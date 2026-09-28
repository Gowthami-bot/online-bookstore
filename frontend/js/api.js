/**
 * API Service for communicating with the Spring Boot Online Bookstore REST Backend.
 * Handles HTTP requests, JSON serialization, and error management.
 */

const API_CONFIG = {
  // Use relative path if already served by Spring Boot on port 8085; otherwise point to localhost:8085
  BASE_URL: (window.location.port === '8085' || (window.location.origin && window.location.origin.includes(':8085')))
    ? ''
    : 'http://localhost:8085'
};

const api = {
  /**
   * Helper for fetch with JSON error handling
   */
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += ': ' + errorData.details.join(', ');
          }
        } catch {
          // Response body was not JSON
        }
        throw new Error(errorMessage);
      }

      // 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn(`[API Error] ${config.method || 'GET'} ${url}:`, error.message);
      throw error;
    }
  },

  /**
   * GET /books?query=...
   */
  async getBooks(query = '') {
    const param = query ? `?query=${encodeURIComponent(query.trim())}` : '';
    return await this.request(`/books${param}`);
  },

  /**
   * GET /books/{id}
   */
  async getBookById(id) {
    return await this.request(`/books/${id}`);
  },

  /**
   * GET /cart
   */
  async getCart() {
    return await this.request('/cart');
  },

  /**
   * POST /cart
   */
  async addToCart(bookId, quantity = 1) {
    return await this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({
        bookId: Number(bookId),
        quantity: Number(quantity)
      })
    });
  },

  /**
   * PUT /cart/{id}
   */
  async updateCartItem(bookId, quantity) {
    return await this.request(`/cart/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity: Number(quantity)
      })
    });
  },

  /**
   * DELETE /cart/{id}
   */
  async removeFromCart(bookId) {
    return await this.request(`/cart/${bookId}`, {
      method: 'DELETE'
    });
  },

  /**
   * DELETE /cart
   */
  async clearCart() {
    return await this.request('/cart', {
      method: 'DELETE'
    });
  },

  /**
   * POST /checkout
   */
  async checkout(orderData) {
    return await this.request('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Helper to refresh the cart badge count displayed in the navigation
   */
  async updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;

    try {
      const cart = await this.getCart();
      const count = cart && cart.itemCount !== undefined ? cart.itemCount : 0;
      badge.textContent = count;
      badge.setAttribute('aria-label', `${count} items in cart`);
    } catch (e) {
      // In case backend is not yet started or during initial dev, fall back gracefully
      console.warn('Could not update cart count from backend:', e.message);
    }
  }
};

// Update cart badge automatically on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  api.updateCartBadge();
});
