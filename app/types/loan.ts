export interface Loan {
  itemIds: number[];
  days: number;
  borrowDate: string;
}

export interface LoanBook {
  status: string; // all | available | borrowed | returned
  q: string; // api
  categoryId: number;
  authorId: number;
  page: number;
  limit: number;
}

export interface LoanBookResponse {
  success: boolean;
  message: string; //success | invalid token
}

export interface BorrowedItem {
  id: number;
  status: string;
  displayStatus: "Active" | "Returned" | "Overdue" | string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays: number;
  book: {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    author: {
      name: string;
    };
    category: {
      name: string;
    };
  };
}
