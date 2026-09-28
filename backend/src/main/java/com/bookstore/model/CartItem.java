package com.bookstore.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Represents a single item entry in the shopping cart.
 */
public class CartItem {
    private Book book;
    private int quantity;

    public CartItem() {
    }

    public CartItem(Book book, int quantity) {
        this.book = book;
        this.quantity = quantity;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getSubtotal() {
        if (book == null || book.getPrice() == null) {
            return 0.0;
        }
        BigDecimal price = BigDecimal.valueOf(book.getPrice());
        BigDecimal qty = BigDecimal.valueOf(quantity);
        return price.multiply(qty).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
