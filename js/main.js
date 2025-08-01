// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation for contact forms
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    return isValid;
}

function showError(input, message) {
    const errorDiv = input.parentNode.querySelector('.error-message') || 
                    document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    if (!input.parentNode.querySelector('.error-message')) {
        input.parentNode.appendChild(errorDiv);
    }
    
    input.style.borderColor = '#ef4444';
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '';
}

// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(contactForm)) {
                // Show success message
                showSuccessMessage(contactForm, 'Thank you! Your message has been sent successfully.');
                contactForm.reset();
            }
        });
    }
});

function showSuccessMessage(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.color = '#10b981';
    successDiv.style.backgroundColor = '#d1fae5';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '0.5rem';
    successDiv.style.marginTop = '1rem';
    successDiv.style.textAlign = 'center';
    
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Button hover effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Active navigation link highlighting
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Set active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Utility function for smooth element visibility
function fadeInElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Initialize tooltips if needed
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#1E40AF';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem';
            tooltip.style.borderRadius = '0.25rem';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            e.target.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', (e) => {
            if (e.target.tooltip) {
                e.target.tooltip.remove();
                e.target.tooltip = null;
            }
        });
    });
}

// Initialize tooltips on page load
document.addEventListener('DOMContentLoaded', initTooltips);

// Mobile video/GIF background fixes
function initMobileVideo() {
    const video = document.querySelector('.hero-video-background video');
    const gif = document.querySelector('.hero-background-gif');
    
    // Handle video if present
    if (video) {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Ensure video is muted for mobile autoplay (required by most mobile browsers)
            video.muted = true;
            
            // Add webkit-specific attributes for iOS
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            
            // Force video to load
            video.load();
            
            // Multiple attempts to autoplay with different strategies
            const attemptAutoplay = async () => {
                try {
                    // First attempt: direct play
                    await video.play();
                    console.log('Video autoplay successful on mobile');
                } catch (error) {
                    console.log('First autoplay attempt failed, trying alternative method');
                    
                    try {
                        // Second attempt: ensure muted and try again
                        video.muted = true;
                        video.volume = 0;
                        await video.play();
                        console.log('Video autoplay successful on second attempt');
                    } catch (secondError) {
                        console.log('Second autoplay attempt failed, setting up interaction fallback');
                        
                        // Set up fallback for user interaction
                        const playOnInteraction = async () => {
                            try {
                                await video.play();
                                console.log('Video started on user interaction');
                            } catch (e) {
                                console.log('Failed to play on interaction:', e);
                            }
                            // Remove listeners after successful play
                            document.removeEventListener('touchstart', playOnInteraction);
                            document.removeEventListener('click', playOnInteraction);
                            document.removeEventListener('scroll', playOnInteraction);
                        };
                        
                        // Listen for various user interactions
                        document.addEventListener('touchstart', playOnInteraction, { once: true });
                        document.addEventListener('click', playOnInteraction, { once: true });
                        document.addEventListener('scroll', playOnInteraction, { once: true });
                    }
                }
            };
            
            // Start autoplay attempt
            attemptAutoplay();
            
            // Additional attempt when page becomes visible (for background tabs)
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && video.paused) {
                    setTimeout(attemptAutoplay, 100);
                }
            });
        }
    }
    
    // Handle GIF if present
    if (gif) {
        // Ensure GIF loads properly on mobile
        gif.addEventListener('load', () => {
            console.log('GIF background loaded successfully');
        });
        
        gif.addEventListener('error', () => {
            console.log('GIF background failed to load');
        });
    }
}

// Initialize mobile video fixes
document.addEventListener('DOMContentLoaded', initMobileVideo); 