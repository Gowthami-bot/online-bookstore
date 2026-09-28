/**
 * Phase 1: static in-memory book data.
 *
 * This stands in for the GET /books and GET /books/{id} API responses
 * until Phase 5, when we swap these hardcoded values for real fetch()
 * calls to the Spring Boot backend. Keeping the shape (id, title,
 * author, price, description, cover) identical to what the backend
 * will return means the swap in Phase 5 is a small, mechanical change.
 */

const BOOKS = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    price: 32.99,
    cover: "📗",
    description: "A classic guide for software developers that covers pragmatic approaches to programming, from personal responsibility and career development to architectural techniques for keeping code flexible and easy to adapt and reuse."
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 29.50,
    cover: "📘",
    description: "A handbook of agile software craftsmanship that teaches the principles, patterns, and practices of writing clean, readable, and maintainable code."
  },
  {
    id: 3,
    title: "Effective Java",
    author: "Joshua Bloch",
    price: 41.25,
    cover: "📙",
    description: "Best practices for the Java platform, covering everything from object creation to generics, enums, lambdas, and streams."
  },
  {
    id: 4,
    title: "Spring in Action",
    author: "Craig Walls",
    price: 38.00,
    cover: "📕",
    description: "A hands-on guide to the Spring Framework, covering Spring Boot, Spring MVC, REST APIs, and data access with Spring Data."
  },
  {
    id: 5,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    price: 45.99,
    cover: "📓",
    description: "An in-depth look at the ideas behind reliable, scalable, and maintainable systems, covering databases, distributed systems, and stream processing."
  },
  {
    id: 6,
    title: "Head First Design Patterns",
    author: "Eric Freeman & Elisabeth Robson",
    price: 36.75,
    cover: "📔",
    description: "A visually rich, example-driven introduction to classic object-oriented design patterns."
  }
];
