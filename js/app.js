'use strict';

// GitHub is the source of truth; the bundled snapshot is an HTTP-only fallback.
const DATA_URL = 'https://anuj-poudel54.github.io/db/portfolioData.json';
const FALLBACK_DATA_URL = 'data/data.json';
// Older entries in the public feed predate category/tag fields.
const PROJECT_METADATA = {
    'alpr.jpg': { category: 'ai', tags: ['YOLOv8', 'CNN', 'Computer vision'] },
    'fakenewsdetection.jpg': { category: 'ai', tags: ['Machine learning', 'NLP'] },
    'maiboard.jpg': { category: 'mobile', tags: ['Java', 'Android', 'OCR'] },
    'passsaver.jpg': { category: 'tools', tags: ['Python', 'SQLite', 'CLI'] },
    'ytclone.jpg': { category: 'tools', tags: ['FFmpeg', 'Video processing'] },
    'hotloader.jpg': { category: 'tools', tags: ['Developer tooling', 'Automation'] },
};
const $ = (selector) => document.querySelector(selector);
const navToggle = $('.nav-toggle');
const navList = $('#nav-list');
const projectFilters = $('.project-filters');
const projectImageManifest = JSON.parse($('#project-image-manifest')?.textContent || '{}');
let personalProjects = [];
let selectedFilter = 'all';
// The generated HTML is useful before JavaScript or the live feed is available.
try {
    const snapshot = JSON.parse($('#project-snapshot')?.textContent || '{}');
    if (Array.isArray(snapshot.projects)) personalProjects = snapshot.projects.filter(isProject);
} catch (_) { /* The live feed can still populate the page. */ }
projectFilters.hidden = personalProjects.length === 0;

document.documentElement.classList.add('js-enabled');
$('#year').textContent = new Date().getFullYear();

function setMenu(open, restoreFocus = false) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navList.classList.toggle('is-open', open);
    if (restoreFocus) navToggle.focus();
}
navToggle.hidden = false;
navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navList.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', (event) => {
    if (!event.target.closest('nav')) setMenu(false);
});
document.addEventListener('focusin', (event) => {
    if (!event.target.closest('nav')) setMenu(false);
});
window.matchMedia('(min-width: 541px)').addEventListener('change', () => setMenu(false));

const themeButton = $('.theme-toggle');
function updateThemeButton() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeButton.title = themeButton.getAttribute('aria-label');
    $('meta[name="theme-color"]').content = isDark ? '#111411' : '#f7f8f2';
}
themeButton.hidden = false;
updateThemeButton();
themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch (_) { /* Storage may be disabled. */ }
    updateThemeButton();
});

const copyButton = $('#copy-email');
if (navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('anujpoudel54@gmail.com');
            $('#copy-status').textContent = 'Email address copied.';
        } catch (_) {
            $('#copy-status').textContent = 'Please select the email address above to copy it.';
        }
    });
}

