export const queryKeys = {
  // Public / User Endpoints
  book: (filters?: any) => ["books", filters] as const,
  bookDetail: (id: string) => ["books", "detail", id] as const,
  bookRecommend: () => ["books", "recommend"] as const,

  books: {
    all: ["books"] as const,
    list: (filters: string) => ["books", "list", filters] as const,
    detail: (id: string) => ["books", "detail", id] as const,
    locate: (search?: string, page?: number) =>
      ["books", "locate", { search, page }] as const,
  },

  // Cart & Review Endpoints
  cart: () => ["cart"] as const,
  myReview: () => ["reviews", "mine"] as const,

  // Admin Specific Endpoints (Sesuai grup Admin di gambar Swagger)
  adminOverview: () => ["admin", "overview"] as const,
  adminBooks: (filters?: any) => ["admin", "books", filters] as const,
  adminUsers: (search?: string, page?: number) =>
    ["admin", "users", { search, page }] as const,
  adminLoans: (filters?: any) => ["admin", "loans", filters] as const,
  adminLoansOverdue: () => ["admin", "loans", "overdue"] as const,

  // Categories & Authors
  categories: () => ["categories"] as const,
  authors: () => ["authors"] as const,
}
