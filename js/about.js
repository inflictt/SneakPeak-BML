// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.style.display === 'flex';
            navMenu.style.display = isOpen ? 'none' : 'flex';
            
            // Animate hamburger to X
            if (isOpen) {
                hamburger.style.transform = 'rotate(0deg)';
            } else {
                hamburger.style.transform = 'rotate(90deg)';
            }
        });
    }
    
    // Add any additional JavaScript functionality here
});