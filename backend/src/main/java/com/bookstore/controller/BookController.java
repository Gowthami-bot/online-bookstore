package com.bookstore.controller;

import com.bookstore.model.Book;
import com.bookstore.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * GET /books
     * Supports optional search query param (?query=... or ?title=...)
     */
    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String title) {
        String searchTerm = query != null ? query : title;
        List<Book> books = bookService.getAllBooks(searchTerm);
        return ResponseEntity.ok(books);
    }

    /**
     * GET /books/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }
}
