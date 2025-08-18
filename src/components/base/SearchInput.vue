<script setup lang="ts">
import Icon from "@/components/base/Icon.vue";

interface Props {
  placeholder?: string;
}

interface Emits {
  (event: 'search', value: string): void;
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
});

const emit = defineEmits<Emits>();

const inputValue = defineModel<string>({ default: '' });

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search', inputValue.value);
  }
};

const clearInput = () => {
  inputValue.value = '';
  emit('search', '');
};
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input v-model="inputValue" @keydown="handleKeydown" :placeholder="placeholder" type="text"
        class="px-4 py-2 pr-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" />

      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Icon v-if="!inputValue" name="search" class="text-gray-400" />

        <button v-if="inputValue" @click="clearInput"
          class="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 pointer-events-auto">
          <Icon name="close" size="sm" />
        </button>
      </div>
    </div>
  </div>
</template>
