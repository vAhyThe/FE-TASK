import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import ChatSideBar from "./ChatSideBar.vue"
import { useAuthStore } from "@/stores/authStore"
import { createRouter, createMemoryHistory } from "vue-router"

vi.mock("vue-router", async () => {
  const actual = await vi.importActual<any>("vue-router")
  return { ...actual }
})

const routes = [
  {
    path: "/chat/:chatName",
    name: "ChatView",
    component: { template: "<div>Chat View</div>" },
  },
]
const router = createRouter({ history: createMemoryHistory(), routes })

describe("ChatSideBar Component", () => {
  beforeEach(async () => {
    await router.push("/home")
    await router.isReady()
  })

  it("renders correctly with chats", () => {
    const wrapper = mount(ChatSideBar, {
      global: { plugins: [createTestingPinia({ createSpy: vi.fn }), router] },
      props: {
        chats: [
          { id: "1", name: "Chat 1" },
          { id: "2", name: "Name 2" },
        ],
        isNewChat: false,
      },
      data() {
        return { toggleVisibility: true }
      },
    })

    const chatItems = wrapper.findAll(".chat-sidebar__item")
    expect(chatItems.length).toBe(2)
    expect(chatItems[0].text()).toContain("Chat 1")
    expect(chatItems[1].text()).toContain("Name 2")
  })

  it("logs out when the logout button is clicked", async () => {
    const wrapper = mount(ChatSideBar, {
      global: { plugins: [createTestingPinia({ createSpy: vi.fn }), router] },
      props: { chats: [], isNewChat: false },
      data() {
        return { toggleVisibility: true }
      },
    })

    const authStore = useAuthStore()
    authStore.isAuthenticated = true

    await nextTick()

    const logoutButton = wrapper.find(".chat-sidebar__logout")
    expect(logoutButton.exists()).toBe(true)

    await logoutButton.trigger("click")
    expect(router.currentRoute.value.path).toBe("/home")
  })
})
