AOS.init({
    duration: 1000,
    once: false,
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
                const langButton = document.getElementById('languageDropdown');
                if (langButton) {
                    const langNames = {
                        'en': 'English',
                        'ar': 'العربية',
                        'es': 'Español',
                        'fr': 'Français'
                    };
                    langButton.textContent = langNames[lang] || 'Language';
                }
            };

            translatePage(currentLang);

            document.querySelectorAll('#languageDropdown ~ .dropdown-menu .dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const lang = item.getAttribute('data-lang');
                    currentLang = lang;
                    const dropdown = item.closest('.dropdown-menu');
                    if (dropdown) {
                        const dropdownInstance = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                        if (dropdownInstance) {
                            dropdownInstance.hide();
                        }
                    }

                    translatePage(lang);
                    localStorage.setItem('preferredLanguage', lang);
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
