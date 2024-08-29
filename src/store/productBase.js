import { defineStore } from 'pinia'
import { useProductStore } from './productStore'

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
      const PRODUCT_STORE_ = useProductStore();
      
      let OBJECT = {
        name: nameValue, 
        calories: caloriesValue + " Ккал", 
        proteins: proteinsValue + " г",
        fats: fatsValue + " г",
        carbs: carbsValue + " г"
      }
      if (PRODUCT_STORE_.foodStorage.find((el) => el.name === nameValue)) {
        alert("Такой продукт уже есть в базе!")
      }
      else {
        PRODUCT_STORE_.addedProducts.push(OBJECT);
        localStorage.setItem("addedProducts", JSON.stringify(PRODUCT_STORE_.addedProducts)); 
        PRODUCT_STORE_.foodStorage.push(OBJECT);
        this.shownArrayOfProducts = [...PRODUCT_STORE_.foodStorage]
      }
    },

    applyFilters() { //вызов фильтрации
      const PRODUCT_STORE = useProductStore();

      this.shownArrayOfProducts = [...PRODUCT_STORE.foodStorage];
      this.shownArrayOfProducts = this.shownArrayOfProducts.filter(value => PRODUCT_STORE.filterFunc(value, 
                                                                   this.BaseFilterRanges.caloriesRange, 
                                                                   this.BaseFilterRanges.proteinsRange,
                                                                   this.BaseFilterRanges.fatsRange,
                                                                   this.BaseFilterRanges.carbsRange));
    }
  },
  getters: {
    returnProductNamesInBase() { //выводит список продуктов в autocomplete с учетом фильтров
      const ARR_OF_NAMES = [];

      for (let i = 0; i < this.shownArrayOfProducts.length; i++) {
        ARR_OF_NAMES[i] = this.shownArrayOfProducts[i].name;
      }
      return ARR_OF_NAMES;
    },

    returnShowedArray() { //вывод списка с учетом фильтров/поиска
      if (this.searchedProduct !== null) {
        const RESULT = this.shownArrayOfProducts.find((el) => el.name === this.searchedProduct);
        const ARR = [];
        ARR.push(RESULT)
        return ARR;
      }
      else {
        return this.shownArrayOfProducts;
      }
    },
  }
})