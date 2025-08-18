<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import LeaguesFilters from '@/components/LeaguesFilters.vue'
import LeaguesList from '@/components/LeaguesList.vue'
</script>

<template>
  <Header title="Sports Leagues">
    <template #filters>
      <LeaguesFilters />
    </template>
  </Header>

  <main class="container mx-auto px-4 py-8">
    <LeaguesList />
  </main>
</template>
