<template>
  <div class="text-center pt-8">
    <p class="mb-4 text-gray-700">
      Login to see your tasks. Enter your super secret user name below and click
      "Login".
    </p>
    <div class="login-form">
      <input
        type="text"
        v-model="userName"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="login"
      />
      <br />
      <input
        type="button"
        @click="login"
        value="Login"
        class="bg-blue-600 text-white py-2 px-6 rounded-md mt-2 cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { userStore } from '../store/userStore';

const userName = ref('');
const store = userStore;

async function login() {
  try {
    const resp = await fetch(
      `/api/Auth/Authenticate?userName=${encodeURIComponent(userName.value)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!resp.ok) throw new Error('Login failed');

    store.token = await resp.text();
    store.currentUser = userName.value;
  } catch (error) {
    console.error('Login error:', error);
  }
}
</script>
