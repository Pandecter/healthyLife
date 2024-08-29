import { defineStore } from 'pinia'
import foodData from '../../datasets/food_base.json'
import { useProductBase } from './productBase';

const MEAL_TIME = ["Завтрак", "Обед", "Ужин"];
const STATS_OF_MEAL = ["calories", "proteins", "fats", "carbs"]

export const useProductStore = defineStore('products', {
  state: () => {
    return {
      switchedCurrentDate: null, //дата, использующаяся при "смене" недели
      listsOfDaysMenu: [], //хранилище продуктов, выбранных пользователем
      foodStorage: [], //хранилище данных по продуктах
      modalFilterRanges: { //диапазоны значения для v-range-sliders в оверлее добавления продукта в "съеденное"
        caloriesRange: null,
        proteinsRange: null,
        fatsRange: null,
        carbsRange: null
      },
      addedProducts: [] //переменная для добавления в localStorage
    }
  },

  actions: {
    mountFunction() { //вызывается 1 раз при запуске приложения 
      const productBase = useProductBase();

      const currenDate = new Date();
      this.switchedCurrentDate = currenDate;
      this.initMinMaxRange(); 

      this.foodStorage = [...foodData];
      if (localStorage.getItem("addedProducts")) { //если есть данные с localStorage
        this.addedProducts = (JSON.parse(localStorage.getItem("addedProducts")))
        this.foodStorage.push(...this.addedProducts);
      }
      productBase.shownArrayOfProducts = [...this.foodStorage];
    },

    initMinMaxRange() { /*!!!!!!функция-ЗАТЫЧКА, которая полностью копирует геттер findMinMaxRange, 
      но без нее данные только одним геттером в v-overlay почему-то не прогужаются !!!!!!*/
      let minMaxArr = [];
      const resultArr = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const choice = STATS_OF_MEAL[i];
        const arr = [...(this.foodStorage.map(obj => obj[choice]))];
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

    dateFormer(date) { //создает строку с датой в привычном для отображения виде
      let month = date.getMonth() + 1; 
      let day = date.getDate();

      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      const currenDate = new Date();
      const result = day + "." + month + "." + currenDate.getFullYear();
      return result;
    },

    dateTypeFormer(date){
      date = this.dateFormer(date); //переведем в привичный вид
      date = date.split(""); //необходимо для преобразования string в array
      let year = date.splice(6, 4).join(''); //выбираем нужную часть даты и преобразуем ее в нужный формат 
      let month = date.splice(3, 2).join('');
      let day = date.splice(0, 2).join('');
      let result = year + "-" + month + "-" + day;
      return result;
    },

    addToProductList(dayNumber, mealTime, food, arrOfDays) { //добавляет продукт в общий массив выбранных продуктов
      const dayId = arrOfDays.findIndex((el) => el === dayNumber);
      const currenDate = this.giveDateInDateType[dayId];
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
    giveCurrentWeek() { //показывает текущую неделю 
      const number = this.switchedCurrentDate.getDay();
      const currenDate = this.switchedCurrentDate;

      const startValue = new Date(currenDate.getFullYear(),  currenDate.getMonth(), currenDate.getDate() - (number === 0 ? 6 : number - 1));
      const startString = this.dateFormer(startValue);

      const endValue = new Date(currenDate.getFullYear(),  currenDate.getMonth(), currenDate.getDate() + (number === 0 ? 0 : 7 - number));
      const endString = this.dateFormer(endValue);
      
      return "Текущая неделя: " + startString + " - " + endString;
    },

    giveCurrentDate() { //отображает даты для дней недели
      const number = this.switchedCurrentDate.getDay();
      const currenDate = this.switchedCurrentDate;
      let startValue;
      let day = 0;
      const arr = [];
      while (day < 7) {
        startValue = new Date(currenDate.getFullYear(),  currenDate.getMonth(), currenDate.getDate() - number + 1 + day);
        startValue = this.dateFormer(startValue);
        arr[day] = startValue;
        day++;
      }
      return arr;
    },

    giveDateInDateType() { //выводит дату в том виде, в котором она хранится в text-field для типа date
      const number = this.switchedCurrentDate.getDay();
      const currenDate = this.switchedCurrentDate;
      let startValue;
      let day = 0;
      const arr = [];
      while (day < 7) {
        startValue = new Date(currenDate.getFullYear(),  currenDate.getMonth(), currenDate.getDate() - number + 1 + day);
        startValue = this.dateTypeFormer(startValue);
        arr[day] = startValue;
        day++;
      }
      return arr;
    },

    returnProductNames() { //выводит список продуктов в autocomplete
      const resArr = this.foodStorage.filter(value => this.filterFunc(value, this.modalFilterRanges.caloriesRange, 
                                              this.modalFilterRanges.proteinsRange, this.modalFilterRanges.fatsRange,
                                              this.modalFilterRanges.carbsRange));
      const arrOfNames = [];
      for (let i = 0; i < resArr.length; i++) {
        arrOfNames[i] = resArr[i].name;
      }
      return arrOfNames;
    },

    showInfo() {
      const shownArray = []; 
      const currenDate = this.giveDateInDateType; 
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

    findMinMaxRange() { //возращает максимальное/минимальное значение для слайдеров (отслеживает изменения в границах)
      const productBase = useProductBase();

      let minMaxArr = [];
      const resultArr = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const choice = STATS_OF_MEAL[i];
        const arr = [...(this.foodStorage.map(obj => obj[choice]))];
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
    
    isDayFilled() { //отображает "отмеченные" дни
      const resultArr = []; 
      for (let i = 0; i < this.giveDateInDateType.length; i++) {
        if (this.listsOfDaysMenu.find((el) => el.date === this.giveDateInDateType[i])) {
          resultArr[i] = true;
        }
        else {
          resultArr[i] = false;
        }
      }
      return resultArr;
    },

    isMealTimeFilled() {
      const resultArr = []; 
      for (let i = 0; i < this.giveDateInDateType.length; i++) {
        const foundDateId = this.listsOfDaysMenu.findIndex((el) => el.date === this.giveDateInDateType[i]);
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