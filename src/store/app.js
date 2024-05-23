import { defineStore } from 'pinia'
import foodData from '../../datasets/food_base.json'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      months: ["Январь", "Февраль", "Март",
               "Апрель", "Май", "Июнь",
               "Июль", "Август", "Сентябрь",
               "Октябрь", "Ноябрь", "Декабрь"], 
      days: ["Понедельник", "Вторник", 
             "Среда", "Четверг", 
             "Пятница", "Суббота", "Воскресенье"],
      isExpandable: [false, false, false, false, false, false, false], //переменная, которая отвечает за расширение вкладок
      mealTime: ["Завтрак", "Обед", "Ужин"],
      currentDate: {day: null, month: null},
      alternativeCurrentDate: null, //текущая дата
      switchedCurrentDate: null, //дата, использующаяся при "смене" недели
      clickedDate: null, //дата дня, с которой работает пользователь
      listsOfDaysMenu: [],
      foodStorage: [], //хранилище данных по продуктах
      inputCountRules: [ //валидация для поля ввода массы продукта
        value => !!value || "Значение не может быть пустым!",
        value => { const REG_EXP = /^[0-9]+$/
                   return REG_EXP.test(value) || "Значение должно быть положительным числом!"
        },
        value => (value || '').length <= 10 || "Значение не должно превышать 10 цифр!",
        value => {if (value.startsWith(0)) 
                  return false || "Значение не может начинаться с нуля!"
                  else 
                  return true}
      ],
      currentCountValue: null, // количество продукта в граммах
      currentProductName: null, //наименование продукта,
      isFormValid: false // переменная, которая нужна для корректной блокировки кнопки
    }
  },
  actions: {
    mountFunction() { //вызывается 1 раз при запуске приложения 
      const CURRENT_DATE = new Date();
      this.alternativeCurrentDate = CURRENT_DATE;
      this.switchedCurrentDate = CURRENT_DATE;
      this.currentDate.day = this.days[CURRENT_DATE.getDay() - 1];
      this.currentDate.month = this.months[CURRENT_DATE.getMonth()];

      this.foodStorage = [...foodData];
    },

    nextWeek() { // метод для переключения на следующую неделю относительно текущей даты пользователя
      const WEEK = 7;
      let currentDate = this.switchedCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() + WEEK);
      this.switchedCurrentDate = currentDate;
    },

    previousWeek() { // метод для переключения на предыдущую неделю относительно текущей даты пользователя
      const WEEK = 7;
      let currentDate = this.switchedCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - WEEK);
      this.switchedCurrentDate = currentDate;
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
      let result = day + "." + month + "." + this.alternativeCurrentDate.getFullYear();
      return result;
    },

    toggleDay(index, date) { //открывает/закрывает меню дня
      this.isExpandable[index] == false ? this.isExpandable[index] = true : this.isExpandable[index] = false; 
      this.clickedDate = date; 
    },

    selectProduct() {
      alert("SELECTED");
    }
    // inputCount(value) {
      
    // }

    // addProductList(dayNumber, mealNumber) {
    //   if (this.listsOfDaysMenu.findIndex((el) => el === dayNumber)) { //если текущий день уже есть в базе

    //   }
    //   else { //если текущего дня нет в базе
    //     let object = { dayNumber: {"breakfast": [],"lunch": [], "dinner": []}};
    //     this.listsOfDaysMenu.push(object);

    //   }
    // },

    // addFoodToMealTime(dayNumber, mealNumber, foodName) {
    //   const DAY_ID = this.listsOfDaysMenu.findIndex((el) => el === dayNumber)
    //   switch(mealNumber) {
    //     case "Завтрак":
    //       this.listsOfDaysMenu[DAY_ID].breakfast.push(foodName);
    //       break;
    //     case "Обед":
    //       this.listsOfDaysMenu[DAY_ID].lunch.push(foodName);
    //       break;
    //     case "Ужин":
    //       this.listsOfDaysMenu[DAY_ID].dinner.push(foodName);
    //       break;
    //   }
    // }
  },
  getters: {
    giveAlternativeCurrentDate() { // показывает текущую дату 
      const RESULT_DATA = this.dateFormer(this.alternativeCurrentDate);
      return RESULT_DATA;
    },

    giveCurrentWeek() { //показывает текущую неделю 
      const NUMBER = this.switchedCurrentDate.getDay();
      const CURRENT_DATE = this.switchedCurrentDate;

      const START_VALUE = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - NUMBER + 1);
      const START_STRING = this.dateFormer(START_VALUE);

      const END_VALUE = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() + NUMBER - 1);
      const END_STRING = this.dateFormer(END_VALUE);
      
      return "Текущая неделя: " + START_STRING + " - " + END_STRING;
    },

    giveCurrentDate() { //отображает даты для дней недели
      const NUMBER = this.switchedCurrentDate.getDay();
      const CURRENT_DATE = this.switchedCurrentDate;
      let startValue;
      let day = 0;
      let arr = [];
      while (day < 7) {
        startValue = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - NUMBER + 1 + day);
        startValue = this.dateFormer(startValue);
        arr[day] = startValue;
        day++;
      }
      return arr;
    },

    returnProductNames() {
      let arrOfNames = [];
      for (let i = 0; i < this.foodStorage.length; i++) {
        arrOfNames[i] = this.foodStorage[i].name;
      }
      return arrOfNames;
    },

    isButtonAvailable() {
      if(this.isFormValid && this.currentProductName != null) {
        return false;
      }
      else {
        return true;
      }
    },

    showInfoAboutProduct() {
      
    }

    // showResultedProducts() {

    // }
  }
})