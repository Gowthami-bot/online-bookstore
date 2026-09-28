/**
 * Cart Page Logic (cart.html)
 * - Fetches cart items via GET /cart
 * - Renders item cards, quantities, prices, and totals
 * - Handles quantity updates with PUT /cart/{id}
 * - Handles item removal with DELETE /cart/{id}
 * - Dynamically toggles between cart list and empty-cart state
 */

document.addEventListener('DOMContentLoaded', () => {
  const emptyCartState = document.getElementById('emptyCartState');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  // Search redirection to home page
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput ? searchInput.value.trim() : '';
      if (q) {
        window.location.href = `index.html?query=${encodeURIComponent(q)}`;
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderCart(cart) {
    const items = cart && cart.items ? cart.items : [];

    if (items.length === 0) {
      if (emptyCartState) emptyCartState.hidden = false;
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.hidden = true;
      }
      if (cartSummary) cartSummary.hidden = true;
      return;
    }

    if (emptyCartState) emptyCartState.hidden = true;
    if (cartItemsContainer) {
      cartItemsContainer.hidden = false;
      cartItemsContainer.innerHTML = '';

      items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.dataset.id = item.book.id;

        const subtotal = Number(item.subtotal || (item.book.price * item.quantity)).toFixed(2);

        itemEl.innerHTML = `
          <div class="cart-item-cover">${escapeHtml(item.book.cover || '📖')}</div>
          <div class="cart-item-info">
            <h3 class="cart-item-title">
              <a href="book.html?id=${item.book.id}">${escapeHtml(item.book.title)}</a>
            </h3>
            <p class="cart-item-author">${escapeHtml(item.book.author)}</p>
          </div>
          <div class="cart-item-qty">
            <label for="qty-${item.book.id}">Qty</label>
            <input
              type="number"
              id="qty-${item.book.id}"
              value="${item.quantity}"
              min="1"
              max="99"
              class="quantity-input cart-qty-input"
              data-id="${item.book.id}"
            >
          </div>
          <p class="cart-item-price" id="subtotal-${item.book.id}">$${subtotal}</p>
          <button class="btn btn-remove" data-id="${item.book.id}" type="button">Remove</button>
        `;

        cartItemsContainer.appendChild(itemEl);
      });
    }

    if (cartSummary) {
      cartSummary.hidden = false;
      const formattedTotal = `$${Number(cart.total || 0).toFixed(2)}`;
      if (cartSubtotal) cartSubtotal.textContent = formattedTotal;
      if (cartTotal) cartTotal.textContent = formattedTotal;
    }
  }

  async function loadCart() {
    try {
      const cart = await api.getCart();
      renderCart(cart);
      await api.updateCartBadge();
    } catch (err) {
      console.warn('Could not load cart from backend:', err.message);
      // If error, show empty state or helpful message
      renderCart({ items: [], total: 0 });
    }
  }

  // Handle Remove and Quantity changes
  if (cartItemsContainer) {
    // Click on Remove button
    cartItemsContainer.addEventListener('click', async (e) => {
      const removeBtn = e.target.closest('.btn-remove');
      if (!removeBtn) return;

      const bookId = Number(removeBtn.dataset.id);
      if (!bookId) return;

      removeBtn.disabled = true;
      removeBtn.textContent = 'Removing...';

      try {
        const updatedCart = await api.removeFromCart(bookId);
        renderCart(updatedCart);
        await api.updateCartBadge();
      } catch (err) {
        alert('Could not remove item: ' + err.message);
        removeBtn.disabled = false;
        removeBtn.textContent = 'Remove';
      }
    });

    // Quantity change
    let qtyDebounce;
    cartItemsContainer.addEventListener('change', async (e) => {
      const qtyInput = e.target.closest('.cart-qty-input');
      if (!qtyInput) return;

      const bookId = Number(qtyInput.dataset.id);
      const newQty = parseInt(qtyInput.value, 10);

      if (isNaN(newQty) || newQty < 1) {
        qtyInput.value = 1;
        return;
      }

      clearTimeout(qtyDebounce);
      qtyDebounce = setTimeout(async () => {
        try {
          const updatedCart = await api.updateCartItem(bookId, newQty);
          renderCart(updatedCart);
          await api.updateCartBadge();
        } catch (err) {
          alert('Could not update quantity: ' + err.message);
          loadCart();
        }
      }, 250);
    });
  }

  // Initial load
  loadCart();
});
