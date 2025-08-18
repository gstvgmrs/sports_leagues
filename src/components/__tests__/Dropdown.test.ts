import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownFilter from '@/components/base/Dropdown.vue'

describe('DropdownFilter', () => {
  const mockOptions = ['All Sports', 'Soccer', 'Basketball', 'Tennis']

  it('should render with options', () => {
    const wrapper = mount(DropdownFilter, {
      props: {
        options: mockOptions,
        defaultValue: 'All Sports',
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('All Sports')
  })

  it('should toggle dropdown on button click', async () => {
    const wrapper = mount(DropdownFilter, {
      props: {
        options: mockOptions,
        defaultValue: 'All Sports',
      },
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.absolute').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(mockOptions.length + 1)
  })

  it('should emit change when option is selected', async () => {
    const wrapper = mount(DropdownFilter, {
      props: {
        options: mockOptions,
        defaultValue: 'All Sports',
      },
    })

    const mainButton = wrapper.find('button')
    await mainButton.trigger('click')

    await wrapper.vm.$nextTick()

    const optionButtons = wrapper.findAll('button')
    const secondOption = optionButtons[2]
    await secondOption.trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual(['Soccer'])
  })

  it('should close dropdown after selection', async () => {
    const wrapper = mount(DropdownFilter, {
      props: {
        options: mockOptions,
        defaultValue: 'All Sports',
      },
    })

    const mainButton = wrapper.find('button')
    await mainButton.trigger('click')

    await wrapper.vm.$nextTick()

    const optionButtons = wrapper.findAll('button')
    const secondOption = optionButtons[2]
    await secondOption.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.absolute').isVisible()).toBe(false)
  })

  it('should display selected value', async () => {
    const wrapper = mount(DropdownFilter, {
      props: {
        options: mockOptions,
        defaultValue: 'All Sports',
      },
    })

    const mainButton = wrapper.find('button')
    await mainButton.trigger('click')

    await wrapper.vm.$nextTick()

    const optionButtons = wrapper.findAll('button')
    const basketballOption = optionButtons[3]
    await basketballOption.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('button').text()).toContain('Basketball')
  })
})
