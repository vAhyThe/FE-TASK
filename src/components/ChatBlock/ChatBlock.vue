<template>
  <div class="chat-block__container">
    <div v-for="(msg, index) in props.messages" :key="msg.id" class="chat-block">
      <div class="chat-block__question text-right">
        {{ msg.question }}
      </div>
      <div v-if="msg.answer" class="chat-block__answer text-left">
        <template v-if="isLastMessageAnimated(msg.id)">
          <span
            v-for="(word, wordIndex) in splitWords(msg.answer)"
            :key="wordIndex"
            class="chat-block__word"
            :style="{ animationDelay: wordIndex * 0.1 + 's' }"
            @animationend="handleAnimationEnd(msg.id, wordIndex, splitWords(msg.answer).length)"
          >
            {{ word }}
          </span>
        </template>
        <template v-else>
          {{ msg.answer }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

interface Message {
  id: number;
  question: string;
  answer?: string;
}

const props = defineProps<{ messages: Message[] }>();
const lastAnimatedMessageId = ref<number | null>(null);

function isLastMessageAnimated(messageId: number): boolean {
  return messageId === lastAnimatedMessageId.value;
}

function splitWords(answer: string): string[] {
  return answer.split(' ');
}


function handleAnimationEnd(messageId: number, wordIndex: number, totalWords: number) {
  if (wordIndex === totalWords - 1 && lastAnimatedMessageId.value === messageId) {
    lastAnimatedMessageId.value = null;
  }
}

watch(
  () => props.messages,
  (newMessages) => {
    if (newMessages.length > 0) {
      const lastMessageId = newMessages[newMessages.length - 1].id;
      lastAnimatedMessageId.value = lastMessageId;
    }
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.chat-block__container {
  padding: 10px 0 100px;
  width: 100%;
  margin: 0 auto;
  transition: all 0.25s ease;
}


.chat-block {
  margin: 10px 20px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: right;

  @media (min-width: 1024px) {
    margin: 0 5% 10px;
  }
}

.chat-block__question {
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  color: #2f67a6;
  display: inline-block;
}

.chat-block__answer {
  opacity: 1;
  letter-spacing: 0px;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.chat-block__word {
  opacity: 0;
  display: inline-block;
  margin-right: 4.2px;
  animation: fadeInWord 0.1s forwards;
}

@keyframes fadeInWord {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
