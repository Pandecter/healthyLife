import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { usePersonStore } from './personStore'  

const ARR_OF_MEAL_TIME = ["breakfast", "lunch", "dinner"];

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
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
      const personStore = usePersonStore();
      const productStore = useProductStore();

      let resArr = {
        labels: [], 
        datasets: [{
          label: 'Данные за период',
          backgroundColor: '#f5eb64',
          borderColor: '#f5eb64',
          data: []
        }]
      }
      this.message = `Данные с ${this.startingDate} по ${this.endingDate}!`;
      let currentDate = this.startingDate;
      let i = 0;
      while (currentDate <= this.endingDate) { 
        let calories = 0;
        while (i < productStore.listsOfDaysMenu.length && currentDate > productStore.listsOfDaysMenu[i].date) {
          i++;
        }
        if ((i < productStore.listsOfDaysMenu.length) && (currentDate === productStore.listsOfDaysMenu[i].date)) { //если такой день есть в списке
          for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
            const choice = ARR_OF_MEAL_TIME[j];
            for (let k = 0; k < productStore.listsOfDaysMenu[i][choice].length; k++) { //проходимся по всем продуктам в приеме
              calories = calories + parseFloat(productStore.listsOfDaysMenu[i][choice][k].calories);
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
        const caloriesData = personStore.recomendedCalories;
        for (let i = 0; i < resArr.labels.length; i++) {
          resArr.datasets[1].data[i] = caloriesData; //копируем значение для отображения линии
        }
      }
      return resArr;
    },

    returnExcess() { //возвращает значения превышения калорий
      const resArr = [];
      for (let i = 0; i < this.mutableChartData.labels.length; i++) {
        if (this.mutableChartData.datasets[0].data[i] > this.mutableChartData.datasets[1].data[i]) { //если есть превышение калорий
          const caloriesObject = {
            date: null,
            value: null
          }
          caloriesObject.date = this.mutableChartData.labels[i];
          caloriesObject.value = (this.mutableChartData.datasets[0].data[i] - this.mutableChartData.datasets[1].data[i]).toFixed(2);
          resArr.push(caloriesObject)
        } 
      }
      return resArr;
    },

    returnStats() { //возвращает сумму БЖУ + Калорий
      const productStore = useProductStore();
      const dataObject = {
        dates: null,
        calories: null,
        proteins: null,
        fats: null,
        carbs: null
      }
      let calsVal = 0;
      let protsVal = 0;
      let fatsVal = 0;
      let carbsVal = 0;
      for (let i = 0; i < this.mutableChartData.labels.length; i++) {
        if(productStore.listsOfDaysMenu.find((el) => el.date === this.mutableChartData.labels[i])) {
          let day = {...productStore.listsOfDaysMenu.find((el) => el.date === this.mutableChartData.labels[i])};
          for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
            const choice = ARR_OF_MEAL_TIME[j];
            for (let k = 0; k < day[choice].length; k++) { //проходимся по всем продуктам в приеме
              calsVal += parseFloat(day[choice][k].calories);
              protsVal += parseFloat((day[choice][k].proteins).replace(/,/g, '.'));
              fatsVal += parseFloat((day[choice][k].fats).replace(/,/g, '.'));
              carbsVal += parseFloat((day[choice][k].carbs).replace(/,/g, '.'));
            }
          }
        }
      } 
      dataObject.dates = "с " + this.startingDate + " по " + this.endingDate;
      dataObject.calories = calsVal;
      dataObject.proteins = protsVal;
      dataObject.fats = fatsVal;
      dataObject.carbs = carbsVal;
      return dataObject;
    }
  }
})