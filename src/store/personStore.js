import { defineStore } from 'pinia'

export const usePersonStore = defineStore('person', {
  state: () => {
    return {
      gender: null,
      age: null,
      height: null,
      weigth: null,
      levelOfActivity: ["Минимальная активность", "Слабый уровень активности",
                        "Умеренный уровень активности", "Тяжелая активность",
                        "Экстремальный уровень активности"],
      commonRules: [
        value => !!value || "Значение не может быть пустым!",
        value => {if (value.startsWith(0)) 
                  return false || "Значение не может начинаться с нуля!"
                  else 
                  return true}
      ],  
      ageHeightRules: [
        value => (value || '').length <= 3 || "Значение не должно превышать 3 цифр!",
        value => { const REG_EXP = /^[0-9]+$/
          return REG_EXP.test(value) || "Значение должно быть положительным числом!"
        }
      ],
      weightRules: [
        value => { const REG_EXP = /^\d*\.?\d+$/
          return REG_EXP.test(value) || "Значение должно быть положительным, корректным и, при необходимости, разделяться точкой!"
        }
      ]
    }
  },
  getters: {
    returnAgeHeightRule() {
      return [...this.commonRules, ...this.ageHeightRules]
    },

    returnWeigthRule() {
      return [...this.commonRules, ...this.weightRules]
    }
  }
})