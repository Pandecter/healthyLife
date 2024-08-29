import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { useRangeStore } from './rangeStore'

export const useProductBase = defineStore('productBase', {
  state: () => {
    return {
      searchedProduct: null, //продукт в поисковой строке базы
      shownArrayOfProducts: null, //массив для отображения продуктов в базе с учетом фильтрации
      BaseFilterRanges: { //диапазоны значения для v-range-sliders на странице БД
        caloriesRange: null,
        proteinsRange: null,
        fatsRange: null,
        carbsRange: null
      },
    }
  },
  actions: {
    addProductToList(nameValue, caloriesValue, proteinsValue, fatsValue, carbsValue) { //добавление продукта в базу
      const productStore = useProductStore();
      
      let OBJECT = {
        name: nameValue, 
        calories: caloriesValue + " Ккал", 
        proteins: proteinsValue + " г",
        fats: fatsValue + " г",
        carbs: carbsValue + " г"
      }
      if (productStore.foodStorage.find((el) => el.name === nameValue)) {
        alert("Такой продукт уже есть в базе!")
      }
      else {
        productStore.addedProducts.push(OBJECT);
        localStorage.setItem("addedProducts", JSON.stringify(productStore.addedProducts)); 
        productStore.foodStorage.push(OBJECT);
        this.shownArrayOfProducts = [...productStore.foodStorage]
      }
    },

    applyFilters() { //вызов фильтрации
      const productStore = useProductStore();
      const rangeStore = useRangeStore();

      this.shownArrayOfProducts = [...productStore.foodStorage];
      this.shownArrayOfProducts = this.shownArrayOfProducts.filter(value => rangeStore.filterFunc(value, 
                                                                   this.BaseFilterRanges.caloriesRange, 
                                                                   this.BaseFilterRanges.proteinsRange,
                                                                   this.BaseFilterRanges.fatsRange,
                                                                   this.BaseFilterRanges.carbsRange));
    }
  },
  getters: {
    returnProductNamesInBase() { //выводит список продуктов в autocomplete с учетом фильтров
      const arrOfNames = [];

      for (let i = 0; i < this.shownArrayOfProducts.length; i++) {
        arrOfNames[i] = this.shownArrayOfProducts[i].name;
      }
      return arrOfNames;
    },

    returnShowedArray() { //вывод списка с учетом фильтров/поиска
      const field = ['calories', 'proteins', 'fats', 'carbs']
      let returnedArr = this.shownArrayOfProducts.map(product => { return {...product }});
      for (let i = 0; i < returnedArr.length; i++) { //проходим по всему массиву данных
        for (let j = 0; j < field.length; j++) { //проходим по каждому (кроме имени) полю объекта массива
          const choice = field[j];
          returnedArr[i][choice] = returnedArr[i][choice].replace(/,/g, '.');
          returnedArr[i][choice] = parseFloat(returnedArr[i][choice]);
        }
      }
      if (this.searchedProduct !== null) {
        const result = returnedArr.find((el) => el.name === this.searchedProduct);
        const arr = [];
        arr.push(result)
        return arr;
      }
      else {
        return returnedArr;
      }
    },
  }
})