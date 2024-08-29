<template>
  <v-app>
    <my-app-bar
      string-val="Персональная информация"
    />
    <v-main class="d-flex justify-center">
      <v-card 
        class="mt-16 mb-8 elevation-8" 
        variant="elevated" 
        width="48vw"
        height="90vh"
      >
        <div 
          v-if="!personStore.buttonIsClicked"
          class="d-flex align-center justify-center"
        >
          <person-info-component
            @button-click="personStore.buttonIsClicked = true" 
          />
        </div>
        <div 
          v-else
          class="d-flex flex-column align-center "
        > 
          <div>
            <p class="text-h4 ma-10"> 
              Ваши данные 
            </p>
          </div>
          <v-table 
            class="ma-6" 
            density="compact"
          >
            <thead>
              <th class="text-left">
                Параметр
              </th>
              <th class="text-left">
                Значение
              </th>
            </thead>
            <tbody>
              <tr 
                v-for="(param, index) in arrOfParams"
                :key="param"
              >
                <td>
                  {{ param }}
                </td>
                <td>
                  {{ personStore.arrOfValues[index] }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-h5 mt-12">
            Ваша суточная норма калорий: {{ personStore.recomendedCalories }} ккал
          </p>
          <div class="mt-16">
            <v-btn 
              title="Удалить данные о себе"
              class="ma-4"
              color="error"
              @click="initDeleteInfo"
            >
              Удалить
            </v-btn>
            <v-btn 
              title="Изменить введенные данные"
              class="ma-4"
              color="warning"
              @click="personStore.buttonIsClicked = false"
            >
              Изменить
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { useProductStore } from '@/store/productStore'
import { usePersonStore } from '@/store/personStore' 
import PersonInfoComponent from '@/components/parts/PersonForm.vue'
import MyAppBar from '@/components/parts/MyAppBar.vue'

export default {
  components: {
    PersonInfoComponent,
    MyAppBar
  },
  
  data() {
    return {
      productStore: useProductStore(),
      personStore: usePersonStore(),
      arrOfParams: ["Пол", "Возраст", "Рост", "Вес", "Ур. активности"],
    }
  },

  methods: {
    initDeleteInfo() { //вызов функции удаления информации о пользователе
      this.personStore.buttonIsClicked = false;
      this.personStore.deletePersonInfo();
    }
  },
}
</script>