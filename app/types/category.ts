export interface CategoryResponse {
  success: boolean
  message: string
  data: {
    categories: [
      {
        id: number
        name: string
        createdAt: string
        updatedAt: string
      },
    ]
  }
}

export interface CategoryMaint {
  name: string
}
