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
        Персональная информация
      </v-app-bar-title>
    </v-app-bar>
    <v-main class="d-flex justify-center">
      <v-card 
        class="mt-16 mb-8 elevation-8" 
        variant="elevated" 
        width="100vh"
        height="90vh"
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
              <div class="d-flex">
                <div>
                  <v-select
                    v-model="personStore.choosedActivity"
                    label="Уровень вашей активности"
                    :items="personStore.levelOfActivity"
                    item-title="name"
                    width="370px"
                  />
                </div>
                <v-btn
                  id="info_activator"
                  title="Как определить уровень активности?"
                  variant="plain"
                  :ripple="false"
                  icon="mdi-help-circle-outline"
                  class="ml-2 pb-2"
                  size="x-large" 
                />
                <v-overlay 
                  activator="#info_activator"
                  class="d-flex justify-center align-center"
                >
                  <v-card max-width="140vh">
                    <div class="d-flex justify-center">
                      <v-card-title>
                        Как определить уровень активности?
                      </v-card-title>
                    </div>

                    <v-card-subtitle class="text-decoration-underline">
                      Минимальная активность
                    </v-card-subtitle>
                    <v-card-text>
                      Сидячая работа, не требующая значительных физических нагрузок.
                    </v-card-text>
                    <v-card-subtitle class="text-decoration-underline">
                      Слабый уровень активности
                    </v-card-subtitle>
                    <v-card-text>
                      Интенсивные упражнения не менее 20 минут один-три раза в неделю.
                      Это может быть езда на велосипеде, бег трусцой, баскетбол, плавание, катание на коньках и т. д.
                      Если вы не тренируетесь регулярно, но сохраняете занятый стиль жизни, который требует частой ходьбы
                      в течение длительного времени, то выберите этот коэффициент.
                    </v-card-text>
                    <v-card-subtitle class="text-decoration-underline">
                      Умеренный уровень активности
                    </v-card-subtitle>
                    <v-card-text>
                      Интенсивная тренировка не менее 30-60 мин три-четыре раза в неделю
                      (любой из перечисленных выше видов спорта).
                    </v-card-text>
                    <v-card-subtitle class="text-decoration-underline">
                      Тяжелая или трудоемкая активность
                    </v-card-subtitle>
                    <v-card-text>
                      Интенсивные упражнения и занятия спортом 5-7 дней в неделю.
                      Трудоемкие занятия также подходят для этого уровня, они включают строительные работы (кирпичная кладка,
                      столярное дело и т. д.), занятость в сельском хозяйстве и т. п.
                    </v-card-text>
                    <v-card-subtitle class="text-decoration-underline">
                      Экстремальный уровень
                    </v-card-subtitle>
                    <v-card-text>
                      Включает чрезвычайно активные и/или очень энергозатратные виды деятельности:
                      занятия спортом с почти ежедневным графиком и несколькими тренировками в течение дня;
                      очень трудоемкая работа, например, сгребание угля или длительный рабочий день на сборочной линии. 
                      Зачастую этого уровня активности очень трудно достичь.
                    </v-card-text>
                  </v-card>
                </v-overlay>
              </div>
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
                v-for="(param, index) in personStore.arrOfParams"
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
              @click="personStore.deletePersonInfo()"
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
