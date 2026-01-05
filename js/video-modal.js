document.addEventListener("DOMContentLoaded",function(){
       const videoModal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');

        videoModal.addEventListener('show.bs.modal', () => {
            videoFrame.src = "https://www.youtube.com/embed/E9Xevr_kKK0?si=xFCXrmvqZC_He0pB";
        });

        videoModal.addEventListener('hidden.bs.modal', () => {
            videoFrame.src = "";
        });
})