import type { Author } from "./author"

export interface Book {
  id: number
  title: string
  description: string
  isbn: string
  publishedYear: number
  coverImage: string
  rating: number
  reviewCount: number
  totalCopies: number
  availableCopies: number
  borrowCount: number
  authorId: number
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
}

export interface BookResponse {
  success: boolean
  message: string
  data: {
    mode: string
    books: [Book]
    author: [Author]
    category: [Category]
  }
}

export interface BookRecommend {
  rating: string //-- | rating | popular
  categoryId: number
  page: number
  limit: number
}

export interface BookRecommendResponse {
  success: boolean
  message: string //success / invalid token
  data: {
    mode: string // rating
    bookes: [Book]
  }
}
