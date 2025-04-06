document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Función para mostrar slide
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        currentSlide = (index + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Navegación con botones
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetTimer();
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetTimer();
    });

    // Navegación con indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Auto slide
    let slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // Resetear timer al interactuar
    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    // Mostrar primer slide al cargar
    showSlide(0);
});
