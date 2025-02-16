<template>
  <div class="container mx-auto text-center px-4">
    <h1>Good List System</h1>
    <h4>
      <span v-if="!!store.token"
        >Hi there <b>{{ store.currentUser }}!</b>,</span
      >
      Go check that
      <b
        ><i><u>Box</u></i></b
      >!
    </h4>
    <button
      v-if="!!store.token"
      @click="logout"
      class="bg-red-600 text-white py-2 px-6 rounded-md text-xs mt-4 border-0 hover:bg-red-700 transition duration-200 easy-in"
    >
      Logout
    </button>
    <task-list v-if="store.token"></task-list>
    <login v-else></login>
  </div>
</template>

<script setup>
import Login from './components/Login.vue';
import TaskList from './components/TaskList.vue';
import { userStore } from './store/userStore.js';

const store = userStore;

const logout = () => {
  userStore.logout();
};

console.log('store: ', store);
</script>
