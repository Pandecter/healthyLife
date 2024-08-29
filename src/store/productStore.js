import { defineStore } from 'pinia'
import foodData from '../../datasets/food_base.json'
import { useProductBase } from './productBase';
import { useDateStore } from './dateStore';
import { useRangeStore } from './rangeStore';

const MEAL_TIME = ["Завтрак", "Обед", "Ужин"];

export const useProductStore = defineStore('products', {
  state: () => {
    return {
      listsOfDaysMenu: [], //хранилище продуктов, выбранных пользователем
      foodStorage: [], //хранилище данных по продуктах
      addedProducts: [] //переменная для добавления в localStorage
    }
  },

  actions: {
    mountFunction() { //вызывается 1 раз при запуске приложения 
      const productBase = useProductBase();
      const dateStore = useDateStore();
      const rangeStore = useRangeStore();

      const currenDate = new Date();
      dateStore.switchedCurrentDate = currenDate;
      rangeStore.initMinMaxRange(); 

      this.foodStorage = [...foodData];
      if (localStorage.getItem("addedProducts")) { //если есть данные с localStorage
        this.addedProducts = (JSON.parse(localStorage.getItem("addedProducts")))
        this.foodStorage.push(...this.addedProducts);
      }
      productBase.shownArrayOfProducts = [...this.foodStorage];
    },

    addToProductList(dayNumber, mealTime, food, arrOfDays) { //добавляет продукт в общий массив выбранных продуктов
      const dateStore = useDateStore();

      const dayId = arrOfDays.findIndex((el) => el === dayNumber);
      const currenDate = dateStore.giveDateInDateType[dayId];
      if (!(this.listsOfDaysMenu.find((el) => el.date === currenDate))) { //если текущего дня нет в базе 
        const OBJECT = { "dayNumber": dayId, "date": currenDate, "breakfast": [],"lunch": [], "dinner": []};
        this.listsOfDaysMenu.push(OBJECT);
        this.addFoodToMealTime(currenDate, mealTime, food);
      }
      else { //если текущий день уже есть в базе
        this.addFoodToMealTime(currenDate, mealTime, food);
      }
      this.listsOfDaysMenu.sort(this.compareFunction);
    },

    compareFunction(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      else {
        return  1;
      }
    },

    addFoodToMealTime(currentDate, mealTime, food) { //добавляет продукт в конкретный прием пищи
      const dayId = this.listsOfDaysMenu.findIndex((el) => el.date === currentDate);
      switch(mealTime) {
        case 0:
          this.listsOfDaysMenu[dayId].breakfast.push(food);
          break;
        case 1:
          this.listsOfDaysMenu[dayId].lunch.push(food);
          break;
        case 2:
          this.listsOfDaysMenu[dayId].dinner.push(food);
          break;
      }
    },

    deleteFoodFromMealTime(mealTimeMenu, mealTime, date) {
      const dayId = this.listsOfDaysMenu.findIndex((el) => el.date === date); //получаем индекс дня в массиве
      let nameOfMealTime;
      switch(mealTime) { //необходим для обращения к полю 
        case 0:
          nameOfMealTime = "breakfast";
          break;
        case 1:
          nameOfMealTime = "lunch";
          break;
        case 2:
          nameOfMealTime = "dinner";
          break; 
      }
      const deletingArr = this.listsOfDaysMenu[dayId][nameOfMealTime]; //получаем массив времени приема пищи конкретной даты
      const mealId = deletingArr.findIndex((el) => el.name === mealTimeMenu.name); //находим ID конкретного продукта
      deletingArr.splice(mealId, 1);
      const mealCheck = this.listsOfDaysMenu[dayId];
      if ((mealCheck.breakfast.length === 0) && (mealCheck.lunch.length === 0) && (mealCheck.dinner.length === 0)) { //если нет данных
        this.listsOfDaysMenu.splice(dayId, 1);
      }
    },
  },

  getters: {
    returnProductNames() { //выводит список продуктов в autocomplete
      const rangeStore = useRangeStore();

      const resArr = this.foodStorage.filter(value => rangeStore.filterFunc(value, rangeStore.modalFilterRanges.caloriesRange, 
                                              rangeStore.modalFilterRanges.proteinsRange, rangeStore.modalFilterRanges.fatsRange,
                                              rangeStore.modalFilterRanges.carbsRange));
      const arrOfNames = [];
      for (let i = 0; i < resArr.length; i++) {
        arrOfNames[i] = resArr[i].name;
      }
      return arrOfNames;
    },

    showInfo() {
      const dateStore = useDateStore();

      const shownArray = []; 
      const currenDate = dateStore.giveDateInDateType; 
      for (let i = 0; i < currenDate.length; i++) { 
        const result = this.listsOfDaysMenu.find((el) => el.date === currenDate[i]) 
        if (typeof(result) === "undefined") { //если полученный тип undefined, т.е. данных с такой датой найдено не было
          let tempArr = [];
          for (let j = 0; j < MEAL_TIME.length; j++) { 
            tempArr.push(null);
          }
          shownArray.push(tempArr);
        }
        else { //если полученный тип (в result) не undefined (т.е найденный объект)
          const mealTimeSwitch = ["breakfast", "lunch", "dinner"]; // массив, который пригодится для более компактной работы
          const tempArr = [];
          for (let j = 0; j < mealTimeSwitch.length; j++) { 
            const choice = mealTimeSwitch[j]; 
            if (result[choice].length !== 0) { //если длина массива за прием пищи ненулевая (т.е. там есть данные о еде)
              tempArr.push(result[choice]);
            }
            else { //если длина массива нулевая (т.е. данные за прием пищи отсутствуют)
              tempArr.push(null);
            }
          }
          shownArray.push(tempArr);
        }
      }
      return shownArray;
    },
    
    isDayFilled() { //отображает "отмеченные" дни
      const dateStore = useDateStore();

      const resultArr = []; 
      for (let i = 0; i < dateStore.giveDateInDateType.length; i++) {
        if (this.listsOfDaysMenu.find((el) => el.date === dateStore.giveDateInDateType[i])) {
          resultArr[i] = true;
        }
        else {
          resultArr[i] = false;
        }
      }
      return resultArr;
    },

    isMealTimeFilled() {
      const dateStore = useDateStore();

      const resultArr = []; 
      for (let i = 0; i < dateStore.giveDateInDateType.length; i++) {
        const foundDateId = this.listsOfDaysMenu.findIndex((el) => el.date === dateStore.giveDateInDateType[i]);
        const subArray = [];
        if (foundDateId !== -1) {
          const mealTimeSwitch = ["breakfast", "lunch", "dinner"];
          for (let j = 0; j < mealTimeSwitch.length; j++) {
            const choice = mealTimeSwitch[j];
            if (this.listsOfDaysMenu[foundDateId][choice].length !== 0) {
              subArray[j] = "success";
            }
            else {
              subArray[j] = false;
            }
          }
          resultArr.push(subArray);
        }
        else {
          for (let j = 0; j < MEAL_TIME.length; j++) {
            subArray[j] = false;
          }
          resultArr.push(subArray);
        }
      }
      return resultArr;
    },
  }
})