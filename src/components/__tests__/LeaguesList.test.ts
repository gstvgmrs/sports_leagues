import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LeaguesList from '@/components/LeaguesList.vue'
import { useLeaguesStore } from '@/stores/leaguesStore'

vi.mock('@/services/leaguesService', () => ({
  leaguesService: {
    fetchLeagues: vi.fn().mockResolvedValue([]),
    fetchLeagueBadge: vi.fn(),
  },
}))

describe('LeaguesList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should show loading skeletons when loading', async () => {
    const wrapper = mount(LeaguesList)
    const store = useLeaguesStore()

    store.loading = true

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[class*="animate-pulse"]').length).toBeGreaterThan(0)
  })

  it('should render leagues when loaded', async () => {
    const wrapper = mount(LeaguesList)
    const store = useLeaguesStore()

    store.loading = false
    store.leagues = [
      {
        idLeague: '1',
        strLeague: 'Premier League',
        strSport: 'Soccer',
      },
      {
        idLeague: '2',
        strLeague: 'NBA',
        strSport: 'Basketball',
      },
    ]

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Premier League')
    expect(wrapper.text()).toContain('NBA')
  })

  it('should show error state when there is an error', async () => {
    const wrapper = mount(LeaguesList)
    const store = useLeaguesStore()

    store.loading = false
    store.error = 'Failed to load leagues'

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Failed to load leagues')
  })

  it('should show empty state when no leagues found', async () => {
    const wrapper = mount(LeaguesList)
    const store = useLeaguesStore()

    store.loading = false
    store.error = null
    store.leagues = []

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('No leagues found')
  })

  it('should call fetchLeagues on mount', async () => {
    const store = useLeaguesStore()
    const fetchLeaguesSpy = vi.spyOn(store, 'fetchLeagues').mockResolvedValue()
    const wrapper = mount(LeaguesList)

    await wrapper.vm.$nextTick()

    expect(fetchLeaguesSpy).toHaveBeenCalled()
  })
})
