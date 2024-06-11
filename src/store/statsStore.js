import { defineStore } from 'pinia'

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      startingDate: null,
      endingDate: null
    }
  }
})