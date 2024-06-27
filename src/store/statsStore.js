import { defineStore } from 'pinia'

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      startingDate: null, 
      endingDate: null,
      message: null, //переменная для уведомления пользователя
      showErrorCard: false, //переменная, которая отвечает за показ карточки с ошибками
      showSuccessCard: false
    }
  },

  actions: {
    showStatistics() {
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
          this.showErrorCard = false;
          this.showSuccessCard = true;
          this.message = `Были выбраны данные с ${this.startingDate} по ${this.endingDate}!`;
        }
      }
    }
  }
})