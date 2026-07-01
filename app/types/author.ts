export interface Author {
  name: string
  bio: string
}

export interface AuthorResponse {
  success: boolean
  message: string
  data: {
    authors: []
  }
}
