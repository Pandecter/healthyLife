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
        ЗЖ-У
      </v-app-bar-title>
    </v-app-bar>
    <v-main class="d-flex justify-center">
      <v-card 
        class="mt-16 mb-8 elevation-8" 
        variant="elevated" 
        width="90vh"
      >
        <div 
          v-if="!personStore.buttonIsClicked"
          class="d-flex align-center justify-center"
        >
          <v-form
            v-model="personStore.formIsValid" 
            class="w-50 mt-8"
          >
            <div>
              <p> Выберите ваш пол </p>
              <v-radio-group v-model="personStore.gender">
                <v-radio 
                  label="Мужской" 
                  value="Мужчина"
                />
                <v-radio 
                  label="Женский" 
                  value="Женщина"
                />
              </v-radio-group>
            </div>
            <div>
              <p> Введите ваш возраст </p>
              <v-text-field
                v-model="personStore.age"
                :rules="personStore.returnAgeHeightRule"
              />
            </div>
            <div>
              <p> Введите ваш рост </p>
              <v-text-field
                v-model="personStore.height" 
                :rules="personStore.returnAgeHeightRule"
                label="в см"
              />
            </div>
            <div>
              <p> Введите ваш вес </p>
              <v-text-field 
                v-model="personStore.weight" 
                :rules="personStore.returnWeightRule"
                label="в кг"
              />      
            </div>
            <div>
              <p> Выберите уровень вашей активности </p>
              <v-select
                v-model="personStore.choosedActivity"
                label="Уровень вашей активности"
                :items="personStore.levelOfActivity"
                item-title="name"
              />
            </div>
            <div class="d-flex justify-center mt-4">
              <v-btn
                :disabled="!personStore.showInfo"
                @click="personStore.calculateRecomendedCalories()"
              >
                Подтвердить
              </v-btn>
            </div>
          </v-form>
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
          <v-table class="ma-6" density="compact">
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
                v-for="(param, index) in personStore.arrOfParams"
                :key="param">
                <td>
                  {{ param }}
                </td>
                <td>
                  {{ personStore.arrOfValues[index] }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-h6 mt-6">
            Ваша суточная норма калорий: {{ personStore.recomendedCalories }} ккал
          </p>
          <div class="mt-16">
            <v-btn 
              class="ma-4"
              color="error"
              @click="personStore.deletePersonInfo()"
            >
              Удалить
            </v-btn>
            <v-btn 
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

export default {
  data() {
    return {
      productStore: useProductStore(),
      personStore: usePersonStore(),
    }
  },

  methods: {
    goToMainPage() {
      this.$router.push('/');
    }
  }
}
</script>
