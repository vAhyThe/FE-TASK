<template>
  <div class="chat-history__content">
    <div v-for="(msg, index) in props.messages" :key="msg.id" class="chat-block">
      <div class="myQuestion text-right">
        {{ msg.question }}
      </div>
      <div v-if="msg.answer" class="myAnswer text-left">
        <template v-if="isLastMessageAnimated(msg.id)">
          <span
            v-for="(word, wordIndex) in splitWords(msg.answer)"
            :key="wordIndex"
            class="word"
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

/**
 * When the animation of the last word ends, remove the animated state so
 * that the answer is rendered as one plain sentence.
 */
function handleAnimationEnd(messageId: number, wordIndex: number, totalWords: number) {
  // Only when the last word's animation ends, clear the animation flag.
  if (wordIndex === totalWords - 1 && lastAnimatedMessageId.value === messageId) {
    lastAnimatedMessageId.value = null;
  }
}

// Watch for changes in messages and mark the last one as animated.
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
.chat-block {
  margin: 10px 20px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: right;

  @media (min-width: 1024px) {
    margin: 0 5% 10px;
  }
}

.myQuestion {
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  color: #2f67a6;
  display: inline-block;
}

.myAnswer {
  opacity: 1;
  letter-spacing: 0px;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Styles for individual words in the animation */
.word {
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
