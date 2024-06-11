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
        Статистика
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="d-flex justify-center mt-8">
        <p class="text-h5">Выберите даты для отображения статистики</p>
      </div>
      <div class="d-flex justify-center mt-6">
        <div class="mr-16">
          <p>
            От:
          </p>
          <v-text-field 
            v-model="statsStore.startingDate"
            width="130px"
            variant="outlined"
            label="ДД.ММ.ГГГГ"
          />
        </div>
        <div class="ml-16">
          <p>
            До:
          </p>
          <v-text-field
            v-model="statsStore.endingDate" 
            width="130px"
            variant="outlined"
            label="ДД.ММ.ГГГГ"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { useProductStore } from '@/store/productStore'
// import { usePersonStore } from '@/store/personStore'
import { useStatsStore } from '@/store/statsStore'
//import { Bar } from 'vue-chartjs'
//import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

//ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  //components: { Bar },

  data() {
    return {
      statsStore: useStatsStore(),
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