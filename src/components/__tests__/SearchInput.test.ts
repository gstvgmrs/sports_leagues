import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchInput from '@/components/base/SearchInput.vue'

describe('SearchInput', () => {
  it('should render with default placeholder', () => {
    const wrapper = mount(SearchInput)

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search...')
  })

  it('should render with custom placeholder', () => {
    const wrapper = mount(SearchInput, {
      props: {
        placeholder: 'Search leagues...',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Search leagues...')
  })

  it('should emit search on Enter key', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.setValue('test query')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]).toEqual(['test query'])
  })

  it('should show clear button when has value', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.setValue('search term')

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('should clear input when clear button is clicked', async () => {
    const wrapper = mount(SearchInput)
    const input = wrapper.find('input')

    await input.setValue('search term')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('search')?.[0]).toEqual([''])
  })

  it('should update v-model value', async () => {
    const wrapper = mount(SearchInput, {
      props: {
        modelValue: 'initial',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })
})
