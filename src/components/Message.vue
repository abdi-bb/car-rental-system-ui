<template>
    <div v-if="message" :class="messageClass">
      <div class="flex items-center justify-between">
        <span>{{ message }}</span>
        <button @click="clearMessage" class="text-current hover:text-red-900 focus:outline-none">
          X
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue';
  
  const props = defineProps(['message', 'type']);
  const emits = defineEmits(['clear']);
  
  const messageClass = computed(() => [
    'p-4 rounded-md shadow-md mb-4 mx-auto w-1/2',
    props.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : '',
    props.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : '',
  ]);
  
  const clearMessage = () => {
    emits.clear();
  };
  </script>
  