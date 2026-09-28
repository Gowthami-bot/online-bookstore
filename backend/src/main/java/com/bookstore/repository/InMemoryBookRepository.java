package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Thread-safe in-memory implementation of BookRepository.
 * Pre-seeded with sample books to provide an instant zero-config experience.
 */
@Repository
public class InMemoryBookRepository implements BookRepository {

    private final Map<Long, Book> bookStorage = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(0);

    public InMemoryBookRepository() {
        seedInitialBooks();
    }

    private void seedInitialBooks() {
        save(new Book(
                1L,
                "The Pragmatic Programmer",
                "David Thomas & Andrew Hunt",
                32.99,
                "📗",
                "A classic guide for software developers that covers pragmatic approaches to programming, from personal responsibility and career development to architectural techniques for keeping code flexible and easy to adapt and reuse."
        ));
        save(new Book(
                2L,
                "Clean Code",
                "Robert C. Martin",
                29.50,
                "📘",
                "A handbook of agile software craftsmanship that teaches the principles, patterns, and practices of writing clean, readable, and maintainable code."
        ));
        save(new Book(
                3L,
                "Effective Java",
                "Joshua Bloch",
                41.25,
                "📙",
                "Best practices for the Java platform, covering everything from object creation to generics, enums, lambdas, and streams."
        ));
        save(new Book(
                4L,
                "Spring in Action",
                "Craig Walls",
                38.00,
                "📕",
                "A hands-on guide to the Spring Framework, covering Spring Boot, Spring MVC, REST APIs, and data access with Spring Data."
        ));
        save(new Book(
                5L,
                "Designing Data-Intensive Applications",
                "Martin Kleppmann",
                45.99,
                "📓",
                "An in-depth look at the ideas behind reliable, scalable, and maintainable systems, covering databases, distributed systems, and stream processing."
        ));
        save(new Book(
                6L,
                "Head First Design Patterns",
                "Eric Freeman & Elisabeth Robson",
                36.75,
                "📔",
                "A visually rich, example-driven introduction to classic object-oriented design patterns."
        ));
    }

    @Override
    public List<Book> findAll() {
        return new ArrayList<>(bookStorage.values());
    }

    @Override
    public List<Book> searchByTitle(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        String normalized = query.trim().toLowerCase();
        return bookStorage.values().stream()
                .filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(normalized)) ||
                             (b.getAuthor() != null && b.getAuthor().toLowerCase().contains(normalized)))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Book> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(bookStorage.get(id));
    }

    @Override
    public Book save(Book book) {
        if (book.getId() == null) {
            book.setId(idSequence.incrementAndGet());
        } else {
            idSequence.accumulateAndGet(book.getId(), Math::max);
        }
        bookStorage.put(book.getId(), book);
        return book;
    }

    @Override
    public boolean existsById(Long id) {
        return id != null && bookStorage.containsKey(id);
    }

    @Override
    public long count() {
        return bookStorage.size();
    }
}
