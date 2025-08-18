import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LeagueCard from '@/components/LeagueCard.vue'
import { useLeaguesStore } from '@/stores/leaguesStore'

vi.mock('@/services/leaguesService', () => ({
  leaguesService: {
    fetchLeagues: vi.fn(),
    fetchLeagueBadge: vi.fn(),
  },
}))

const mockLeague = {
  idLeague: '1',
  strLeague: 'Premier League',
  strLeagueAlternate: 'EPL',
  strSport: 'Soccer',
}

describe('LeagueCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render league information', () => {
    const wrapper = mount(LeagueCard, {
      props: {
        league: mockLeague,
      },
    })

    expect(wrapper.text()).toContain('Premier League')
    expect(wrapper.text()).toContain('EPL')
    expect(wrapper.text()).toContain('Soccer')
  })

  it('should show loading state when fetching badge', async () => {
    const wrapper = mount(LeagueCard, {
      props: {
        league: mockLeague,
      },
    })

    const store = useLeaguesStore()
    store.loadingBadges['1'] = true

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading badge...')
  })

  it('should show badge when available', () => {
    const leagueWithBadge = {
      ...mockLeague,
      strBadge: 'https://example.com/badge.png',
    }

    const wrapper = mount(LeagueCard, {
      props: {
        league: leagueWithBadge,
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/badge.png')
    expect(img.attributes('alt')).toBe('Premier League badge')
  })

  it('should show no badge available state', () => {
    const wrapper = mount(LeagueCard, {
      props: {
        league: mockLeague,
      },
    })

    expect(wrapper.text()).toContain('No badge available')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should handle click and flip card', async () => {
    const wrapper = mount(LeagueCard, {
      props: {
        league: mockLeague,
      },
    })

    const store = useLeaguesStore()
    const fetchBadgeSpy = vi.spyOn(store, 'fetchLeagueBadge').mockResolvedValue()

    expect(wrapper.find('.flip-card-inner').classes()).not.toContain('flipped')

    await wrapper.find('.flip-card').trigger('click')

    expect(fetchBadgeSpy).toHaveBeenCalledWith('1')
    expect(wrapper.find('.flip-card-inner').classes()).toContain('flipped')
  })

  it('should not fetch badge if already has badge', async () => {
    const leagueWithBadge = {
      ...mockLeague,
      strBadge: 'https://example.com/badge.png',
    }

    const wrapper = mount(LeagueCard, {
      props: {
        league: leagueWithBadge,
      },
    })

    const store = useLeaguesStore()
    const fetchBadgeSpy = vi.spyOn(store, 'fetchLeagueBadge').mockResolvedValue()

    await wrapper.find('.flip-card').trigger('click')

    expect(wrapper.find('.flip-card-inner').classes()).toContain('flipped')
    expect(fetchBadgeSpy).not.toHaveBeenCalled()
  })

  it('should not fetch badge if already loading', async () => {
    const wrapper = mount(LeagueCard, {
      props: {
        league: mockLeague,
      },
    })

    const store = useLeaguesStore()
    store.loadingBadges['1'] = true
    const fetchBadgeSpy = vi.spyOn(store, 'fetchLeagueBadge').mockResolvedValue()

    await wrapper.find('.flip-card').trigger('click')

    expect(fetchBadgeSpy).not.toHaveBeenCalled()
    expect(wrapper.find('.flip-card-inner').classes()).toContain('flipped')
  })
})
