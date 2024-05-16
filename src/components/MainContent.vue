<template>
  <v-app>
    <v-app-bar absolute>
      <template #image>
        <v-img gradient="to top right, rgba(81, 217, 61,.9), rgba(141,216,125,.5)" />
      </template>
      <v-app-bar-nav-icon />
      <v-app-bar-title>
        ЗЖ-У
      </v-app-bar-title>
    </v-app-bar> 
    <div class="mt-16">
      <p class="d-flex justify-center mt-16">
        {{ appStore.giveCurrentWeek }}
      </p>
      <div class="d-flex justify-center mt-8">
        <v-btn 
          class="mr-2" 
          @click="appStore.previousWeek()"
        >
          Предыдущая
        </v-btn>
        <v-btn 
          class="ml-2" 
          @click="appStore.nextWeek()"
        >
          Следующая
        </v-btn>
      </div>
      <v-container class="d-flex justify-space-between flex-column mt-16 w-100 h-100">
        <v-card 
          v-for="(day, index) in appStore.days"
          :key="day"
          variant="outlined"
          width="100%"
          class="border-thin rounded-shaped elevation-2"
        >
          <div class="d-flex justify-space-between">
            <v-card-title>
              {{ day }}
            </v-card-title>
            <v-card-subtitle class="mt-4">
              {{ appStore.giveCurrentDate[index] }}
            </v-card-subtitle>
          </div>
          <v-card-actions>
            <v-btn
              :icon="appStore.isExpandable[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="appStore.isExpandable[index] = !appStore.isExpandable[index]"
            />
          </v-card-actions>
          <v-expand-transition>
            <div v-if="appStore.isExpandable[index]">
              <v-expansion-panels 
                v-for="time in appStore.mealTime"
                :key="time"
              >
                <v-expansion-panel 
                  :title="time"
                  text="fffff"
                  class="rounded-0"
                />
              </v-expansion-panels>
            </div>  
          </v-expand-transition>
        </v-card>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { useAppStore } from '@/store/app' 

export default {
  data() {
    return {
      appStore: useAppStore(),
    }
  }
}
</script>