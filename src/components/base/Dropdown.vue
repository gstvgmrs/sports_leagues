<script setup lang="ts">
import { ref, computed } from "vue";
import Icon from "@/components/base/Icon.vue";

interface Props {
  options: string[];
  defaultValue?: string;
  placeholder?: string;
}

interface Emits {
  (event: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: '',
  placeholder: 'Select an option'
});

const emit = defineEmits<Emits>();

const selectedOption = ref(props.defaultValue || props.options[0]);
const isDropdownOpen = ref(false);

const chevronClasses = computed(() => {
  return `transition-transform duration-200 ${isDropdownOpen.value ? 'rotate-180' : ''}`;
});

const selectOption = (option: string) => {
  selectedOption.value = option;
  isDropdownOpen.value = false;
  emit('change', option);
};
</script>

<template>
  <div class="relative">
    <button @click="isDropdownOpen = !isDropdownOpen"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      {{ selectedOption }}
      <Icon name="chevron-down" :class="chevronClasses" />
    </button>

    <div v-show="isDropdownOpen"
      class="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      <div class="py-1">
        <button v-for="option in options" :key="option" @click="selectOption(option)"
          class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
          :class="{ 'bg-blue-50 text-blue-700': selectedOption === option }">
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>
