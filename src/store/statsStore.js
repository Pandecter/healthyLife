import { defineStore } from 'pinia'
import { useProductStore } from './productStore'
import { usePersonStore } from './personStore'

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      personStore: usePersonStore(),
      productStore: useProductStore(),
      startingDate: null, 
      endingDate: null,
      message: null, //переменная для уведомления пользователя
      showErrorCard: false, //переменная, которая отвечает за показ карточки с ошибками
      showSuccessCard: false,
      chartData: {
        labels: [], 
        datasets: [{
          label: 'Данные за период',
          backgroundColor: '#f5eb64',
          borderColor: '#f5eb64',
          data: []
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },

  actions: {
    showStatistics(start, end) {
      this.startingDate = null;
      this.endingDate = null;
      console.log(start)
      if ((start === null || start === "") || (end === null) || (end === "")) { //если данных нет, либо веденной даты не существует
        this.showErrorCard = true;
        this.showSuccessCard = false;
        this.message = "Дата не была введена или такой даты не существует!"
      }
      else { // данные существуют, но могут быть некорректны для сравнения 
        if (start >= end) { //если дата начала "позднее" даты конца или равна ему
          if (start === end) { //один и тот же день выбран в обоих полях
            this.showErrorCard = true;
            this.showSuccessCard = false;
            this.message = "Нельзя отобразить статистику менее чем за 2 дня!"
          }
          else { //старт позже конца
            this.showErrorCard = true;
            this.showSuccessCard = false;
            this.message = "Начальная дата не может быть раньше даты окончания!"
          }
        }
        else { //все правила соблюдены
          this.startingDate = start;
          this.endingDate = end;
          this.showErrorCard = false;
          this.showSuccessCard = true;
          //console.log(this.chartData.datasets[0].data)
        }
      }
    }
  },
  getters: {
    mutableChartData() {
      //this.chartData.datasets[0].data = []; //обнуляем данные на каждый клик
      //this.chartData.labels = [];
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
        if((i < this.productStore.listsOfDaysMenu.length) && (currentDate === this.productStore.listsOfDaysMenu[i].date)) { //если такой день есть в списке
          for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
            const CHOICE = ARR_OF_MEAL_TIME[j];
            for (let k = 0; k < this.productStore.listsOfDaysMenu[i][CHOICE].length; k++) { //проходимся по всем продуктам в приеме
              calories = calories + parseFloat(this.productStore.listsOfDaysMenu[i][CHOICE][k].calories);
            }
          }
          resArr.datasets[0].data.push(calories);
          resArr.labels.push(currentDate);
          i++;
        }
        else { //если такого дня нет, то добавим 0 калорий
          resArr.datasets[0].data.push(calories);
          resArr.labels.push(currentDate);
        }
        let dateObj = new Date(currentDate); //переводим в тип Date чтоб можно было "прибавить" день
        dateObj.setDate(dateObj.getDate() + 1);
        currentDate = dateObj.toISOString().split('T')[0] //возвращаем к исходному типу 
      } 

      if (resArr.datasets.length > 1) {
        const DATA = this.personStore.recomendedCalories;
        for (let i = 0; i < resArr.labels.length; i++) {
          resArr.datasets[1].data[i] = DATA; //копируем значение для отображения линии
        }
      }
      return resArr;
    },

  }
})