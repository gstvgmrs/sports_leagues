import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LeaguesFilters from '@/components/LeaguesFilters.vue'
import { useLeaguesStore } from '@/stores/leaguesStore'

vi.mock('@/services/leaguesService', () => ({
  leaguesService: {
    fetchLeagues: vi.fn().mockResolvedValue([]),
    fetchLeagueBadge: vi.fn(),
  },
}))

describe('LeaguesFilters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should match snapshot', () => {
    const wrapper = mount(LeaguesFilters)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render sport options in dropdown', async () => {
    const wrapper = mount(LeaguesFilters)
    const store = useLeaguesStore()

    store.leagues = [
      { idLeague: '1', strLeague: 'Test League', strSport: 'Soccer' },
      { idLeague: '2', strLeague: 'Test League 2', strSport: 'Basketball' },
    ]

    await wrapper.vm.$nextTick()

    const dropdown = wrapper.find('button')
    await dropdown.trigger('click')

    expect(wrapper.text()).toContain('All Sports')
    expect(wrapper.text()).toContain('Soccer')
    expect(wrapper.text()).toContain('Basketball')
  })
})
