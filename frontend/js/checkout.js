/**
 * Checkout Page Logic (checkout.html)
 * - Fetches cart to populate Order Summary
 * - Validates shipping details (full name, email, address, city, zip)
 * - Submits order via POST /checkout
 * - Displays Order Confirmation with unique Order ID
 * - Clears cart state
 */

document.addEventListener('DOMContentLoaded', async () => {
  const checkoutForm = document.getElementById('checkoutForm');
  const orderSummary = document.getElementById('orderSummary');
  const orderTotal = document.getElementById('orderTotal');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const orderIdValue = document.getElementById('orderIdValue');
  const checkoutLayout = document.querySelector('.checkout-layout');

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (val) => val.trim().length >= 2,
      errorMsg: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorMsg: 'Please enter a valid email address.'
    },
    address: {
      input: document.getElementById('address'),
      error: document.getElementById('addressError'),
      validate: (val) => val.trim().length >= 5,
      errorMsg: 'Please enter a complete shipping address (at least 5 characters).'
    },
    city: {
      input: document.getElementById('city'),
      error: document.getElementById('cityError'),
      validate: (val) => val.trim().length >= 2,
      errorMsg: 'Please enter your city.'
    },
    zip: {
      input: document.getElementById('zip'),
      error: document.getElementById('zipError'),
      validate: (val) => val.trim().length >= 3,
      errorMsg: 'Please enter a valid ZIP / postal code.'
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  let currentCart = null;

  async function loadOrderSummary() {
    try {
      currentCart = await api.getCart();
      const items = currentCart && currentCart.items ? currentCart.items : [];

      if (items.length === 0) {
        if (orderSummary) {
          orderSummary.innerHTML = `
            <h2>Order Summary</h2>
            <p style="color: var(--color-ink-soft); font-style: italic; margin-bottom: 1rem;">
              Your cart is currently empty.
            </p>
            <a href="index.html" class="btn">Browse Books</a>
          `;
        }
        const submitBtn = checkoutForm ? checkoutForm.querySelector('button[type="submit"]') : null;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.title = 'Add books to cart before checking out';
        }
        return;
      }

      if (orderSummary) {
        const itemsHtml = items.map(item => `
          <div class="order-summary-item">
            <span>${escapeHtml(item.book.title)} &times; ${item.quantity}</span>
            <span>$${Number(item.subtotal || (item.book.price * item.quantity)).toFixed(2)}</span>
          </div>
        `).join('');

        const totalFormatted = `$${Number(currentCart.total || 0).toFixed(2)}`;

        orderSummary.innerHTML = `
          <h2>Order Summary</h2>
          ${itemsHtml}
          <div class="order-summary-row cart-total-row">
            <span>Total</span>
            <span id="orderTotal">${totalFormatted}</span>
          </div>
        `;
      }
    } catch (err) {
      console.warn('Could not load cart for checkout:', err.message);
    }
  }

  // Clear validation error on user input
  Object.values(fields).forEach(({ input, error }) => {
    if (input) {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
        if (error) error.hidden = true;
      });
    }
  });

  // Handle form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check cart has items
      if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
        alert('Your cart is empty. Please add books to cart first.');
        return;
      }

      // Validate all fields
      let hasError = false;
      const orderData = {};

      Object.entries(fields).forEach(([key, { input, error, validate, errorMsg }]) => {
        if (!input) return;
        const value = input.value;
        const group = input.closest('.form-group');

        if (!validate(value)) {
          hasError = true;
          if (group) group.classList.add('has-error');
          if (error) {
            error.textContent = errorMsg;
            error.hidden = false;
          }
        } else {
          if (group) group.classList.remove('has-error');
          if (error) error.hidden = true;
          orderData[key] = value.trim();
        }
      });

      if (hasError) {
        return;
      }

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Order...';
      }

      try {
        const orderResponse = await api.checkout(orderData);

        // Hide checkout layout
        if (checkoutLayout) {
          checkoutLayout.style.display = 'none';
        }

        // Show confirmation section
        if (orderConfirmation) {
          orderConfirmation.hidden = false;
          if (orderIdValue) {
            orderIdValue.textContent = orderResponse.orderId || 'ORD-SUCCESS';
          }
        }

        // Update badge count to 0
        await api.updateCartBadge();

        // Scroll to confirmation view
        if (orderConfirmation) {
          orderConfirmation.scrollIntoView({ behavior: 'smooth' });
        }

      } catch (err) {
        alert('Order submission failed: ' + err.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Place Order';
        }
      }
    });
  }

  // Load summary on init
  await loadOrderSummary();
});
