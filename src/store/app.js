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


    addToProductList(dayNumber, mealTime, food) {
      const DAY_ID = this.days.findIndex((el) => el === dayNumber);
      let currentDate = this.giveCurrentDate[DAY_ID];

      if (!(this.listsOfDaysMenu.find((el) => el.date === currentDate))) { //если текущего дня нет в базе 
        //console.log("НЕТ В БАЗЕ, сначала создадим, а потом вызовем аддфуд");
        const OBJECT = { "dayNumber": DAY_ID, "date": currentDate, "breakfast": [],"lunch": [], "dinner": []};
        this.listsOfDaysMenu.push(OBJECT);
        this.addFoodToMealTime(currentDate, mealTime, food);    
      }
      else { //если текущий день уже есть в базе
        if(this.listsOfDaysMenu.find((el) => el.date === currentDate)) {
          //console.log("ЕСТЬ В БАЗЕ, просто вызовем аддфуд");
          this.addFoodToMealTime(currentDate, mealTime, food);
        }
      }
      
    },

    addFoodToMealTime(currentDate, mealTime, food) {
      const DAY_ID = this.listsOfDaysMenu.findIndex((el) => el.date === currentDate);
      //console.log(DAY_ID)
      switch(mealTime) {
        case "Завтрак":
          this.listsOfDaysMenu[DAY_ID].breakfast.push(food);
          break;
        case "Обед":
          this.listsOfDaysMenu[DAY_ID].lunch.push(food);
          break;
        case "Ужин":
          this.listsOfDaysMenu[DAY_ID].dinner.push(food);
          break;
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

    returnProductNames() { //выводит список продуктов в autocomplete
      let arrOfNames = [];
      for (let i = 0; i < this.foodStorage.length; i++) {
        arrOfNames[i] = this.foodStorage[i].name;
      }
      return arrOfNames;
    },

    isButtonAvailable() { //отвечает блокировку/разблокировку кнопки
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
      let stats = ["calories", "proteins", "fats", "carbs"];
      let product = {...this.foodStorage.find((el) => el.name === this.currentProductName) };
      for (let i = 0; i < stats.length; i++) {
        let choice = stats[i];
        product[choice] = product[choice].replace(/,/g, '.');
        product[choice] = Number(product[choice].replace(/[^0-9.]+/g,""));
        product[choice] = (product[choice] * (this.currentCountValue / 100)).toFixed(2);
      } 
      return product;
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
      let shownArray = []; //возвращаемый массив
      let currentDate = this.giveCurrentDate; // получаем массив выбранных дат
      console.log("CURRENT_DATE: " + currentDate);
      for (let i = 0; i < currentDate.length; i++) { //проходимся по всему массиву дат
        let result = this.listsOfDaysMenu.find((el) => el.date === currentDate[i]) //присваиваем результат поиска даты в массиве меню
        console.log("RESULT: " + result);
        if (typeof(result) === "undefined") { //если полученный тип undefined, т.е. данных с такой датой найдено не было
          console.log("ДАННЫХ С ДАТОЙ " + currentDate[i] + " НЕ БЫЛО!");
          let tempArr = [];
          for (let j = 0; j < this.mealTime.length; j++) { //проходимся 3 раза в соответствии с распорядком (завтрак/обед/ужин)
            console.log("ИНИЦИИРУЕМ НЕТ ДАННЫХ ПЕРЕДАЧУ");
            tempArr.push("Нет данных")
            //shownArray[i][j] = "Нет данных"; //заносим данные во все j-ые поля i-го дня т.к. такого дня в базе нет
          }
          shownArray.push(tempArr);
        }
        else { //если полученный тип (в result) не undefined (т.е найденный объект)
          console.log("ДАННЫЕ С ДАТОЙ " + currentDate[i] + "БЫЛИ!");
          const SWITCH = ["breakfast", "lunch", "dinner"]; // массив, который пригодится для более компактной работы
          let tempArr = [];
          for(let j = 0; j < SWITCH.length; j++) { //проходимся по всему массиву SWITCH
            const CHOICE = SWITCH[j]; //выбираем j-ый элемент массива SWITCH
            console.log("ТЕКУЩИЙ ВЫБОР: " + CHOICE);
            if(result[CHOICE].length !== 0) { //если длина массива за прием пищи ненулевая (т.е там есть данные о еде)
              console.log("ЗА ДАТУ " + currentDate[i] + "И ПРИЕМ ПИЩИ " + CHOICE +"ЕСТЬ ДАННЫЕ. ЭТО: " + result[CHOICE]);
              tempArr.push(result[CHOICE]);
              //shownArray[i][j] = result[CHOICE]; //заносим данные в массив
            }
            else { //если длина массива нулевая (т. е. данные за прием пищи отсутствуют)
              console.log("ЗА ДАТУ " + currentDate[i] + "И ПРИЕМ ПИЩИ " + CHOICE + "НЕТ ДАННЫХ")
              tempArr.push("Нет данных");
              //shownArray[i][j] = "Нет данных";
            }
          }
          shownArray.push(tempArr);
        }
      }
      return shownArray;
    }
  }
})