<template>
  <div class="chat-input">
    <input
      type="text"
      v-model="message"
      ref="chatInputRef"
      :placeholder="!isInputDisabled ? 'Start asking for knowledge...' : 'Please wait for the response...'"
      @keyup.enter="handleSendMessage"
      :disabled="isInputDisabled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineExpose, defineEmits } from 'vue';

const props = defineProps<{ isInputDisabled: boolean }>();

const message = ref<string>('');
const chatInputRef = ref<HTMLInputElement | null>(null);

function focusInput() {
  nextTick(() => {
    chatInputRef.value?.focus();
  });
}

defineExpose({ focusInput });

const emit = defineEmits<{ (event: 'send-message', message: string): void }>();

function handleSendMessage() {
  if (message.value.trim() === '' || props.isInputDisabled) return;
  emit('send-message', message.value);
  message.value = '';
}
</script>

<style scoped lang="scss">
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
  animation: slideFromBottomFixed .5s ease-out forwards;

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
</style>
