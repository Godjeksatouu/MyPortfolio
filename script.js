// DOM Elements
const header = document.querySelector('.main-header');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const headerShapes = document.getElementById('header-shapes');
const particlesContainer = document.getElementById('particles');

// ----- Theme Toggling -----
// Check for saved theme preference or prefer-color-scheme
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-theme');
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// ----- Mobile Navigation -----
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ----- Smooth Scrolling for Anchor Links -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        const headerOffset = header.offsetHeight;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// ----- Header Animations -----
// Generate random shapes for header background
function createHeaderShapes() {
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.classList.add('header-shape');
        
        // Random size between 100px and 300px
        const size = Math.floor(Math.random() * 200) + 100;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Random position
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        
        headerShapes.appendChild(shape);
    }
}

createHeaderShapes();

// ----- Scroll Effects -----
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header scroll effects
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > 300) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
    
    // Active navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - header.offsetHeight - 10;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.querySelector(`a[href="#${sectionId}"]`)) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// ----- Particle Background -----
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > window.innerWidth) {
            this.speedX = -this.speedX;
        }
        
        if (this.y < 0 || this.y > window.innerHeight) {
            this.speedY = -this.speedY;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Limit particles based on screen size
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
    
    // Connect particles with lines if they're close enough
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(ctx);
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    animate();
}

// Initialize particles
createParticles();

// ----- Intersection Observer for Animations -----
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// ----- Initialize Active Navigation -----
function setInitialActiveNav() {
    // Get the current scroll position
    const scrollPosition = window.scrollY + header.offsetHeight + 10;
    
    // Find the current section
    const sections = document.querySelectorAll('section[id]');
    let currentSection = sections[0]?.getAttribute('id') || '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Set active class
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (currentSection && item.querySelector(`a[href="#${currentSection}"]`)) {
            item.classList.add('active');
        }
    });
}

// Run on load
window.addEventListener('load', () => {
    setInitialActiveNav();
    
    // Add animation classes to constellation lines with delay
    document.querySelectorAll('.constellation-line').forEach((line, index) => {
        line.style.animationDelay = `${1.5 + index * 0.2}s`;
    });
});
// ----- Projects Filter -----
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('in-view'), 10);
            } else {
                card.classList.remove('in-view');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// ----- Contact Form Handling -----
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simple client-side validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        formMessage.textContent = 'Please fill out all fields.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        formMessage.textContent = 'Message sent successfully! I’ll get back to you soon.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        contactForm.reset();
    }, 500);

    // For actual implementation, uncomment and configure:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            formMessage.textContent = 'Message sent successfully! I’ll get back to you soon.';
            formMessage.classList.remove('error');
            formMessage.classList.add('success');
            contactForm.reset();
        } else {
            formMessage.textContent = 'Something went wrong. Please try again.';
            formMessage.classList.remove('success');
            formMessage.classList.add('error');
        }
    })
    .catch(error => {
        formMessage.textContent = 'An error occurred. Please try again later.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
    });
    */
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Project filters
    const filterBtns = document.querySelectorAll('.project-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Shrink header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Project filters
    const filterBtns = document.querySelectorAll('.project-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Shrink header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission with validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                highlightError(nameInput);
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                highlightError(emailInput);
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                highlightError(messageInput);
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            if (isValid) {
                // In a real implementation, you would send data to server here
                // For now, just show success message
                const formSuccess = document.createElement('div');
                formSuccess.className = 'form-success';
                formSuccess.textContent = 'Thank you! Your message has been sent.';
                
                // Replace form with success message
                contactForm.innerHTML = '';
                contactForm.appendChild(formSuccess);
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Form error helpers
    function highlightError(input) {
        input.classList.add('error');
        input.parentElement.classList.add('has-error');
        
        // Create error message if it doesn't exist
        if (!input.parentElement.querySelector('.error-message')) {
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = input.id === 'email' && input.value.trim() 
                ? 'Please enter a valid email address' 
                : 'This field is required';
            input.parentElement.appendChild(errorMessage);
        }
    }
    
    function removeError(input) {
        input.classList.remove('error');
        input.parentElement.classList.remove('has-error');
        
        // Remove error message if it exists
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Animation on scroll (simple version)
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    function checkVisibility() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.85) {
                el.classList.add('fadeIn');
            }
        });
    }
    
    // Run once immediately
    checkVisibility();
    
    // Then on scroll
    window.addEventListener('scroll', checkVisibility);
});

// Add CSS for error states
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group.has-error input,
    .form-group.has-error textarea {
        border-color: #ff4081;
        box-shadow: 0 0 0 2px rgba(255, 64, 129, 0.2);
    }
    
    .error-message {
        color: #ff4081;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    }
    
    .form-success {
        padding: 20px;
        background-color: #4caf50;
        color: white;
        text-align: center;
        border-radius: 4px;
        font-weight: 500;
    }
`;
document.head.appendChild(errorStyles);