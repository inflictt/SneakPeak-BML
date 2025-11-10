class ProductDetailsPage {
    constructor() {
        this.productId = null;
        this.product = null;
        this.selectedSize = null;
        this.selectedVendor = null;
        this.vendors = [];
        this.init();
    }

    async init() {
        // Get product ID from URL
        this.productId = this.getProductIdFromURL();
        
        if (!this.productId) {
            this.showError('Product ID not found in URL');
            return;
        }

        // Setup event listeners first (using delegation, so it works with dynamic content)
        this.setupEventListeners();
        
        // Load product data (this will render the product)
        await this.loadProduct();
        
        // Disable sections until size is selected
        this.disableVendorsSection();
        this.disableAddToCart();
    }

    getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadProduct() {
        try {
            console.log(`📦 Loading product with ID: ${this.productId}`);
            
            // Try loading from API first
            try {
                const response = await API.getProduct(this.productId);
                if (response.success && response.product) {
                    this.product = new Product(response.product);
                    console.log('✅ Product loaded from API');
                    this.renderProduct();
                    return;
                }
            } catch (apiError) {
                console.warn('API failed, trying JSON fallback...', apiError);
            }

            // Fallback to JSON
            const productManager = new ProductManager();
            await productManager.loadProducts('data/products.json');
            const productData = productManager.getProductById(this.productId);
            
            if (productData) {
                this.product = productData;
                console.log('✅ Product loaded from JSON');
                this.renderProduct();
            } else {
                throw new Error(`Product with ID ${this.productId} not found`);
            }
        } catch (error) {
            console.error('❌ Error loading product:', error);
            this.showError('Failed to load product. Please try again.');
        }
    }

    renderProduct() {
        if (!this.product) return;

        // Update page title
        document.title = `${this.product.brand} ${this.product.name} | SneakPeak`;

        // Update product header
        const brandName = document.querySelector('.brand-name');
        const productTitle = document.querySelector('.product-title');
        const productSubtitle = document.querySelector('.product-subtitle');
        const priceElement = document.querySelector('.price');

        if (brandName) brandName.textContent = this.product.brand;
        if (productTitle) productTitle.textContent = this.product.name;
        if (productSubtitle) productSubtitle.textContent = this.product.subtitle || '';
        
        // Calculate lowest price from vendors
        const lowestPrice = this.product.getLowestVendorPrice();
        if (priceElement) {
            priceElement.textContent = this.product.formatPrice(lowestPrice);
        }

        // Update product images
        this.renderProductImages();

        // Update size selector
        this.renderSizeSelector();

        // Update vendors
        this.renderVendors();
    }

    renderProductImages() {
        const imageGallery = document.querySelector('.image-gallery');
        if (!imageGallery || !this.product.images || this.product.images.length === 0) return;

        // Clear existing images
        imageGallery.innerHTML = '';

        // Create image rows (2 images per row)
        const images = this.product.images;
        for (let i = 0; i < images.length; i += 2) {
            const imageRow = document.createElement('div');
            imageRow.className = 'image-row';

            // First image
            const img1 = document.createElement('img');
            img1.src = images[i];
            img1.alt = `${this.product.brand} ${this.product.name} view ${i + 1}`;
            img1.className = 'product-image';
            imageRow.appendChild(img1);

            // Second image if exists
            if (images[i + 1]) {
                const img2 = document.createElement('img');
                img2.src = images[i + 1];
                img2.alt = `${this.product.brand} ${this.product.name} view ${i + 2}`;
                img2.className = 'product-image';
                imageRow.appendChild(img2);
            }

            imageGallery.appendChild(imageRow);
        }
    }

    renderSizeSelector() {
        const sizeSelector = document.querySelector('.size-selector');
        if (!sizeSelector || !this.product.sizes || this.product.sizes.length === 0) return;

        sizeSelector.innerHTML = '';

        this.product.sizes.forEach(size => {
            const button = document.createElement('button');
            button.className = 'size-option';
            button.dataset.size = size;
            button.textContent = `UK ${size}`;
            sizeSelector.appendChild(button);
        });
    }

    renderVendors() {
        const retailerCards = document.querySelector('.retailer-cards');
        if (!retailerCards || !this.product.vendors || this.product.vendors.length === 0) return;

        retailerCards.innerHTML = '';

        this.product.vendors.forEach(vendor => {
            const card = document.createElement('div');
            card.className = 'retailer-card';
            card.dataset.vendor = vendor.name;

            card.innerHTML = `
                <div class="retailer-info">
                    <div class="retailer-header">
                        <div class="retailer-name">${vendor.name}</div>
                        <div class="rating-section">
                            <img src="assets/images/img_vector_teal_400.svg" alt="Star rating" class="rating-icon">
                            <span class="rating-text">${vendor.rating || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="retailer-price">${this.product.formatPrice(vendor.price)}</div>
                    ${vendor.verified ? `
                        <div class="verified-badge">
                            <img src="assets/images/img_vector_teal_400_12x12.svg" alt="Verified" class="verified-icon">
                            <span class="verified-text">Verified Seller</span>
                        </div>
                    ` : ''}
                </div>
            `;

            retailerCards.appendChild(card);
        });

        // Update vendors array for cart functionality
        this.vendors = this.product.vendors.map(v => ({
            name: v.name,
            price: v.price,
            rating: v.rating,
            delivery: "2-3 days", // Default delivery time
            inStock: true
        }));
    }

    setupEventListeners() {
        // Use event delegation for dynamically created elements
        // Size Selection - delegate to size-selector container
        const sizeSelector = document.querySelector('.size-selector');
        if (sizeSelector) {
            sizeSelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('size-option')) {
                    this.handleSizeSelection(e.target);
                }
            });
        }

        // Vendor Selection - delegate to retailer-cards container
        const retailerCards = document.querySelector('.retailer-cards');
        if (retailerCards) {
            retailerCards.addEventListener('click', (e) => {
                const card = e.target.closest('.retailer-card');
                if (card) {
                    if (!this.selectedSize) {
                        this.updateVendorHint('Please select a size first');
                        return;
                    }
                    this.handleVendorSelection(card);
                }
            });
        }

        // Add to Cart
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.handleAddToCart());
        }

        // Wishlist
        const wishlistBtn = document.getElementById('wishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.handleWishlist());
        }
    }

    handleSizeSelection(sizeButton) {
        // Remove previous selection
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add new selection
        sizeButton.classList.add('selected');
        this.selectedSize = sizeButton.dataset.size;

        // Enable vendors section
        this.enableVendorsSection();
        this.updateSizeHint(`Size ${this.selectedSize} selected - Choose your vendor`);
        
        // Reset vendor selection if any
        this.resetVendorSelection();
    }

    handleVendorSelection(vendorCard) {
        // Remove previous selection
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add new selection
        vendorCard.classList.add('selected');
        const vendorName = vendorCard.dataset.vendor;
        
        // Find vendor from product data
        if (this.product && this.product.vendors) {
            const vendorData = this.product.vendors.find(v => v.name === vendorName);
            if (vendorData) {
                this.selectedVendor = {
                    name: vendorData.name,
                    price: vendorData.price,
                    rating: vendorData.rating,
                    delivery: "2-3 days",
                    inStock: true
                };
            }
        } else {
            // Fallback: parse from DOM
            this.selectedVendor = {
                name: vendorName,
                price: parseInt(vendorCard.querySelector('.retailer-price')?.textContent.replace(/[₹,]/g, '') || '0'),
                rating: parseFloat(vendorCard.querySelector('.rating-text')?.textContent || '0'),
                delivery: "2-3 days",
                inStock: true
            };
        }

        if (this.selectedVendor) {
            // Enable add to cart
            this.enableAddToCart();
            this.updateVendorHint(`Selected ${this.selectedVendor.name}`);
        }
    }

    async handleAddToCart() {
        if (!this.selectedSize || !this.selectedVendor) {
            this.showMessage('Please select both size and vendor', 'error');
            return;
        }

        if (!this.product) {
            this.showMessage('Product data not loaded', 'error');
            return;
        }

        try {
            // Check if user is authenticated
            const authStatus = await API.checkAuthStatus();
            
            if (!authStatus.isAuthenticated) {
                this.showMessage('Please login to add items to cart', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // Get first product image
            const firstImage = (this.product.images && this.product.images.length > 0) 
                ? this.product.images[0] 
                : 'assets/images/img_rectangle_12.png';

            // Get product details for cart item
            const cartItem = {
                productId: this.product.id,
                name: this.product.name,
                brand: this.product.brand,
                subtitle: this.product.subtitle || '',
                price: this.selectedVendor.price,
                size: this.selectedSize,
                vendor: this.selectedVendor.name,
                image: firstImage,
                quantity: 1
            };

            // Add to cart via API
            const response = await API.addToCart(cartItem);
            
            if (response.success) {
                this.showMessage('Added to cart successfully!', 'success');
                
                // Redirect to cart page
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1500);
            } else {
                throw new Error(response.message || 'Failed to add to cart');
            }
            
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showMessage(error.message || 'Failed to add to cart. Please try again.', 'error');
        }
    }

    enableVendorsSection() {
        const vendorsSection = document.querySelector('.vendors-section');
        vendorsSection.classList.remove('disabled');
        
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.remove('disabled');
        });
    }

    disableVendorsSection() {
        const vendorsSection = document.querySelector('.vendors-section');
        vendorsSection.classList.add('disabled');
        
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.add('disabled');
        });
    }

    enableAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const wishlistBtn = document.getElementById('wishlistBtn');
        
        addToCartBtn.disabled = false;
        wishlistBtn.disabled = false;
    }

    disableAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const wishlistBtn = document.getElementById('wishlistBtn');
        
        addToCartBtn.disabled = true;
        wishlistBtn.disabled = true;
    }

    resetVendorSelection() {
        this.selectedVendor = null;
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.disableAddToCart();
    }

    updateSizeHint(message) {
        const sizeHint = document.getElementById('sizeHint');
        if (sizeHint) {
            sizeHint.textContent = message;
        }
    }

    updateVendorHint(message) {
        const vendorHint = document.getElementById('vendorHint');
        if (vendorHint) {
            vendorHint.textContent = message;
        }
    }

    showError(message) {
        // Display error message in the main content area
        const productSection = document.querySelector('.product-section');
        if (productSection) {
            productSection.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2 style="color: #dc2626; margin-bottom: 20px;">Error Loading Product</h2>
                    <p style="color: #666; margin-bottom: 30px;">${message}</p>
                    <a href="index.html" style="display: inline-block; padding: 12px 24px; background: #000; color: white; text-decoration: none; border-radius: 4px;">
                        Return to Homepage
                    </a>
                </div>
            `;
        } else {
            // Fallback: use showMessage
            this.showMessage(message, 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 4px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;

        document.body.appendChild(messageElement);
        setTimeout(() => messageElement.remove(), 3000);
    }

    handleWishlist() {
        // Add wishlist functionality here
        this.showMessage('Added to wishlist!', 'success');
    }
}

// Initialize when DOM is loaded
function initializeProductDetails() {
    console.log('🚀 Initializing ProductDetailsPage...');
    try {
        new ProductDetailsPage();
    } catch (error) {
        console.error('❌ Error initializing ProductDetailsPage:', error);
    }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductDetails);
} else {
    // DOM is already loaded
    initializeProductDetails();
}