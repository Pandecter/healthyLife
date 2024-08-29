<template>
  <v-app>
    <my-app-bar
      string-val="База данных продуктов"
    />
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
          <adding-window 
            @swith-overlay="isOverlayActive = false"
          />
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
        <range-slider-component
          :value="productBase.BaseFilterRanges"
          :min-max-val="productStore.findMinMaxRange"
          :disabled-val="blockSliders"
          max-width-val="300px"
          @change-value="changeValInit"
        />
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
import RangeSliderComponent from '@/components/parts/RangeSlider.vue'
import AddingWindow from '@/components/parts/AddToBaseWindows.vue'
import MyAppBar from '@/components/parts/MyAppBar.vue'


export default {
  components: {
    RangeSliderComponent,
    AddingWindow,
    MyAppBar
  },

  data() {
    return {
      productStore: useProductStore(),
      productBase: useProductBase(),
      isDataFiltered: false,
      isOverlayActive: false, //активация/деактивация оверлея
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
    blockSliders() {
      return this.productBase.searchedProduct !== null;
    },

    returnColor() {
      const arr = ["name", "calories" , "proteins", "fats", "carbs"];
      const colors = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === this.sortBy[0]) {
          colors[i] = "red";
        }
        else {
          colors[i] = "black";
        }
      }
      return colors;
    }
  },

  methods: {
    showOverlay() { //необходимо для корректного добавления продуктов и открытия оверлея
      this.isOverlayActive = true;
    },

    sortInit(value) { //замена параметров переменной для вызова геттера сортировки
      const field = value;
      if (value !== this.sortBy[0]) {
        this.sortBy[0] = value;
        this.sortBy[1] = "desc";
        this.sortIcons[field] = "mdi-menu-down" //по умолчанию ставим убывающую сортировку
      }
      else {
        if (this.sortBy[1] === "desc") {
          this.sortBy[1] = "asc";
          this.sortIcons[field] = "mdi-menu-up";
        }
        else {
          this.sortBy[1] = "desc";
          this.sortIcons[field] = "mdi-menu-down";
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
      const field = this.sortBy[0];
      let a_mod = a[field].replace(/,/g, '.');
      a_mod = parseFloat(a_mod);
      let b_mod = b[field].replace(/,/g, '.');
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

    changeValInit(data, string) {
      this.productBase.BaseFilterRanges[string][0] = data[0];
      this.productBase.BaseFilterRanges[string][1] = data[1]
    }
  },
}
</script>