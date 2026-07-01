// import type { UserData } from "~/types"

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       token: null,
//       user: null,
//       isAuthenticated: false,

//       setAuth: (token: string, user: UserData) => {
//         if (typeof window !== "undefined") {
//           localStorage.setItem("auth_token", token)
//           const expires = new Date(Date.now() + 7 * 864e5).toUTCString()
//           document.cookie = `auth_token=${token};expires=${expires}; path=/; SameSite=Lax`
//         }

//         set({ token, user, isAuthenticated: true })
//       },

//       setUser: (user: UserData) => set({ user }),
//       logout: () => {
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("auth_token")

//           document.cookie =
//             "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
//           window.location.href = "/login"
//         }
//         set({ token: null, user: null, isAuthenticated: false })
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         token: state.token,
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// )
