import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { usePersonStore } from './personStore'  

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      personStore: usePersonStore(),
      productStore: useProductStore(),
      startingDate: null, //начальная дата на странице статистики
      endingDate: null, //конечная дата на странице статистики
      message: null, //переменная для уведомления пользователя
      recomendedChart: null, //данные о "норме калорий" пользователя
      chartOptions: { //опции для графика
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },

  getters: {
    mutableChartData() { //отправляет данные для графика
      let resArr = {
        labels: [], 
        datasets: [{
          label: 'Данные за период',
          backgroundColor: '#f5eb64',
          borderColor: '#f5eb64',
          data: []
        }]
      }
      const ARR_OF_MEAL_TIME = ["breakfast", "lunch", "dinner"];
      this.message = `Данные с ${this.startingDate} по ${this.endingDate}!`;
      let currentDate = this.startingDate;
      let i = 0;
      while (currentDate <= this.endingDate) { 
        let calories = 0;
        while (i < this.productStore.listsOfDaysMenu.length && currentDate > this.productStore.listsOfDaysMenu[i].date) {
          i++;
        }
        if ((i < this.productStore.listsOfDaysMenu.length) && (currentDate === this.productStore.listsOfDaysMenu[i].date)) { //если такой день есть в списке
          for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
            const CHOICE = ARR_OF_MEAL_TIME[j];
            for (let k = 0; k < this.productStore.listsOfDaysMenu[i][CHOICE].length; k++) { //проходимся по всем продуктам в приеме
              calories = calories + parseFloat(this.productStore.listsOfDaysMenu[i][CHOICE][k].calories);
            }
          }
          resArr.datasets[0].data.push(calories);
          resArr.labels.push(currentDate);
        }
        else { //если такого дня нет, то добавим 0 калорий
          resArr.datasets[0].data.push(calories);
          resArr.labels.push(currentDate);
        }
        let dateObj = new Date(currentDate); //переводим в тип Date чтоб можно было "прибавить" день
        dateObj.setDate(dateObj.getDate() + 1);
        currentDate = dateObj.toISOString().split('T')[0] //возвращаем к исходному типу 
      } 

      if (this.recomendedChart !== null) { //если есть данные о пользователе
        resArr.datasets.push(this.recomendedChart)
        const DATA = this.personStore.recomendedCalories;
        for (let i = 0; i < resArr.labels.length; i++) {
          resArr.datasets[1].data[i] = DATA; //копируем значение для отображения линии
        }
      }
      return resArr;
    },

    returnExcess() { //возвращает значения превышения калорий
      const RES_ARR = [];
      for (let i = 0; i < this.mutableChartData.labels.length; i++) {
        if (this.mutableChartData.datasets[0].data[i] > this.mutableChartData.datasets[1].data[i]) { //если есть превышение калорий
          const OBJECT = {
            date: null,
            value: null
          }
          OBJECT.date = this.mutableChartData.labels[i];
          OBJECT.value = (this.mutableChartData.datasets[0].data[i] - this.mutableChartData.datasets[1].data[i]).toFixed(2);
          RES_ARR.push(OBJECT)
        } 
      }
      return RES_ARR;
    },

    returnStats() { //возвращает сумму БЖУ + Калорий
      const OBJECT = {
        dates: null,
        calories: null,
        proteins: null,
        fats: null,
        carbs: null
      }
      const ARR_OF_MEAL_TIME = ["breakfast", "lunch", "dinner"];
      let calsVal = 0;
      let protsVal = 0;
      let fatsVal = 0;
      let carbsVal = 0;
      for (let i = 0; i < this.mutableChartData.labels.length; i++) {
        if(this.productStore.listsOfDaysMenu.find((el) => el.date === this.mutableChartData.labels[i])) {
          let day = {...this.productStore.listsOfDaysMenu.find((el) => el.date === this.mutableChartData.labels[i])};
          for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
            const CHOICE = ARR_OF_MEAL_TIME[j];
            for (let k = 0; k < day[CHOICE].length; k++) { //проходимся по всем продуктам в приеме
              calsVal += parseFloat(day[CHOICE][k].calories);
              protsVal += parseFloat((day[CHOICE][k].proteins).replace(/,/g, '.'));
              fatsVal += parseFloat((day[CHOICE][k].fats).replace(/,/g, '.'));
              carbsVal += parseFloat((day[CHOICE][k].carbs).replace(/,/g, '.'));
            }
          }
        }
      } 
      OBJECT.dates = "с " + this.startingDate + " по " + this.endingDate;
      OBJECT.calories = calsVal;
      OBJECT.proteins = protsVal;
      OBJECT.fats = fatsVal;
      OBJECT.carbs = carbsVal;
      return OBJECT;
    }
  }
})