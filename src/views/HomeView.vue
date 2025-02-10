<template>
  <div>
    <img 
      alt="logo" 
      src="../assets/logo.png" 
      class="logo-anim"
    />

    <button 
      class="btn-anim"
      @click="router.push('/login')"
    >
      Login
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
/* BUTTON */
button {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}

.logo-anim {
  animation: slideFromTop 1s ease-out forwards;
  margin-bottom: 20px;
}

.btn-anim {
  animation: slideFromBottom 1s ease-out forwards;
}
</style>
