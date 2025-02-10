import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useThemeStore = defineStore("theme", () => {
  // Načti téma z localStorage (výchozí je světlé téma)
  const isDarkTheme = ref(localStorage.getItem("theme") === "dark")

  // Synchronizace se stránkou – hned na začátku nastavíme téma
  const updateTheme = () => {
    const root = document.documentElement
    if (isDarkTheme.value) {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }
  }

  // Funkce pro přepnutí tématu
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    updateTheme()
    localStorage.setItem("theme", isDarkTheme.value ? "dark" : "light")
  }

  // Při vytvoření store rovnou nastavíme aktuální téma
  updateTheme()

  // Sledujeme změny a vždy aktualizujeme stránku
  watch(isDarkTheme, (newValue) => {
    localStorage.setItem("theme", newValue ? "dark" : "light")
    updateTheme()
  })

  return { isDarkTheme, toggleTheme }
})
