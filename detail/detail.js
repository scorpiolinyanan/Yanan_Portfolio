// Detail Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Add click event to header title to return to home page
    const headerTitle = document.querySelector('.header-left h1');
    headerTitle.style.cursor = 'pointer';
    headerTitle.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    // Show all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('active');
        page.style.display = 'flex';
    });

    // Image hover effects and click to enlarge
    const images = document.querySelectorAll('.project-image:not(video)');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-btn');
    
    images.forEach(img => {
        // Click to enlarge
        img.addEventListener('click', () => {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Text animation on scroll
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

    // Observe text elements
    const textElements = document.querySelectorAll('.project-title, .project-subtitle, .project-description');
    textElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
