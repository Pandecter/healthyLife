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
      <v-form
        v-model="personStore.formIsValid" 
        class="w-25"
      >
        <div>
          <p> Выберите ваш пол </p>
          <v-radio-group v-model="personStore.gender">
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
            v-model="personStore.weigth" 
            :rules="personStore.returnWeigthRule"
            label="в кг"
          />      
        </div>
        <div>
          <v-select
            v-model="personStore.choosedActivity"
            label="Уровень вашей активности"
            :items="personStore.levelOfActivity"
            item-title="name"
          />
        </div>
        <div 
          v-if="personStore.showInfo"
          class="d-flex justify-center"
        >
          <p>
            Ваша суточная норма калорий: {{ personStore.requiredCalories }}
          </p>
        </div>
      </v-form>
    </div>
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
