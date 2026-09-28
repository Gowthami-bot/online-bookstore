package com.bookstore.repository;

import com.bookstore.model.Book;
import com.bookstore.model.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartRepository {
    List<CartItem> findAll();
    Optional<CartItem> findByBookId(Long bookId);
    CartItem addOrUpdateItem(Book book, int quantityToAdd);
    CartItem setItemQuantity(Book book, int exactQuantity);
    void removeItem(Long bookId);
    void clear();
}
