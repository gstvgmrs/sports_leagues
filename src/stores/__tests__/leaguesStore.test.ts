import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLeaguesStore } from '@/stores/leaguesStore'
import { leaguesService } from '@/services/leaguesService'

vi.mock('@/services/leaguesService', () => ({
  leaguesService: {
    fetchLeagues: vi.fn(),
    fetchLeagueBadge: vi.fn(),
  },
}))

const mockLeagues = [
  {
    idLeague: '1',
    strLeague: 'Premier League',
    strLeagueAlternate: 'EPL',
    strSport: 'Soccer',
  },
  {
    idLeague: '2',
    strLeague: 'NBA',
    strLeagueAlternate: 'National Basketball Association',
    strSport: 'Basketball',
  },
  {
    idLeague: '3',
    strLeague: 'Champions League',
    strSport: 'Soccer',
  },
]

describe('LeaguesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useLeaguesStore()

      expect(store.leagues).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.searchQuery).toBe('')
      expect(store.selectedSport).toBe('')
      expect(store.loadingBadges).toEqual({})
      expect(store.filteredLeagues).toEqual([])
      expect(store.sportOptions).toEqual(['All Sports'])
    })
  })

  describe('fetchLeagues', () => {
    it('should fetch leagues successfully', async () => {
      const store = useLeaguesStore()
      vi.mocked(leaguesService.fetchLeagues).mockResolvedValue(mockLeagues)

      await store.fetchLeagues()

      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.leagues).toEqual(mockLeagues)
      expect(leaguesService.fetchLeagues).toHaveBeenCalledOnce()
    })

    it('should handle fetch leagues error', async () => {
      const store = useLeaguesStore()
      const errorMessage = 'Failed to fetch'
      vi.mocked(leaguesService.fetchLeagues).mockRejectedValue(new Error(errorMessage))

      await store.fetchLeagues()

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
      expect(store.leagues).toEqual([])
    })

    it('should set loading state correctly during fetch', async () => {
      const store = useLeaguesStore()
      let resolvePromise: (value: typeof mockLeagues) => void
      const promise = new Promise<typeof mockLeagues>((resolve) => {
        resolvePromise = resolve
      })
      vi.mocked(leaguesService.fetchLeagues).mockReturnValue(promise)

      const fetchPromise = store.fetchLeagues()
      expect(store.loading).toBe(true)

      resolvePromise!(mockLeagues)
      await fetchPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('fetchLeagueBadge', () => {
    it('should fetch badge successfully and update league', async () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]
      const badgeUrl = 'https://example.com/badge.png'
      vi.mocked(leaguesService.fetchLeagueBadge).mockResolvedValue(badgeUrl)

      await store.fetchLeagueBadge('1')

      expect(store.leagues[0].strBadge).toBe(badgeUrl)
      expect(store.loadingBadges['1']).toBe(false)
      expect(leaguesService.fetchLeagueBadge).toHaveBeenCalledWith('1')
    })

    it('should not fetch badge if already loading', async () => {
      const store = useLeaguesStore()
      store.loadingBadges['1'] = true

      await store.fetchLeagueBadge('1')

      expect(leaguesService.fetchLeagueBadge).not.toHaveBeenCalled()
    })

    it('should handle badge fetch error', async () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(leaguesService.fetchLeagueBadge).mockRejectedValue(new Error('Badge error'))

      await store.fetchLeagueBadge('1')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching badge:', expect.any(Error))
      expect(store.loadingBadges['1']).toBe(false)
      consoleSpy.mockRestore()
    })

    it('should not update league if badge URL is null', async () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]
      vi.mocked(leaguesService.fetchLeagueBadge).mockResolvedValue(null)

      await store.fetchLeagueBadge('1')

      expect(store.leagues[0].strBadge).toBeUndefined()
      expect(store.loadingBadges['1']).toBe(false)
    })
  })

  describe('Filters', () => {
    beforeEach(() => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]
    })

    it('should set search query', () => {
      const store = useLeaguesStore()

      store.setSearchQuery('Premier')

      expect(store.searchQuery).toBe('Premier')
    })

    it('should set sport filter', () => {
      const store = useLeaguesStore()

      store.setSportFilter('Soccer')

      expect(store.selectedSport).toBe('Soccer')
    })

    it('should filter leagues by search query', () => {
      const store = useLeaguesStore()

      store.setSearchQuery('premier')

      expect(store.filteredLeagues).toHaveLength(1)
      expect(store.filteredLeagues[0].strLeague).toBe('Premier League')
    })

    it('should filter leagues by sport', () => {
      const store = useLeaguesStore()

      store.setSportFilter('Soccer')

      expect(store.filteredLeagues).toHaveLength(2)
      expect(store.filteredLeagues.every((league) => league.strSport === 'Soccer')).toBe(true)
    })

    it('should apply both search and sport filters', () => {
      const store = useLeaguesStore()

      store.setSearchQuery('champions')
      store.setSportFilter('Soccer')

      expect(store.filteredLeagues).toHaveLength(1)
      expect(store.filteredLeagues[0].strLeague).toBe('Champions League')
    })

    it('should return all leagues when "All Sports" is selected', () => {
      const store = useLeaguesStore()

      store.setSportFilter('All Sports')

      expect(store.filteredLeagues).toHaveLength(3)
    })

    it('should handle case insensitive search', () => {
      const store = useLeaguesStore()

      store.setSearchQuery('NBA')

      expect(store.filteredLeagues).toHaveLength(1)
      expect(store.filteredLeagues[0].strLeague).toBe('NBA')
    })
  })

  describe('Computed Properties', () => {
    it('should generate sport options correctly', () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]

      expect(store.sportOptions).toEqual(['All Sports', 'Soccer', 'Basketball'])
    })

    it('should filter out undefined sports from options', () => {
      const store = useLeaguesStore()
      store.leagues = [
        { idLeague: '1', strLeague: 'Test League', strSport: 'Soccer' },
        { idLeague: '2', strLeague: 'Test League 2' }, // no sport
      ]

      expect(store.sportOptions).toEqual(['All Sports', 'Soccer'])
    })

    it('should remove duplicate sports from options', () => {
      const store = useLeaguesStore()
      store.leagues = [
        { idLeague: '1', strLeague: 'Premier League', strSport: 'Soccer' },
        { idLeague: '2', strLeague: 'La Liga', strSport: 'Soccer' },
        { idLeague: '3', strLeague: 'Serie A', strSport: 'Soccer' },
      ]

      expect(store.sportOptions).toEqual(['All Sports', 'Soccer'])
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty search query', () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]

      store.setSearchQuery('')

      expect(store.filteredLeagues).toHaveLength(3)
    })

    it('should handle whitespace-only search query', () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]

      store.setSearchQuery('   ')

      expect(store.filteredLeagues).toHaveLength(3)
    })

    it('should handle non-existent league ID in fetchLeagueBadge', async () => {
      const store = useLeaguesStore()
      store.leagues = [...mockLeagues]
      vi.mocked(leaguesService.fetchLeagueBadge).mockResolvedValue('badge-url')

      await store.fetchLeagueBadge('non-existent')

      expect(store.leagues.find((l) => l.idLeague === 'non-existent')).toBeUndefined()
      expect(store.loadingBadges['non-existent']).toBe(false)
    })
  })
})
