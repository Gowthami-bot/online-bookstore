package com.bookstore.controller;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.UpdateCartRequest;
import com.bookstore.model.Cart;
import com.bookstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * GET /cart
     * Returns current cart with items, total count, and total cost.
     */
    @GetMapping
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    /**
     * POST /cart
     * Adds an item to the cart or increments its quantity.
     */
    @PostMapping
    public ResponseEntity<Cart> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Cart updatedCart = cartService.addToCart(request.getBookId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedCart);
    }

    /**
     * PUT /cart/{id}
     * Updates the exact quantity of the specified book in the cart.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartRequest request) {
        Cart updatedCart = cartService.updateItemQuantity(id, request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * DELETE /cart/{id}
     * Removes the specified book from the cart.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long id) {
        Cart updatedCart = cartService.removeItem(id);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * DELETE /cart
     * Clears all items from the cart.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
