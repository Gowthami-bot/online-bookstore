/**
 * Home Page Logic (index.html)
 * - Fetches books from GET /books REST API
 * - Real-time and form search by title/author
 * - Renders dynamic book cards
 * - Handles adding books directly to cart with animated feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookGrid = document.getElementById('bookGrid');
  const loadingMessage = document.getElementById('loadingMessage');
  const emptyMessage = document.getElementById('emptyMessage');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  let currentBooks = [];

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderBooks(books) {
    if (!bookGrid) return;
    bookGrid.innerHTML = '';

    if (!books || books.length === 0) {
      if (emptyMessage) emptyMessage.hidden = false;
      return;
    }

    if (emptyMessage) emptyMessage.hidden = true;

    books.forEach((book, index) => {
      const card = document.createElement('article');
      card.className = 'book-card';
      card.dataset.id = book.id;

      card.innerHTML = `
        <a href="book.html?id=${book.id}" class="book-card-link">
          <div class="book-cover">${escapeHtml(book.cover || '📖')}</div>
          <h3 class="book-title">${escapeHtml(book.title)}</h3>
          <p class="book-author">${escapeHtml(book.author)}</p>
          <p class="book-price">$${Number(book.price).toFixed(2)}</p>
        </a>
        <button class="btn btn-add-cart" data-id="${book.id}" type="button">Add to Cart</button>
      `;

      bookGrid.appendChild(card);
    });
  }

  async function loadBooks(query = '') {
    if (loadingMessage) loadingMessage.hidden = false;
    if (emptyMessage) emptyMessage.hidden = true;

    try {
      const books = await api.getBooks(query);
      currentBooks = books;
      renderBooks(books);
    } catch (err) {
      console.warn('API fetch failed, checking fallback:', err.message);
      // Fallback to BOOKS array if available from books-data.js
      if (typeof BOOKS !== 'undefined' && Array.isArray(BOOKS)) {
        let filtered = BOOKS;
        if (query && query.trim()) {
          const q = query.trim().toLowerCase();
          filtered = BOOKS.filter(b =>
            b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
          );
        }
        currentBooks = filtered;
        renderBooks(filtered);
      } else {
        if (bookGrid) bookGrid.innerHTML = '';
        if (emptyMessage) {
          emptyMessage.textContent = 'Unable to load books. Please ensure the backend is running.';
          emptyMessage.hidden = false;
        }
      }
    } finally {
      if (loadingMessage) loadingMessage.hidden = true;
    }
  }

  // Handle Add to Cart button clicks on book cards
  if (bookGrid) {
    bookGrid.addEventListener('click', async (e) => {
      const btn = e.target.closest('.btn-add-cart');
      if (!btn) return;

      const bookId = btn.dataset.id;
      if (!bookId) return;

      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Adding...';

      try {
        await api.addToCart(bookId, 1);
        await api.updateCartBadge();

        btn.textContent = 'Added! ✓';
        btn.style.backgroundColor = 'var(--color-forest)';
        btn.style.borderColor = 'var(--color-forest)';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 1200);
      } catch (err) {
        alert('Failed to add book to cart: ' + err.message);
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle search submit
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loadBooks(searchInput ? searchInput.value : '');
    });
  }

  // Handle live search with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadBooks(searchInput.value);
      }, 300);
    });

    // Check query params if page loaded with ?query=...
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('query') || urlParams.get('search');
    if (searchParam) {
      searchInput.value = searchParam;
      loadBooks(searchParam);
      return;
    }
  }

  // Initial load
  loadBooks();
});