// Use textContent for portfolio content and allow only web URLs for project links.
function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}
function safeUrl(value) {
    if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return null;
    try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
}
function projectLinks(project) {
    const links = element('div', 'project-links');
    const options = [[project.webLink, 'Visit website'], [project.githubLink || project.githublink, 'View source']];
    for (const [value, label] of options) {
        const url = safeUrl(value);
        if (!url) continue;
        const link = element('a', '', label);
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${label}: ${project.title} (opens in a new tab)`);
        const arrow = element('span', '', '↗');
        arrow.setAttribute('aria-hidden', 'true');
        link.append(arrow);
        links.append(link);
    }
    return links;
}
function createWorkCard(work) {
    const card = element('article', 'work-card');
    const imageWrap = element('div', 'work-image-wrap');
    const placeholder = () => imageWrap.replaceChildren(element('span', 'image-placeholder', work.title));
    if (typeof work.imageName === 'string' && /^[\w.-]+$/.test(work.imageName)) {
        const image = element('img');
        image.alt = `${work.title} website preview`;
        image.loading = 'lazy';
        image.decoding = 'async';
        const originalSource = `img/workproject/${work.imageName}`;
        const optimized = projectImageManifest[work.imageName];
        if (optimized) {
            image.width = optimized.width;
            image.height = optimized.height;
            image.sizes = optimized.sizes;
            image.srcset = optimized.srcset;
        }
        image.addEventListener('error', () => {
            if (image.hasAttribute('srcset')) {
                image.removeAttribute('srcset');
                image.removeAttribute('sizes');
                image.addEventListener('error', placeholder, { once: true });
                image.src = originalSource;
            } else placeholder();
        }, { once: true });
        image.src = optimized?.src || originalSource;
        imageWrap.append(image);
    } else placeholder();
    const heading = element('div', 'work-card-top');
    heading.append(element('h3', '', work.title), element('span', 'project-category', work.category || 'Web application'));
    card.append(imageWrap, heading, element('p', '', work.desc), projectLinks(work));
    return card;
}
function createProjectCard(project, index) {
    const card = element('article', 'project-card');
    const top = element('div', 'project-card-heading');
    // Static decorative markup only; all data is added using DOM text nodes.
    top.innerHTML = '<svg class="folder-icon" viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"/></svg>';
    top.append(element('span', 'project-index', String(index + 1).padStart(2, '0')));
    const tags = element('div', 'project-tags');
    if (Array.isArray(project.tags)) project.tags.forEach(tag => tags.append(element('span', '', tag)));
    card.append(top, element('h3', '', project.title), element('p', '', project.desc), tags, projectLinks(project));
    return card;
}
function renderProjects() {
    const shown = personalProjects.filter(project => selectedFilter === 'all' || project.category === selectedFilter);
    $('#personal-projects').replaceChildren(...shown.map(project => createProjectCard(project, personalProjects.indexOf(project))));
    if (!shown.length) $('#personal-projects').append(element('p', 'loading', 'No projects in this category yet.'));
    $('#project-status').textContent = `${shown.length} personal ${shown.length === 1 ? 'project' : 'projects'} shown.`;
}
projectFilters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    selectedFilter = button.dataset.filter;
    projectFilters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderProjects();
});
function isProject(item) {
    return item && typeof item.title === 'string' && typeof item.desc === 'string';
}
async function fetchProjectData(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Project data is unavailable.');
        const data = await response.json();
        if (!data || !Array.isArray(data.works) || !Array.isArray(data.projects)) {
            throw new Error('Invalid project data.');
        }
        return data;
    } finally {
        clearTimeout(timeout);
    }
}
async function getProjectData() {
    try {
        return await fetchProjectData(DATA_URL);
    } catch (error) {
        // Browsers cannot fetch sibling JSON files from a file:// page.
        if (window.location.protocol === 'file:') throw error;
        return await fetchProjectData(FALLBACK_DATA_URL);
    }
}
async function loadProjects() {
    const containers = [$('#featured-works'), $('#personal-projects')];
    containers.forEach(container => {
        container.setAttribute('aria-busy', 'true');
        if (!container.querySelector('article')) {
            container.replaceChildren(element('p', 'loading', 'Loading projects…'));
        }
    });
    try {
        const data = await getProjectData();
        const works = data.works.filter(isProject);
        personalProjects = data.projects.filter(isProject).map(project => ({
            ...PROJECT_METADATA[project.imageName],
            ...project,
        }));
        $('#featured-works').replaceChildren(...works.map(createWorkCard));
        if (!works.length) $('#featured-works').append(element('p', 'loading', 'New work will be added soon.'));
        renderProjects();
        projectFilters.hidden = personalProjects.length === 0;
    } catch (_) {
        containers.forEach(container => {
            // Keep the crawlable snapshot visible if both data requests fail.
            if (container.querySelector('article')) return;
            const message = element('div', 'load-error');
            message.append(element('p', '', 'Project details couldn’t load. You can still explore my repositories on GitHub.'));
            const link = element('a', 'text-link', 'Explore GitHub ↗');
            link.href = 'https://github.com/Anuj-poudel54/';
            const retry = element('button', '', 'Try again');
            retry.type = 'button';
            retry.addEventListener('click', loadProjects);
            message.append(link, retry);
            container.replaceChildren(message);
        });
    } finally {
        containers.forEach(container => container.setAttribute('aria-busy', 'false'));
    }
}

// Observe visibility instead of forcing layout measurements on every scroll.
const navLinks = [...document.querySelectorAll('.nav-link')];
let activeNavLink = null;
function setActiveNavigation(active) {
    if (active === activeNavLink) return;
    activeNavLink = active;
    navLinks.forEach(link => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}
if ('IntersectionObserver' in window) {
    const sections = [
        { element: $('#home'), link: null },
        { element: $('#work'), link: navLinks[0] },
        { element: $('.experiments-section'), link: navLinks[0] },
        { element: $('#about'), link: navLinks[1] },
        { element: $('#contact'), link: navLinks[2] },
    ];
    const visible = new Set();
    let footerVisible = false;
    const update = () => {
        const current = sections.filter(section => visible.has(section.element)).at(-1);
        if (footerVisible) setActiveNavigation(navLinks[2]);
        else if (current) setActiveNavigation(current.link);
    };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
        });
        update();
    }, { rootMargin: '-80px 0px -60% 0px' });
    sections.forEach(section => observer.observe(section.element));
    new IntersectionObserver(entries => {
        footerVisible = entries[0].isIntersecting;
        update();
    }).observe($('.footer'));
} else {
    navLinks.forEach(link => link.addEventListener('click', () => setActiveNavigation(link)));
}
loadProjects();
