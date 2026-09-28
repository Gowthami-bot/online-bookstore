package com.bookstore.repository;

import com.bookstore.dto.OrderResponse;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryOrderRepository implements OrderRepository {
    private final Map<String, OrderResponse> orderStorage = new ConcurrentHashMap<>();

    @Override
    public OrderResponse save(OrderResponse order) {
        if (order != null && order.getOrderId() != null) {
            orderStorage.put(order.getOrderId(), order);
        }
        return order;
    }

    @Override
    public Optional<OrderResponse> findById(String orderId) {
        if (orderId == null) return Optional.empty();
        return Optional.ofNullable(orderStorage.get(orderId));
    }

    @Override
    public List<OrderResponse> findAll() {
        return new ArrayList<>(orderStorage.values());
    }
}
