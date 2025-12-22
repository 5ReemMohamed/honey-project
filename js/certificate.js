document.addEventListener("DOMContentLoaded", function () {

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
})