import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import { useThemeStore } from "@/stores/themeStore" // Use the actual theme store definition
import ThemeSwitch from "./ThemeSwitcher.vue"

describe("ThemeSwitch Component", () => {
  it("renders correctly", () => {
    const wrapper = mount(ThemeSwitch, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true)
    expect(wrapper.find(".theme-switch__container").exists()).toBe(true)
    expect(wrapper.findAll(".theme-switch__spot").length).toBe(3)
  })
  it("toggles theme when checkbox is clicked", async () => {
    // Mount component with testing Pinia
    const wrapper = mount(ThemeSwitch, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })

    // Access the store instance created by Pinia
    const themeStore = useThemeStore()

    // Initially, isDarkTheme should be false
    expect(themeStore.isDarkTheme).toBe(false)

    // Trigger the checkbox change event
    const checkbox = wrapper.find("input[type='checkbox']")
    await checkbox.trigger("change")

    // Verify that toggleTheme was called and the state was updated
    expect(themeStore.isDarkTheme).toBe(true)
  })
})
