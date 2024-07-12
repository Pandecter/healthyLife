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
      if ((this.startingDate === "") || (this.endingDate === "")) { //если данных нет, либо веденной даты не существует
        this.showErrorCard = true;
        this.showSuccessCard = false;
        this.message = "Дата не была введена или такой даты не существует!"
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
          this.chartData.datasets[0].data = []; //обнуляем данные на каждый клик
          this.chartData.labels = [];
          const ARR_OF_MEAL_TIME = ["breakfast", "lunch", "dinner"];
          this.message = `Данные с ${this.startingDate} по ${this.endingDate}!`;
          let currentDate = this.startingDate;
          let i = 0;
          while (currentDate < this.endingDate) { 
            let calories = 0;
            //console.log(this.productStore.listsOfDaysMenu[i].date)
            if((i < this.productStore.listsOfDaysMenu.length) && (currentDate === this.productStore.listsOfDaysMenu[i].date)) { //если такой день есть в списке
              for (let j = 0; j < ARR_OF_MEAL_TIME.length; j++) { //проходимся по всем приемам пищи
                const CHOICE = ARR_OF_MEAL_TIME[j];
                for (let k = 0; k < this.productStore.listsOfDaysMenu[i][CHOICE].length; k++) { //проходимся по всем продуктам в приеме
                  calories = calories + parseFloat(this.productStore.listsOfDaysMenu[i][CHOICE][k].calories);
                }
              }
              this.chartData.datasets[0].data.push(calories);
              this.chartData.labels.push(currentDate);
              //console.log(i)
              i++;
            }
            else { //если такого дня нет, то добавим 0 калорий
              this.chartData.datasets[0].data.push(calories);
              this.chartData.labels.push(currentDate);
            }
            let dateObj = new Date(currentDate); //переводим в тип Date чтоб можно было "прибавить" день
            dateObj.setDate(dateObj.getDate() + 1);
            currentDate = dateObj.toISOString().split('T')[0] //возвращаем к исходному типу 
          } 
          if (this.productStore.listsOfDaysMenu.length < 2) {
            this.showErrorCard = true;
            this.showSuccessCard = false;
            this.message = "Недостаточно данных для корректного отображения статистики!";
          }
          else {
            this.showErrorCard = false;
            this.showSuccessCard = true;
            if (this.chartData.datasets.length > 1) {
              const DATA = this.personStore.recomendedCalories;
              for (let i = 0; i < this.chartData.labels.length; i++) {
                this.chartData.datasets[1].data[i] = DATA; //копируем значение для отображения линии
              }
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