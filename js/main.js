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

let productsSwiper;

function initProductsSwiper(lang) {
    const isRTL = lang === "ar";

    if (productsSwiper) {
        productsSwiper.destroy(true, true);
    }

    productsSwiper = new Swiper(".products-swiper", {
        rtl: isRTL,
        direction: "horizontal",
        slidesPerView: 3,
        spaceBetween: 10,
        slideToClickedSlide: true,
        centeredSlides: true,
        loop: true,
        speed: 1000,
        grabCursor: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        breakpoints: {
            0: { slidesPerView: 1, centeredSlides: false },
            576: { slidesPerView: 2, centeredSlides: true },
            992: { slidesPerView: 3, centeredSlides: true },
            1200: { slidesPerView: 5, centeredSlides: true }
        }
    });
}

AOS.init({ duration: 1000, once: false });

document.addEventListener("DOMContentLoaded", function () {

    const navbarCollapse = document.getElementById("navbarNav");
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    document.querySelectorAll('.btn-dropdown').forEach(button => {
        button.setAttribute('data-bs-toggle', ''); 
        const dropdownMenu = button.nextElementSibling;

        button.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.add('show');
                button.setAttribute('aria-expanded', 'true');
            }
        });
        button.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.remove('show');
                button.setAttribute('aria-expanded', 'false');
            }
        });
        dropdownMenu.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.add('show');
                button.setAttribute('aria-expanded', 'true');
            }
        });
        dropdownMenu.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.classList.remove('show');
                button.setAttribute('aria-expanded', 'false');
            }
        });

        button.addEventListener('click', e => {
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopPropagation();

                const isExpanded = button.getAttribute('aria-expanded') === 'true';

                document.querySelectorAll('.btn-dropdown').forEach(otherBtn => {
                    if (otherBtn !== button) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        const otherMenu = otherBtn.nextElementSibling;
                        if (otherMenu) otherMenu.classList.remove('show');
                    }
                });

                if (dropdownMenu) {
                    dropdownMenu.classList.toggle('show');
                    button.setAttribute('aria-expanded', !isExpanded);
                }
            }
        });
    });

    document.addEventListener('click', e => {
        if (window.innerWidth < 992) {
            const isDropdownButton = e.target.classList.contains('btn-dropdown') || e.target.closest('.btn-dropdown');
            const isInsideDropdown = e.target.closest('.dropdown-menu');

            if (!isDropdownButton && !isInsideDropdown) {
                document.querySelectorAll('.btn-dropdown').forEach(button => {
                    button.setAttribute('aria-expanded', 'false');
                    const menu = button.nextElementSibling;
                    if (menu) menu.classList.remove('show');
                });
            }
        }
    });

    document.querySelectorAll('.dropdown-item:not([data-lang])').forEach(item => {
        item.addEventListener('click', function (e) {
            if (window.innerWidth < 992) {
                const dropdown = this.closest('.dropdown-menu');
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
                setTimeout(() => {
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }, 100);
            }


        });
    });
    document.querySelectorAll('.dropdown-item:not([data-lang])').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth >= 992) {
                const dropdown = this.closest('.dropdown-menu');
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
                const toggleBtn = this.closest('.dropdown')?.querySelector('.btn-dropdown');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    applyLanguage(currentLang);
    initProductsSwiper(currentLang);

    const navbar = document.getElementById("mainNavbar");
    const navLinks = document.querySelectorAll("#mainNavbar .nav-link");

    function handleNavbar() {
        navbar.classList.toggle("sticky", window.scrollY > 10);
    }
    handleNavbar();
    window.addEventListener("scroll", handleNavbar);

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
                    window.scrollTo({ top: offsetTop, behavior: "smooth" });
                }

                if (window.innerWidth < 992) {
                    bsCollapse.hide();
                }
            }
        });
    });
    document.querySelectorAll(".dropdown-item[data-lang]").forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            const lang = item.dataset.lang;
            applyLanguage(lang);
            document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
        });
    });
    const countersSection = document.getElementById("honeyCounters");
    if (countersSection) {
        const counters = countersSection.querySelectorAll(".number");
        const formatNumber = num => num >= 1_000_000 ? (num / 1_000_000) + "M+" :
            num >= 1_000 ? (num / 1_000) + "K+" : num;

        const startCounters = () => {
            counters.forEach(counter => {
                let current = 0;
                const target = +counter.dataset.target;
                const speed = 400;
                const increment = Math.ceil(target / speed);

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = current.toLocaleString();
                        setTimeout(updateCount, 20);
                    } else counter.innerText = formatNumber(target);
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(countersSection);
    }
});

document.addEventListener("languageChanged", (e) => {
    initProductsSwiper(e.detail.lang);
});
