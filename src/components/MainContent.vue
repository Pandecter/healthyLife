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
              @click="appStore.toggleDay(index, appStore.giveCurrentDate[index])"
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
                  class="rounded-0"
                >
                  <v-expansion-panel-text>
                    <v-btn
                      variant="text" 
                    >
                      <v-overlay 
                        class="d-flex justify-center align-center"
                        activator="parent"
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
                                v-model="appStore.currentProductName"
                                label="Введите наименование продукта" 
                                :items="appStore.returnProductNames"
                                no-data-text="По данному запросу нет результатов"
                              />
                            </div>    
                          </div> 
                          <div class="d-flex justify-space-between mt-8 ml-16 mr-16">
                            <p class="text-h6 mt-2">
                              Количество продукта:
                            </p>
                            <div class="w-50">
                              <v-form v-model="appStore.isFormValid">
                                <v-text-field
                                  v-model="appStore.currentCountValue"
                                  :rules="appStore.inputCountRules" 
                                  label="Введите количество в граммах"
                                />
                              </v-form>
                            </div>
                          </div>
                          <div class="d-flex justify-center align-end h-50">
                            <v-btn 
                              :disabled="appStore.isButtonAvailable"
                            > 
                              Добавить продукт 
                            </v-btn>
                          </div> 
                        </v-card>
                      </v-overlay>
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