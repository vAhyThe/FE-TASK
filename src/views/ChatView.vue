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
          <div class="chat-input" v-if="activeChat || isNewChat">
            <input
              type="text"
              ref="chatInput"
              v-model="userMessage"
              :placeholder="!isInputDisabled ? 'Start asking for knowledge...' : 'Please wait for the response...'"
              @keyup.enter="sendMessage"
              :disabled="isInputDisabled"
            />
          </div>
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
import ToggleButton from '@/components/ToggleButton/ToggleButton.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue';

const chatStore = useChatStore();
const userMessage = ref<string>('');
const isNewChat = ref(false);
// Reaktivní proměnná, která určuje, zda má být input deaktivován.
const isInputDisabled = ref(false);

const route = useRoute();
const router = useRouter();

const chats = computed(() => chatStore.chats);
const activeChat = computed(() => chatStore.activeChat);
const messages = computed(() => chatStore.messages);
const chatHistoryContentRef = ref<HTMLElement | null>(null);
const chatInput = ref<HTMLInputElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    if (chatHistoryContentRef.value) {
      chatHistoryContentRef.value.scrollTop = chatHistoryContentRef.value.scrollHeight;
    }
  });
}

async function sendMessage() {
  // Pokud je zpráva prázdná nebo je input momentálně zakázán, neprovádíme nic
  if (userMessage.value.trim() === '' || isInputDisabled.value) return;

  // Deaktivace inputu – uživatel nemůže posílat další zprávy, dokud se neobjeví odpověď
  isInputDisabled.value = true;

  const userMsg = userMessage.value;

  if (isNewChat.value) {
    const newChatId = chatStore.createNewChat(userMsg);
    chatStore.switchChat(newChatId);
    isNewChat.value = false;
    updateChatUrl(userMsg);
  }

  // Přidání zprávy bez odpovědi
  chatStore.addMessage({
    id: Date.now(),
    question: userMsg,
    answer: '',
  });

  userMessage.value = '';
  scrollToBottom();

  await nextTick();

  // Simulace načítání odpovědi (např. volání API)
  setTimeout(() => {
    const lastMessage = chatStore.messages.at(-1);
    if (lastMessage) {
      lastMessage.answer = getRandomResponse();
      chatStore.saveChatsToStorage();
      scrollToBottom();
    }
    // Po načtení odpovědi opět povolíme vstup
    isInputDisabled.value = false;
  }, 1000);
}

watch(isNewChat, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (chatInput.value) {
        chatInput.value.focus();
      }
    });
  }
});

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

.chat-input {
  padding: 10px;
  position: fixed;
  left: 110px;
  bottom: 20px;
  width: calc(100% - 120px);
  display: flex;
  background: white;
  border-radius: 1rem;
  background: linear-gradient(173deg, #23272f 0%, #14161a 100%);
  box-shadow:
    10px 10px 20px #0e1013,
    -10px -10px 40px #383e4b;
  padding: 0.3rem;
  gap: 0.3rem;
  animation: slideFromBottom .5s ease-out forwards;

  @media (min-width: 1024px) {
    left: 5%;
    width: 90%;
    position: fixed;
    width: 50%;
    left: 50%;
    transform: translateX(-50%);
  }

  input {
    width: 100%;
    border-radius: 0.8rem;
    background: #23272f;
    box-shadow:
      inset 5px 5px 10px #0e1013,
      inset -5px -5px 10px #383e4b,
      0px 0px 100px rgba(255, 212, 59, 0),
      0px 0px 100px rgba(255, 102, 0, 0);
    flex-basis: 100%;
    padding: 1rem;
    border: none;
    border: 1px solid transparent;
    color: white;
    transition: all 0.2s ease-in-out;

    &:focus {
      border: 1px solid #007bff;
      outline: none;
      box-shadow:
        inset 0px 0px 10px rgba(0, 123, 255, 0.5),
        inset 0px 0px 10px rgba(0, 123, 255, 0.5),
        0px 0px 100px rgba(0, 123, 255, 0.5),
        0px 0px 100px rgba(0, 123, 255, 0.5);
    }
  }
}

@keyframes slideFromBottom {
  0% {
    bottom: -40px;
    opacity: 0;
  }
  100% {
    bottom: 30px;
    opacity: 1;
  }
}
</style>
