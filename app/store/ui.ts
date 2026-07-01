import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  searchQuery: string
  selectedCategory: string | null
}

const initialState: UIState = {
  isCartOpen: false,
  isMobileMenuOpen: false,
  searchQuery: "",
  selectedCategory: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
  },
})

export const {
  setCartOpen,
  setMobileMenuOpen,
  setSearchQuery,
  setSelectedCategory,
} = uiSlice.actions
export default uiSlice.reducer
