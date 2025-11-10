// Discover Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Product slider functionality
    const slider = document.getElementById('productsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (slider && prevBtn && nextBtn) {
        let scrollAmount = 0;
        const cardWidth = 326; // 310px + 16px gap
        
        nextBtn.addEventListener('click', () => {
            scrollAmount += cardWidth;
            if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
                scrollAmount = slider.scrollWidth - slider.clientWidth;
            }
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        prevBtn.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            if (scrollAmount < 0) {
                scrollAmount = 0;
            }
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // In a real implementation, you would filter content here
            filterDiscoverContent(button.textContent);
        });
    });
    
    // Filter content function (placeholder for actual implementation)
    function filterDiscoverContent(category) {
        console.log(`Filtering by: ${category}`);
        // This would typically involve:
        // 1. Hiding/showing discover cards based on category
        // 2. Making API calls to fetch filtered content
        // 3. Updating the DOM with filtered results
    }
    
    // Additional discover page functionality can be added here
});