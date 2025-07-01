document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація частинок
    initParticles();
    
    const track = document.querySelector('.case_slider_track');
    const slides = document.querySelectorAll('.case_slide');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Функція для оновлення активного слайду
    function updateSlide() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Анімація для статистики
        animateStats();
    }
    
    // Анімація статистики
    function animateStats() {
        const currentSlideElement = slides[currentSlide];
        const statNumbers = currentSlideElement.querySelectorAll('.stat_number');
        
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.animation = 'none';
                stat.offsetHeight; // Trigger reflow
                stat.style.animation = 'numberCount 2s ease-out';
            }, index * 200);
        });
    }
    
    // Наступний слайд
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlide();
    }
    
    // Автоматичне перемикання слайдерів
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Зупинка автоперемикання при наведенні
    const sliderBlock = document.querySelector('.case_slider_block');
    if (sliderBlock) {
        sliderBlock.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderBlock.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Клавіатурна навігація
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Swipe для мобільних пристроїв
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateSlide();
            }
        }
    }
    
    // Ініціалізація першого слайду
    updateSlide();
    
    // Додавання ефектів при завантаженні
    setTimeout(() => {
        const firstSlide = slides[0];
        if (firstSlide) {
            firstSlide.style.opacity = '1';
            firstSlide.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Функція для ініціалізації частинок
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationId;
    
    // Налаштування розміру canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Клас частинки
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = `hsl(${Math.random() * 60 + 180}, 70%, 70%)`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Відбиття від країв
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Зміна прозорості
            this.opacity += (Math.random() - 0.5) * 0.02;
            this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Створення частинок
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Функція анімації
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Оновлення та малювання частинок
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Малювання з'єднань між частинками
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Запуск анімації
    animate();
    
    // Очищення при знищенні
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}
