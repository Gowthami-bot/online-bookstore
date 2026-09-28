/**
 * Book Details Page Logic (book.html)
 * - Reads book ID from URL query (?id=...)
 * - Fetches book details via GET /books/{id}
 * - Renders cover, title, author, price, and description
 * - Handles quantity adjustment and Add to Cart action
 * - Displays success confirmation
 */

document.addEventListener('DOMContentLoaded', async () => {
  const loadingMessage = document.getElementById('loadingMessage');
  const errorMessage = document.getElementById('errorMessage');
  const bookDetail = document.getElementById('bookDetail');
  const bookDetailCover = document.getElementById('bookDetailCover');
  const bookDetailTitle = document.getElementById('bookDetailTitle');
  const bookDetailAuthor = document.getElementById('bookDetailAuthor');
  const bookDetailPrice = document.getElementById('bookDetailPrice');
  const bookDetailDescription = document.getElementById('bookDetailDescription');
  const quantityInput = document.getElementById('quantityInput');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const addConfirmation = document.getElementById('addConfirmation');
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

  // Parse ?id= from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookIdParam = urlParams.get('id');

  if (!bookIdParam) {
    showError('No book selected. Please return to the catalog.');
    return;
  }

  const bookId = Number(bookIdParam);
  if (isNaN(bookId) || bookId <= 0) {
    showError('Invalid book ID.');
    return;
  }

  function showError(msg) {
    if (loadingMessage) loadingMessage.hidden = true;
    if (bookDetail) bookDetail.hidden = true;
    if (errorMessage) {
      errorMessage.textContent = msg || 'Book not found.';
      errorMessage.hidden = false;
    }
  }

  // Fetch book details
  try {
    if (loadingMessage) loadingMessage.hidden = false;
    if (errorMessage) errorMessage.hidden = true;
    if (bookDetail) bookDetail.hidden = true;

    let book;
    try {
      book = await api.getBookById(bookId);
    } catch (apiErr) {
      console.warn('API call failed, falling back to local data:', apiErr.message);
      if (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) {
        book = BOOKS.find(b => b.id === bookId);
      }
      if (!book) throw apiErr;
    }

    if (!book) {
      showError('Book not found in our catalog.');
      return;
    }

    // Populate data
    document.title = `${book.title} — Online Bookstore`;
    if (bookDetailCover) bookDetailCover.textContent = book.cover || '📖';
    if (bookDetailTitle) bookDetailTitle.textContent = book.title;
    if (bookDetailAuthor) bookDetailAuthor.textContent = `by ${book.author}`;
    if (bookDetailPrice) bookDetailPrice.textContent = `$${Number(book.price).toFixed(2)}`;
    if (bookDetailDescription) bookDetailDescription.textContent = book.description;

    if (addToCartBtn) {
      addToCartBtn.dataset.id = book.id;
    }

    if (loadingMessage) loadingMessage.hidden = true;
    if (bookDetail) bookDetail.hidden = false;

  } catch (err) {
    showError(err.message || 'Failed to load book details.');
  }

  // Handle Add to Cart button
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async () => {
      const qty = quantityInput ? parseInt(quantityInput.value, 10) : 1;
      const validQty = isNaN(qty) || qty < 1 ? 1 : qty;

      const originalText = addToCartBtn.textContent;
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Adding...';

      try {
        await api.addToCart(bookId, validQty);
        await api.updateCartBadge();

        if (addConfirmation) {
          addConfirmation.textContent = `Added ${validQty} item${validQty > 1 ? 's' : ''} to cart!`;
          addConfirmation.hidden = false;
          setTimeout(() => {
            addConfirmation.hidden = true;
          }, 3000);
        }

        addToCartBtn.textContent = 'Added! ✓';
        addToCartBtn.style.backgroundColor = 'var(--color-forest)';
        addToCartBtn.style.borderColor = 'var(--color-forest)';

        setTimeout(() => {
          addToCartBtn.textContent = originalText;
          addToCartBtn.style.backgroundColor = '';
          addToCartBtn.style.borderColor = '';
          addToCartBtn.disabled = false;
        }, 1200);

      } catch (err) {
        alert('Could not add to cart: ' + err.message);
        addToCartBtn.textContent = originalText;
        addToCartBtn.disabled = false;
      }
    });
  }
});
