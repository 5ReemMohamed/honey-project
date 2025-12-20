window.addEventListener("load", () => {
    const overlay = document.getElementById("loader-overlay");
    if (!overlay) return;

    setTimeout(() => {
        overlay.classList.add("hide");
        AOS.init({
            duration: 1000, // animation duration in ms
            once: false,
        });

    }, 8500);
});

document.addEventListener("DOMContentLoaded", function () {

    let currentLang = 'en';

    fetch('../json/translation.json')
        .then(res => res.json())
        .then(translations => {
            const translateElement = (el, lang) => {
                const key = el.getAttribute('data-key');
                const translation = translations[lang][key];
                if (!translation) return;
                const temp = document.createElement('div');
                temp.innerHTML = translation;
                el.innerHTML = temp.innerHTML;
            };
            const translatePage = (lang) => {
                document.querySelectorAll('[data-key]').forEach(el => translateElement(el, lang));
                document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
            };
            translatePage(currentLang);

            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = item.getAttribute('data-lang');
                    currentLang = lang;
                    document.getElementById('languageDropdown').textContent = item.textContent.toUpperCase();
                    translatePage(lang);
                });
            });
        })
        .catch(err => console.error('Error loading translations:', err));
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
    function handleNavbar() {
        if (window.scrollY > 10) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
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


    var certificateModal = document.getElementById('certificateModal');
    var modalImg = document.getElementById('modalImage');
    var zoomInBtn = document.getElementById('zoom-in');
    var zoomOutBtn = document.getElementById('zoom-out');

    let scale = 1;
    const maxZoom = 3;
    const minZoom = 1;
    const zoomStep = 0.2;

    certificateModal.addEventListener('show.bs.modal', function (event) {
        var triggerImg = event.relatedTarget;
        var imgSrc = triggerImg.getAttribute('data-bs-img');

        modalImg.src = imgSrc;
        scale = 1;
        modalImg.style.transform = `scale(${scale})`;
    });

    zoomInBtn.addEventListener('click', function () {
        if (scale < maxZoom) {
            scale += zoomStep;
            modalImg.style.transform = `scale(${scale})`;
        }
    });
    zoomOutBtn.addEventListener('click', function () {
        if (scale > minZoom) {
            scale -= zoomStep;
            modalImg.style.transform = `scale(${scale})`;
        }
    });

    certificateModal.addEventListener('hidden.bs.modal', function () {
        scale = 1;
        modalImg.style.transform = `scale(${scale})`;
    });
});
