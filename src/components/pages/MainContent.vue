<template>
  <v-app>
    <v-app-bar 
      absolute 
      app
    >
      <template #image>
        <v-img gradient="to top right, rgba(81, 217, 61,.9), rgba(141,216,125,.5)" />
      </template>
      <v-app-bar-nav-icon 
        variant="text"
        @click.stop="drawer = !drawer"
      />
      <v-app-bar-title>
        ЗОЖ-Учёт
      </v-app-bar-title>
      <v-btn 
        icon="mdi-account"
        title="Ввести данные"
        @click="goToPersonPage"
      />
    </v-app-bar>
    <v-main>
      <menu-component
        :drawer-value="drawer"
        @close-expandables="isExpandable.fill(false)"
      />
      <div>
        <week-changer-component 
          @expand-window="isExpandable.fill(false)"
        />
        <v-container 
          class="d-flex justify-space-between flex-column mt-6 w-100 h-100"
          transition="slide-x-transition"
        > 
          <v-card 
            v-for="(day, indexOfDay) in days"
            :key="day"
            variant="outlined"
            width="100%"
            class="border-thin rounded-shaped elevation-2 mb-8"
          >
            <div class="d-flex justify-space-between">
              <v-card-title>
                {{ day }}
                <v-icon 
                  v-if="productStore.isDayFilled[indexOfDay]"
                  icon="mdi-food-fork-drink"
                  color="success"
                  class="ml-2"
                  title="Вы внесли данные за этот день!"
                />
              </v-card-title>
              <v-card-subtitle class="mt-4">
                {{ productStore.giveCurrentDate[indexOfDay] }}
              </v-card-subtitle>
            </div>
            <v-card-actions>
              <v-btn
                :icon="isExpandable[indexOfDay] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="toggleDay(indexOfDay)"
              />
            </v-card-actions>
            <v-expand-transition>
              <div v-if="isExpandable[indexOfDay]">
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
                        v-if="productStore.isMealTimeFilled[indexOfDay][indexOfTime]"
                        icon="mdi-check-outline"
                        color="success"
                        class="ml-2"
                        title="Вы внесли данные за этот прием пищи!"
                      />
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div 
                        v-if="productStore.showInfo[indexOfDay][indexOfTime] === null"
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
                            v-for="element in productStore.showInfo[indexOfDay][indexOfTime]"
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
                                @click="productStore.deleteFoodFromMealTime(element, indexOfTime, productStore.giveDateInDateType[indexOfDay])"
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
                          @click="showOverlay(day, indexOfTime)"
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
                    :arr-of-days="days"
                    @switch-overlay="isOverlayActive = false"
                  />
                </v-overlay>
              </div>  
            </v-expand-transition>
          </v-card>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { useProductStore } from '@/store/productStore' 
import { useStatsStore } from '@/store/statsStore'
import WeekChangerComponent from '@/components/parts/WeekChanger.vue'
import MenuComponent from '@/components/parts/MenuComponent.vue'
import FoodCardComponent from '@/components/parts/AddFoodToTimeCard.vue'

export default {
  components: {
    WeekChangerComponent,
    MenuComponent,
    FoodCardComponent
  },
  
  data() {
    return {
      productStore: useProductStore(),
      statsStore: useStatsStore(),
      currentDay: null,
      currentMealTime: null,
      mealTime: ["Завтрак", "Обед", "Ужин"],
      days: ["Понедельник", "Вторник", 
             "Среда", "Четверг", 
             "Пятница", "Суббота", "Воскресенье"],
      listOfStats: ["Наименование", "Калорийность", "Белки",
      "Жиры", "Углеводы", "Удаление"],
      isExpandable: [false, false, false, false, false, false, false], //позволяет открывать/закрывать вкладки
      isOverlayActive: false, //активация/деактивация оверлея // переменная, которая нужна для корректной блокировки кнопки,
      drawer: false, //отвечает за открытие/закрытие меню наверху слева
    }
  },

  methods: {
    toggleDay(index) { //открывает/закрывает меню дня
      this.isExpandable[index] == false ? this.isExpandable[index] = true : this.isExpandable[index] = false;
    },

    showOverlay(day, mealTime) { //необходимо для корректного добавления продуктов и открытия оверлея
      this.currentDay = day;
      this.currentMealTime = mealTime;
      this.isOverlayActive = true;
    },

    goToPersonPage() {
      this.isExpandable.fill(false);
      this.$router.push('/person_info');
    },
  }
}
</script>