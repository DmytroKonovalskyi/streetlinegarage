/* ============================ LENIS SMOOTH SCROLL ============================ */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ПЛАВНЫЙ СКРОЛЛ ДЛЯ НАВИГАЦИИ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80,
                duration: 1.2
            });
        }
    });
});



/* ============================ LANGUAGE SWITCH ============================ */
function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll(".lang-btn[data-lang]").forEach(btn => {
        btn.classList.toggle("lang-btn--active", btn.dataset.lang === lang);
    });

    localStorage.setItem('slg_lang', lang);
}

const savedLang = localStorage.getItem('slg_lang') || 'pl';
setLanguage(savedLang);

document.querySelectorAll(".lang-btn[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        const href = window.location.href;
        const onUaPage = href.includes('/ua/') || href.endsWith('/ua');
        if (lang === 'ua' && !onUaPage) {
            const base = href.replace(/\/?(?:index\.html)?(\?.*)?$/, '');
            window.location.href = base + '/ua/';
        } else if (lang === 'pl' && onUaPage) {
            window.location.href = href.replace(/\/ua\/.*$/, '/');
        }
    });
});

const gallery = document.getElementById("gallery");
const galleryLang = localStorage.getItem('slg_lang') || 'pl';

const photoFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', 'img1.jpg', 'img2.jpg', 'img3.jpg'];
const videoFiles = ['1.mp4', '2.mp4', '3.mp4', '4.mp4'];
const mediaItems = [
    ...photoFiles.map(f => ({ type: 'image', src: f })),
    ...videoFiles.map(f => ({ type: 'video', src: f }))
];

photoFiles.forEach((file, i) => {
    const div = document.createElement("div");
    div.className = "gallery-item reveal" + (i === 0 ? " gallery-item--featured" : "");
    const altText = galleryLang === 'ua'
        ? `Автосервіс Щецин Street Line Garage - Фото ${i + 1}`
        : `Mechanik Szczecin Street Line Garage - Praca ${i + 1}`;
    const mediaIdx = i;
    div.innerHTML = `
        <img src="${file}" alt="${altText}" loading="lazy">
        <div class="gallery-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        </div>`;
    div.addEventListener('click', () => openMedia(mediaIdx));
    gallery.appendChild(div);
});

videoFiles.forEach((file, i) => {
    const div = document.createElement("div");
    div.className = "gallery-item reveal";
    const mediaIdx = photoFiles.length + i;

    // ТУТ ИЗМЕНЕНИЯ: добавлены autoplay, loop и preload="metadata"
    div.innerHTML = `
        <video autoplay loop muted playsinline preload="metadata" aria-label="Wideo z warsztatu samochodowego Street Line Garage">
            <source src="${file}" type="video/mp4">
        </video>
        <div class="gallery-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/></svg>
        </div>`;

    div.addEventListener('click', () => openMedia(mediaIdx));
    gallery.appendChild(div);
});


/* ============================ LIGHTBOX ============================ */
let currentMediaIndex = 0;

function renderLightboxMedia(index) {
    const item = mediaItems[index];
    const content = document.getElementById("lightbox-content");
    if (item.type === 'image') {
        content.innerHTML = `<img src="${item.src}" alt="Street Line Garage - zdjęcie">`;
    } else {
        content.innerHTML = `
            <video controls autoplay muted playsinline>
                <source src="${item.src}" type="video/mp4">
            </video>`;
    }
}

function openMedia(index) {
    currentMediaIndex = index;
    renderLightboxMedia(currentMediaIndex);
    document.getElementById("lightbox").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("lightbox-content").innerHTML = "";
    document.body.style.overflow = "";
}

document.getElementById("lightbox-close").onclick = closeLightbox;

document.getElementById("lightbox-prev").onclick = () => {
    currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
    renderLightboxMedia(currentMediaIndex);
};

document.getElementById("lightbox-next").onclick = () => {
    currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
    renderLightboxMedia(currentMediaIndex);
};

document.getElementById("lightbox").onclick = e => {
    if (e.target.id === "lightbox") closeLightbox();
};

document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (lb.style.display !== "flex") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
        currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
        renderLightboxMedia(currentMediaIndex);
    }
    if (e.key === "ArrowRight") {
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
        renderLightboxMedia(currentMediaIndex);
    }
});

/* ============================ HAMBURGER MENU ============================ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

function openMobileNav() {
    mobileNav.classList.add('open');
    hamburgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileNavBackdrop.addEventListener('click', closeMobileNav);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href');
        closeMobileNav();
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                setTimeout(() => {
                    lenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
                }, 350);
            }
        }
    });
});

/* ============================ PROMO CLOSE ============================ */
const promoClose = document.getElementById('promoClose');
const promoBanner = document.querySelector('.promo-banner');

if (sessionStorage.getItem('promoClosed')) {
    promoBanner.style.display = 'none';
}

promoClose.addEventListener('click', () => {
    promoBanner.style.display = 'none';
    sessionStorage.setItem('promoClosed', '1');
});

/* ============================ SCROLL SPY ============================ */
const allSections = document.querySelectorAll('section[id]');
const headerNavLinks = document.querySelectorAll('.header-nav a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            headerNavLinks.forEach(link => {
                link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-30% 0px -60% 0px' });

allSections.forEach(s => spyObserver.observe(s));