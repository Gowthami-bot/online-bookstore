package com.bookstore.service;

import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.model.Cart;
import com.bookstore.model.CartItem;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    public CartService(CartRepository cartRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    public Cart getCart() {
        List<CartItem> items = cartRepository.findAll();
        return new Cart(items);
    }

    public Cart addToCart(Long bookId, int quantity) {
        if (bookId == null) {
            throw new BadRequestException("Book ID must be provided");
        }
        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot add to cart: Book not found with ID " + bookId));

        cartRepository.addOrUpdateItem(book, quantity);
        return getCart();
    }

    public Cart updateItemQuantity(Long bookId, int quantity) {
        if (bookId == null) {
            throw new BadRequestException("Book ID must be provided");
        }
        if (quantity < 0) {
            throw new BadRequestException("Quantity cannot be negative");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot update cart: Book not found with ID " + bookId));

        cartRepository.setItemQuantity(book, quantity);
        return getCart();
    }

    public Cart removeItem(Long bookId) {
        if (bookId == null) {
            throw new BadRequestException("Book ID must be provided");
        }
        cartRepository.removeItem(bookId);
        return getCart();
    }

    public void clearCart() {
        cartRepository.clear();
    }
}
