<script setup lang="ts">
import { useLeaguesStore } from '@/stores/leaguesStore'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import EmptyState from '@/components/EmptyState.vue'
import LeagueCardSkeleton from '@/components/LeagueCardSkeleton.vue'
import LeagueCard from '@/components/LeagueCard.vue'

const leaguesStore = useLeaguesStore()
const { filteredLeagues, loading, error } = storeToRefs(leaguesStore)

onMounted(() => {
  leaguesStore.fetchLeagues()
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <template v-if="loading">
      <LeagueCardSkeleton v-for="n in 9" :key="`skeleton-${n}`" />
    </template>

    <template v-else>
      <LeagueCard v-for="league in filteredLeagues" :key="league.idLeague" :league="league" />
    </template>
  </div>

  <EmptyState
    v-if="!loading && error"
    icon="error"
    :title="'Failed to load leagues'"
    :description="'Something went wrong while fetching the data. Please try again.'"
    icon-class="mx-auto text-red-400 mb-4"
  />

  <EmptyState
    v-else-if="!loading && !error && filteredLeagues.length === 0"
    icon="search"
    :title="'No leagues found'"
    :description="'Try adjusting your search or filter criteria.'"
  />
</template>
