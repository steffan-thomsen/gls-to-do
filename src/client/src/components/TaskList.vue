<template>
  <div class="text-center py-8">
    <span class="text-sm text-gray-600 mb-4 block">
      Items ({{ completeCount }} tasks complete / {{ incompleteCount }} tasks
      incomplete):
    </span>
    <div class="item-list space-y-3">
      <task-item
        v-for="item in items"
        :key="item.id"
        :item="item"
        @item-updated="updateList"
        class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:bg-gray-50"
      />
    </div>
    <hr class="my-6 border-t border-gray-300" />
    <div class="task-add space-x-4">
      <span class="text-sm text-gray-700">Add new item to list:</span>
      <input
        ref="taskInput"
        type="text"
        v-model="newItemText"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="addItem"
      />
      <button
        type="button"
        @click="addItem"
        class="bg-blue-600 text-white py-2 px-6 rounded-md mt-2 cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 easy-in"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { userStore } from '../store/userStore';
import { apiCall } from '../utils/apiCall';
import TaskItem from './TaskItem.vue';

const items = ref([]);
const newItemText = ref('');
const store = userStore;

async function addItem() {
  if (newItemText.value.trim() === '') return;
  const task = await apiCall(
    '/api/Task/Add',
    'POST',
    { text: newItemText.value, owner: store.currentUser, isCompleted: false },
    store.token
  );
  if (task) {
    newItemText.value = '';
    updateList();
  }
}

async function updateList() {
  const tasks = await apiCall(
    `/api/Task/List?userName=${encodeURIComponent(store.currentUser)}`,
    'GET',
    null,
    store.token
  );
  if (tasks) items.value = tasks;
}

const completeCount = computed(
  () => items.value.filter((q) => q.isCompleted).length
);
const incompleteCount = computed(
  () => items.value.filter((q) => !q.isCompleted).length
);

onMounted(() => {
  updateList();
  nextTick(() => document.querySelector('input[ref=taskInput]')?.focus());
});
</script>
