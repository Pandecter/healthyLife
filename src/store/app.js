import { defineStore } from 'pinia'

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
      mealTime: ["Завтрак", "Обед", "Ужин"],
      currentDate: {day: "Воскресенье", month: "Январь"},
      alternativeCurrentDate: null
    }
  },
  actions: {
    mountFunction() { //вызывается 1 раз при запуске приложения 
      const CURRENT_DATE = new Date();
      this.alternativeCurrentDate = CURRENT_DATE;
      this.currentDate.day = this.days[CURRENT_DATE.getDay() - 1];
      this.currentDate.month = this.months[CURRENT_DATE.getMonth()];
    },

    nextWeek() {
      let n = 7;
      let currentDate = this.alternativeCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() + n);
      this.alternativeCurrentDate = currentDate;
    },

    previousWeek() {
      let n = 7;
      let currentDate = this.alternativeCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - n);
      this.alternativeCurrentDate = currentDate;
    },

    zeroAdder(day, month) {
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return [day, month]
    }
  },
  getters: {
    giveAlternativeCurrentDate() { // показывает текущую дату вида: "дд.мм.гггг"
      const CUR_MONTH = this.alternativeCurrentDate.getMonth() + 1; 
      const CUR_DAY = this.alternativeCurrentDate.getDate();
      let arr = [];
      arr = this.zeroAdder(CUR_DAY, CUR_MONTH);
      return arr[0] + "." + arr[1] + "." + this.alternativeCurrentDate.getFullYear();
    },

    // giveCurrentWeek() {
    //   const START = this.alternativeCurrentDate.getDate() - this.alternativeCurrentDate.getDay();
    //   const END = this.alternativeCurrentDate.getDate() + this.alternativeCurrentDate.getDay();
    //   // const ARR = [];
    //   // ARR = this.zeroAdder(CUR_DAY, CUR_MONTH);
    //   return  
    // }
  }
})