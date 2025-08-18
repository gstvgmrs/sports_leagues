import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '@/components/layout/Header.vue'

describe('Header', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Header, {
      props: {
        title: 'Sports Leagues',
      },
      slots: {
        filters: '<input type="text" placeholder="Search..." /><button>Filter</button>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
