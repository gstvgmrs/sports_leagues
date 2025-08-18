import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '@/components/base/Card.vue'

describe('BaseCard', () => {
  it('should match snapshot', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        default: '<h1>Test Title</h1><p>Test content</p>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
