<template>
  <v-app>
    <v-app-bar 
      absolute 
      app
    >
      <template #image>
        <v-img gradient="to top right, rgba(81, 217, 61,.9), rgba(141,216,125,.5)" />
      </template>
      <v-btn
        variant="plain"
        icon="mdi-keyboard-backspace"
        title="Вернуться на главную"
        @click="goToMainPage()"
      />
      <v-app-bar-title>
        База данных продуктов
        <v-tooltip text="Вся информация в базе представлена на 100 гр. продукта">
          <template #activator="{ props }">
            <v-icon 
              v-bind="props" 
              icon="mdi-information-variant" 
            />
          </template>
        </v-tooltip>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="d-flex justify-center mt-8">
        <v-btn
          @click="showOverlay"
        >
          Добавить свой продукт в базу данных
        </v-btn>
        <v-overlay
          v-model="productStore.isOverlayActive"
          class="d-flex justify-center align-center"
        >
          <v-card
            width="130vh"
            height="80vh"
          >
            <div class="d-flex flex-column align-center mt-8">
              <v-form v-model="productStore.addingFormIsValid">
                <p class="text-h6">
                  Введите наименование продукта
                </p>
                <v-text-field
                  v-model="name" 
                  :rules="productStore.ruleForProductName" 
                />
                <p class="text-h6">
                  Введите количество ккал на 100 гр. продукта
                </p>
                <v-text-field
                  v-model="calories" 
                  :rules="productStore.rulesForCalories"
                />
                <p class="text-h6">
                  Введите количество белков на 100 гр. продукта
                </p>
                <v-text-field
                  v-model="proteins" 
                  :rules="productStore.rulesForProductStats"
                />
                <p class="text-h6">
                  Введите количество жиров на 100 гр. продукта
                </p>
                <v-text-field
                  v-model="fats"
                  :rules="productStore.rulesForProductStats"
                />
                <p class="text-h6">
                  Введите количество углеводов на 100 гр. продукта
                </p>
                <v-text-field
                  v-model="carbs"
                  :rules="productStore.rulesForProductStats"
                />
              </v-form> 
              
              <v-btn 
                :disabled="!productStore.addingFormIsValid"
                @click="productStore.addProductToList(name, calories, proteins, fats, carbs)"
              >
                Подтвердить
              </v-btn>
            </div>
          </v-card>
        </v-overlay>
      </div>
      <v-card 
        class="mt-8 mb-8" 
        variant="tonal"
      >
        <v-card-text>
          <v-autocomplete 
            v-model="productStore.searchedProduct"
            label="Введите наименование продукта" 
            :items="productStore.returnProductNamesInBase"
            no-data-text="По данному запросу нет результатов"
          />
        </v-card-text>
        <div class="d-flex justify-space-around">
          <p>Калории</p>
          <p>Белки</p>
          <p>Жиры</p>
          <p>Углеводы</p>
        </div>
        <div class="d-flex justify-space-around">
          <v-range-slider 
            v-model="productStore.BaseFilterRanges.caloriesRange"
            :min="productStore.findMinMaxRange[0][0]"
            :max="productStore.findMinMaxRange[0][1]"
            :disabled="productStore.slidersDisabled"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.BaseFilterRanges.proteinsRange"
            :min="productStore.findMinMaxRange[1][0]"
            :max="productStore.findMinMaxRange[1][1]"
            :disabled="productStore.slidersDisabled"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.BaseFilterRanges.fatsRange"
            :min="productStore.findMinMaxRange[2][0]"
            :max="productStore.findMinMaxRange[2][1]"
            :disabled="productStore.slidersDisabled" 
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.BaseFilterRanges.carbsRange"
            :min="productStore.findMinMaxRange[3][0]"
            :max="productStore.findMinMaxRange[3][1]"
            :disabled="productStore.slidersDisabled" 
            max-width="300px"
            thumb-label="always"
          />
        </div>
        <div class="d-flex justify-center mb-6 mt-6">
          <v-btn
            :disabled="productStore.slidersDisabled" 
            @click="productStore.applyFilters()"
          >
            Применить
          </v-btn>
        </div>
        <div class="d-flex justify-center mb-4 text-h6">
          Найдено продуктов: {{ productStore.shownArrayOfProducts.length }}
        </div>
      </v-card>
      <hr>
      <div class="mt-8">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                Название продукта
                <v-btn
                  :icon="productStore.sortIcons.name"
                  :disabled="productStore.slidersDisabled"  
                  variant="plain" 
                  :ripple="false" 
                  class=" mb-1 pr-6" 
                  :color="productStore.returnColor[0]"
                  @click="productStore.sortInit('name')"
                />
              </th>
              <th class="text-left">
                Калории
                <v-btn 
                  :icon="productStore.sortIcons.calories" 
                  :disabled="productStore.slidersDisabled" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="productStore.returnColor[1]"
                  @click="productStore.sortInit('calories')"
                />
              </th>
              <th class="text-left">
                Белки
                <v-btn
                  :icon="productStore.sortIcons.proteins" 
                  :disabled="productStore.slidersDisabled" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="productStore.returnColor[2]"
                  @click="productStore.sortInit('proteins')"
                />
              </th>
              <th class="text-left">
                Жиры
                <v-btn 
                  :icon="productStore.sortIcons.fats" 
                  :disabled="productStore.slidersDisabled" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="productStore.returnColor[3]"
                  @click="productStore.sortInit('fats')"
                />
              </th>
              <th class="text-left">
                Углеводы
                <v-btn 
                  :icon="productStore.sortIcons.carbs" 
                  :disabled="productStore.slidersDisabled" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="productStore.returnColor[4]"
                  @click="productStore.sortInit('carbs')"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in productStore.returnShowedArray"
              :key="product"
            >
              <td 
                v-for="stat in product"
                :key="stat"
              >
                {{ stat }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { useProductStore } from '@/store/productStore'
// import { usePersonStore } from '@/store/personStore'
//import { useStatsStore } from '@/store/statsStore'
//import { Bar } from 'vue-chartjs'
//import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

//ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  //components: { Bar },

  data() {
    return {
      //statsStore: useStatsStore(),
      productStore: useProductStore(),
      isDataFiltered: false,
      name: null,
      calories: null,
      proteins: null,
      fats: null,
      carbs: null
      // personStore: usePersonStore(),
      // chartData: {
      //   labels: [ 'January', 'February', 'March' ],
      //   datasets: [ { data: [40, 20, 12] } ]
      // },
      // chartOptions: {
      //   responsive: true
      // }
    }
  },

  
  computed: {
    currentDate() {
      return this.isDataFiltered ? this.productStore.filterData : this.productStore.foodStorage;
    }
  },

  methods: {
    goToMainPage() {
      this.productStore.drawer = false;
      this.$router.push('/');
    },

    showOverlay() { //необходимо для корректного добавления продуктов и открытия оверлея
      this.productStore.isOverlayActive = true;
    },

  },

}
</script>