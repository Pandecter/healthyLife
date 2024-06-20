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
        icon="mdi-arrow-left-thick"
        title="Вернуться на главную"
        @click="goToMainPage()"
      />
      <v-app-bar-title>
        База данных продуктов
        <v-tooltip text="Вся информация в базе представлена на 100 гр. продукта">
          <template #activator="{ props }">
            <v-icon 
              v-bind="props" 
              icon="mdi-information-outline" 
            />
          </template>
        </v-tooltip>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="d-flex justify-center mt-8">
        <v-btn>
          Добавить свой продукт в базу данных
        </v-btn>
      </div>
      <v-card 
        class="mt-8 mb-8" 
        variant="tonal"
      >
        <v-card-text>
          <v-autocomplete 
            v-model="productStore.currentProductName"
            label="Введите наименование продукта" 
            :items="productStore.returnProductNames"
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
            v-model="productStore.caloriesRange"
            :min="productStore.findMinMaxRange[0][0]"
            :max="productStore.findMinMaxRange[0][1]"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.proteinsRange"
            :min="productStore.findMinMaxRange[1][0]"
            :max="productStore.findMinMaxRange[1][1]"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.fatsRange"
            :min="productStore.findMinMaxRange[2][0]"
            :max="productStore.findMinMaxRange[2][1]" 
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productStore.carbsRange"
            :min="productStore.findMinMaxRange[3][0]"
            :max="productStore.findMinMaxRange[3][1]" 
            max-width="300px"
            thumb-label="always"
          />
        </div>
      </v-card>
      <hr>
      <div class="mt-8">
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
            <tr 
              v-for="product in productStore.foodStorage"
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

  methods: {
    goToMainPage() {
      this.productStore.drawer = false;
      this.$router.push('/');
    }
  }
}
</script>