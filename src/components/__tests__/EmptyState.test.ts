import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  it('should match snapshot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        icon: 'error',
        title: 'No leagues found',
        description: 'Try adjusting your search or filter criteria.',
        iconClass: 'text-red-500 custom-icon',
      },
      slots: {
        default: '<button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Retry</button>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
