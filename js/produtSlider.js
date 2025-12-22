document.addEventListener("DOMContentLoaded",function(){
        let currentSlide = 0;
    const slides = document.querySelectorAll('.product-slide');
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        slides[index].classList.add('active');
    }

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, slideInterval);

    showSlide(currentSlide);
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.animation = 'none';
            slide.offsetHeight;
        });

        slides[index].style.animation = '';
        slides[index].classList.add('active');
    }
})