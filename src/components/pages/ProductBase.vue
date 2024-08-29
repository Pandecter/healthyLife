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
            @click="productBase.applyFilters"
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
        <v-data-table
          :headers="tableHeaders"
          :items="productBase.returnShowedArray"
        />
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
      tableHeaders: [
        { title: 'Наименование продукта', align: 'start', key: 'name'},
        { title: 'Калории (кКал)', align: 'end', key: 'calories',  },
        { title: 'Белки (г)', align: 'end', key: 'proteins',  },
        { title: 'Жиры (г)', align: 'end', key: 'fats', },
        { title: 'Углеводы (г)', align: 'end', key: 'carbs',  },
      ]
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

    changeValInit(data, string) {
      this.productBase.BaseFilterRanges[string][0] = data[0];
      this.productBase.BaseFilterRanges[string][1] = data[1]
    }
  },
}
</script>