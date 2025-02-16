<template>
  <div class="flex items-center justify-between">
    <input
      type="checkbox"
      class="chk-toggle rounded-full border-gray-300"
      :checked="item.isCompleted"
      @click.stop="toggle(item.id)"
    />
    <span
      class="ml-3 text-gray-700 flex-1"
      :class="{ 'line-through text-gray-400': item.isCompleted }"
      v-html="item.text"
    ></span>
    <a
      title="Remove item"
      class="text-red-600 cursor-pointer"
      @click.stop="remove(item.id)"
    >
      X
    </a>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { userStore } from '../store/userStore';
import { apiCall } from '../utils/apiCall';

const props = defineProps({
  item: Object,
});

const emit = defineEmits(['itemUpdated']);

async function toggle(itemId) {
  try {
    const resp = await fetch(`/api/Task/Toggle?taskId=${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`,
      },
    });

    if (!resp.ok) throw new Error('Toggle failed');
    emit('itemUpdated');
  } catch (error) {
    console.error('Toggle error:', error);
  }
}

async function remove(itemId) {
  try {
    const result = await apiCall(
      `/api/Task/Remove?taskId=${itemId}`,
      'DELETE',
      null,
      userStore.token
    );
    if (result) {
      emit('itemUpdated');
    }
  } catch (error) {
    console.error('Remove error:', error);
  }
}
</script>
