// Product Class using OOPS concepts
class Product {
    constructor(productData) {
        this.id = productData.id;
        this.brand = productData.brand;
        this.name = productData.name;
        this.subtitle = productData.subtitle;
        this.price = productData.price;
        this.originalPrice = productData.originalPrice;
        this.images = productData.images;
        this.sizes = productData.sizes;
        this.vendors = productData.vendors;
        this.details = productData.details;
        this.description = productData.description;
    }

    // Method to calculate discount percentage
    getDiscountPercentage() {
        if (!this.originalPrice || this.originalPrice <= this.price) return 0;
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }

    // Method to get lowest vendor price
    getLowestVendorPrice() {
        if (!this.vendors || this.vendors.length === 0) return this.price;
        return Math.min(...this.vendors.map(vendor => vendor.price));
    }

    // Method to check if size is available
    isSizeAvailable(size) {
        return this.sizes.includes(parseInt(size));
    }

    // Method to get vendor by name
    getVendorByName(vendorName) {
        return this.vendors.find(vendor => vendor.name === vendorName);
    }

    // Method to format price with currency
    formatPrice(price = this.price) {
        return `₹${price.toLocaleString('en-IN')}`;
    }

    // Method to get product specifications as HTML
    getSpecificationsHTML() {
        if (!this.details) return '';
        
        let html = '';
        for (const [key, value] of Object.entries(this.details)) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            html += `<strong>${formattedKey}:</strong> ${value}<br>`;
        }
        return html;
    }

    // Static method to create Product instance from JSON data
    static createFromJSON(jsonData) {
        return new Product(jsonData);
    }
}

// Product Manager Class to handle multiple products
class ProductManager {
    constructor() {
        this.products = [];
        this.currentProduct = null;
    }

    // Method to load products from JSON
    async loadProducts(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            const data = await response.json();
            this.products = data.products.map(productData => Product.createFromJSON(productData));
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    // Method to get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Method to get products by brand
    getProductsByBrand(brand) {
        return this.products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
    }

    // Method to set current product
    setCurrentProduct(product) {
        this.currentProduct = product;
    }

    // Method to get featured products (for homepage)
    getFeaturedProducts(limit = 4) {
        return this.products.slice(0, limit);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Product, ProductManager };
}