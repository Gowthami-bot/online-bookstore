package com.bookstore.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents the customer's shopping cart holding items, total count, and total amount.
 */
public class Cart {
    private List<CartItem> items = new ArrayList<>();

    public Cart() {
    }

    public Cart(List<CartItem> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public int getItemCount() {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }

    public double getTotal() {
        BigDecimal total = items.stream()
                .map(item -> BigDecimal.valueOf(item.getSubtotal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
