import { defineStore } from 'pinia'

export const usePersonStore = defineStore('person', {
  state: () => {
    return {
      gender: null,
      age: null,
      height: null,
      weight: null,
      choosedActivity: null,
      levelOfActivity: [{ name: "Минимальная активность", value: 1.2 }, 
                        { name: "Слабый уровень активности", value: 1.375 },
                        { name: "Умеренный уровень активности", value: 1.55 }, 
                        { name: "Тяжелая активность", value: 1.7 },
                        { name: "Экстремальный уровень активности", value: 1.9}],
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
          return REG_EXP.test(value) || "Значение должно быть положительным числом и не содержать знаков!"
        }
      ],
      weightRules: [
        value => { const REG_EXP = /^\d*\.?\d+$/
          return REG_EXP.test(value) || "Значение должно быть положительным, корректным и, при необходимости, разделяться точкой!"
        }
      ],
      recomendedCalories: null,
      formIsValid: false,
      buttonIsClicked: false,
      arrOfParams: ["Пол", "Возраст", "Рост", "Вес", "Ур. активности"],
      arrOfValues: []
    }
  },

  actions: {
    deletePersonInfo() {
      this.gender = null;
      this.age = null;
      this.height = null;
      this.weight = null;
      this.choosedActivity = null;
      this.buttonIsClicked = false;
    },
    
    calculateRecomendedCalories() {
      this.buttonIsClicked = true;
      if (this.gender === "Мужчина") {
        this.recomendedCalories = Number((10 * this.weight + 6.25 * this.height - 5 * this.age + 5) * this.choosedActivity).toFixed(2); 
      }
      else {
        this.recomendedCalories = Number((10 * this.weight + 6.25 * this.height - 5 * this.age - 161) * this.choosedActivity).toFixed(2); 
      }
      const ARR_OF_PARAMS = ["gender", "age", "height", "weight", "choosedActivity"];
      for (let i = 0; i < ARR_OF_PARAMS.length; i++) {
        const CHOICE = ARR_OF_PARAMS[i];
        this.arrOfValues.push(this[CHOICE]);
      }
      const ACTIVITY_ID = this.levelOfActivity.findIndex((el) => el.value === this.arrOfValues[4]); //получаем не значение, а название
      this.arrOfValues[4] = this.levelOfActivity[ACTIVITY_ID].name;
    }
  },

  getters: {
    returnAgeHeightRule() { //совмещает общие правила и правила для роста/возраста
      return [...this.commonRules, ...this.ageHeightRules]
    },

    returnWeightRule() { //совмещает общие правила и правила для веса
      return [...this.commonRules, ...this.weightRules]
    },

    showInfo() { //отвечает за блокировку кнопки
      if (this.formIsValid && (this.gender !== null && this.choosedActivity !== null)) {
        return true;
      }
      else {
        return false;
      }
    },

    // requiredCalories() { //формула Миффлина-Сан Жеора
    //   if (this.gender === "male") {
    //     return Number((10 * this.weigth + 6.25 * this.height - 5 * this.age + 5) * this.choosedActivity).toFixed(2); 
    //   }
    //   else {
    //     return Number((10 * this.weigth + 6.25 * this.height - 5 * this.age - 161) * this.choosedActivity).toFixed(2); 
    //   }
    // }
  }
})