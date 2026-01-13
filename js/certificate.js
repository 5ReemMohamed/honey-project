document.addEventListener("DOMContentLoaded", function () {

    const certificateModal = document.getElementById('certificateModal');
    const certImageContainer = certificateModal.querySelector('.cert-image-container');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    let scale = 1;
    const maxZoom = 3;
    const minZoom = 1;
    const zoomStep = 0.2;
    let currentImages = [];

    certificateModal.addEventListener('show.bs.modal', function (event) {
        scale = 1;
        currentImages = [];

        const triggerElement = event.relatedTarget;
        if (!triggerElement) return;
        let imgSrcs = triggerElement.getAttribute('data-bs-imgs') || triggerElement.getAttribute('data-bs-img');
        if (!imgSrcs) imgSrcs = 'assets/default-certificate.jpg';

        const imageArray = imgSrcs.split(',').map(src => src.trim()).filter(src => src !== '');
        certImageContainer.innerHTML = '';
        imageArray.forEach((src, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'cert-img-wrapper position-relative w-100';

            const img = document.createElement('img');
            img.src = src;
            img.alt = "Certificate";
            img.className = "modal-cert-img img-fluid";
            img.style.cursor = 'pointer';
            img.style.transition = 'transform 0.3s ease';
            img.style.maxWidth = '100%';
            img.style.Width = '100%';
            img.style.objectFit = 'cover';
            img.style.transform = `scale(${scale})`;

            if (imageArray.length > 1) {
                const numberIndicator = document.createElement('div');
                numberIndicator.className = 'position-absolute top-0 start-0 m-2 badge bg-primary';
                numberIndicator.textContent = `${index + 1}/${imageArray.length}`;
                numberIndicator.style.zIndex = '10';
                imgWrapper.appendChild(numberIndicator);
            }

            imgWrapper.appendChild(img);
            certImageContainer.appendChild(imgWrapper);
            currentImages.push(img);
            img.addEventListener('click', function () {
                scale = 1;
                updateAllImagesScale();
            });
        });
        const modalTitle = certificateModal.querySelector('.modal-title');
        modalTitle.textContent = imageArray.length > 1 ? `Certificates (${imageArray.length})` : 'Certificate';
    });
    function updateAllImagesScale() {
        currentImages.forEach(img => {
            img.style.transform = `scale(${scale})`;
        });
    }
    zoomInBtn?.addEventListener('click', function () {
        if (scale < maxZoom) {
            scale += zoomStep;
            updateAllImagesScale();
        }
    });

    zoomOutBtn?.addEventListener('click', function () {
        if (scale > minZoom) {
            scale -= zoomStep;
            updateAllImagesScale();
        }
    });

    certificateModal.addEventListener('hidden.bs.modal', function () {
        scale = 1;
        updateAllImagesScale();
        currentImages = [];
        certImageContainer.innerHTML = '';
    });
});
