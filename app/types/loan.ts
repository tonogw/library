export interface Loan {
  itemIds: number[]
  days: number
  borrowDate: string
}

export interface LoanBook {
  status: string // all | available | borrowed | returned
  q: string // api
  categoryId: number
  authorId: number
  page: number
  limit: number
}

export interface LoanBookResponse {
  success: boolean
  message: string //success | invalid token
}
