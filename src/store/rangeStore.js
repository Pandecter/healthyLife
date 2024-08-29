import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { useProductBase } from './productBase'

const STATS_OF_MEAL = ["calories", "proteins", "fats", "carbs"]

export const useRangeStore = defineStore('rangeStore',{
  state: () => {
    return {
      modalFilterRanges: { //диапазоны значения для v-range-sliders в оверлее добавления продукта в "съеденное"
        caloriesRange: null,
        proteinsRange: null,
        fatsRange: null,
        carbsRange: null
      },
    }
  },

  actions: {
    initMinMaxRange() { 
      const productStore = useProductStore();

      let minMaxArr = [];
      const resultArr = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const choice = STATS_OF_MEAL[i];
        const arr = [...(productStore.foodStorage.map(obj => obj[choice]))];
        for (let j = 0; j < arr.length; j++) {
          arr[j] = arr[j].replace(/,/g, '.'); //заменяем запятые на точки, т.к. parseFloat не воспринимает запятые
          arr[j] = parseFloat(arr[j]); //"удаляем" лишние слова, нам нужны только цифры
        }
        minMaxArr[0] = Math.min(...arr);
        minMaxArr[1] = Math.max(...arr);
        resultArr[i] = [...minMaxArr];
        minMaxArr = [];
      }
      this.modalFilterRanges.caloriesRange = [...resultArr[0]];
      this.modalFilterRanges.proteinsRange = [...resultArr[1]];
      this.modalFilterRanges.fatsRange = [...resultArr[2]];
      this.modalFilterRanges.carbsRange = [...resultArr[3]];
    }, 

    filterFunc(value, caloriesRange, proteinsRange, fatsRange, carbRange) { //функция фильтрации
      let changedValue = {...value};
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const choice = STATS_OF_MEAL[i];
        changedValue[choice] = changedValue[choice].replace(/,/g, '.');
        changedValue[choice] = parseFloat(changedValue[choice]);
      }
      const caloriesCondition = (changedValue.calories >= caloriesRange[0]) && (changedValue.calories <= caloriesRange[1]);
      const proteinsCondition = (changedValue.proteins >= proteinsRange[0]) && (changedValue.proteins <= proteinsRange[1]);
      const fatsCondition = (changedValue.fats >= fatsRange[0]) && (changedValue.fats <= fatsRange[1]);
      const carbsCondition = (changedValue.carbs >= carbRange[0]) && (changedValue.carbs <= carbRange[1]);
      return (caloriesCondition && proteinsCondition && fatsCondition && carbsCondition);
    },
  },

  getters: {
    findMinMaxRange() { //возращает максимальное/минимальное значение для слайдеров (отслеживает изменения в границах)
      const productBase = useProductBase();
      const productStore = useProductStore();

      let minMaxArr = [];
      const resultArr = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const choice = STATS_OF_MEAL[i];
        const arr = [...(productStore.foodStorage.map(obj => obj[choice]))];
      for (let j = 0; j < arr.length; j++) {
          arr[j] = arr[j].replace(/,/g, '.'); //заменяем запятые на точки, т.к. parseFloat не воспринимает запятые
          arr[j] = parseFloat(arr[j]); //"удаляем" лишние слова, нам нужны только цифры
        }
        minMaxArr[0] = Math.min(...arr);
        minMaxArr[1] = Math.max(...arr);
        resultArr[i] = [...minMaxArr];
        minMaxArr = [];
      }

      productBase.BaseFilterRanges.caloriesRange = [...resultArr[0]];
      productBase.BaseFilterRanges.proteinsRange = [...resultArr[1]];
      productBase.BaseFilterRanges.fatsRange = [...resultArr[2]];
      productBase.BaseFilterRanges.carbsRange = [...resultArr[3]];

      this.modalFilterRanges.caloriesRange = [...resultArr[0]];
      this.modalFilterRanges.proteinsRange = [...resultArr[1]];
      this.modalFilterRanges.fatsRange = [...resultArr[2]];
      this.modalFilterRanges.carbsRange = [...resultArr[3]];

      return resultArr;
    },
  }
})