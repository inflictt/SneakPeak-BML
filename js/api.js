// API Configuration and Utility Functions
// Use relative URL since frontend and backend are on the same server
const API_BASE_URL = '/api';

class API {
    // Helper method for making requests
    static async request(endpoint, options = {}) {
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include' // Include cookies for session management
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication APIs
    static async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async logout() {
        return await this.request('/auth/logout', {
            method: 'POST'
        });
    }

    static async getCurrentUser() {
        return await this.request('/auth/me');
    }

    static async checkAuthStatus() {
        return await this.request('/auth/status');
    }

    static async updateProfile(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Product APIs
    static async getAllProducts(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/products?${queryParams}` : '/products';
        return await this.request(endpoint);
    }

    static async getProduct(id) {
        return await this.request(`/products/${id}`);
    }

    static async getFeaturedProducts(limit = 10) {
        return await this.request(`/products/featured?limit=${limit}`);
    }

    static async getProductsByBrand(brand) {
        return await this.request(`/products/brand/${brand}`);
    }

    // Cart APIs
    static async getCart() {
        return await this.request('/cart');
    }

    static async addToCart(item) {
        return await this.request('/cart/add', {
            method: 'POST',
            body: JSON.stringify(item)
        });
    }

    static async updateCartItem(itemId, quantity) {
        return await this.request(`/cart/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    static async removeFromCart(itemId) {
        return await this.request(`/cart/remove/${itemId}`, {
            method: 'DELETE'
        });
    }

    static async clearCart() {
        return await this.request('/cart/clear', {
            method: 'DELETE'
        });
    }
}

// Export for use in other files
window.API = API;

