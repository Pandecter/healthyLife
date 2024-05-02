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
      alternativeCurrentDate: null,
      start: null,
      end: null
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
      const WEEK = 7;
      let currentDate = this.alternativeCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() + WEEK);
      this.alternativeCurrentDate = currentDate;
    },

    previousWeek() {
      const WEEK = 7;
      let currentDate = this.alternativeCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - WEEK);
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
      const ARR = this.zeroAdder(CUR_DAY, CUR_MONTH);
      return ARR[0] + "." + ARR[1] + "." + this.alternativeCurrentDate.getFullYear();
    },

    giveCurrentWeek() {
      const NUMBER = this.alternativeCurrentDate.getDay();
      let currentDate = this.alternativeCurrentDate;

      let startV = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - NUMBER + 1);
      let startDay = startV.getDate();
      let startMonth = startV.getMonth() + 1;
      const ARR_START = this.zeroAdder(startDay, startMonth);
      const START_STRING = ARR_START[0] + "." + ARR_START[1] + "." + startV.getFullYear();

      const endV = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() + NUMBER - 1);
      let endDay = endV.getDate();
      let endMonth = endV.getMonth() + 1;
      const ARR_END = this.zeroAdder(endDay, endMonth);
      const END_STRING = ARR_END[0] + "." + ARR_END[1] + "." + endV.getFullYear();
      
      return "Текущая неделя: " + START_STRING + " - " + END_STRING;
    }
  }
})