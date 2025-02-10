<template>
  <div class="chat-sidebar" :class="{ 'chat-sidebar--open': toggleVisibility }">
    <ToggleButton v-model="toggleVisibility" />
    <h3 class="chat-sidebar__title">Chats</h3>
    <div 
      v-for="chat in chats" 
      :key="chat.id" 
      class="chat-item"
      :class="{ 'chat-item--active': activeChat && activeChat.id === chat.id }"
    >
      <a @click="switchChatByName(chat.name)">
        {{ !toggleVisibility ? chat.name.slice(0, 3) + '...' : chat.name }}
      </a>
      <button v-if="toggleVisibility" class="delete-button" @click="deleteChat(chat.id)">
        🗑️
      </button>
    </div>
    <button @click="prepareNewChat" class="new-chat">
      ✚ {{ toggleVisibility ? 'New Chat' : '' }}
    </button>
  </div>
  <div class="chat-overlay" :class="{ 'chat-overlay--active': toggleVisibility }" @click="toggleVisibility = false">
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { createSlug } from '@/utils/utils';
import { useRoute, useRouter } from 'vue-router';

import ToggleButton from '@/components/ToggleButton/ToggleButton.vue';

// Define the Chat type
interface Chat {
  id: string;
  name: string;
}

// Define props with the correct type
const props = defineProps<{ chats: Chat[]; isNewChat: boolean }>();

const chatStore = useChatStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toggleVisibility = ref<boolean>(true);
const activeChat = computed(() => chatStore.activeChat);
const lastAnimatedMessageId = ref<number | null>(null);
const emit = defineEmits(['update:isNewChat']);

authStore.initializeAuth();

function switchChatByName(chatName: string) {
  const slug = createSlug(chatName);
  const chat = props.chats.find(chat => createSlug(chat.name) === slug);
  if (chat) {
    chatStore.switchChat(chat.id);
    updateChatUrl(chat.name);
  }
}

function updateChatUrl(chatName: string) {
  const slug = createSlug(chatName);
  router.push({ name: 'ChatView', params: { chatName: slug } });
}

function deleteChat(chatId: string) {
  const confirmed = confirm('Are you sure you want to delete this chat?');
  if (confirmed) {
    chatStore.deleteChat(chatId);

    if (chatStore.activeChat?.id === chatId) {
      if (props.chats.length > 0) {
        switchChatByName(props.chats[props.chats.length - 1].name);
      } else {
        router.push({ name: 'ChatView' });
      }
    }
  }
}

function prepareNewChat() {
  emit('update:isNewChat', true);
  chatStore.switchChat(null);
  router.push({ name: 'ChatView', params: { chatName: 'new-chat' } });
}
</script>

<style scoped lang="scss">
.chat-sidebar {
  background-color: #0e1013;
  z-index: 20;
  position: absolute;
  height: 100%;
  width: 100px;
  padding: 20px;
  border-right: 1px solid #ccc;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 1024px) {
    position: static;
  }

  &--open {
    width: 300px;
  }
}

.chat-sidebar__title {
  font-size: 12px;
  font-weight: bold;
  color: white;
  margin: 10px 0;
}

.chat-overlay {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(230, 218, 218, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  z-index: 10;

  &--active {
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: 1024px) {
    display: none;
  }
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  transition: all 0.25s ease;
  border-bottom: 1px solid transparent;
  color: white;

  a {
    padding: 0 5px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: transform 0.25s ease;
  }

  &--active {
    padding-left: 10px;
    color: #2f67a6;
    border-bottom: 1px solid #2f67a6;
  }

  &:hover {
    a {
      transform: scale(1.1);
    }
  }
}

.new-chat {
  margin-top: 10px;
  background-color: #2f67a6;
  border-radius: 10px;
  color: white;
  text-align: center;
  padding: 10px 20px;
  display: block;
  transition: background-color 0.25s ease;
  cursor: pointer;

  &:hover {
    background-color: #1f4d86;
  }
}

.delete-button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
}

</style>
