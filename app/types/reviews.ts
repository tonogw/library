export interface Review {
  bookId: number;
  star: number;
  comment: string;
}

export interface ReviewItem {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}
