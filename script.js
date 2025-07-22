/**
 * WordPress Developer Portfolio - JavaScript
 * Author: Eduardo Silva
 * Description: Interactive functionality for portfolio website
 */

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let scrollTimeout;
const throttleDelay = 100;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');
    
    // Initialize all modules
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initActiveNavigation();
    initNavbarScroll();
    initScrollProgress();
    initParallaxEffects();
    initTypingEffect();
    initProjectFilters();
    
    // Performance optimizations
    initLazyLoading();
    preloadCriticalImages();
});

// ===== MOBILE MENU MODULE =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        mobileMenu.classList.toggle('hidden');
        
        // Update button icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
        }
        
        // Add animation classes
        if (!isOpen) {
            mobileMenu.style.animation = 'slideDown 0.3s ease-out';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars text-xl';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
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
                
                // Smooth scroll with easing
                smoothScrollTo(targetPosition, 800);
                
                // Update URL without triggering scroll
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();
    
    function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const ease = 1 - Math.pow(1 - progress, 3);
        
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
        rootMargin: '0px 0px -50px 0px'
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
                    element.style.transform = 'translateY(0)';
                }, delay);
                
                // Stop observing this element
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach((element, index) => {
        // Add stagger delay
        element.dataset.delay = index * 100;
        animationObserver.observe(element);
    });
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
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
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
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            resetSubmitButton(submitButton, originalText);
        }, 2000);
        
        // TODO: Replace with actual form submission
        // submitFormData(data);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form validation functions
function validateContactForm(data) {
    if (!data.name) {
        return { isValid: false, message: 'Please enter your name.' };
    }
    
    if (!data.email) {
        return { isValid: false, message: 'Please enter your email address.' };
    }
    
    if (!isValidEmail(data.email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!data.subject) {
        return { isValid: false, message: 'Please enter a subject.' };
    }
    
    if (!data.message) {
        return { isValid: false, message: 'Please enter your message.' };
    }
    
    if (data.message.length < 10) {
        return { isValid: false, message: 'Message must be at least 10 characters long.' };
    }
    
    return { isValid: true, message: 'Valid' };
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    switch (fieldName) {
        case 'name':
            isValid = value.length >= 2;
            message = 'Name must be at least 2 characters long.';
            break;
        case 'email':
            isValid = isValidEmail(value);
            message = 'Please enter a valid email address.';
            break;
        case 'subject':
            isValid = value.length >= 5;
            message = 'Subject must be at least 5 characters long.';
            break;
        case 'message':
            isValid = value.length >= 10;
            message = 'Message must be at least 10 characters long.';
            break;
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetSubmitButton(button, originalText) {
    if (button) {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// ===== ACTIVE NAVIGATION MODULE =====
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const throttledScroll = throttle(function() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-600', 'active');
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
        
        nav.classList.toggle('bg-white/95', scrolled);
        nav.classList.toggle('bg-white/90', !scrolled);
        nav.classList.toggle('shadow-lg', scrolled);
        nav.classList.toggle('backdrop-blur-xl', scrolled);
    }, throttleDelay);
    
    window.addEventListener('scroll', throttledNavbarScroll);
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    progressBar.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.scroll-progress');
    
    const updateProgress = throttle(function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressFill.style.width = scrolled + '%';
    }, throttleDelay);
    
    window.addEventListener('scroll', updateProgress);
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating');
    
    if (parallaxElements.length === 0) return;
    
    const handleParallax = throttle(function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translateY(${rate}px)`;
        });
    }, throttleDelay);
    
    window.addEventListener('scroll', handleParallax);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    const speed = 100;
    let i = 0;
    
    typingElement.textContent = '';
    typingElement.style.borderRight = '2px solid';
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Blinking cursor effect
            setInterval(() => {
                typingElement.style.borderRight = typingElement.style.borderRight === 'none' ? '2px solid' : 'none';
            }, 500);
        }
    }
    
    typeWriter();
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const shouldShow = filter === 'all' || cardCategory === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== PRELOAD CRITICAL IMAGES =====
function preloadCriticalImages() {
    const criticalImages = [
        // Add paths to critical images here
        // 'images/hero-bg.jpg',
        // 'images/profile.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${getNotificationClasses(type)}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationClasses(type) {
    switch (type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for input events
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 80) {
    const elementPosition = element.offsetTop - offset;
    smoothScrollTo(elementPosition, 800);
}

// Get scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Arrow keys for navigation (when not in form fields)
    if (!e.target.matches('input, textarea, select')) {
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                window.scrollBy(0, -100);
                break;
            case 'ArrowDown':
                e.preventDefault();
                window.scrollBy(0, 100);
                break;
            case 'Home':
                e.preventDefault();
                smoothScrollTo(0, 800);
                break;
            case 'End':
                e.preventDefault();
                smoothScrollTo(document.body.scrollHeight, 800);
                break;
        }
    }
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Focus management for skip links
const skipLinks = document.querySelectorAll('.skip-link');
skipLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== PERFORMANCE MONITORING =====

// Monitor page load performance
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Log performance metrics
        if (loadTime > 3000) {
            console.warn('Page load time is slow, consider optimization');
        }
    }
});

// Monitor scroll performance
let scrollPerformanceWarning = false;
window.addEventListener('scroll', function() {
    if (!scrollPerformanceWarning && performance.now() % 1000 < 16) {
        const scrollStart = performance.now();
        
        requestAnimationFrame(() => {
            const scrollTime = performance.now() - scrollStart;
            if (scrollTime > 16) {
                console.warn('Scroll performance issue detected');
                scrollPerformanceWarning = true;
            }
        });
    }
});

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Show user-friendly error message for critical errors
    if (e.error && e.error.message) {
        showNotification('Something went wrong. Please refresh the page.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== ANALYTICS HELPERS =====

// Track user interactions (replace with your analytics service)
function trackEvent(category, action, label = null, value = null) {
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Example: Custom analytics
    console.log('Event tracked:', { category, action, label, value });
}

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', throttle(function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestones
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
            trackEvent('Scroll', '25% Page Depth');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
            trackEvent('Scroll', '50% Page Depth');
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
            trackEvent('Scroll', '75% Page Depth');
        } else if (maxScrollDepth >= 100) {
            trackEvent('Scroll', '100% Page Depth');
        }
    }
}, 1000));

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    }
    
    if (e.target.matches('.nav-link')) {
        const linkText = e.target.textContent.trim();
        trackEvent('Navigation', 'Click', linkText);
    }
    
    if (e.target.matches('.project-card a')) {
        const projectTitle = e.target.closest('.project-card').querySelector('h3')?.textContent.trim();
        trackEvent('Project', 'View', projectTitle);
    }
});

// ===== DEVELOPMENT HELPERS =====

// Console welcome message (remove in production)
if (process.env.NODE_ENV !== 'production') {
    console.log('%cWelcome to Eduardo\'s Portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with ❤️ using vanilla JavaScript', 'color: #f093fb; font-size: 14px;');
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateContactForm,
        isValidEmail,
        throttle,
        debounce,
        smoothScrollTo
    };
}
