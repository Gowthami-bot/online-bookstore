package com.bookstore.repository;

import com.bookstore.dto.OrderResponse;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    OrderResponse save(OrderResponse order);
    Optional<OrderResponse> findById(String orderId);
    List<OrderResponse> findAll();
}
