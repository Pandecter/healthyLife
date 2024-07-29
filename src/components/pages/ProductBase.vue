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
        variant="plain"
        icon="mdi-keyboard-backspace"
        title="Вернуться на главную"
        @click="goToMainPage()"
      />
      <v-app-bar-title>
        База данных продуктов
        <v-tooltip text="Вся информация в базе представлена на 100 гр. продукта">
          <template #activator="{ props }">
            <v-icon 
              v-bind="props" 
              icon="mdi-information-variant" 
            />
          </template>
        </v-tooltip>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="d-flex justify-center mt-8">
        <v-btn
          @click="showOverlay"
        >
          Добавить свой продукт в базу данных
        </v-btn>
        <v-overlay
          v-model="isOverlayActive"
          class="d-flex justify-center align-center"
        >
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
        </v-overlay>
      </div>
      <v-card 
        class="mt-8 mb-8" 
        variant="tonal"
      >
        <v-card-text>
          <v-autocomplete 
            v-model="productBase.searchedProduct"
            label="Введите наименование продукта" 
            :items="productBase.returnProductNamesInBase"
            no-data-text="По данному запросу нет результатов"
          />
        </v-card-text>
        <div class="d-flex justify-space-around">
          <p>Калории</p>
          <p>Белки</p>
          <p>Жиры</p>
          <p>Углеводы</p>
        </div>
        <div class="d-flex justify-space-around">
          <v-range-slider 
            v-model="productBase.BaseFilterRanges.caloriesRange"
            :min="productStore.findMinMaxRange[0][0]"
            :max="productStore.findMinMaxRange[0][1]"
            :disabled="blockSliders"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productBase.BaseFilterRanges.proteinsRange"
            :min="productStore.findMinMaxRange[1][0]"
            :max="productStore.findMinMaxRange[1][1]"
            :disabled="blockSliders"
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productBase.BaseFilterRanges.fatsRange"
            :min="productStore.findMinMaxRange[2][0]"
            :max="productStore.findMinMaxRange[2][1]"
            :disabled="blockSliders" 
            max-width="300px"
            thumb-label="always"
          />
          <v-range-slider
            v-model="productBase.BaseFilterRanges.carbsRange"
            :min="productStore.findMinMaxRange[3][0]"
            :max="productStore.findMinMaxRange[3][1]"
            :disabled="blockSliders" 
            max-width="300px"
            thumb-label="always"
          />
        </div>
        <div class="d-flex justify-center mb-6 mt-6">
          <v-btn
            :disabled="blockSliders" 
            @click="productBase.applyFilters()"
          >
            Применить
          </v-btn>
        </div>
        <div class="d-flex justify-center mb-4 text-h6">
          Найдено продуктов: {{ productBase.shownArrayOfProducts.length }}
        </div>
      </v-card>
      <hr>
      <div class="mt-8">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                Название продукта
                <v-btn
                  :icon="sortIcons.name"
                  :disabled="blockSliders"  
                  variant="plain" 
                  :ripple="false" 
                  class=" mb-1 pr-6" 
                  :color="returnColor[0]"
                  @click="sortInit('name')"
                />
              </th>
              <th class="text-left">
                Калории
                <v-btn 
                  :icon="sortIcons.calories" 
                  :disabled="blockSliders" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="returnColor[1]"
                  @click="sortInit('calories')"
                />
              </th>
              <th class="text-left">
                Белки
                <v-btn
                  :icon="sortIcons.proteins" 
                  :disabled="blockSliders" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="returnColor[2]"
                  @click="sortInit('proteins')"
                />
              </th>
              <th class="text-left">
                Жиры
                <v-btn 
                  :icon="sortIcons.fats" 
                  :disabled="blockSliders" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="returnColor[3]"
                  @click="sortInit('fats')"
                />
              </th>
              <th class="text-left">
                Углеводы
                <v-btn 
                  :icon="sortIcons.carbs" 
                  :disabled="blockSliders" 
                  variant="plain" 
                  :ripple="false" 
                  class="mb-1 pr-6"
                  :color="returnColor[4]"
                  @click="sortInit('carbs')"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in productBase.returnShowedArray"
              :key="product"
            >
              <td 
                v-for="stat in product"
                :key="stat"
              >
                {{ stat }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { useProductStore } from '@/store/productStore'
import { useProductBase } from '@/store/productBase'
import validationRules from '@/shared/rules/index.js'

export default {
  data() {
    return {
      productStore: useProductStore(),
      productBase: useProductBase(),
      isDataFiltered: false,
      name: null,
      calories: null,
      proteins: null,
      fats: null,
      carbs: null,
      isOverlayActive: false, //активация/деактивация оверлея
      addingFormIsValid: false, //активация/деактивация кнопки добавления
      sortBy: ['name', 'desc'], //сортировка по убыванию/возрастанию,
      sortIcons:{ //набор стилей для кнопок сортировок, каждая из которых меняется на клик
        name: "mdi-menu-up",
        calories: "mdi-menu-down",
        proteins: "mdi-menu-down",
        fats: "mdi-menu-down",
        carbs: "mdi-menu-down"
      },
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

    blockSliders() {
      if (this.productBase.searchedProduct !== null) {
        return true;
      }
      else {
        return false;
      }
    },

    returnColor() {
      const ARR = ["name", "calories" , "proteins", "fats", "carbs"];
      const COLORS = [];
      for (let i = 0; i < ARR.length; i++) {
        if (ARR[i] === this.sortBy[0]) {
          COLORS[i] = "red";
        }
        else {
          COLORS[i] = "black";
        }
      }
      return COLORS;
    }
  },

  methods: {
    goToMainPage() {
      this.productStore.drawer = false;
      this.$router.push('/');
    },

    showOverlay() { //необходимо для корректного добавления продуктов и открытия оверлея
      this.isOverlayActive = true;
    },

    initAddingToBaseFunc(nameVal, caloriesVal, proteinsVal, fatsVal, carbsVal) {
      this.isOverlayActive = false;
      this.productBase.addProductToList(nameVal, caloriesVal, proteinsVal, fatsVal, carbsVal);
    },

    sortInit(value) { //замена параметров переменной для вызова геттера сортировки
      const FIELD = value;
      if (value !== this.sortBy[0]) {
        this.sortBy[0] = value;
        this.sortBy[1] = "desc";
        this.sortIcons[FIELD] = "mdi-menu-down" //по умолчанию ставим убывающую сортировку
      }
      else {
        if (this.sortBy[1] === "desc") {
          this.sortBy[1] = "asc";
          this.sortIcons[FIELD] = "mdi-menu-up";
        }
        else {
          this.sortBy[1] = "desc";
          this.sortIcons[FIELD] = "mdi-menu-down";
        }
      }
      if (this.sortBy[0] === "name") {
        if(this.sortBy[1] === "asc") {
          this.productBase.shownArrayOfProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
        }
        else {
          this.productBase.shownArrayOfProducts.sort((a, b) => (a.name > b.name ? -1 : 1));
        }
      }
      else {
        this.productBase.shownArrayOfProducts.sort(this.sortFunction);
      }
    },

    sortFunction(a, b) {
      const FIELD = this.sortBy[0];
      let a_mod = a[FIELD].replace(/,/g, '.');
      a_mod = parseFloat(a_mod);
      let b_mod = b[FIELD].replace(/,/g, '.');
      b_mod = parseFloat(b_mod);
      if (this.sortBy[1] === "asc") { //по возрастанию
        if (a_mod < b_mod) {
          return -1;
        }
        else {
          return 1;
        }
      }
      else { //по убыванию 
        if (a_mod < b_mod) {
          return 1;
        }
        else {
          return -1;
        }
      }
    },
  },
}
</script>