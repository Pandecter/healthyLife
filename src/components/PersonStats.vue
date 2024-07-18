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
        icon="mdi-keyboard-backspace"
        title="Вернуться на главную"
        @click="goToMainPage()"
      />
      <v-app-bar-title>
        Статистика
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="d-flex justify-center mt-8">
        <p class="text-h5">
          Выберите даты для отображения статистики
        </p>
      </div>
      <div class="d-flex justify-center mt-6">
        <div class="mr-16">
          <p>
            От:
          </p>
          <v-text-field 
           
            v-model="startDate"
            width="130px"
            variant="outlined"
            type="date"
          />
        </div>
        <div class="ml-16">
          <p>
            До:
          </p>
          <v-text-field
            v-model="endDate" 
            width="130px"
            variant="outlined"
            type="date"
          />
        </div>
      </div>
      <div class="d-flex justify-center mt-4">
        <v-btn
          @click="statsStore.showStatistics(startDate, endDate)"
        >
          Вывести статистику
        </v-btn>
      </div>
      <div class="d-flex justify-center mt-16">
        <v-card 
          v-if="statsStore.showErrorCard"
          color="error"
          class="d-flex justify-center"
          width="80vh"
        >
          <v-card-title>
            {{ statsStore.message }}
          </v-card-title>
        </v-card>
        <div v-if="statsStore.showSuccessCard">
          <v-card 
            color="success"
            class="d-flex justify-center"
            width="160vh"
          >
            <v-card-title>
              {{ statsStore.message }}
            </v-card-title>
          </v-card>
          <div>
            <LineChart 
              :data="statsStore.mutableChartData" 
              :options="statsStore.chartOptions" 
            />
          </div>
          <div 
            v-if="personStore.isInfoIsNotFull" 
            class="ma-8 text-h5 d-flex justify-center"
          >
            <p>
              Введите <RouterLink to="/person_info">
                свои данные 
              </RouterLink> и получите расширенную статистику!
            </p>
          </div>
          <div v-else class="ma-8 text-h5 d-flex justify-center">
            <p>
              Тут будут статы
            </p>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { usePersonStore } from '@/store/personStore'
import { useProductStore } from '@/store/productStore'
import { useStatsStore } from '@/store/statsStore'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  components: { LineChart: Line },
  data() {
    return {
      personStore: usePersonStore(),
      statsStore: useStatsStore(),
      productStore: useProductStore(),
      startDate: null,
      endDate: null
    }
  },

  mounted() {
    this.startDate = this.productStore.giveDateInDateType[0];
    this.endDate = this.productStore.giveDateInDateType[6];
  },


  methods: {
    goToMainPage() {
      this.productStore.drawer = false;
      this.$router.push('/');
    },

  }
}
</script>