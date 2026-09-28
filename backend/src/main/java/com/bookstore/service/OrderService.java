package com.bookstore.service;

import com.bookstore.dto.CheckoutRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.exception.BadRequestException;
import com.bookstore.model.Cart;
import com.bookstore.model.CartItem;
import com.bookstore.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final CartService cartService;
    private final OrderRepository orderRepository;

    public OrderService(CartService cartService, OrderRepository orderRepository) {
        this.cartService = cartService;
        this.orderRepository = orderRepository;
    }

    public OrderResponse checkout(CheckoutRequest request) {
        Cart cart = cartService.getCart();
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add books before checking out.");
        }

        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Copy cart items snapshot
        List<CartItem> orderedItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            orderedItems.add(new CartItem(item.getBook(), item.getQuantity()));
        }

        OrderResponse orderResponse = new OrderResponse(
                orderId,
                request.getFullName().trim(),
                request.getEmail().trim(),
                request.getAddress().trim(),
                request.getCity().trim(),
                request.getZip().trim(),
                cart.getTotal(),
                cart.getItemCount(),
                orderedItems,
                orderDate,
                "CONFIRMED"
        );

        // Save order and clear cart
        orderRepository.save(orderResponse);
        cartService.clearCart();

        return orderResponse;
    }
}
