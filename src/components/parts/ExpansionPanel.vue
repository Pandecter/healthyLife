<template>
  <v-expand-transition>
    <div v-if="arrOfExpandables[dayIndex]">
      <v-expansion-panels 
        v-for="(time, indexOfTime) in mealTime"
        :key="time"
      >
        <v-expansion-panel
          class="rounded-0"
        >
          <v-expansion-panel-title>
            {{ time }}
            <v-icon
              v-if="productStore.isMealTimeFilled[dayIndex][indexOfTime]"
              icon="mdi-check-outline"
              color="success"
              class="ml-2"
              title="Вы внесли данные за этот прием пищи!"
            />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div 
              v-if="productStore.showInfo[dayIndex][indexOfTime] === null"
              class="d-flex justify-center font-weight-light"
            > 
              Нет продуктов
            </div>
            <div v-else>
              <v-container>
                <v-row class="mb-2 font-weight-bold">
                  <v-col 
                    v-for="stat in listOfStats"
                    :key="stat"
                    class=""
                  >
                    {{ stat }}
                  </v-col>
                </v-row>
                <hr class="mb-3">
                <v-row
                  v-for="element in productStore.showInfo[dayIndex][indexOfTime]"
                  :key="element.name"
                  class="pa-2"
                >
                  <v-col 
                    v-for="property in element"
                    :key="property.name"
                    class="d-flex align-center"
                  >
                    {{ property }}
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-btn 
                      title="Удалить продукт"
                      color="red"
                      variant="tonal"
                      @click="productStore.deleteFoodFromMealTime(element, indexOfTime, dateStore.giveDateInDateType[dayIndex])"
                    >
                      Удалить 
                    </v-btn>
                  </v-col>
                </v-row>
                <hr class="mt-3">
              </v-container>
            </div>
            <div class="d-flex justify-center">
              <v-btn
                variant="outlined"
                class="mt-4"
                @click="showOverlay(choosedDay, indexOfTime)"
              >
                Добавить продукт
                <v-icon 
                  icon="mdi-plus-circle-outline" 
                  class="ml-2"
                  size="large"
                  color="success"
                />
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel> 
      </v-expansion-panels>
      <v-overlay
        v-model="isOverlayActive"
        class="d-flex justify-center align-center"
      >
        <food-card-component
          :cur-day="currentDay"
          :cur-meal-time="currentMealTime"
          :arr-of-days="arrayOfDays"
          @switch-overlay="isOverlayActive = false"
        />
      </v-overlay>
    </div>  
  </v-expand-transition>
</template>

<script>
import { useProductStore } from '../../store/productStore'
import FoodCardComponent from '../parts/AddFoodToTimeCard.vue'
import { useDateStore } from '@/store/dateStore'

export default {
  components: {
    FoodCardComponent
  },

  props: {
    arrOfExpandables: {
      type: Array,
      required: true
    },

    dayIndex: {
      type: Number,
      required: true
    },

    arrayOfDays: {
      type: Array,
      required: true
    },

    choosedDay: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      productStore: useProductStore(),
      dateStore: useDateStore(),
      currentDay: null,
      currentMealTime: null,
      mealTime: ["Завтрак", "Обед", "Ужин"],
      listOfStats: ["Наименование", "Калорийность", "Белки",
      "Жиры", "Углеводы", "Удаление"],
      isOverlayActive: false, //активация/деактивация оверлея // переменная, которая нужна для корректной блокировки кнопки
    }
  },

  methods: {
    showOverlay(day, mealTime) { //необходимо для корректного добавления продуктов и открытия оверлея
      this.currentDay = day;
      this.currentMealTime = mealTime;
      this.isOverlayActive = true;
    }
  }
}
</script>