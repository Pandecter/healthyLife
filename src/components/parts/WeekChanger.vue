<template>
  <div class="d-flex justify-center">
    <v-card 
      variant="elevated" 
      class="mt-10 pb-6 pl-6 pr-6 elevation-4"
    >
      <p class="d-flex justify-center mt-16 text-h6">
        {{ dateStore.giveCurrentWeek }}
      </p>
      <div class="d-flex justify-center mt-8">
        <v-btn 
          class="mr-2" 
          @click="previousWeek"
        >
          Предыдущая
        </v-btn>
        <v-btn 
          class="ml-2" 
          @click="nextWeek"
        >
          Следующая
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { useProductStore } from '../../store/productStore'
import { useDateStore } from '@/store/dateStore'

export default {
  emits: ['expandWindow'],
  data() {
    return{
      dateStore: useDateStore(),
      productStore: useProductStore()
    }
  },

  methods: {
    nextWeek() { // метод для переключения на следующую неделю относительно текущей даты пользователя
      const WEEK = 7;
      let currentDate = this.dateStore.switchedCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() + WEEK);
      this.dateStore.switchedCurrentDate = currentDate;
      this.$emit('expandWindow');
    },

    previousWeek() { // метод для переключения на предыдущую неделю относительно текущей даты пользователя
      const WEEK = 7;
      let currentDate = this.dateStore.switchedCurrentDate;
      currentDate = new Date(currentDate.getFullYear(),  currentDate.getMonth(), currentDate.getDate() - WEEK);
      this.dateStore.switchedCurrentDate = currentDate;
      this.$emit('expandWindow');
    },
  }
}
</script>