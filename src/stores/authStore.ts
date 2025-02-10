import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
  }),

  actions: {
    initializeAuth() {
      const savedAuth = sessionStorage.getItem("isAuthenticated")
      this.isAuthenticated = savedAuth === "true"
    },

    login(username: string, password: string): boolean {
      if (username === "username" && password === "password") {
        this.isAuthenticated = true
        sessionStorage.setItem("isAuthenticated", "true")
        return true
      } else {
        return false
      }
    },

    logout() {
      this.isAuthenticated = false
      sessionStorage.removeItem("isAuthenticated")
    },
  },
})
