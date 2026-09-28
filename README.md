# Online Bookstore

A full-stack bookstore demo with a responsive storefront and a Spring Boot REST API. Browse and search a seeded catalog, manage a shopping cart, and complete checkout.

## Highlights

- Book catalog with title and author search and individual book details
- Shopping cart with quantity updates and item removal
- Validated checkout with order confirmation
- REST API error handling and CORS configuration
- API tests covering catalog, cart, and checkout flows

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Java 17, Spring Boot 3.3, Spring MVC, Bean Validation
- **Testing:** JUnit 5, Spring Boot Test, MockMvc

## Run Locally

Requires Java 17 or later. From the repository root, run:

```bat
run-backend.bat
```

Or, from `backend/`, run `mvnw.cmd spring-boot:run` on Windows or `./mvnw spring-boot:run` on macOS/Linux. Open [http://localhost:8085](http://localhost:8085).

## Run Tests

From `backend/`:

```bat
mvnw.cmd test
```

On macOS/Linux, use `./mvnw test`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/books` | List books; optionally filter with `?query=` |
| `GET` | `/books/{id}` | Get book details |
| `GET`, `POST`, `DELETE` | `/cart` | View, add to, or clear the cart |
| `PUT`, `DELETE` | `/cart/{id}` | Update quantity or remove a book |
| `POST` | `/checkout` | Create an order from the current cart |

Catalog, cart, and order data are stored in memory and reset when the backend restarts.