import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LeagueCardSkeleton from '@/components/LeagueCardSkeleton.vue'

describe('LeagueCardSkeleton', () => {
  it('should match snapshot', () => {
    const wrapper = mount(LeagueCardSkeleton)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
