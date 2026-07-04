import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "~/types";

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Took data from browser if user has login
const storedToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const storedUser =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

let initialUser: UserData | null = null;
if (storedUser) {
  try {
    initialUser = JSON.parse(storedUser);
  } catch (error) {
    console.error("failed to parse stored user", error);
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // To store endUser data and token while logged in
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>,
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      ((state.token = token), (state.isAuthenticated = true));

      // Save to browser memory while refresh
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    // remove when logout
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // remove from browser
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
