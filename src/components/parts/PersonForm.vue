<template>
  <v-form
    v-model="formIsValid" 
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
        :rules="returnAgeHeightRule"
      />
    </div>
    <div>
      <p> Введите ваш рост </p>
      <v-text-field
        v-model="personStore.height" 
        :rules="returnAgeHeightRule"
        label="в см"
      />
    </div>
    <div>
      <p> Введите ваш вес </p>
      <v-text-field 
        v-model="personStore.weight" 
        :rules="returnWeightRule"
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
            :items="levelOfActivity"
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
          <activity-info-component />
        </v-overlay>
      </div>
    </div>
    <div class="d-flex justify-center mt-4">
      <v-btn
        :disabled="!showInfo"
        @click="initCaloriesCalculation()"
      >
        Подтвердить
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { usePersonStore } from '@/store/personStore'
import validationRules from '@/shared/rules/index.js' 
import ActivityInfoComponent from '@/components/parts/ActivityInfo.vue'

export default {
  components: {
    ActivityInfoComponent
  },
  emits: ["buttonClick"],
  data() {
    return {
      personStore: usePersonStore(),
      formIsValid: null,
      levelOfActivity: [{ name: "Минимальная активность", value: 1.2 }, 
                        { name: "Слабый уровень активности", value: 1.375 },
                        { name: "Умеренный уровень активности", value: 1.55 }, 
                        { name: "Тяжелая активность", value: 1.7 },
                        { name: "Экстремальный уровень активности", value: 1.9}],
    }
  },

  computed: {
    returnAgeHeightRule() { //совмещает общие правила и правила для роста/возраста
      return [...validationRules.commonRules, ...validationRules.ageHeightRules]
    },

    returnWeightRule() { //совмещает общие правила и правила для веса
      return [...validationRules.commonRules, ...validationRules.weightRules]
    },

    showInfo() { //отвечает за блокировку кнопки
      if (this.formIsValid && (this.personStore.gender !== null && this.personStore.choosedActivity !== null)) {
        return true;
      }
      else {
        return false;
      }
    },
  },

  methods: {
    initCaloriesCalculation() { //вызов функции расчета калорий
      this.$emit('buttonClick');
      this.personStore.calculateRecomendedCalories(this.levelOfActivity);
    },
  }
}
</script>