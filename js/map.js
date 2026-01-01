let map;
let markers = [];

const visitStoreText = {
    en: "Visit Store",
    ar: "زيارة المتجر",
    es: "Visitar tienda",
    fr: "Visiter le magasin"
};

const branches = [
    {
        name: { en: "UAE Branch", ar: "فرع الإمارات", es: "Sucursal Emiratos", fr: "Succursale EAU" },
        city: { en: "Dubai", ar: "دبي", es: "Dubái", fr: "Dubaï" },
        country: {
            en: "United Arab Emirates",
            ar: "الإمارات العربية المتحدة",
            es: "Emiratos Árabes Unidos",
            fr: "Émirats arabes unis"
        },
        coordinates: [25.2048, 55.2708],
        link: "/store-uae.html"
    },
    {
        name: { en: "Jordan Branch", ar: "فرع الأردن", es: "Sucursal Jordania", fr: "Succursale Jordanie" },
        city: { en: "Amman", ar: "عمّان", es: "Amán", fr: "Amman" },
        country: { en: "Jordan", ar: "الأردن", es: "Jordania", fr: "Jordanie" },
        coordinates: [31.9454, 35.9284],
        link: "/store-jordan.html"
    },
    {
        name: { en: "Saudi Arabia Branch", ar: "فرع السعودية", es: "Sucursal Arabia Saudita", fr: "Succursale Arabie Saoudite" },
        city: { en: "Riyadh", ar: "الرياض", es: "Riad", fr: "Riyad" },
        country: {
            en: "Saudi Arabia",
            ar: "المملكة العربية السعودية",
            es: "Arabia Saudita",
            fr: "Arabie Saoudite"
        },
        coordinates: [24.7136, 46.6753],
        link: "/store-saudi.html"
    },
    {
        name: { en: "Qatar Branch", ar: "فرع قطر", es: "Sucursal Catar", fr: "Succursale Qatar" },
        city: { en: "Doha", ar: "الدوحة", es: "Doha", fr: "Doha" },
        country: { en: "Qatar", ar: "قطر", es: "Catar", fr: "Qatar" },
        coordinates: [25.2854, 51.5310],
        link: "/store-qatar.html"
    },
    {
        name: { en: "Oman Branch", ar: "فرع عمان", es: "Sucursal Omán", fr: "Succursale Oman" },
        city: { en: "Muscat", ar: "مسقط", es: "Mascate", fr: "Mascate" },
        country: { en: "Oman", ar: "عمان", es: "Omán", fr: "Oman" },
        coordinates: [23.5880, 58.3829],
        link: "/store-oman.html"
    }
];

document.addEventListener("DOMContentLoaded", () => {

    map = L.map("map", {
        zoomControl: true,
        attributionControl: false
    }).setView([25, 50], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
    }).addTo(map);

    renderMap(window.currentLang || "en");

    const mapWrapper = document.querySelector(".map-wrapper");

    const resizeObserver = new ResizeObserver(() => {
        if (map) {
            map.invalidateSize(true);
        }
    });

    resizeObserver.observe(mapWrapper);

    setTimeout(() => {
        map.invalidateSize(true);
    }, 500);
});

function renderMap(lang) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    branches.forEach(branch => {

        const marker = L.marker(branch.coordinates).addTo(map);

        const popupHTML = `
            <div class="popup-content ${lang === "ar" ? "rtl" : ""}">
                <h4>${branch.name[lang]}</h4>
                <p><strong>${branch.city[lang]}</strong>, ${branch.country[lang]}</p>
                <div class="social-icons">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
                <button class="redirect-btn" data-link="${branch.link}">
                    ${visitStoreText[lang]}
                </button>
            </div>
        `;

        marker.bindPopup(popupHTML);

        marker.on("popupopen", () => {
            const btn = document.querySelector(".redirect-btn");
            if (btn) {
                btn.onclick = () => window.location.href = btn.dataset.link;
            }
        });

        markers.push(marker);
    });
}

function updateMapLanguage(lang) {
    renderMap(lang);
}
window.updateMapLanguage = updateMapLanguage;
