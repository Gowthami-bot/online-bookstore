package com.bookstore.dto;

import com.bookstore.model.CartItem;

import java.util.ArrayList;
import java.util.List;

public class OrderResponse {
    private String orderId;
    private String fullName;
    private String email;
    private String address;
    private String city;
    private String zip;
    private double total;
    private int totalItems;
    private List<CartItem> items = new ArrayList<>();
    private String orderDate;
    private String status;

    public OrderResponse() {
    }

    public OrderResponse(String orderId, String fullName, String email, String address, String city, String zip,
                         double total, int totalItems, List<CartItem> items, String orderDate, String status) {
        this.orderId = orderId;
        this.fullName = fullName;
        this.email = email;
        this.address = address;
        this.city = city;
        this.zip = zip;
        this.total = total;
        this.totalItems = totalItems;
        this.items = items;
        this.orderDate = orderDate;
        this.status = status;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
