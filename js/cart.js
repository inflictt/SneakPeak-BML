class CartPage {
    constructor() {
        this.cart = [];
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        await this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadCart();
        } else {
            this.showLoginPrompt();
        }
        this.setupEventListeners();
    }

    async checkAuth() {
        try {
            const response = await API.checkAuthStatus();
            this.isAuthenticated = response.isAuthenticated;
        } catch (error) {
            console.error('Auth check failed:', error);
            this.isAuthenticated = false;
        }
    }

    async loadCart() {
        try {
            const response = await API.getCart();
            if (response.success) {
                this.cart = response.cart.items || [];
                this.subtotal = response.cart.subtotal || 0;
                this.renderCart();
                this.updateTotals();
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
            this.renderCart();
        }
    }

    showLoginPrompt() {
        const cartContainer = document.querySelector('.cart-items');
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Please login to view your cart</p>
                <a href="login.html" class="continue-shopping">Go to Login</a>
            </div>
        `;
    }

    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-subtitle">${item.subtitle}</p>
                    <p class="item-size">Size: ${item.size}</p>
                    <p class="item-vendor">Seller: ${item.vendor}</p>
                    <div class="item-bottom">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="price-remove">
                            <span class="item-price">₹${item.price * item.quantity}</span>
                            <button class="remove-btn">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.subtotal-amount').textContent = `₹${subtotal}`;
        document.querySelector('.total-amount').textContent = `₹${subtotal}`;
    }

    setupEventListeners() {
        document.querySelector('.cart-items').addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.dataset.id;
            
            if (e.target.classList.contains('plus')) {
                this.updateQuantity(itemId, 1);
            } else if (e.target.classList.contains('minus')) {
                this.updateQuantity(itemId, -1);
            } else if (e.target.classList.contains('remove-btn')) {
                this.removeItem(itemId);
            }
        });

        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    alert('Your cart is empty');
                    return;
                }
                // Add checkout logic here
                alert('Proceeding to checkout...');
            });
        }
    }

    async updateQuantity(itemId, change) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const newQuantity = this.cart[itemIndex].quantity + change;

        if (newQuantity < 1) {
            await this.removeItem(itemId);
        } else {
            try {
                const response = await API.updateCartItem(itemId, newQuantity);
                if (response.success) {
                    await this.loadCart();
                }
            } catch (error) {
                console.error('Failed to update quantity:', error);
                alert('Failed to update cart. Please try again.');
            }
        }
    }

    async removeItem(itemId) {
        try {
            const response = await API.removeFromCart(itemId);
            if (response.success) {
                await this.loadCart();
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
            alert('Failed to remove item. Please try again.');
        }
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});