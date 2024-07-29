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
      const PRODUTC_BASE = useProductBase();

      const CURRENT_DATE = new Date();
      this.switchedCurrentDate = CURRENT_DATE;
      this.initMinMaxRange(); 

      this.foodStorage = [...foodData];
      if (localStorage.getItem("addedProducts")) { //если есть данные с localStorage
        this.addedProducts = (JSON.parse(localStorage.getItem("addedProducts")))
        this.foodStorage.push(...this.addedProducts);
      }
      PRODUTC_BASE.shownArrayOfProducts = [...this.foodStorage];
    },

    initMinMaxRange() { /*!!!!!!функция-ЗАТЫЧКА, которая полностью копирует геттер findMinMaxRange, 
      но без нее данные только одним геттером в v-overlay почему-то не прогужаются !!!!!!*/
      let minMaxArr = [];
      const RESULT_ARR = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const CHOICE = STATS_OF_MEAL[i];
        const ARR = [...(this.foodStorage.map(obj => obj[CHOICE]))];
        for (let j = 0; j < ARR.length; j++) {
          ARR[j] = ARR[j].replace(/,/g, '.'); //заменяем запятые на точки, т.к. parseFloat не воспринимает запятые
          ARR[j] = parseFloat(ARR[j]); //"удаляем" лишние слова, нам нужны только цифры
        }
        minMaxArr[0] = Math.min(...ARR);
        minMaxArr[1] = Math.max(...ARR);
        RESULT_ARR[i] = [...minMaxArr];
        minMaxArr = [];
      }
      this.modalFilterRanges.caloriesRange = [...RESULT_ARR[0]];
      this.modalFilterRanges.proteinsRange = [...RESULT_ARR[1]];
      this.modalFilterRanges.fatsRange = [...RESULT_ARR[2]];
      this.modalFilterRanges.carbsRange = [...RESULT_ARR[3]];
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
      const CURRENT_DATE = new Date();
      const RESULT = day + "." + month + "." + CURRENT_DATE.getFullYear();
      return RESULT;
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
      const DAY_ID = arrOfDays.findIndex((el) => el === dayNumber);
      const CURRENT_DATE = this.giveDateInDateType[DAY_ID];
      if (!(this.listsOfDaysMenu.find((el) => el.date === CURRENT_DATE))) { //если текущего дня нет в базе 
        const OBJECT = { "dayNumber": DAY_ID, "date": CURRENT_DATE, "breakfast": [],"lunch": [], "dinner": []};
        this.listsOfDaysMenu.push(OBJECT);
        this.addFoodToMealTime(CURRENT_DATE, mealTime, food);
      }
      else { //если текущий день уже есть в базе
        this.addFoodToMealTime(CURRENT_DATE, mealTime, food);
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
      const DAY_ID = this.listsOfDaysMenu.findIndex((el) => el.date === currentDate);
      switch(mealTime) {
        case 0:
          this.listsOfDaysMenu[DAY_ID].breakfast.push(food);
          break;
        case 1:
          this.listsOfDaysMenu[DAY_ID].lunch.push(food);
          break;
        case 2:
          this.listsOfDaysMenu[DAY_ID].dinner.push(food);
          break;
      }
    },

    deleteFoodFromMealTime(mealTimeMenu, mealTime, date) {
      const DAY_ID = this.listsOfDaysMenu.findIndex((el) => el.date === date); //получаем индекс дня в массиве
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
      const DELETING_ARR = this.listsOfDaysMenu[DAY_ID][nameOfMealTime]; //получаем массив времени приема пищи конкретной даты
      const MEAL_ID = DELETING_ARR.findIndex((el) => el.name === mealTimeMenu.name); //находим ID конкретного продукта
      DELETING_ARR.splice(MEAL_ID, 1);
      const MEAL_CHECK = this.listsOfDaysMenu[DAY_ID];
      if ((MEAL_CHECK.breakfast.length === 0) && (MEAL_CHECK.lunch.length === 0) && (MEAL_CHECK.dinner.length === 0)) { //если нет данных
        this.listsOfDaysMenu.splice(DAY_ID, 1);
      }
    },

    filterFunc(value, caloriesRange, proteinsRange, fatsRange, carbRange) { //функция фильтрации
      let changedValue = {...value};
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const CHOICE = STATS_OF_MEAL[i];
        changedValue[CHOICE] = changedValue[CHOICE].replace(/,/g, '.');
        changedValue[CHOICE] = parseFloat(changedValue[CHOICE]);
      }
      const CALORIES_CONDITION = (changedValue.calories >= caloriesRange[0]) && (changedValue.calories <= caloriesRange[1]);
      const PROTEINS_CONDITION = (changedValue.proteins >= proteinsRange[0]) && (changedValue.proteins <= proteinsRange[1]);
      const FATS_CONDITION = (changedValue.fats >= fatsRange[0]) && (changedValue.fats <= fatsRange[1]);
      const CARBS_CONDITION = (changedValue.carbs >= carbRange[0]) && (changedValue.carbs <= carbRange[1]);
      return (CALORIES_CONDITION && PROTEINS_CONDITION && FATS_CONDITION && CARBS_CONDITION);
    },
  },
  getters: {
    giveCurrentWeek() { //показывает текущую неделю 
      const NUMBER = this.switchedCurrentDate.getDay();
      const CURRENT_DATE = this.switchedCurrentDate;

      const START_VALUE = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - (NUMBER === 0 ? 6 : NUMBER - 1));
      const START_STRING = this.dateFormer(START_VALUE);

      const END_VALUE = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() + (NUMBER === 0 ? 0 : 7 - NUMBER));
      const END_STRING = this.dateFormer(END_VALUE);
      
      return "Текущая неделя: " + START_STRING + " - " + END_STRING;
    },

    giveCurrentDate() { //отображает даты для дней недели
      const NUMBER = this.switchedCurrentDate.getDay();
      const CURRENT_DATE = this.switchedCurrentDate;
      let startValue;
      let day = 0;
      const ARR = [];
      while (day < 7) {
        startValue = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - NUMBER + 1 + day);
        startValue = this.dateFormer(startValue);
        ARR[day] = startValue;
        day++;
      }
      return ARR;
    },

    giveDateInDateType() { //выводит дату в том виде, в котором она хранится в text-field для типа date
      const NUMBER = this.switchedCurrentDate.getDay();
      const CURRENT_DATE = this.switchedCurrentDate;
      let startValue;
      let day = 0;
      const ARR = [];
      while (day < 7) {
        startValue = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - NUMBER + 1 + day);
        startValue = this.dateTypeFormer(startValue);
        ARR[day] = startValue;
        day++;
      }
      return ARR;
    },

    returnProductNames() { //выводит список продуктов в autocomplete
      const RES_ARR = this.foodStorage.filter(value => this.filterFunc(value, this.modalFilterRanges.caloriesRange, 
                                              this.modalFilterRanges.proteinsRange, this.modalFilterRanges.fatsRange,
                                              this.modalFilterRanges.carbsRange));
      const ARR_OF_NAMES = [];
      for (let i = 0; i < RES_ARR.length; i++) {
        ARR_OF_NAMES[i] = RES_ARR[i].name;
      }
      return ARR_OF_NAMES;
    },

    showInfo() {
      const SHOWN_ARRAY = []; 
      const CURRENT_DATE = this.giveDateInDateType; 
      for (let i = 0; i < CURRENT_DATE.length; i++) { 
        const RESULT = this.listsOfDaysMenu.find((el) => el.date === CURRENT_DATE[i]) 
        if (typeof(RESULT) === "undefined") { //если полученный тип undefined, т.е. данных с такой датой найдено не было
          let tempArr = [];
          for (let j = 0; j < MEAL_TIME.length; j++) { 
            tempArr.push(null);
          }
          SHOWN_ARRAY.push(tempArr);
        }
        else { //если полученный тип (в RESULT) не undefined (т.е найденный объект)
          const SWITCH = ["breakfast", "lunch", "dinner"]; // массив, который пригодится для более компактной работы
          const TEMP_ARR = [];
          for (let j = 0; j < SWITCH.length; j++) { 
            const CHOICE = SWITCH[j]; 
            if (RESULT[CHOICE].length !== 0) { //если длина массива за прием пищи ненулевая (т.е. там есть данные о еде)
              TEMP_ARR.push(RESULT[CHOICE]);
            }
            else { //если длина массива нулевая (т.е. данные за прием пищи отсутствуют)
              TEMP_ARR.push(null);
            }
          }
          SHOWN_ARRAY.push(TEMP_ARR);
        }
      }
      return SHOWN_ARRAY;
    },

    findMinMaxRange() { //возращает максимальное/минимальное значение для слайдеров (отслеживает изменения в границах)
      const PRODUTC_BASE = useProductBase();

      let minMaxArr = [];
      const RESULT_ARR = [];
      for (let i = 0; i < STATS_OF_MEAL.length; i++) {
        const CHOICE = STATS_OF_MEAL[i];
        const ARR = [...(this.foodStorage.map(obj => obj[CHOICE]))];
      for (let j = 0; j < ARR.length; j++) {
          ARR[j] = ARR[j].replace(/,/g, '.'); //заменяем запятые на точки, т.к. parseFloat не воспринимает запятые
          ARR[j] = parseFloat(ARR[j]); //"удаляем" лишние слова, нам нужны только цифры
        }
        minMaxArr[0] = Math.min(...ARR);
        minMaxArr[1] = Math.max(...ARR);
        RESULT_ARR[i] = [...minMaxArr];
        minMaxArr = [];
      }

      PRODUTC_BASE.BaseFilterRanges.caloriesRange = [...RESULT_ARR[0]];
      PRODUTC_BASE.BaseFilterRanges.proteinsRange = [...RESULT_ARR[1]];
      PRODUTC_BASE.BaseFilterRanges.fatsRange = [...RESULT_ARR[2]];
      PRODUTC_BASE.BaseFilterRanges.carbsRange = [...RESULT_ARR[3]];

      this.modalFilterRanges.caloriesRange = [...RESULT_ARR[0]];
      this.modalFilterRanges.proteinsRange = [...RESULT_ARR[1]];
      this.modalFilterRanges.fatsRange = [...RESULT_ARR[2]];
      this.modalFilterRanges.carbsRange = [...RESULT_ARR[3]];

      //console.log(RESULT_ARR)

      return RESULT_ARR;
    },
    
    isDayFilled() { //отображает "отмеченные" дни
      const RESULT_ARR = []; 
      for (let i = 0; i < this.giveDateInDateType.length; i++) {
        if (this.listsOfDaysMenu.find((el) => el.date === this.giveDateInDateType[i])) {
          RESULT_ARR[i] = true;
        }
        else {
          RESULT_ARR[i] = false;
        }
      }
      return RESULT_ARR;
    },

    isMealTimeFilled() {
      const RESULT_ARR = []; 
      for (let i = 0; i < this.giveDateInDateType.length; i++) {
        const FOUND_DATE_ID = this.listsOfDaysMenu.findIndex((el) => el.date === this.giveDateInDateType[i]);
        const SUB_ARRAY = [];
        if (FOUND_DATE_ID !== -1) {
          const SWITCH = ["breakfast", "lunch", "dinner"];
          for (let j = 0; j < SWITCH.length; j++) {
            const CHOICE = SWITCH[j];
            if (this.listsOfDaysMenu[FOUND_DATE_ID][CHOICE].length !== 0) {
              SUB_ARRAY[j] = "success";
            }
            else {
              SUB_ARRAY[j] = false;
            }
          }
          RESULT_ARR.push(SUB_ARRAY);
        }
        else {
          for (let j = 0; j < MEAL_TIME.length; j++) {
            SUB_ARRAY[j] = false;
          }
          RESULT_ARR.push(SUB_ARRAY);
        }
      }
      return RESULT_ARR;
    },
  }
})