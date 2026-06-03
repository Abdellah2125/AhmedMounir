/**
 * Ahmed Mounir Portfolio — Main Script
 * SPA-style routing with localStorage persistence
 * ------------------------------------------------
 * Architecture:
 *   Storage  → read/write projects safely
 *   Projects → default data & CRUD helpers
 *   Router   → hash-based SPA navigation
 *   UI       → render homepage & project pages
 *   Nav      → sticky header & scroll-spy
 *   Anim     → entrance animations
 *   Init     → bootstrap on DOMContentLoaded
 */

'use strict';

/* ============================================================
   1. STORAGE — safe localStorage wrapper
   ============================================================ */

const Storage = (() => {
  const KEY = 'portfolio_projects';

  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('[Storage] Read failed:', e);
      return null;
    }
  }

  function set(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('[Storage] Write failed:', e);
      return false;
    }
  }

  function remove() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      console.error('[Storage] Remove failed:', e);
    }
  }

  /** Warn in console if storage is getting full (>80% of ~5 MB) */
  function checkQuota() {
    try {
      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        bytes += (k.length + localStorage.getItem(k).length) * 2;
      }
      const pct = (bytes / (5 * 1024 * 1024)) * 100;
      if (pct > 80) console.warn(`[Storage] Usage at ${pct.toFixed(0)}%`);
      if (pct > 90) UI.showStorageWarning();
    } catch (e) { /* silent */ }
  }

  return { get, set, remove, checkQuota };
})();


/* ============================================================
   2. PROJECTS — data layer
   ============================================================ */

const Projects = (() => {
  const DEFAULTS = [
    {
      id: 'graphicare',
      title: 'GraphiCare',
      category: 'Poster Design',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd96a01e51df93e35168c5_GraphiCare%20Full.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd9699cf6f93409fcdc41e_Strong%20Opioid-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd969973684cc4d96c2b35_Weak%20Opioid-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65772e330795a0cf2c502b12_Paracetamol-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65772e339bd99b3ab8174749_Liver%20NAPQI%20Toxicity-p-1080.png',
      ],
    },
    {
      id: 'snickers',
      title: 'Snickers IceCream',
      category: 'Packaging Design',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6585ffa1c97f93094f703bbc_Snickers-Logo.jpg',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6501ded44095db4fb51185e2_Snickers%20Mockup%202-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6501ded2ea5badea3f584f1c_Snickers%20Taste%201%20(%20Ahmed%20Mounir%20)-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6501ded1967f6bec68dc2a77_Snickers%20Taste%202%20(%20Ahmed%20Mounir%20)-p-1080.png',
      ],
    },
    {
      id: 'banky',
      title: 'Banky App',
      category: 'UI Redesign',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd98897fae295e3d692a5f_Overview%201.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd98cedc3596c561031486_Presentation-min-p-1080.jpg',
      ],
    },
    {
      id: 'econnect',
      title: 'Econnect',
      category: 'UX Case Study',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65772cd27dc2b51545896228_Econnect%20logo.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/657725c86aa65a852d1412c7_Econnect%202-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/657727c0106bb7356b9fa0f2_Econnect%20Case%20Study%20(1)-p-1080.png',
      ],
    },
    {
      id: 'wsa-algeria',
      title: 'WSA Algeria',
      category: 'Event Design',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65772ca06519fde69f664354_images.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd9a24b35bdc7d587c9bd4_3.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd9a24d5d080d41022456b_1.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd9a25cf6f93409fd0fecd_2.png',
      ],
    },
    {
      id: 'khedma',
      title: 'Khedma',
      category: 'Brand Identity',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65246e65bc981dd73948a7c5_Splash.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65246eda9aefaf74819567ff_BW%20Logo-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/65246ee19aefaf7481956eca_Artboard%203-p-1080.png',
      ],
    },
    {
      id: 'blu-studio',
      title: 'Blu Studio',
      category: 'Brand Identity',
      mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/657f5a57559409c5ed726e23_blu%20pesentation%201.png',
      galleryImages: [
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/657f5a721e8318870c1458a8_blu%20presentation%203-p-1080.png',
        'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/657f5a56b5510e0d521bc9ad_blu%20presentation%202-p-1080.png',
      ],
    },
  ];

  /** Seed defaults on first visit */
  function init() {
    if (Storage.get() === null) {
      Storage.set(DEFAULTS);
    }
  }

  function getAll() {
    return Storage.get() || [];
  }

  function getById(id) {
    return getAll().find((p) => p.id === id) || null;
  }

  return { init, getAll, getById };
})();


/* ============================================================
   3. HELPERS — pure utility functions
   ============================================================ */

