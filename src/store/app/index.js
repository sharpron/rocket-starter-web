import { defineStore } from 'pinia'
import defaultSettings from '@/settings.json'

const useAppStore = defineStore('app', {
  state: () => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state) {
      return { ...state }
    },
    appDevice(state) {
      return state.device
    },
    isDark(state) {
      return state.theme === 'dark'
    }
  },

  actions: {
    // Update app settings
    updateSettings(partial) {
      // @ts-ignore-next-line
      this.$patch(partial)
    },

    // Change theme color
    toggleTheme(dark) {
      if (dark) {
        this.theme = 'dark'
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        this.theme = 'light'
        document.body.removeAttribute('arco-theme')
      }
    },
    toggleDevice(device) {
      this.device = device
    },
    toggleMenu(value) {
      this.hideMenu = value
    }
  }
})

export default useAppStore
