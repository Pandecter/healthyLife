<template>
  <v-app>
    <v-app-bar absolute>
      <template #image>
        <v-img gradient="to top right, rgba(81, 217, 61,.9), rgba(141,216,125,.5)"/>
      </template>
      <v-app-bar-nav-icon />
      <v-app-bar-title>
        ЗЖ-У
      </v-app-bar-title>
    </v-app-bar> 
    <div class="mt-16">
      <v-container class="d-flex justify-space-between mt-16 w-100">
        <v-card 
          v-for="day in appStore.days"
          :key="day"
          variant="outlined"
          width="150"
          height="400"
        >
          <v-card-title>
            {{ day }}
          </v-card-title>
        </v-card>
      </v-container>
      <div class="d-flex justify-center mt-16">
        <v-btn class="mr-2" @click="appStore.previousWeek()">Предыдущая</v-btn>
        <v-btn class="ml-2" @click="appStore.nextWeek()">Следующая</v-btn>
      </div>
      <p class="d-flex justify-center mt-4">
        Результат: {{ appStore.giveAlternativeCurrentDate }}
      </p>
    </div>
  </v-app>
</template>

<script>
import { useAppStore } from '@/store/app' 

export default {
  data() {
    return {
      appStore: useAppStore()
    }
  }
}
</script>