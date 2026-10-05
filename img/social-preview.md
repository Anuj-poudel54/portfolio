# Portfolio sharing image

`social-preview.png` is the original 1730 × 909 PNG generated with the built-in imagegen tool. The image uses the portfolio's charcoal and lime palette and is referenced by static Open Graph and Twitter Card metadata in `index.html`.

Deploy the HTML and image together. The absolute image URLs in the metadata must point to this image on the public portfolio host. If the image is replaced, update its dimensions and use a new filename to avoid stale image caches.

The production portfolio is `https://anuj-poudel.com.np/`. Both `og:image` and `twitter:image` point to `https://anuj-poudel.com.np/img/social-preview.png`. The canonical link and `og:url` use the production homepage URL.

After deploying metadata changes, check the live page source for these tags. Social platforms can retain an earlier preview; use the platform's sharing debugger or inspection tool to request a fresh scrape when available. Local file edits alone do not update the deployed site's preview.

## Generation prompt

Use case: ads-marketing. Create a finished social sharing Open Graph banner for Anuj Poudel's developer portfolio. Project-bound final asset. Landscape 1200 x 630 pixels (approximately 1.91:1 aspect ratio). Sophisticated restrained editorial design matching a website with charcoal black #111411 background, warm white #eef1e9 text, and pale lime #c3ed83 accent. Large precise typography on left: 'Anuj Poudel' as the most prominent text, below it 'Backend Engineer'. Above, a small minimal 'ap.' typographic monogram. Supporting tagline on two lines: 'Thoughtful code.' and 'Reliable systems.' In lower left small tasteful spaced text 'PYTHON / DJANGO / APPLIED AI'. On the right, a beautiful abstract 3D architectural stack of three dark graphite glass server-like planes, connected by fine lime glowing paths and nodes, suggesting APIs, logic, and data. Subtle technical grid fading into charcoal, restrained lime rim light. Keep about 7% safe margin around every edge. Crisp professional premium design that remains legible at thumbnail size. Flat full bleed image, no surrounding mockup, no photograph of a screen, no browser frame, no buttons, no watermark, no extra words, no website URL. Strong hierarchy and negative space. Render all quoted text exactly, with clean modern sans-serif typography. Save final image for use in the current portfolio project.

## Metadata reference

[Open Graph protocol](https://ogp.me/)
