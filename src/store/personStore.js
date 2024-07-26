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
      const STATS_STORE = useStatsStore();
      
      this.gender = null;
      this.age = null;
      this.height = null;
      this.weight = null;
      this.choosedActivity = null;
      this.recomendedCalories = null;
      STATS_STORE.recomendedChart = null;
      this.arrOfValues = [];
    },
    
    calculateRecomendedCalories(level) { //расчет нормы калорий
      const STATS_STORE = useStatsStore();

      this.arrOfValues = [];
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
      const ACTIVITY_ID = level.findIndex((el) => el.value === this.arrOfValues[4]); //получаем не значение, а название
      this.arrOfValues[4] = level[ACTIVITY_ID].name;

      const DATASET = { //нужно для графика
        label: 'Норма калорий',
        backgroundColor: '#ff000d',
        borderColor: '#ff000d',
        data: []
      }
      STATS_STORE.recomendedChart = DATASET;
    }
  },

  getters: {
    isInfoIsNotFull() { //отвечает за отображение данных на странице статистики
      if (this.arrOfValues.length === 5) {
        return false;
      }
      else {
        return true;
      }
    }
  }
})