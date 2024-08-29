import { defineStore } from 'pinia'

export const useDateStore = defineStore('dateStore',{
  state: () => {
    return {
      switchedCurrentDate: null, //дата, использующаяся при "смене" недели
    }
  },

  actions: {
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

  }
})