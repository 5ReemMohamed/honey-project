document.addEventListener("DOMContentLoaded", function () {

    const branches = [
        {
            name: 'UAE Branch',
            city: 'Dubai',
            country: 'United Arab Emirates',
            coordinates: [25.2048, 55.2708],
            link: '/store-uae.html'
        },
        {
            name: 'Jordan Branch',
            city: 'Amman',
            country: 'Jordan',
            coordinates: [31.9454, 35.9284],
            link: '/store-jordan.html'
        },
        {
            name: 'Saudi Arabia Branch',
            city: 'Riyadh',
            country: 'Saudi Arabia',
            coordinates: [24.7136, 46.6753],
            link: '/store-saudi.html'
        },
        {
            name: 'Qatar Branch',
            city: 'Doha',
            country: 'Qatar',
            coordinates: [25.2854, 51.5310],
            link: '/store-qatar.html'
        },
        {
            name: 'Oman Branch',
            city: 'Muscat',
            country: 'Oman',
            coordinates: [23.5880, 58.3829],
            link: '/store-oman.html'
        }
    ];

    const map = L.map('map').setView([25.0, 50.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin"></div><div class="marker-arrow"></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
    });

    branches.forEach(branch => {
        const marker = L.marker(branch.coordinates, { icon: customIcon }).addTo(map);

        const popupContent = `
    <div class="popup-content">
        <h4>${branch.name}</h4>
        <p><strong>${branch.city}</strong>, ${branch.country}</p>

        <div class="social-icons">
            <a href="#" target="_blank" aria-label="Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
            </a>
        </div>

        <button class="redirect-btn" data-link="${branch.link}">
            Visit Store
        </button>
    </div>
`;


        marker.bindPopup(popupContent);

        marker.on('popupopen', function () {
            const popupEl = document.querySelector('.leaflet-popup-content');

            const redirectBtn = popupEl.querySelector('.redirect-btn');
            redirectBtn.addEventListener('click', () => {
                window.location.href = redirectBtn.dataset.link;
            });
        });
    });

})