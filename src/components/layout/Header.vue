<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Application',
})
</script>

<template>
  <header class="shadow bg-white">
    <div class="container mx-auto p-4 flex justify-between items-center flex-col md:flex-row gap-4">
      <h1 class="text-gray-800 font-semibold">{{ title }}</h1>
      <div class="flex gap-4 justify-between">
        <slot name="filters" />
      </div>
    </div>
  </header>
</template>
