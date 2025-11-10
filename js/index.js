// Product slider functionality with MongoDB API integration
class HomePageManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentSlide = 0;
        this.sliderInterval = null;
        this.slidesPerView = 3; // Number of products visible at once
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.initSlider();
        this.initSearchFilter();
        this.initEventListeners();
    }

    async loadProducts() {
        // Try loading from JSON first (more reliable)
        try {
            await this.loadProductsFromJSON();
        } catch (error) {
            console.error('Error loading products from JSON:', error);
            // Fallback: try MongoDB API
            try {
                console.log('Trying MongoDB API as fallback...');
                const response = await API.getAllProducts(); // Get all products for search
                
                if (response.success && response.products && response.products.length > 0) {
                    // Convert API products to Product instances
                    this.products = response.products.map(productData => 
                        new Product(productData)
                    );
                    this.renderProducts(this.products);
                } else {
                    this.showError('No products available. Please check your database.');
                }
            } catch (apiError) {
                console.error('Error loading products from API:', apiError);
                this.showError('Failed to load products. Please refresh the page.');
            }
        }
    }

    async loadProductsFromJSON() {
        console.log('📦 Loading products from products.json...');
        
        if (typeof ProductManager === 'undefined') {
            throw new Error('ProductManager class not found. Make sure product.js is loaded.');
        }
        
        const productManager = new ProductManager();
        const products = await productManager.loadProducts('data/products.json');
        
        console.log(`📊 Found ${products ? products.length : 0} products in JSON`);
        
        if (!products || products.length === 0) {
            throw new Error('No products found in JSON file');
        }
        
        // Show all products (or limit if needed)
        this.products = products; // Show all products for better slider experience
        console.log(`✅ Selected ${this.products.length} products to display`);
        this.renderProducts(this.products);
    }

    renderProducts(products) {
        const slider = document.getElementById('productsSlider');
        
        if (!slider) {
            console.error('❌ Products slider not found in DOM');
            return;
        }

        console.log(`🔄 Rendering ${products.length} products...`);

        // Clear loading message
        slider.innerHTML = '';

        if (!products || products.length === 0) {
            console.warn('⚠️ No products to render');
            slider.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    No products available at the moment.
                </div>
            `;
            return;
        }

        // Create wrapper for carousel
        const carouselWrapper = document.createElement('div');
        carouselWrapper.className = 'carousel-wrapper';
        carouselWrapper.style.cssText = 'display: flex; transition: transform 0.5s ease; width: 100%;';

        // Group products into slides (3 products per slide)
        for (let i = 0; i < products.length; i += this.slidesPerView) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.style.cssText = 'display: flex; gap: 16px; min-width: 100%; flex-shrink: 0;';

            const slideProducts = products.slice(i, i + this.slidesPerView);
            slideProducts.forEach((product, index) => {
                try {
                    const productCard = this.createProductCard(product);
                    // Each product in a slide takes equal space
                    productCard.style.cssText = 'flex: 1; min-width: 0;';
                    slide.appendChild(productCard);
                    console.log(`✅ Rendered product ${i + index + 1}: ${product.brand} ${product.name}`);
                } catch (error) {
                    console.error(`❌ Error rendering product ${i + index + 1}:`, error);
                }
            });

            carouselWrapper.appendChild(slide);
        }

        slider.appendChild(carouselWrapper);
        this.filteredProducts = products;
        this.updateSliderIndicators();
        this.startAutoSlide();
        
        console.log(`✅ Successfully rendered ${products.length} products`);
    }

    updateSliderIndicators() {
        const indicatorsContainer = document.getElementById('sliderIndicators');
        if (!indicatorsContainer || !this.filteredProducts || this.filteredProducts.length === 0) return;

        const totalSlides = Math.ceil(this.filteredProducts.length / this.slidesPerView);
        indicatorsContainer.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.setAttribute('data-slide', i);
            indicator.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: none;
                background: ${i === this.currentSlide ? '#000' : '#ccc'};
                cursor: pointer;
                transition: background 0.3s;
            `;
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    goToSlide(slideIndex) {
        const slider = document.getElementById('productsSlider');
        const carouselWrapper = slider?.querySelector('.carousel-wrapper');
        if (!carouselWrapper) return;

        const totalSlides = Math.ceil(this.filteredProducts.length / this.slidesPerView);
        this.currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));

        // Calculate translateX based on slide index
        // Each slide shows 3 products (33.333% each), so we move by 100% per slide
        const translateX = -(this.currentSlide * 100);
        carouselWrapper.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        document.querySelectorAll('.slider-indicator').forEach((ind, idx) => {
            ind.style.background = idx === this.currentSlide ? '#000' : '#ccc';
        });
    }

    startAutoSlide() {
        // Clear existing interval
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
        }

        // Auto-slide every 4 seconds
        this.sliderInterval = setInterval(() => {
            const totalSlides = Math.ceil(this.filteredProducts.length / this.slidesPerView);
            if (totalSlides <= 1) return;

            this.currentSlide = (this.currentSlide + 1) % totalSlides;
            this.goToSlide(this.currentSlide);
        }, 4000);
    }

    stopAutoSlide() {
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
            this.sliderInterval = null;
        }
    }

    showError(message) {
        const slider = document.getElementById('productsSlider');
        if (slider) {
            slider.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    ${message}
                </div>
            `;
        }
    }

    createProductCard(product) {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.setAttribute('data-product-id', product.id);

        // Ensure product has required properties
        const productInstance = product instanceof Product ? product : new Product(product);
        
        // Calculate discount
        const discount = productInstance.getDiscountPercentage();
        
        // Get first image or fallback
        const imageUrl = (productInstance.images && productInstance.images.length > 0) 
            ? productInstance.images[0] 
            : 'assets/images/img_rectangle_12.png';
        
        // Format price safely
        const price = productInstance.price || 0;
        const originalPrice = productInstance.originalPrice || price;

        article.innerHTML = `
            <a href="/productDetails?id=${productInstance.id}" style="display: block; text-decoration: none; color: inherit;">
                <img src="${imageUrl}" alt="${productInstance.brand} ${productInstance.name} sneakers" class="product-image" style="opacity: 1;">
                <div class="product-info">
                    <p class="product-brand">${productInstance.brand || 'Brand'}</p>
                    <h3 class="product-name">${productInstance.name || 'Product'}</h3>
                    ${discount > 0 ? `
                        <div class="product-pricing" style="margin-top: 8px;">
                            <span class="current-price" style="color: #dc2626; font-weight: 600;">₹${price.toLocaleString('en-IN')}</span>
                            <span class="original-price" style="text-decoration: line-through; color: #999; margin-left: 8px;">₹${originalPrice.toLocaleString('en-IN')}</span>
                            <span class="discount-badge" style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px;">${discount}% OFF</span>
                        </div>
                    ` : `
                        <div class="product-pricing" style="margin-top: 8px;">
                            <span class="current-price" style="font-weight: 600;">₹${price.toLocaleString('en-IN')}</span>
                        </div>
                    `}
                </div>
            </a>
        `;

        return article;
    }

    initSlider() {
        // Slider is now auto-sliding, but we can add pause on hover
        const slider = document.getElementById('productsSlider');
        if (!slider) return;

        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    initSearchFilter() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        // Debounce search function
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.toLowerCase().trim();

            searchTimeout = setTimeout(() => {
                this.filterProducts(searchTerm);
            }, 300); // Wait 300ms after user stops typing
        });

        // Clear search on Escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.filterProducts('');
            }
        });
    }

    filterProducts(searchTerm) {
        if (!searchTerm) {
            // Show all products
            this.filteredProducts = this.products;
        } else {
            // Filter products by search term
            this.filteredProducts = this.products.filter(product => {
                const brand = (product.brand || '').toLowerCase();
                const name = (product.name || '').toLowerCase();
                const subtitle = (product.subtitle || '').toLowerCase();
                
                return brand.includes(searchTerm) || 
                       name.includes(searchTerm) || 
                       subtitle.includes(searchTerm);
            });
        }

        // Re-render filtered products
        this.renderProducts(this.filteredProducts);
        
        // Reset to first slide
        this.currentSlide = 0;
        this.goToSlide(0);
        
        console.log(`🔍 Filtered to ${this.filteredProducts.length} products`);
    }

    initEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
        }

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

        // Hero button click
        const heroButton = document.querySelector('.hero-button');
        if (heroButton) {
            heroButton.addEventListener('click', () => {
                window.location.href = 'discover.html';
            });
        }

        // CTA button click
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
        }
    }
}

// Initialize when DOM is loaded
function initializeHomePage() {
    console.log('🚀 Initializing HomePageManager...');
    try {
        new HomePageManager();
    } catch (error) {
        console.error('❌ Error initializing HomePageManager:', error);
    }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHomePage);
} else {
    // DOM is already loaded
    initializeHomePage();
}