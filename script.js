// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a, .cta-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const hash = this.getAttribute('href');
        
        if (hash && hash.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add active state to nav links with glow effect
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', updateActiveNav);
updateActiveNav();

// Fade in animation on load
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
});

// Subtle animation for skill tags on scroll
const skillTags = document.querySelectorAll('.skill-tag');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

skillTags.forEach((tag, index) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(15px)';
    tag.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
    observer.observe(tag);
});

// Subtle animation for project cards
const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
    cardObserver.observe(card);
});