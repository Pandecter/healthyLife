import { defineStore } from 'pinia'
import foodData from '../../datasets/food_base.json'

export const useProductStore = defineStore('app', {
  state: () => {
    return {
      months: ["Январь", "Февраль", "Март",
               "Апрель", "Май", "Июнь",
               "Июль", "Август", "Сентябрь",
               "Октябрь", "Ноябрь", "Декабрь"], 
      days: ["Понедельник", "Вторник", 
             "Среда", "Четверг", 
             "Пятница", "Суббота", "Воскресенье"],
      listOfStats: ["Наименование", "Калорийность", "Белки",
                    "Жиры", "Углеводы", "Удаление"],
      isExpandable: [false, false, false, false, false, false, false], //переменная, которая отвечает за расширение вкладок
      mealTime: ["Завтрак", "Обед", "Ужин"],
      currentDate: {day: null, month: null},
      alternativeCurrentDate: null, //текущая дата в более "удобном" виде 
      switchedCurrentDate: null, //дата, использующаяся при "смене" недели
      clickedDate: null, //дата дня, с которой работает пользователь
      listsOfDaysMenu: [], //хранилище продуктов, выбранных пользователем
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
      isFormValid: false, // переменная, которая нужна для корректной блокировки кнопки
      isOverlayActive: false
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
      this.isExpandable.fill(false)
    },

    previousWeek() { // метод для переключения на предыдущую неделю относительно текущей даты пользователя
      const WEEK = 7;
      let currentDate = this.switchedCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - WEEK);
      this.switchedCurrentDate = currentDate;
      this.isExpandable.fill(false)
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
      const RESULT = day + "." + month + "." + this.alternativeCurrentDate.getFullYear();
      return RESULT;
    },

    toggleDay(index, date) { //открывает/закрывает меню дня
      this.isExpandable[index] == false ? this.isExpandable[index] = true : this.isExpandable[index] = false; 
      this.clickedDate = date; 
    },

    addToProductList(dayNumber, mealTime, food) { //добавляет продукт в общий массив выбранных продуктов
      const DAY_ID = this.days.findIndex((el) => el === dayNumber);
      const CURRENT_DATE = this.giveCurrentDate[DAY_ID];
      if (!(this.listsOfDaysMenu.find((el) => el.date === CURRENT_DATE))) { //если текущего дня нет в базе 
        const OBJECT = { "dayNumber": DAY_ID, "date": CURRENT_DATE, "breakfast": [],"lunch": [], "dinner": []};
        this.listsOfDaysMenu.push(OBJECT);
        this.addFoodToMealTime(CURRENT_DATE, mealTime, food);    
      }
      else { //если текущий день уже есть в базе
        this.addFoodToMealTime(CURRENT_DATE, mealTime, food);
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
      const DELETING_ARR = this.listsOfDaysMenu[DAY_ID][nameOfMealTime]; //получаем массив времени приемащ пищи конкретной даты
      const MEAL_ID = DELETING_ARR.findIndex((el) => el.name === mealTimeMenu.name); //находим ID конкретного продукта
      DELETING_ARR.splice(MEAL_ID, 1);
    }
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
      const ARR = [];
      while (day < 7) {
        startValue = new Date(CURRENT_DATE.getFullYear(),  CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - NUMBER + 1 + day);
        startValue = this.dateFormer(startValue);
        ARR[day] = startValue;
        day++;
      }
      return ARR;
    },

    returnProductNames() { //выводит список продуктов в autocomplete
      const ARR_OF_NAMES = [];
      for (let i = 0; i < this.foodStorage.length; i++) {
        ARR_OF_NAMES[i] = this.foodStorage[i].name;
      }
      return ARR_OF_NAMES;
    },

    isButtonAvailable() { //отвечает за блокировку/разблокировку кнопки
      if (this.isFormValid && this.currentProductName != null) {
        this.showModalInfo = true;
        return false;
      }
      else {
        this.showModalInfo = false;
        return true;
      }
    },

    actualProductCounter() { //высчитывает количество "состава" с учетом количества продукта
      const STATS = ["calories", "proteins", "fats", "carbs"];
      const PRODUCT = {...this.foodStorage.find((el) => el.name === this.currentProductName) };
      for (let i = 0; i < STATS.length; i++) {
        let choice = STATS[i];
        PRODUCT[choice] = PRODUCT[choice].replace(/,/g, '.');
        PRODUCT[choice] = Number(PRODUCT[choice].replace(/[^0-9.]+/g,""));
        PRODUCT[choice] = (PRODUCT[choice] * (this.currentCountValue / 100)).toFixed(2);
      } 
      return PRODUCT;
    },
    
    showInfoAboutProduct() { //вывод информации о продукте
      let info = this.actualProductCounter;
      info.calories = info.calories + " Ккал";
      info.proteins = info.proteins + " г";
      info.fats = info.fats + " г";
      info.carbs = info.carbs + " г";
      return info;
    },

    showInfo() {
      const SHOWN_ARRAY = []; 
      const CURRENT_DATE = this.giveCurrentDate; 
      for (let i = 0; i < CURRENT_DATE.length; i++) { 
        const RESULT = this.listsOfDaysMenu.find((el) => el.date === CURRENT_DATE[i]) 
        if (typeof(RESULT) === "undefined") { //если полученный тип undefined, т.е. данных с такой датой найдено не было
          let tempArr = [];
          for (let j = 0; j < this.mealTime.length; j++) { 
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
  }
})