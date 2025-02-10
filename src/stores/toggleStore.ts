import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useToggleStore = defineStore("toggle", () => {
  const isSidebarOpen = ref(localStorage.getItem("isSidebarOpen") === "true")

  watch(isSidebarOpen, (newValue) => {
    localStorage.setItem("isSidebarOpen", newValue.toString())
  })

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return { isSidebarOpen, toggleSidebar }
})
