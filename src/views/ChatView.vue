<template>
  <div class="chat-view">
    <ChatSideBar :chats="chats" v-model:isNewChat="isNewChat" />
    <div class="chat-holder">
      <div class="chat-history" ref="chatHistoryContentRef">
        <template v-if="activeChat || isNewChat">
          <h4 class="chat-history__title">
            <span>{{ activeChat?.name || 'New Chat (not yet created)' }}</span>
          </h4>
          <ChatBlock :messages="messages" />
          <ChatInput v-if="activeChat || isNewChat" @send-message="sendMessage" :isInputDisabled="isInputDisabled" ref="chatInput" />
        </template>

        <template v-else>
          <h4 class="chat-history__title chat-history__title--empty">
            No chat selected. Please choose from the list or create a new chat.
          </h4>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useRoute, useRouter } from 'vue-router';
import { createSlug } from '@/utils/utils';
import response from '@/mocks/response';
import ChatSideBar from '@/components/ChatSideBar/ChatSideBar.vue';
import ChatBlock from '@/components/ChatBlock/ChatBlock.vue';
import ChatInput from '@/components/ChatInput/ChatInput.vue';

const chatStore = useChatStore();
const isNewChat = ref(false);
const isInputDisabled = ref(false);

const route = useRoute();
const router = useRouter();

const chats = computed(() => chatStore.chats);
const activeChat = computed(() => chatStore.activeChat);
const messages = computed(() => chatStore.messages);
const chatHistoryContentRef = ref<HTMLElement | null>(null);
  const chatInput = ref<InstanceType<typeof ChatInput> | null>(null);


function scrollToBottom() {
  nextTick(() => {
    if (chatHistoryContentRef.value) {
      chatHistoryContentRef.value.scrollTop = chatHistoryContentRef.value.scrollHeight;
    }
  });
}

async function sendMessage(message: string) {
  if (message.trim() === '' || isInputDisabled.value) return;

  isInputDisabled.value = true;

  if (isNewChat.value) {
    const newChatId = chatStore.createNewChat(message);
    chatStore.switchChat(newChatId);
    isNewChat.value = false;
    updateChatUrl(message);
  }

  chatStore.addMessage({
    id: Date.now(),
    question: message,
    answer: '',
  });

  scrollToBottom();

  await nextTick();

  setTimeout(() => {
    const lastMessage = chatStore.messages.at(-1);
    if (lastMessage) {
      lastMessage.answer = getRandomResponse();
      chatStore.saveChatsToStorage();
      scrollToBottom();
    }
    isInputDisabled.value = false;
  }, 1000);
}

function updateChatUrl(chatName: string) {
  const slug = chatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  router.push({ name: 'ChatView', params: { chatName: slug } });
}

function getRandomResponse(): string {
  const index = Math.floor(Math.random() * response.length);
  return response[index];
}

onMounted(() => {
  const chatNameFromUrl = route.params.chatName as string | undefined;

  if (chatNameFromUrl) {
    const chat = chats.value.find(chat => createSlug(chat.name) === chatNameFromUrl);
    if (chat) {
      chatStore.switchChat(chat.id);
    }
  } else if (chats.value.length > 0) {
    const lastChat = chats.value[chats.value.length - 1];
    chatStore.switchChat(lastChat.id);
    updateChatUrl(lastChat.name);
  }
});

watch(() => route.params.chatName, (newChatName) => {
  if (newChatName) {
    chatInput.value?.focusInput();
    const chat = chats.value.find(chat => createSlug(chat.name) === newChatName);
    if (chat) {
      chatStore.switchChat(chat.id);
    }
  }
});
</script>

<style scoped lang="scss">
.chat-view {
  display: flex;
  height: 100%;
  width: 100vw;
  height: 100vh;
}

.chat-holder {
  width: 100%;
  padding-left: 100px;

  @media (min-width: 1024px) {
    padding-left: 0;
  }
}

.chat-history__content {
  padding: 10px 0 100px;
  width: 100%;
  margin: 0 auto;
  transition: all 0.25s ease;
}

.chat-history__title {
  margin: 10px;
  position: relative;
  color: white;

  &::before {
    content: 'Title';
    font-weight: thin;
    position: absolute;
    left: 10px;
    top: -15px;
    background-color: #99b9dd;
    padding: 3px 10px;
    font-size: 12px;
    border-radius: 5px;
  }

  span {
    background-color: #99b9dd;
    display: inline-block;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
  }

  @media (min-width: 1024px) {
    margin-right: 10%;
  }

  &--empty {
    &::before {
      content: none;
    }
  }
}

.chat-history {
  position: relative;
  padding: 10px 0;
  height: 100vh;
  overflow-y: auto;
}
</style>
