import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { leaguesService } from '@/services/leaguesService'

interface League {
  idLeague: string
  strLeague: string
  strLeagueAlternate?: string
  strSport?: string
  strBadge?: string
}

export const useLeaguesStore = defineStore('leaguesStore', () => {
  const leagues = ref<League[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadingBadges = ref<Record<string, boolean>>({})
  const searchQuery = ref('')
  const selectedSport = ref('')

  async function fetchLeagues() {
    try {
      loading.value = true
      error.value = null
      leagues.value = await leaguesService.fetchLeagues()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error fetching leagues'
    } finally {
      loading.value = false
    }
  }

  async function fetchLeagueBadge(idLeague: string) {
    if (loadingBadges.value[idLeague]) return

    try {
      loadingBadges.value[idLeague] = true
      const badgeUrl = await leaguesService.fetchLeagueBadge(idLeague)

      if (badgeUrl) {
        const itemIndex = leagues.value.findIndex((item) => item.idLeague === idLeague)
        if (itemIndex !== -1) {
          leagues.value[itemIndex] = { ...leagues.value[itemIndex], strBadge: badgeUrl }
        }
      }
    } catch (err: unknown) {
      console.error('Error fetching badge:', err)
    } finally {
      loadingBadges.value[idLeague] = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSportFilter(sport: string) {
    selectedSport.value = sport
  }

  const filteredLeagues = computed(() => {
    let filtered = leagues.value

    if (searchQuery.value.trim()) {
      filtered = filtered.filter((league) =>
        league.strLeague?.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    }

    if (selectedSport.value && selectedSport.value !== 'All Sports') {
      filtered = filtered.filter((league) => league.strSport === selectedSport.value)
    }

    return filtered
  })

  const sportOptions = computed(() => {
    const sports = [
      ...new Set(
        leagues.value
          .map((item) => item.strSport)
          .filter((sport): sport is string => Boolean(sport)),
      ),
    ]
    return ['All Sports', ...sports]
  })

  return {
    leagues,
    loading,
    error,
    searchQuery,
    selectedSport,
    filteredLeagues,
    sportOptions,
    loadingBadges,
    fetchLeagues,
    setSearchQuery,
    setSportFilter,
    fetchLeagueBadge,
  }
})
