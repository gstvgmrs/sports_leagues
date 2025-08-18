<script setup lang="ts">
import { useLeaguesStore } from '@/stores/leaguesStore'
import { storeToRefs } from 'pinia'
import Dropdown from '@/components/base/Dropdown.vue'
import SearchInput from '@/components/base/SearchInput.vue'

const leaguesStore = useLeaguesStore()
const { sportOptions } = storeToRefs(leaguesStore)

const handleFilterChange = (selectedOption: string) => {
  leaguesStore.setSportFilter(selectedOption)
}

const handleSearch = (query: string) => {
  leaguesStore.setSearchQuery(query)
}
</script>

<template>
  <SearchInput placeholder="Search by name" @search="handleSearch" class="flex-1" />
  <Dropdown :options="sportOptions" default-value="All Sports" @change="handleFilterChange" />
</template>
