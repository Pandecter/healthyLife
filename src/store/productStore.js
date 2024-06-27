import { defineStore } from 'pinia'
import foodData from '../../datasets/food_base.json'

export const useProductStore = defineStore('products', {
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
        value => (value || '').length <= 5 || "Значение не должно превышать 5 цифр!",
        value => {if (value.startsWith(0)) 
                  return false || "Значение не может начинаться с нуля!"
                  else 
                  return true}
      ],
      currentCountValue: null, // количество продукта в граммах
      currentProductName: null, //наименование продукта,
      isFormValid: false, // переменная, которая нужна для корректной блокировки кнопки
      isOverlayActive: false,
      drawer: false,
      caloriesRange: null,
      proteinsRange: null,
      fatsRange: null,
      carbsRange: null, 
      searchedProduct: null, //продукт в поисковой строке базы 
      shownArrayOfProducts: null, //массив для отображения продуктов в базе с учетом фильтрации
      slidersDisabled: false,
      ruleForProductName: [
        value => !!value || "Название продукта не может быть пустым!",
        value => (value || '').length <= 40 || "Название продукта не должно превышать 40 символов!",
      ],
      rulesForCalories: [
        value => !!value || "Значение не может быть пустым!",
        value => {if (value.startsWith(0)) 
          return false || "Значение не может начинаться с нуля!"
          else 
          return true},
        value => !/^-.*/.test(value) || "Значение не должно быть отрицательным!",
        value => { const REG_EXP = /^[0-9]+$/
          return REG_EXP.test(value) || "Значение должно быть положительным числом и не содержать знаков!"
        },
        value => (value || '').length <= 4 || "Значение не должно превышать 4 цифр!",
      ],
      rulesForProductStats: [
        value => !!value || "Значение не может быть пустым!",
        value => {if (value.startsWith(0)) 
          return false || "Значение не может начинаться с нуля!"
          else 
          return true},
        value => !/^-.*/.test(value) || "Значение не должно быть отрицательным!",
        value => /^(\d+|\d+,\d{1})$/.test(value) || "Значение разделяйте запятой, после запятой может быть только 1 символ!",
        value => (value || '').length <= 5 || "Значение не должно превышать 5 символов!",
      ],
      addingFormIsValid: false
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
      this.shownArrayOfProducts = [...foodData];
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

    dateTypeFormer(date){
      date = this.dateFormer(date); //переведем в привичный вид
      date = date.split(""); //необходимо для преобразования string в array
      let year = date.splice(6, 4).join(''); //выбираем нужную часть даты и преобразуем ее в нужный формат 
      let month = date.splice(3, 2).join('');
      let day = date.splice(0, 2).join('');
      let result = year + "-" + month + "-" + day;
      return result;
    },

    toggleDay(index, date) { //открывает/закрывает меню дня
      this.isExpandable[index] == false ? this.isExpandable[index] = true : this.isExpandable[index] = false; 
      this.clickedDate = date; 
    },

    addToProductList(dayNumber, mealTime, food) { //добавляет продукт в общий массив выбранных продуктов
      const DAY_ID = this.days.findIndex((el) => el === dayNumber);
      const CURRENT_DATE = this.giveDateInDateType[DAY_ID];
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
      const DELETING_ARR = this.listsOfDaysMenu[DAY_ID][nameOfMealTime]; //получаем массив времени приема пищи конкретной даты
      const MEAL_ID = DELETING_ARR.findIndex((el) => el.name === mealTimeMenu.name); //находим ID конкретного продукта
      DELETING_ARR.splice(MEAL_ID, 1);
      const MEAL_CHECK = this.listsOfDaysMenu[DAY_ID];
      if((MEAL_CHECK.breakfast.length === 0) && (MEAL_CHECK.lunch.length === 0) && (MEAL_CHECK.dinner.length === 0)) { //если нет данных
        this.listsOfDaysMenu.splice(DAY_ID, 1);
      }
    },

    applyFilters() { //вызов фильтрации
      this.shownArrayOfProducts = [...this.foodStorage];
      this.shownArrayOfProducts = this.shownArrayOfProducts.filter(this.filterFunc);
    },

    filterFunc(value) { //функция фильтрации
      const STATS = ["calories", "proteins", "fats", "carbs"];
      let changedValue = {...value};
      for (let i = 0; i < STATS.length; i++) {
        const CHOICE = STATS[i];
        changedValue[CHOICE] = changedValue[CHOICE].replace(/,/g, '.');
        changedValue[CHOICE] = parseFloat(changedValue[CHOICE]);
      }
      const CALORIES_CONDITION = (changedValue.calories >= this.caloriesRange[0]) && (changedValue.calories <= this.caloriesRange[1]);
      const PROTEINS_CONDITION = (changedValue.proteins >= this.proteinsRange[0]) && (changedValue.proteins <= this.proteinsRange[1]);
      const FATS_CONDITION = (changedValue.fats >= this.fatsRange[0]) && (changedValue.fats <= this.fatsRange[1]);
      const CARBS_CONDITION = (changedValue.carbs >= this.carbsRange[0]) && (changedValue.carbs <= this.carbsRange[1]);
      return (CALORIES_CONDITION && PROTEINS_CONDITION && FATS_CONDITION && CARBS_CONDITION);
    },

    addProductToList(nameValue, caloriesValue, proteinsValue, fatsValue, carbsValue) { //добавление продукта в базу
      let OBJECT = {
        name: nameValue, 
        calories: caloriesValue + " Ккал", 
        proteins: proteinsValue + " г",
        fats: fatsValue + " г",
        carbs: carbsValue + " г"
      }
      if (this.foodStorage.find((el) => el.name === nameValue)) {
        alert("Такой продукт уже есть в базе!")
      }
      else {
        this.foodStorage.push(OBJECT);
        this.isOverlayActive = false;
        this.shownArrayOfProducts = [...this.foodStorage]
      }
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
      const ARR_OF_NAMES = [];
      for (let i = 0; i < this.foodStorage.length; i++) {
        ARR_OF_NAMES[i] = this.foodStorage[i].name;
      }
      return ARR_OF_NAMES;
    },

    returnProductNamesInBase() { //выводит список продуктов в autocomplete с учетом фильтров
      const ARR_OF_NAMES = [];
      for (let i = 0; i < this.shownArrayOfProducts.length; i++) {
        ARR_OF_NAMES[i] = this.shownArrayOfProducts[i].name;
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
        const CHOICE = STATS[i];
        PRODUCT[CHOICE] = PRODUCT[CHOICE].replace(/,/g, '.');
        PRODUCT[CHOICE] = Number(PRODUCT[CHOICE].replace(/[^0-9.]+/g,""));
        PRODUCT[CHOICE] = (PRODUCT[CHOICE] * (this.currentCountValue / 100)).toFixed(2);
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
      const CURRENT_DATE = this.giveDateInDateType; 
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

    findMinMaxRange() { //возращает максимальное/минимальное значение для слайдеров
      const SWITCH = ["calories", "proteins", "fats", "carbs"];
      const MIN_MAX_ARR = [];
      const RESULT_ARR = [];
      for (let i = 0; i < SWITCH.length; i++) {
        const CHOICE = SWITCH[i];
        const ARR = [...(this.foodStorage.map(obj => obj[CHOICE]))];
        for (let j = 0; j < ARR.length; j++) {
          ARR[j] = ARR[j].replace(/,/g, '.'); //заменяем запятые на точки, т.к. parseFloat не воспринимает запятые
          ARR[j] = parseFloat(ARR[j]); //"удаляем" лишние слова, нам нужны только цифры
        }
        MIN_MAX_ARR[0] = Math.min(...ARR);
        MIN_MAX_ARR[1] = Math.max(...ARR);
        RESULT_ARR[i] = [...MIN_MAX_ARR];
        MIN_MAX_ARR.length = 0;
      }
      this.caloriesRange = RESULT_ARR[0];
      this.proteinsRange = RESULT_ARR[1];
      this.fatsRange = RESULT_ARR[2];
      this.carbsRange = RESULT_ARR[3];
      return RESULT_ARR;
    },
    
    returnShowedArray() { //вывод списка с учетом фильтров
      if (this.searchedProduct !== null) {
        const RESULT = this.shownArrayOfProducts.find((el) => el.name === this.searchedProduct);
        const ARR = [];
        ARR.push(RESULT)
        this.slidersDisabled = true;
        return ARR;
      }
      else {
        this.slidersDisabled = false;
        return this.shownArrayOfProducts;
      }
    }
    
  }
})