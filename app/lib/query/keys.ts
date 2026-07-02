export const queryKeys = {
  // Grup Buku
  books: (filters?: any) => ["books", filters] as const,
  bookDetail: (id: string) => ["books", "detail", id] as const,
  bookSearch: (q: string) => ["books", "search", q] as const,
  bookRecommend: () => ["books", "recommend"] as const,

  // Grup Cart
  cart: () => ["cart"] as const,

  // Grup Admin (Ini yang dipanggil di admin/users.tsx)
  adminUsers: (search?: string, page?: number) =>
    ["admin", "users", { search, page }] as const,
  adminBooks: (filters?: any) => ["admin", "books", filters] as const,
  // adminBooks: (delete?: any)=> ["admin", "books", delete] as const,
  adminLoans: (filters?: any) => ["admin", "loans", filters] as const,
};
