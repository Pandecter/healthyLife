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
        @click.stop="productStore.drawer = !productStore.drawer"
      />
      <v-app-bar-title>
        ЗОЖ-Учёт
      </v-app-bar-title>
      <v-btn 
        icon="mdi-account"
        title="Ввести данные"
        @click="goToPersonPage()"
      />
    </v-app-bar>
    <v-main>
      <v-menu
        v-model="productStore.drawer"
        location="bottom"
      >
        <v-list>
          <v-list-item>
            <v-btn 
              variant="text"
              width="150"
              @click="goToStatsPage()"
            >
              Статистика
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn 
              variant="text"
              width="150"
              @click="goToBasePage()"
            >
              База данных
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu> 
      <div>
        <div class="d-flex justify-center">
          <v-card 
            variant="elevated" 
            class="mt-10 pb-6 pl-6 pr-6 elevation-4"
          >
            <p class="d-flex justify-center mt-16 text-h6">
              {{ productStore.giveCurrentWeek }}
            </p>
            <div class="d-flex justify-center mt-8">
              <v-btn 
                class="mr-2" 
                @click="productStore.previousWeek()"
              >
                Предыдущая
              </v-btn>
              <v-btn 
                class="ml-2" 
                @click="productStore.nextWeek()"
              >
                Следующая
              </v-btn>
            </div>
          </v-card>
        </div>
        <v-container 
          class="d-flex justify-space-between flex-column mt-6 w-100 h-100"
          transition="slide-x-transition"
        >
          <v-card 
            v-for="(day, indexOfDay) in productStore.days"
            :key="day"
            variant="outlined"
            width="100%"
            class="border-thin rounded-shaped elevation-2 mb-8"
          >
            <div class="d-flex justify-space-between">
              <v-card-title>
                {{ day }}
              </v-card-title>
              <v-card-subtitle class="mt-4">
                {{ productStore.giveCurrentDate[indexOfDay] }}
              </v-card-subtitle>
            </div>
            <v-card-actions>
              <v-btn
                :icon="productStore.isExpandable[indexOfDay] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="productStore.toggleDay(indexOfDay, productStore.giveCurrentDate[indexOfDay])"
              />
            </v-card-actions>
            <v-expand-transition>
              <div v-if="productStore.isExpandable[indexOfDay]">
                <v-expansion-panels 
                  v-for="(time, indexOfTime) in productStore.mealTime"
                  :key="time"
                >
                  <v-expansion-panel
                    :title="time"
                    class="rounded-0"
                  >
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
                              v-for="stat in productStore.listOfStats"
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
                                variant="text"
                                icon="mdi-delete-circle"
                                color="red"
                                @click="productStore.deleteFoodFromMealTime(element, indexOfTime, productStore.giveDateInDateType[indexOfDay])"
                              />
                            </v-col>
                          </v-row>
                          <hr class="mt-3">
                        </v-container>
                      </div>
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
                    </v-expansion-panel-text>
                  </v-expansion-panel> 
                </v-expansion-panels>
                <v-overlay
                  v-model="productStore.isOverlayActive"
                  class="d-flex justify-center align-center"
                >
                  <v-card 
                    width="130vh"
                    height="80vh"
                  >
                    <div class="d-flex justify-space-between mt-12 ml-16 mr-16">
                      <p class="text-h6 mt-2">
                        Ваш продукт:
                      </p>
                      <div class="w-50">
                        <v-autocomplete 
                          v-model="productStore.currentProductName"
                          label="Введите наименование продукта" 
                          :items="productStore.returnProductNames"
                          no-data-text="По данному запросу нет результатов"
                        />
                      </div>    
                    </div> 
                    <div class="d-flex justify-space-between mt-8 ml-16 mr-16">
                      <p class="text-h6 mt-2">
                        Количество продукта:
                      </p>
                      <div class="w-50">
                        <v-form v-model="productStore.isFormValid">
                          <v-text-field
                            v-model="productStore.currentCountValue"
                            :rules="productStore.inputCountRules" 
                            label="Введите количество в граммах"
                          />
                        </v-form>
                      </div>
                    </div>
                    <div 
                      v-if="productStore.isButtonAvailable"
                      class="d-flex justify-center align-center h-50"
                    >
                      <p 
                        class="text-h6 font-weight-light"
                      > 
                        Здесь будут отображены данные о продукте
                      </p>
                    </div>
                    <div 
                      v-else
                      class="h-50 pt-16"
                    >
                      <div class="d-flex justify-center pb-8">
                        <p class="text-h6">
                          Информация о выбранном продукте 
                        </p>
                      </div>
                      <hr>
                      <v-table>
                        <thead>
                          <tr>
                            <th class="text-left">
                              Название продукта
                            </th>
                            <th class="text-left">
                              Калории
                            </th>
                            <th class="text-left">
                              Белки
                            </th>
                            <th class="text-left">
                              Жиры
                            </th>
                            <th class="text-left">
                              Углеводы
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td 
                              v-for="stat in productStore.showInfoAboutProduct"
                              :key="stat.name"
                            >
                              {{ stat }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <hr>
                    </div>                         
                    <div class="d-flex justify-center">
                      <v-btn 
                        :disabled="productStore.isButtonAvailable"
                        @click="addToProductStore()"
                      > 
                        Добавить продукт 
                      </v-btn>
                    </div> 
                  </v-card>
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

export default {
  data() {
    return {
      productStore: useProductStore(),
      statsStore: useStatsStore(),
      currentDay: null,
      currentMealTime: null
    }
  },

  methods: {
    showOverlay(day, mealTime) { //необходимо для корректного добавления продуктов и открытия оверлея
      this.currentDay = day;
      this.currentMealTime = mealTime;
      this.productStore.isOverlayActive = true;
    },

    addToProductStore() {//необходимо для корректного добавления продуктов и закрытия оверлея
      this.productStore.addToProductList(this.currentDay, this.currentMealTime, this.productStore.showInfoAboutProduct);
      this.productStore.isOverlayActive = false;
    },

    goToPersonPage() {
      this.productStore.isExpandable.fill(false);
      this.$router.push('/person_info');
    },

    goToStatsPage() {
      this.$router.push('/stats');
      let end = this.productStore.giveDateInDateType[6];
      let start = this.productStore.giveDateInDateType[0];
      this.statsStore.startingDate = start;
      this.statsStore.endingDate = end;
      this.statsStore.showSuccessCard = false;
      this.statsStore.showErrorCard = false;
      this.productStore.isExpandable.fill(false);
    },

    // dateMaker(value) { //метод для адекватной "привязки" к полю с типом date
    //   value = value.split(""); //необходимо для преобразования string в array
    //   let year = value.splice(6, 4).join(''); //выбираем нужную часть даты и преобразуем ее в нужный формат 
    //   let month = value.splice(3, 2).join('');
    //   let day = value.splice(0, 2).join('');
    //   let result = year + "-" + month + "-" + day;
    //   return result;
    // },

    goToBasePage() {
      this.productStore.isExpandable.fill(false);
      this.$router.push('/base');
    }
  }
}
</script>@/store/productStore