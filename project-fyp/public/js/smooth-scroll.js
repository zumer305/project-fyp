/* ============================================
   SMOOTH SCROLL & INTERACTIVE ENHANCEMENTS
   Professional Travel Website - FYP
   ============================================ */

// Smooth scroll behavior for anchor links
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.boxShadow = 'var(--shadow-md)';
      return;
    }

    if (currentScroll > lastScroll && currentScroll > 80) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
      navbar.style.boxShadow = 'var(--shadow-xl)';
    }

    lastScroll = currentScroll;
  });
}

// Intersection Observer for fade-in animations
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

// Observe cards and sections
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card, .listing-card, .category-card, .feature-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

// Parallax effect for hero section
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
  });
}

// Add ripple effect to buttons
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple');

  const rippleStyle = document.createElement('style');
  if (!document.querySelector('#ripple-styles')) {
    rippleStyle.id = 'ripple-styles';
    rippleStyle.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      button, .btn, .add-btn, .edit-btn {
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(rippleStyle);
  }

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);
}

// Apply ripple to all buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button, .btn, .add-btn, .edit-btn');
  buttons.forEach(button => {
    button.addEventListener('click', createRipple);
  });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });
}

// Form validation enhancement
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add focus effect
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('input-focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('input-focused');
        
        // Validate on blur
        if (input.hasAttribute('required') && !input.value) {
          input.style.borderColor = 'var(--error)';
        } else {
          input.style.borderColor = 'var(--gray-300)';
        }
      });
    });
  });
});

// Progress indicator for page load
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  if (loadTime > 1000) {
    console.log(`Page loaded in ${loadTime}ms`);
  }
});

// Back to top button
const createBackToTop = () => {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'back-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 999;
    box-shadow: var(--shadow-lg);
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    } else {
      button.style.opacity = '0';
      button.style.transform = 'scale(0)';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

document.addEventListener('DOMContentLoaded', createBackToTop);

// Loading animation
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

console.log('✨ Professional enhancements loaded successfully!');
