const supportedLangs = ["en", "ar", "es", "fr"];

function getCurrentLanguage() {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && supportedLangs.includes(savedLang)) return savedLang;

    const browserLang = navigator.language.slice(0, 2);
    return supportedLangs.includes(browserLang) ? browserLang : "en";
}

let currentLang = getCurrentLanguage();

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    document.querySelectorAll(`[data-placeholder-${lang}]`).forEach(el => {
        el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
    });

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

window.currentLang = currentLang;
window.applyLanguage = applyLanguage;

AOS.init({
    duration: 1000,
    once: false,
});

document.addEventListener("DOMContentLoaded", function () {

    applyLanguage(currentLang);
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    function handleNavbar() {
        navbar.classList.toggle('sticky', window.scrollY > 10);
    }

    handleNavbar();
    window.addEventListener('scroll', handleNavbar);

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId.startsWith("#")) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }

            if (window.innerWidth < 992) {
                bsCollapse.hide();
            }
        });
    });
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            const lang = item.dataset.lang;
            applyLanguage(lang);
            document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));

            if (window.updateMapLanguage) window.updateMapLanguage(lang);
        });
    });

    const countersSection = document.getElementById("honeyCounters");

    if (countersSection) {
        const counters = countersSection.querySelectorAll(".number");

        const startCounters = () => {
            counters.forEach(counter => {
                counter.innerText = "0";
                const target = +counter.dataset.target;
                const speed = 400;

                const updateCount = () => {
                    const current = +counter.innerText;
                    const increment = Math.ceil(target / speed);

                    if (current < target) {
                        counter.innerText = current + increment;
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
            });
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(countersSection);
    }

});
