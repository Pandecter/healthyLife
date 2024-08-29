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
            <expanded-panel
              :arr-of-expandables="isExpandable"
              :day-index="indexOfDay"
              :array-of-days="days"
              :choosed-day="day"
            />
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
import ExpandedPanel from '@/components/parts/ExpansionPanel.vue'

export default {
  components: {
    WeekChangerComponent,
    MenuComponent,
    ExpandedPanel
  },
  
  data() {
    return {
      productStore: useProductStore(),
      statsStore: useStatsStore(),
      days: ["Понедельник", "Вторник", 
             "Среда", "Четверг", 
             "Пятница", "Суббота", "Воскресенье"],
      isExpandable: [false, false, false, false, false, false, false], //позволяет открывать/закрывать вкладки
      drawer: false, //отвечает за открытие/закрытие меню наверху слева
    }
  },

  methods: {
    toggleDay(index) { //открывает/закрывает меню дня
      this.isExpandable[index] == false ? this.isExpandable[index] = true : this.isExpandable[index] = false;
    },

    goToPersonPage() {
      this.isExpandable.fill(false);
      this.$router.push('/person_info');
    },
  }
}
</script>