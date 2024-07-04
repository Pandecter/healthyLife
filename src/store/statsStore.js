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
          backgroundColor: '#f87979',
          data: []
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      // testData: {
      //   labels: ["2024-06-31", "2024-07-01", "2024-07-02"], 
      //   datasets: [{
      //     label: 'Данные за период',
      //     backgroundColor: '#f87979',
      //     data: [553.1, 42, 441]
      //   }]
      // }
    }
  },

  actions: {
    showStatistics() {
      // this.chartData.datasets[0].data.length = 0;
      // this.chartData.labels.length = 0;
      // console.log(this.chartData.datasets[0].data);
      // console.log(this.chartData.labels);
      if ((this.startingDate === "") || (this.endingDate === "")) { //если данных нет, либо веденной даты не существует
        this.showErrorCard = true;
        this.showSuccessCard = false;
        this.message = "Дата либо не была введена, либо введена некорректно!"
      }
      else { // данные существуют, но могут быть некорректны для сравнения 
        if (this.startingDate >= this.endingDate) { //если дата начала "позднее" даты конца или равна ему
          if (this.startingDate === this.endingDate) { //один и тот же день выбран в обоих полях
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
          //console.log("ВСЕ ПРАВИЛА СОБЛЮДЕНЫ")
          this.showErrorCard = false;
          this.showSuccessCard = true;
          this.chartData.datasets[0].data = []; //обнуляем данные на каждый клик
          this.chartData.labels = [];
          const ARR_OF_MEAL_TIME = ["breakfast", "lunch", "dinner"];
          this.message = `Были выбраны данные с ${this.startingDate} по ${this.endingDate}!`;
          for (let i = 0; i < this.productStore.listsOfDaysMenu.length; i++) { //проходимся по всему массиву с добавленной едой
            if ((this.startingDate <= this.productStore.listsOfDaysMenu[i].date) &&
                (this.endingDate >= this.productStore.listsOfDaysMenu[i].date)) { //выбираем все подходящие под даты дни
              let calories = 0;
              for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
                const CHOICE = ARR_OF_MEAL_TIME[j];
                for (let k = 0; k < this.productStore.listsOfDaysMenu[i][CHOICE].length; k++) { //проходимся по всем продуктам в приеме
                  calories = calories + parseFloat(this.productStore.listsOfDaysMenu[i][CHOICE][k].calories);
                }
              }
              //console.log("ПОЧТИ ОПТРАВИЛИ!")
              this.chartData.datasets[0].data.push(calories);
             // console.log("Отправили данные по калориям!")
              this.chartData.labels.push(this.productStore.listsOfDaysMenu[i].date);
              //console.log("END")
            }
          }
          if (this.chartData.datasets.length > 1) {
            const DATA = this.personStore.recomendedCalories;
            for (let i = 0; i < this.chartData.labels.length; i++) {
              this.chartData.datasets[1].data[i] = DATA; //копируем значение для отображения линии
            }
          }
        }
      }
    }
  },
  // getters: {
  //   countLabels() {
  //     return this.chartData.labels.length;
  //   }
  // }
})