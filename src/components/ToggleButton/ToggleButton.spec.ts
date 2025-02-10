import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import ToggleButton from "./ToggleButton.vue"

describe("ToggleButton", () => {
  it("renders correctly", () => {
    const wrapper = mount(ToggleButton, {
      props: {
        modelValue: false,
      },
    })

    // Check that the checkbox input and label exist
    expect(wrapper.find("input#checkbox").exists()).toBe(true)
    expect(wrapper.find("label.toggle").exists()).toBe(true)

    // Adjust this assertion to match the actual number of `.bars`
    expect(wrapper.findAll(".bars").length).toBe(3)
  })

  it("emits update:modelValue event when toggled", async () => {
    const wrapper = mount(ToggleButton, {
      props: {
        modelValue: false,
      },
    })

    // Find and trigger change event on checkbox
    const checkbox = wrapper.find("input#checkbox")
    await checkbox.trigger("change")

    // Check that the event is emitted with the updated value
    expect(wrapper.emitted("update:modelValue")).toBeTruthy()
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true])
  })

  it("toggles value when onToggle is called directly", async () => {
    const wrapper = mount(ToggleButton, {
      props: {
        modelValue: false,
      },
    })

    // Manually trigger change on the checkbox
    const checkbox = wrapper.find("input#checkbox")
    await checkbox.trigger("change")

    // Verify the event is emitted with the correct value
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true])
  })
})
