<template>
  <transition name="slide-fade" appear>
    <div v-if="showCard" :class="{ shake: shakeForm }" class="card">
      <div class="card-overlay"></div>
      <div class="card-inner">
        <div>
          <h1 class="p-8 title">Login</h1>
          <div>
            <input type="text" @keyup.enter="login" class="input-field" placeholder="Username" v-model="username" />
            <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
          </div>
          <div>
            <input type="password" @keyup.enter="login" class="input-field" placeholder="Password" v-model="password" />
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          </div>
          <div>
            <button @click="login">Login</button>
            <div v-if="loginError" class="error-message">{{ loginError }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const username = ref<string>('');
const password = ref<string>('');
const usernameError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const loginError = ref<string | null>(null);

const shakeForm = ref(false);

function triggerShake() {
  shakeForm.value = true;
  setTimeout(() => {
    shakeForm.value = false;
  }, 400);
}

const authStore = useAuthStore();
const router = useRouter();

const showCard = ref(true);

const login = () => {
  usernameError.value = null;
  passwordError.value = null;
  loginError.value = null;

  if (!username.value) {
    usernameError.value = 'Username is required.';
  }
  if (!password.value) {
    passwordError.value = 'Password is required.';
  }
  if (usernameError.value || passwordError.value) {
    triggerShake();
    return;
  }

  if (authStore.login(username.value, password.value)) {
    router.push('/chat');
  } else {
    loginError.value = 'Invalid username or password.';
    triggerShake();
  }
};
</script>
<style scoped>
  .title {
    color: #007bff;
  }

  .card {
    --bg: #e8e8e8;
    --contrast: #e2e0e0;
    --grey: #93a1a1;
    position: relative;
    padding: 9px;
    background-color: var(--bg);
    border-radius: 35px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-conic-gradient(var(--bg) 0.0000001%, var(--grey) 0.000104%) 60% 60%/600% 600%;
    filter: opacity(10%) contrast(105%);
  }

  .card-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    min-height: 254px;
    padding: 30px;
    background-color: var(--contrast);
    border-radius: 30px;
    font-size: 30px;
    font-weight: 900;
    color: #c7c4c4;
    text-align: center;
    font-family: monospace;
  }

  .input-field {
    margin-bottom: 15px;
    width: 100%;
    color: black !important;
  }

  .error-message {
    color: red;
    font-size: 14px;
    margin: 5px 0;
  }

  button {
    background-color: #007bff;
    color: white;
    font-size: 16px;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: #0056b3;
  }

  .shake {
    animation: shake 0.4s ease-in-out;
  }
</style>
