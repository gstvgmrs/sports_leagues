import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseIcon from '@/components/base/Icon.vue'

describe('BaseIcon', () => {
  it('should match snapshot', () => {
    const wrapper = mount(BaseIcon, {
      props: {
        name: 'search',
        size: 'lg',
        class: 'text-red-500 custom-class',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
