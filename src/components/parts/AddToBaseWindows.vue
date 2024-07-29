<template>
  <v-card
    width="130vh"
    height="90vh"
  >
    <div class="d-flex flex-column align-center mt-8">
      <v-form v-model="addingFormIsValid">
        <p class="text-h6">
          Введите наименование продукта
        </p>
        <v-text-field
          v-model="name" 
          :rules="returnNameRules" 
        />
        <p class="text-h6">
          Введите количество ккал на 100 гр. продукта
        </p>
        <v-text-field
          v-model="calories" 
          :rules="returnCaloriesRules"
        />
        <p class="text-h6">
          Введите количество белков на 100 гр. продукта
        </p>
        <v-text-field
          v-model="proteins" 
          :rules="returnRulesForOtherFields"
        />
        <p class="text-h6">
          Введите количество жиров на 100 гр. продукта
        </p>
        <v-text-field
          v-model="fats"
          :rules="returnRulesForOtherFields"
        />
        <p class="text-h6">
          Введите количество углеводов на 100 гр. продукта
        </p>
        <v-text-field
          v-model="carbs"
          :rules="returnRulesForOtherFields"
        />
      </v-form> 
      
      <v-btn 
        class="mt-2"
        :disabled="!addingFormIsValid"
        @click="initAddingToBaseFunc(name, calories, proteins, fats, carbs)"
      >
        Подтвердить
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import validationRules from '@/shared/rules/index.js'
import { useProductBase } from '@/store/productBase'

export default {
  emits: ['swithOverlay'],
  
  data() {
    return {
      productBase: useProductBase(),
      addingFormIsValid: false, //активация/деактивация кнопки добавления
      name: null,
      calories: null,
      proteins: null,
      fats: null,
      carbs: null,
    }
  },

  computed: {
    returnNameRules() {
      return validationRules.ruleForProductName;
    },

    returnCaloriesRules() {
      return validationRules.rulesForCalories;
    },

    returnRulesForOtherFields() {
      return validationRules.rulesForProductStats;
    },
  },

  methods: {
    initAddingToBaseFunc(nameVal, caloriesVal, proteinsVal, fatsVal, carbsVal) {
      this.$emit('swithOverlay');
      this.productBase.addProductToList(nameVal, caloriesVal, proteinsVal, fatsVal, carbsVal);
    },
  }
}
</script>