/**
 * Escape a string so it is safe to inject into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}

/** Placeholder image URL used when a real image is missing */
const PLACEHOLDER = (w = 400, h = 250, label = 'No+Image') =>
  `https://placehold.co/${w}x${h}/e0e0e0/666666?text=${label}`;


/* ============================================================
   4. UI — render layer (homepage & project page)
   ============================================================ */

const UI = (() => {
  /* --- cached DOM references (set in init) --- */
  let homepageEl, projectPageEl, gridEl;
  let projectTitleEl, projectCategoryEl, galleryEl;

  /* ---- Project Cards ---- */

  function renderProjectCard(project) {
    const img = project.mainImage || PLACEHOLDER();
    const title = escapeHtml(project.title);
    const cat = escapeHtml(project.category);

    return `
      <a href="#project/${project.id}"
         class="project-card"
         data-project-id="${project.id}"
         aria-label="${title} — ${cat}">
        <img
          src="${img}"
          alt="${title}"
          class="project-image"
          loading="lazy"
          onerror="this.src='${PLACEHOLDER(400, 250, 'Image+Error')}'">
        <div class="project-info">
          <h3 class="project-title">${title}</h3>
          <p class="project-category">${cat}</p>
        </div>
      </a>`;
  }

  function renderHomepageProjects() {
    if (!gridEl) return;

    const projects = Projects.getAll();

    if (projects.length === 0) {
      gridEl.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;padding:40px;color:#888">
          No projects yet.
          <a href="admin.html" style="color:inherit;font-weight:600">Add some →</a>
        </p>`;
      return;
    }

    gridEl.innerHTML = projects.map(renderProjectCard).join('');
    Anim.staggerCards();
  }

  /* ---- Gallery Images ---- */

  function renderGallery(project) {
    if (!galleryEl) return;
    if (!project.galleryImages?.length) {
      galleryEl.innerHTML = '';
      return;
    }

    const isSingle = project.galleryImages.length === 1;

    galleryEl.innerHTML = project.galleryImages
      .map((src, i) => `
        <img
          src="${src}"
          alt="${escapeHtml(project.title)} — Image ${i + 1}"
          class="gallery-image${isSingle ? ' full-width' : ''}"
          loading="lazy"
          onerror="this.src='${PLACEHOLDER(800, 600, 'Image+Error')}'">`)
      .join('');
  }

  /* ---- Page switching ---- */

  function showHomepage() {
    document.title = 'Ahmed Mounir | Graphic & UI/UX Designer';

    projectPageEl.style.display = 'none';
    homepageEl.style.display = 'block';

    renderHomepageProjects();

    const savedY = parseInt(sessionStorage.getItem('homepage_scroll') || '0', 10);
    sessionStorage.removeItem('homepage_scroll');
    requestAnimationFrame(() => window.scrollTo(0, savedY));

    Nav.update();
  }

  function showProjectPage(projectId) {
    const project = Projects.getById(projectId);

    if (!project) {
      // Unknown project ID — fall back silently
      Router.navigate('');
      return;
    }

    document.title = `${project.title} | Ahmed Mounir`;

    if (projectTitleEl)    projectTitleEl.textContent    = project.title;
    if (projectCategoryEl) projectCategoryEl.textContent = project.category;

    renderGallery(project);

    homepageEl.style.display    = 'none';
    projectPageEl.style.display = 'block';

    window.scrollTo(0, 0);
    Nav.clearActive();
  }

  /* ---- Misc ---- */

  function saveHomepageScroll() {
    if (homepageEl?.style.display !== 'none') {
      sessionStorage.setItem('homepage_scroll', window.scrollY);
    }
  }

  function showStorageWarning() {
    const el = document.createElement('div');
    el.textContent = '⚠️ Storage nearly full. Export & clear old projects.';
    Object.assign(el.style, {
      position: 'fixed', bottom: '20px', right: '20px',
      background: '#ff9800', color: '#000', padding: '10px 14px',
      borderRadius: '8px', fontSize: '12px', zIndex: '10000',
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  /* ---- Init ---- */

  function init() {
    homepageEl        = document.getElementById('homepage-content');
    projectPageEl     = document.getElementById('project-page-content');
    gridEl            = document.getElementById('projects-grid-container');
    projectTitleEl    = document.getElementById('project-title');
    projectCategoryEl = document.getElementById('project-category');
    galleryEl         = document.getElementById('project-gallery');
  }

  return {
    init,
    showHomepage,
    showProjectPage,
    saveHomepageScroll,
    showStorageWarning,
    renderHomepageProjects,
  };
})();


/* ============================================================
   5. ROUTER — hash-based SPA navigation
   ============================================================ */

const Router = (() => {
  const PROJECT_PATTERN = /^#project\/(.+)$/;

  function handle() {
    const hash = window.location.hash;
    const match = hash.match(PROJECT_PATTERN);

    if (match) {
      UI.showProjectPage(decodeURIComponent(match[1]));
    } else {
      UI.showHomepage();
    }
  }

  /** Navigate programmatically without triggering a full reload */
  function navigate(hash) {
    // Setting hash to '' would add a bare '#' to the URL; use history API instead
    if (hash === '' || hash === '#') {
      history.pushState(null, '', window.location.pathname);
      UI.showHomepage();
    } else {
      window.location.hash = hash;
    }
  }

  function init() {
    window.addEventListener('hashchange', handle);
  }

  return { init, handle, navigate };
})();


/* ============================================================
   6. NAV — sticky header & scroll-spy
   ============================================================ */

const Nav = (() => {
  let sections, links, homepageEl;

  function update() {
    // Don't run scroll-spy while a project page is visible
    if (homepageEl?.style.display === 'none') return;

    const scrollY = window.scrollY + 120;
    let active = '';

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.clientHeight) {
        active = section.id;
      }
    });

    links.forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', id === active);
    });
  }

  function clearActive() {
    links?.forEach((link) => link.classList.remove('active'));
  }

  function init() {
    homepageEl = document.getElementById('homepage-content');
    sections   = document.querySelectorAll('section[id]');
    links      = document.querySelectorAll('.nav-links a');

    // Smooth scroll for in-page anchor links
    document.querySelectorAll('.nav-links a').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href?.startsWith('#') || href.startsWith('#project/')) return;

        // Only scroll when homepage is visible
        if (homepageEl?.style.display === 'none') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  return { init, update, clearActive };
})();


/* ============================================================
   7. ANIM — entrance animations
   ============================================================ */

const Anim = (() => {
  /** Staggered fade-in for project cards after they are rendered */
  function staggerCards() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }

  /** Intersection Observer for skill tags */
  function observeSkillTags() {
    const tags = document.querySelectorAll('.skill-tag');
    if (!tags.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity   = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 50);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    tags.forEach((tag) => {
      tag.style.opacity    = '0';
      tag.style.transform  = 'translateY(15px)';
      tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(tag);
    });
  }

  /** Subtle fade-in on initial page load */
  function pageEntrance() {
    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    // Use rAF to ensure the initial opacity:0 has been painted first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  return { staggerCards, observeSkillTags, pageEntrance };
})();


/* ============================================================
   8. EVENTS — global event bindings (back, logo, storage sync)
   ============================================================ */

function bindEvents() {
  /* Back to home button */
  const backBtn = document.getElementById('back-to-home');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      UI.saveHomepageScroll();
      Router.navigate('');
    });
  }

  /* Logo — go home without full reload */
  const logoLink = document.getElementById('logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      UI.saveHomepageScroll();
      Router.navigate('');
    });
  }

  /* Cross-tab sync: if another tab updates projects, refresh the grid */
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_projects') {
      UI.renderHomepageProjects();
    }
  });
}


/* ============================================================
   9. PUBLIC HELPERS — console utilities for admin use
   ============================================================ */

function registerConsoleHelpers() {
  function exportProjects() {
    const data = localStorage.getItem('portfolio_projects');
    if (!data) return console.warn('No projects to export.');
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `portfolio_backup_${new Date().toISOString().slice(0, 19)}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProjects(fileInput) {
    const file = fileInput?.files?.[0];
    if (!file) return console.error('Pass a file input element.');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Expected an array.');
        Storage.set(data);
        UI.renderHomepageProjects();
        console.log(`✅ Imported ${data.length} projects.`);
      } catch (err) {
        console.error('Import failed:', err.message);
      }
    };
    reader.readAsText(file);
  }

  function clearAllProjects() {
    if (!confirm('⚠️ This will delete ALL projects. Continue?')) return;
    Storage.remove();
    UI.renderHomepageProjects();
    Router.navigate('');
    console.log('🗑️ All projects cleared.');
  }

  window.portfolioHelper = { exportProjects, importProjects, clearAllProjects };
  console.log('💡 Portfolio helper ready — window.portfolioHelper');
}


/* ============================================================
   10. INIT — bootstrap everything when the DOM is ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Order matters: data → UI elements → events → routing → animations
  Projects.init();       // seed defaults if first visit
  UI.init();             // cache DOM references
  Nav.init();            // scroll-spy & smooth scroll
  Router.init();         // listen for hashchange
  bindEvents();          // back button, logo, storage sync
  registerConsoleHelpers();

  Router.handle();       // handle current URL on load (e.g. direct link to a project)

  Anim.observeSkillTags();
  Anim.pageEntrance();

  // Deferred: storage quota check (non-critical)
  setTimeout(Storage.checkQuota, 1500);
});