<template>
  <div class="chat-sidebar" :class="{ 'chat-sidebar--open': toggleVisibility }">
    <ToggleButton v-model="toggleVisibility" class="chat-sidebar__toggle" />
    <h3 class="chat-sidebar__title">Chats</h3>
    <ul class="chat-sidebar__list">
      <li
        v-for="chat in chats"
        :key="chat.id"
        class="chat-sidebar__item"
        :class="{ 'chat-sidebar__item--active': activeChat && activeChat.id === chat.id }"
      >
        <a @click="switchChatByName(chat.name)" class="chat-sidebar__link" :title="chat.name">
          {{ !toggleVisibility ? chat.name.slice(0, 3) + '...' : chat.name }}
        </a>
        <button v-if="toggleVisibility" class="chat-sidebar__delete" @click="deleteChat(chat.id, chat.name)">
          🗑️
        </button>
      </li>
    </ul>
    <button @click="prepareNewChat" class="chat-sidebar__new-chat">
      ✚ {{ toggleVisibility ? 'New Chat' : '' }}
    </button>
    <div class="chat-sidebar__footer" v-if="toggleVisibility">
      <ThemeSwitcher class="chat-sidebar__theme-switcher" />
      <button v-if="authStore.isAuthenticated" @click="logout" class="chat-sidebar__logout">
        Logout
      </button>
    </div>
  </div>
  <div class="chat-sidebar__overlay" :class="{ 'chat-sidebar__overlay--active': toggleVisibility }" @click="toggleVisibility = false" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { createSlug } from '@/utils/utils';
import { useRoute, useRouter } from 'vue-router';

import ToggleButton from '@/components/ToggleButton/ToggleButton.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';

interface Chat {
  id: string;
  name: string;
}

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

function deleteChat(chatId: string, chatName: string) {
  const confirmed = confirm(`Are you sure you want to delete this "${chatName}" chat?`);
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

const logout = () => {
  authStore.logout();
  router.push('/');
};
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

.chat-sidebar__list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-sidebar__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid transparent;
  color: white;
  padding: 5px;
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
    cursor: pointer;
  }

  &:hover {
    a {
      transform: scale(1.1);
    }
  }


  &--active {
    padding-left: 10px;
    color: #2f67a6;
    border-bottom: 1px solid #2f67a6;
  }
}

.chat-sidebar__link {
  padding: 0 5px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 0.25s ease;
}

.chat-sidebar__delete {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
}

.chat-sidebar__new-chat {
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

.chat-sidebar__footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chat-sidebar__theme-switcher {
  margin: 10px;
}

.chat-sidebar__logout {
  margin-top: auto;
  background: #d9534f;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  pointer-events: auto;
  position: relative;
  z-index: 1;
  transition: background 0.25s ease;
}

.chat-sidebar__logout:hover {
  background: #c9302c;
}

.chat-sidebar__overlay {
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
</style>