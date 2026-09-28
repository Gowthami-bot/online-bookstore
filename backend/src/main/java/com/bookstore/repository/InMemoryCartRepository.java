package com.bookstore.repository;

import com.bookstore.model.Book;
import com.bookstore.model.CartItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Thread-safe in-memory cart storage preserving insertion order.
 */
@Repository
public class InMemoryCartRepository implements CartRepository {

    // LinkedHashMap synchronized to maintain insertion order
    private final Map<Long, CartItem> cartStorage = new LinkedHashMap<>();
    private final Object lock = new Object();

    @Override
    public List<CartItem> findAll() {
        synchronized (lock) {
            return new ArrayList<>(cartStorage.values());
        }
    }

    @Override
    public Optional<CartItem> findByBookId(Long bookId) {
        synchronized (lock) {
            if (bookId == null) return Optional.empty();
            return Optional.ofNullable(cartStorage.get(bookId));
        }
    }

    @Override
    public CartItem addOrUpdateItem(Book book, int quantityToAdd) {
        synchronized (lock) {
            if (book == null || book.getId() == null) {
                return null;
            }
            CartItem existing = cartStorage.get(book.getId());
            if (existing != null) {
                existing.setQuantity(existing.getQuantity() + quantityToAdd);
                return existing;
            } else {
                CartItem newItem = new CartItem(book, quantityToAdd);
                cartStorage.put(book.getId(), newItem);
                return newItem;
            }
        }
    }

    @Override
    public CartItem setItemQuantity(Book book, int exactQuantity) {
        synchronized (lock) {
            if (book == null || book.getId() == null) {
                return null;
            }
            if (exactQuantity <= 0) {
                cartStorage.remove(book.getId());
                return null;
            }
            CartItem item = cartStorage.get(book.getId());
            if (item != null) {
                item.setQuantity(exactQuantity);
                return item;
            } else {
                CartItem newItem = new CartItem(book, exactQuantity);
                cartStorage.put(book.getId(), newItem);
                return newItem;
            }
        }
    }

    @Override
    public void removeItem(Long bookId) {
        synchronized (lock) {
            if (bookId != null) {
                cartStorage.remove(bookId);
            }
        }
    }

    @Override
    public void clear() {
        synchronized (lock) {
            cartStorage.clear();
        }
    }
}
