import type { Author } from "./author";
import type { ReviewItem } from "./reviews";

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface BookResponse {
  success: boolean;
  message: string;
  data: {
    mode: string;
    books: [Book];
    author: [Author];
    category: [Category];
  };
}

export interface BookRecommend {
  rating: string; //-- | rating | popular
  categoryId: number;
  page: number;
  limit: number;
}

export interface RecommendBook {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  author: {
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface BookRecommendResponse {
  success: boolean;
  message: string; //success / invalid token
  data: {
    mode: string; // rating
    bookes: [Book];
  };
}

export interface BookDetailData {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
    bio: string;
  };
  category?: {
    id: number;
    name: string;
  };
  reviews?: ReviewItem[];
}
