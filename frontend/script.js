
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}


function moveSlide(direction) {
    showSlide(currentSlideIndex + direction);
}


function currentSlide(index) {
    showSlide(index);
}


let autoSlide = setInterval(() => {
    moveSlide(1);
}, 5000);


document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoSlide);
});


document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
        moveSlide(1);
    }, 5000);
});


let currentReviewIndex = 0;
const reviewsContainer = document.querySelector('.reviews-container');
const reviewCards = document.querySelectorAll('.review-card');

function moveReview(direction) {
    const cardWidth = reviewCards[0].offsetWidth + 20; 
    const maxScroll = (reviewCards.length - 1) * cardWidth;
    
    currentReviewIndex += direction;
    
    if (currentReviewIndex < 0) {
        currentReviewIndex = 0;
    } else if (currentReviewIndex * cardWidth > maxScroll) {
        currentReviewIndex = Math.floor(maxScroll / cardWidth);
    }
    
    reviewsContainer.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
}


reviewsContainer.style.transition = 'transform 0.3s ease-in-out';


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveSlide(-1);
    } else if (e.key === 'ArrowRight') {
        moveSlide(1);
    }
});


document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        const categoryName = this.querySelector('p').textContent;
        console.log(`Navegando a categoría: ${categoryName}`);

    });
});


document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const productName = this.querySelector('.product-name').textContent;
        console.log(`Personalizando: ${productName}`);

    });
});


document.querySelector('.menu-icon').addEventListener('click', function() {
    console.log('Menú clickeado');

});


document.querySelector('.search-icon').addEventListener('click', function() {
    console.log('Búsqueda clickeada');
    
});


document.querySelector('.cart-icon').addEventListener('click', function() {
    console.log('Carrito clickeado');
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .review-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
});

