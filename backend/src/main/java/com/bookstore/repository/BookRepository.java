package com.bookstore.repository;

import com.bookstore.model.Book;

import java.util.List;
import java.util.Optional;

public interface BookRepository {
    List<Book> findAll();
    List<Book> searchByTitle(String query);
    Optional<Book> findById(Long id);
    Book save(Book book);
    boolean existsById(Long id);
    long count();
}
