import { defineStore } from 'pinia'
import { useStatsStore } from './statsStore'

export const usePersonStore = defineStore('person', {
  state: () => {
    return {
      gender: null,
      age: null,
      height: null,
      weight: null,
      choosedActivity: null,
      recomendedCalories: null,
      arrOfValues: [] //необходимо для хранения и обработки введенных значений
    }
  },

  actions: {
    deletePersonInfo() { //удаление информации о пользователе
      const statsStore = useStatsStore();
      
      this.gender = null;
      this.age = null;
      this.height = null;
      this.weight = null;
      this.choosedActivity = null;
      this.recomendedCalories = null;
      statsStore.recomendedChart = null;
      this.arrOfValues = [];
    },
    
    calculateRecomendedCalories(level) { //расчет нормы калорий
      const statsStore = useStatsStore();

      this.arrOfValues = [];
      if (this.gender === "Мужчина") {
        this.recomendedCalories = Number((10 * this.weight + 6.25 * this.height - 5 * this.age + 5) * this.choosedActivity).toFixed(2); 
      }
      else {
        this.recomendedCalories = Number((10 * this.weight + 6.25 * this.height - 5 * this.age - 161) * this.choosedActivity).toFixed(2); 
      }
      const arrOfParams = ["gender", "age", "height", "weight", "choosedActivity"];
      for (let i = 0; i < arrOfParams.length; i++) {
        const choice = arrOfParams[i];
        this.arrOfValues.push(this[choice]);
      }
      const activityId = level.findIndex((el) => el.value === this.arrOfValues[4]); //получаем не значение, а название
      this.arrOfValues[4] = level[activityId].name;

      const dataset = { //нужно для графика
        label: 'Норма калорий',
        backgroundColor: '#ff000d',
        borderColor: '#ff000d',
        data: []
      }
      statsStore.recomendedChart = dataset;
    }
  },

  getters: {
    isInfoIsNotFull() { //отвечает за отображение данных на странице статистики
      return !(this.arrOfValues.length === 5)
    }
  }
})