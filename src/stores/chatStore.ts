import { defineStore } from "pinia"

interface Message {
  id: number
  question: string
  answer: string
}

interface Chat {
  id: string
  name: string
  messages: Message[]
}

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    chats: JSON.parse(localStorage.getItem("chatChats") || "[]"),
    activeChatId: null,
  }),

  getters: {
    activeChat(state): Chat | null {
      return state.chats.find((chat) => chat.id === state.activeChatId) || null
    },
    messages(): Message[] {
      return this.activeChat?.messages || []
    },
  },

  actions: {
    createNewChat(name: string): string {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name,
        messages: [],
      }
      this.chats.push(newChat)
      this.saveChatsToStorage()
      return newChat.id
    },

    renameActiveChat(name: string) {
      if (this.activeChat) {
        this.activeChat.name = name
        this.saveChatsToStorage()
      }
    },

    addMessage(message: Message) {
      const chat = this.activeChat
      if (chat) {
        chat.messages.push(message)
        this.saveChatsToStorage()
      }
    },

    switchChat(chatId: string | null) {
      this.activeChatId = chatId
    },

    deleteChat(chatId: string) {
      this.chats = this.chats.filter((chat) => chat.id !== chatId)
      this.saveChatsToStorage()
    },

    saveChatsToStorage() {
      localStorage.setItem("chatChats", JSON.stringify(this.chats))
    },
  },
})
