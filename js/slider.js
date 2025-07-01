// Slider functionality for cases
document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    const track = document.querySelector('.case_slider_track');
    const slides = document.querySelectorAll('.case_slide');
    const totalSlides = slides.length;

    if (!track || slides.length === 0) return;

    function goToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % totalSlides);
    }

    // Auto-slide
    let interval = setInterval(nextSlide, 4000);

    // Pause on hover
    const slider = document.querySelector('.case_slider_wrapper');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', () => {
            interval = setInterval(nextSlide, 4000);
        });
    }

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
            }
        }
    }

    if (slider) {
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchend', handleSwipe, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Initialize first slide
    goToSlide(0);

    const scrollBtn = document.querySelector('.scroll-to-contact');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('.contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}); 