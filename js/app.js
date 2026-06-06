/**
 * Portfolio Application
 * Modern, performance-optimized vanilla JavaScript
 */

// DOM Elements
const elements = {
    header: document.querySelector('.header'),
    navToggle: document.querySelector('.nav-toggle'),
    navList: document.getElementById('nav-list'),
    navLinks: document.querySelectorAll('.nav-link'),
    featuredWorks: document.getElementById('featured-works'),
    personalProjects: document.getElementById('personal-projects'),
    year: document.getElementById('year'),
};

// Application State
const state = {
    isMenuOpen: false,
    projects: {
        works: [],
        projects: [],
    },
};

/**
 * Initialize Application
 */
function init() {
    setYear();
    setupEventListeners();
    fetchAndRenderProjects();
    setupIntersectionObserver();
    setupScrollEffects();
}

/**
 * Set current year in footer
 */
function setYear() {
    if (elements.year) {
        elements.year.textContent = new Date().getFullYear();
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Mobile menu toggle
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            setActiveNavLink(link);
        });
    });

    // Handle keyboard ESC for menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

/**
 * Toggle Mobile Menu
 */
function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
    elements.navList.setAttribute('aria-expanded', state.isMenuOpen);
}

/**
 * Close Mobile Menu
 */
function closeMobileMenu() {
    if (state.isMenuOpen) {
        state.isMenuOpen = false;
        elements.navToggle.setAttribute('aria-expanded', 'false');
        elements.navList.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Set Active Navigation Link
 */
function setActiveNavLink(link) {
    elements.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
}

/**
 * Fetch and Render Projects
 */
async function fetchAndRenderProjects() {
    try {
        const dataUrl = CONFIG.dataUrl || 'https://anuj-poudel54.github.io/db/portfolioData.json';

        console.log('Fetching data from:', dataUrl);
        elements.featuredWorks.innerHTML = '<p class="loading">Loading projects...</p>';
        elements.personalProjects.innerHTML = '<p class="loading">Loading projects...</p>';

        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data loaded successfully:', data);

        state.projects = data;

        if (data.works && Array.isArray(data.works) && data.works.length > 0) {
            renderFeaturedWorks(data.works);
        } else {
            elements.featuredWorks.innerHTML = '<p>No works available.</p>';
        }

        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
            renderPersonalProjects(data.projects);
        } else {
            elements.personalProjects.innerHTML = '<p>No projects available.</p>';
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        elements.featuredWorks.innerHTML = `<p style="color: #e74c3c;">Error loading projects: ${error.message}</p>`;
        elements.personalProjects.innerHTML = `<p style="color: #e74c3c;">Error loading projects: ${error.message}</p>`;
    }
}

/**
 * Render Featured Works
 */
function renderFeaturedWorks(works) {
    const html = works.map(work => createFeaturedWorkCard(work)).join('');
    elements.featuredWorks.innerHTML = html;
    console.log(`Rendered ${works.length} featured works`);
}

/**
 * Create Featured Work Card
 */
function createFeaturedWorkCard(work) {
    const imageUrl = `img/workproject/${work.imageName}`;
    const githubLink = work.githubLink || '';
    const webLink = work.webLink || '';

    return `
        <article class="project-card fade-in">
            <div>
                <img 
                    src="${imageUrl}" 
                    alt="${escapeHtml(work.title)}" 
                    class="project-image"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23999%22%3EImage not available%3C/text%3E%3C/svg%3E'"
                >
            </div>
            <div class="project-content">
                <h3>${escapeHtml(work.title)}</h3>
                <p class="project-desc">${escapeHtml(work.desc)}</p>
                <div class="project-links">
                    ${webLink ? `
                        <a href="${escapeHtml(webLink)}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <span>→</span> Visit Site
                        </a>
                    ` : ''}
                    ${githubLink ? `
                        <a href="${escapeHtml(githubLink)}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <span>→</span> GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `;
}

/**
 * Render Personal Projects
 */
function renderPersonalProjects(projects) {
    const html = projects.map(project => createProjectSmallCard(project)).join('');
    elements.personalProjects.innerHTML = html;
    console.log(`Rendered ${projects.length} personal projects`);
}

/**
 * Create Project Small Card
 */
function createProjectSmallCard(project) {
    const imageUrl = `img/workproject/${project.imageName}`;
    const githubLink = project.githubLink || '';
    const webLink = project.webLink || '';

    return `
        <article class="project-small-card fade-in">
            <img 
                src="${imageUrl}" 
                alt="${escapeHtml(project.title)}" 
                class="project-small-image"
                loading="lazy"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23999%22%3EImage not available%3C/text%3E%3C/svg%3E'"
            >
            <div class="project-small-content">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.desc)}</p>
                <div class="project-small-links">
                    ${githubLink ? `
                        <a 
                            href="${escapeHtml(githubLink)}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="icon-link" 
                            aria-label="GitHub repository for ${escapeHtml(project.title)}"
                            title="GitHub"
                        >
                            →
                        </a>
                    ` : ''}
                    ${webLink ? `
                        <a 
                            href="${escapeHtml(webLink)}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="icon-link" 
                            aria-label="Website for ${escapeHtml(project.title)}"
                            title="Website"
                        >
                            ↗
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Setup Intersection Observer for Animations
 */
function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Setup Scroll Effects
 */
function setupScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow to header on scroll
        if (scrollTop > CONFIG.scrollThreshold) {
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateScrollEffects();
}

/**
 * Handle smooth scroll for anchor links
 */
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('target') === '_blank') return;

    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMobileMenu();

    target.scrollIntoView({ behavior: 'smooth' });

    // Update active nav link
    const navLink = document.querySelector(`a[href="${href}"]`);
    if (navLink) {
        setActiveNavLink(navLink);
    }
});

/**
 * Performance: Lazy load images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/**
 * Start Application
 */
document.addEventListener('DOMContentLoaded', init);

// Handle dynamic content loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
