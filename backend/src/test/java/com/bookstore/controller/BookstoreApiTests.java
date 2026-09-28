package com.bookstore.controller;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.CheckoutRequest;
import com.bookstore.dto.UpdateCartRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BookstoreApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void resetCart() throws Exception {
        // Clear cart before each test for isolated state
        mockMvc.perform(delete("/cart"));
    }

    @Test
    @DisplayName("GET /books returns list of 6 seeded books")
    void testGetAllBooks() throws Exception {
        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].title", notNullValue()))
                .andExpect(jsonPath("$[0].price", notNullValue()));
    }

    @Test
    @DisplayName("GET /books?query=Clean filters books by title")
    void testSearchBooksByTitle() throws Exception {
        mockMvc.perform(get("/books").param("query", "Clean"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", containsString("Clean Code")));
    }

    @Test
    @DisplayName("GET /books/{id} returns book details for valid ID")
    void testGetBookById() throws Exception {
        mockMvc.perform(get("/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("The Pragmatic Programmer")))
                .andExpect(jsonPath("$.price", is(32.99)));
    }

    @Test
    @DisplayName("GET /books/{id} returns 404 for invalid ID")
    void testGetBookByIdNotFound() throws Exception {
        mockMvc.perform(get("/books/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    @DisplayName("POST /cart adds an item to cart and returns updated cart")
    void testAddToCart() throws Exception {
        AddToCartRequest request = new AddToCartRequest(1L, 2);

        mockMvc.perform(post("/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.itemCount", is(2)))
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].book.id", is(1)))
                .andExpect(jsonPath("$.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.total", is(65.98)));
    }

    @Test
    @DisplayName("PUT /cart/{id} updates cart item quantity")
    void testUpdateCartItem() throws Exception {
        // Add item first
        mockMvc.perform(post("/cart")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddToCartRequest(2L, 1))));

        // Update quantity to 3
        mockMvc.perform(put("/cart/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateCartRequest(3))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount", is(3)))
                .andExpect(jsonPath("$.items[0].quantity", is(3)));
    }

    @Test
    @DisplayName("DELETE /cart/{id} removes item from cart")
    void testRemoveFromCart() throws Exception {
        // Add item
        mockMvc.perform(post("/cart")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddToCartRequest(3L, 1))));

        // Delete item
        mockMvc.perform(delete("/cart/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount", is(0)))
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    @DisplayName("POST /checkout with empty cart returns 400 Bad Request")
    void testCheckoutWithEmptyCart() throws Exception {
        CheckoutRequest request = new CheckoutRequest(
                "Ada Lovelace",
                "ada@example.com",
                "12 Analytical Engine Way",
                "London",
                "SW1A 1AA"
        );

        mockMvc.perform(post("/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("empty")));
    }

    @Test
    @DisplayName("POST /checkout with valid cart creates order and empties cart")
    void testCheckoutSuccess() throws Exception {
        // Add item to cart
        mockMvc.perform(post("/cart")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AddToCartRequest(1L, 1))));

        CheckoutRequest request = new CheckoutRequest(
                "Jane Doe",
                "jane.doe@example.com",
                "42 Bookworm Lane",
                "Oxford",
                "OX1 2JD"
        );

        mockMvc.perform(post("/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId", startsWith("ORD-")))
                .andExpect(jsonPath("$.fullName", is("Jane Doe")))
                .andExpect(jsonPath("$.status", is("CONFIRMED")))
                .andExpect(jsonPath("$.total", is(32.99)))
                .andExpect(jsonPath("$.items", hasSize(1)));

        // Cart should now be empty
        mockMvc.perform(get("/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itemCount", is(0)));
    }
}
