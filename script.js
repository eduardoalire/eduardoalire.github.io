/**
 * Modern Dark Portfolio - JavaScript
 * Author: Eduardo Silva
 * Description: Interactive functionality for modern portfolio website
 */

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let scrollTimeout;
const throttleDelay = 16; // 60fps
let skillAnimationsTriggered = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('%cModern Portfolio Initialized', 'color: #3B82F6; font-size: 20px; font-weight: bold;');
    
    // Initialize all modules
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initActiveNavigation();
    initNavbarScroll();
    initScrollProgress();
    initParallaxEffects();
    initTypingEffect();
    initFloatingElements();
    initMouseTracker();
    initKeyboardNavigation();
    
    // Performance optimizations
    initLazyLoading();
    preloadCriticalAssets();
    
    // Analytics
    trackPageView();
});

// ===== MOBILE MENU MODULE =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        mobileMenu.classList.toggle('hidden', !isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        
        // Update button icon with animation
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                icon.className = isMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }
        
        // Animate menu items
        if (isMenuOpen) {
            mobileLinks.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    link.style.transition = 'all 0.3s ease';
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }
        
        trackEvent('Navigation', 'Mobile Menu Toggle', isMenuOpen ? 'Open' : 'Close');
    }
    
    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });
}

// ===== SMOOTH SCROLLING MODULE =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navHeight = document.querySelector('nav')?.offsetHeight || 80;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                // Enhanced smooth scroll with custom easing
                smoothScrollTo(targetPosition, 1000);
                
                // Update URL without triggering scroll
                history.pushState(null, null, targetId);
                
                // Track navigation
                trackEvent('Navigation', 'Scroll To Section', targetId.replace('#', ''));
            }
        });
    });
}

// Enhanced smooth scroll function with custom easing
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();
    
    function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Custom easing function (ease-out-quart)
        const ease = 1 - Math.pow(1 - progress, 4);
        
        window.scrollTo(0, start + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        }
    }
    
    requestAnimationFrame(scrollAnimation);
}

// ===== SCROLL ANIMATIONS MODULE =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add loaded class for CSS animations
                element.classList.add('loaded');
                
                // Add stagger delay for multiple elements
                const delay = element.dataset.delay || 0;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) translateX(0)';
                }, delay);
                
                // Special handling for skill bars
                if (element.classList.contains('skill-category') && !skillAnimationsTriggered) {
                    setTimeout(() => animateSkillBars(), 500);
                    skillAnimationsTriggered = true;
                }
                
                // Stop observing this element
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-category, .glass-card');
    animatedElements.forEach((element, index) => {
        // Add stagger delay
        element.dataset.delay = (index % 3) * 200;
        animationObserver.observe(element);
    });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    // This will be triggered by scroll animation
}

function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    
    skillFills.forEach((fill, index) => {
        const width = fill.dataset.width;
        setTimeout(() => {
            fill.style.width = width + '%';
        }, index * 200);
    });
    
    trackEvent('Skills', 'Animation Triggered');
}

// ===== CONTACT FORM MODULE =====
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>Sending...</span>';
            submitButton.disabled = true;
        }
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim()
        };
        
        // Validate form
        const validation = validateContactForm(data);
        
        if (!validation.isValid) {
            showNotification(validation.message, 'error');
            resetSubmitButton(submitButton, originalText);
            return;
        }
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            resetSubmitButton(submitButton, originalText);
            trackEvent('Contact', 'Form Submitted');
        }, 2000);
        
        trackEvent('Contact', 'Form Submission Attempted');
    });
    
    // Real-time validation with debounce
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        let validationTimeout;
        
        input.addEventListener('input', function() {
            clearTimeout(validationTimeout);
            clearFieldError(this);
            
            validationTimeout = setTimeout(() => {
                if (this.value.trim()) {
                    validateField(this);
                }
            }, 500);
        });
        
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });
    });
}

// Enhanced form validation
function validateContactForm(data) {
    const rules = [
        { field: 'name', min: 2, message: 'Name must be at least 2 characters long.' },
        { field: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
        { field: 'subject', min: 5, message: 'Subject must be at least 5 characters long.' },
        { field: 'message', min: 10, message: 'Message must be at least 10 characters long.' }
    ];
    
    for (const rule of rules) {
        const value = data[rule.field];
        
        if (!value) {
            return { isValid: false, message: `Please enter your ${rule.field}.` };
        }
        
        if (rule.min && value.length < rule.min) {
            return { isValid: false, message: rule.message };
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
            return { isValid: false, message: rule.message };
        }
    }
    
    return { isValid: true, message: 'Valid' };
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    const validationRules = {
        name: { min: 2, message: 'Name must be at least 2 characters long.' },
        email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
        subject: { min: 5, message: 'Subject must be at least 5 characters long.' },
        message: { min: 10, message: 'Message must be at least 10 characters long.' }
    };
    
    const rule = validationRules[fieldName];
    if (!rule) return true;
    
    let isValid = true;
    let message = '';
    
    if (rule.min && value.length < rule.min) {
        isValid = false;
        message = rule.message;
    } else if (rule.pattern && !rule.pattern.test(value)) {
        isValid = false;
        message = rule.message;
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#EF4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-400 text-sm mt-1 flex items-center';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.style.borderColor = '#10B981';
    field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function resetSubmitButton(button, originalText) {
    if (button) {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// ===== ACTIVE NAVIGATION MODULE =====
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const throttledScroll = throttle(function() {
        let current = '';
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, throttleDelay);
    
    window.addEventListener('scroll', throttledScroll);
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const throttledNavbarScroll = throttle(function() {
        const scrolled = window.scrollY > 50;
        
        nav.style.background = scrolled ? 
            'rgba(17, 24,