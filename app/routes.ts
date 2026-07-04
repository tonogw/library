import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),

  // Buku & Kategori (Bisa diakses Publik/User)
  route("search-book", "routes/user/books.tsx"),
  route("books", "routes/books/index.tsx"),
  route("books/:id", "routes/books/$id.tsx"),
  route("categories", "routes/categories/index.tsx"),
  route("categories/:id", "routes/categories/$id.tsx"),

  // Fitur User (Profile, Cart, Loans)
  route("profile", "routes/user/profile.tsx"),
  route("cart", "routes/user/cart.tsx"),
  route("checkout", "routes/user/checkout.tsx"),
  route("loans", "routes/borrow/index.tsx"),
  route("loans/history", "routes/borrow/history.tsx"),

  // Admin Dashboard
  route("admin/search-book", "routes/admin/books.tsx"),
  route("admin", "routes/admin/dashboard.tsx"),
  route("admin/books", "routes/admin/books.tsx"),
  route("admin/users", "routes/admin/users.tsx"),
  route("admin/categories", "routes/admin/categories.tsx"),

  // Admin Book Maintenance
  route("admin/books/:id/preview", "routes/admin/book-preview.tsx"),
  route("admin/books/new", "routes/admin/book-add.tsx"),
  route("admin/books/:id/edit", "routes/admin/book-edit.tsx"),
] as RouteConfig;
