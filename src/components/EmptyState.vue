<script setup lang="ts">
import Icon from "@/components/base/Icon.vue";

interface Props {
  icon?: 'document' | 'search' | 'close' | 'chevron-down' | 'error' | 'alert';
  title: string;
  description: string;
  iconClass?: string;
}

withDefaults(defineProps<Props>(), {
  icon: 'document',
  iconClass: 'mx-auto text-gray-300 mb-4'
});
</script>

<template>
  <div class="text-center py-12">
    <Icon :name="icon" size="lg" :class="iconClass" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500">{{ description }}</p>
    <slot />
  </div>
</template>
