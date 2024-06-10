<template>
  <v-app>
    <v-app-bar absolute>
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
    <div class="mt-16 d-flex align-center h-100 justify-center">
      <v-form class="w-25">
        <div>
          <p> Выберите ваш пол </p>
          <v-radio-group>
            <v-radio 
              label="Мужской" 
              value="male"
            />
            <v-radio 
              label="Женский" 
              value="female"
            />
          </v-radio-group>
        </div>
        <div>
          <p> Введите ваш возраст </p>
          <v-text-field>

          </v-text-field>
        </div>
        <div>
          <p> Введите ваш рост </p>
          <v-text-field>

          </v-text-field>
        </div>
        <div>
          <p> Введите ваш вес </p>
          <v-text-field>

          </v-text-field>          
        </div>
        <div>
          <v-select
            label="Уровень вашей активности"
            :items="['Минимальная активность', 'Слабый уровень активности', 'умеренный уровень активности', 'Тяжелая аткивность', 'Экстремальный уровень']"
          />
        </div>
      </v-form> 
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
  },

  methods: {
    goToMainPage() {
      this.$router.push('/');
    }
  }
}
</script>
