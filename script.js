// ======================= Hero Slider =======================
class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.slider-dot');
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.startAutoPlay();
        const hero = document.querySelector('.hero');
        hero.addEventListener('mouseenter', () => this.stopAutoPlay());
        hero.addEventListener('mouseleave', () => this.startAutoPlay());
        this.addTouchSupport();
    }

    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const hero = document.querySelector('.hero');

        hero.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
        hero.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            }
        });
    }
}

// ======================= Mobile Menu =======================
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        document.addEventListener('click', (e) => {
            if (!this.menuBtn.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.menuBtn.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuBtn.classList.remove('active');
    }
}

// ======================= Smooth Scrolling =======================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ======================= Deal of the Day =======================
function initDealOfTheDay() {
    fetch('get-deal.php')
        .then(res => res.json())
        .then(deal => {
            if (!deal.error) {
                document.getElementById('deal-product').innerText = deal.product_name;
                document.getElementById('deal-original').innerText = `$${deal.original_price}`;
                document.getElementById('deal-price').innerText = `$${deal.deal_price} only`;
                const dealImage = document.getElementById('deal-image');
                dealImage.src = deal.image;
                dealImage.alt = deal.product_name;

                const endTime = new Date(deal.deal_end).getTime();
                const timer = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = endTime - now;

                    if (distance < 0) {
                        clearInterval(timer);
                        document.getElementById('days').innerText = "00";
                        document.getElementById('hours').innerText = "00";
                        document.getElementById('minutes').innerText = "00";
                        document.getElementById('seconds').innerText = "00";
                    } else {
                        document.getElementById('days').innerText = String(Math.floor(distance / (1000*60*60*24))).padStart(2,'0');
                        document.getElementById('hours').innerText = String(Math.floor((distance % (1000*60*60*24))/(1000*60*60))).padStart(2,'0');
                        document.getElementById('minutes').innerText = String(Math.floor((distance % (1000*60*60))/(1000*60))).padStart(2,'0');
                        document.getElementById('seconds').innerText = String(Math.floor((distance % (1000*60))/1000)).padStart(2,'0');
                    }
                }, 1000);
            }
        })
        .catch(err => console.error('Error loading deal of the day:', err));
}

// ======================= Scroll Animations =======================
function handleScrollAnimations() {
    document.querySelectorAll('.fade-in').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 150) el.classList.add('visible');
    });
}

// ======================= Window Resize Handling =======================
function handleResize() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('mobile-active');
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        }
    }
}

// ======================= Multi-Item Testimonial Slider =======================
class MultiTestimonialSlider {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.current = 0;
        this.perSlide = 3; // 3 testimonials per slide
        this.interval = null;
        this.init();
    }

    init() {
        if (this.cards.length === 0) return;
        this.showSlide(this.current);
        this.startAutoPlay();

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index * this.perSlide);
                this.resetAutoPlay();
            });
        });
    }

    showSlide(startIndex) {
        this.cards.forEach(card => card.classList.remove('active'));
        for (let i = startIndex; i < startIndex + this.perSlide; i++) {
            if (this.cards[i]) this.cards[i].classList.add('active');
        }

        const dotIndex = Math.floor(startIndex / this.perSlide);
        this.dots.forEach(dot => dot.classList.remove('active'));
        if (this.dots[dotIndex]) this.dots[dotIndex].classList.add('active');

        this.current = startIndex;
    }

    nextSlide() {
        let nextIndex = this.current + this.perSlide;
        if (nextIndex >= this.cards.length) nextIndex = 0;
        this.showSlide(nextIndex);
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.interval);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ======================= Initialize Everything =======================
document.addEventListener('DOMContentLoaded', function() {
    new HeroSlider();
    new MobileMenu();
    initSmoothScrolling();
    initDealOfTheDay();
    handleScrollAnimations();
    new MultiTestimonialSlider(); // multi-item testimonials
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('resize', handleResize);
});
