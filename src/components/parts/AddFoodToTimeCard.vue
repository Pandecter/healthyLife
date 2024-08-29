<template>
  <v-card 
    width="65vw"
    height="95vh"
  >
    <div class="d-flex justify-space-between mt-12 ml-16 mr-16">
      <p class="text-h6 mt-2">
        Ваш продукт:
      </p>
      <div class="w-50">
        <v-autocomplete 
          v-model="currentProductName"
          label="Введите наименование продукта" 
          :items="productStore.returnProductNames"
          no-data-text="По данному запросу нет результатов"
        />
      </div> 
    </div> 
    <div class="d-flex justify-space-between mt-8 ml-16 mr-16">
      <p class="text-h6 mt-2">
        Количество продукта:
      </p>
      <div class="w-50">
        <v-form v-model="isFormValid">
          <v-text-field
            v-model="currentCountValue"
            :rules="returnProductMassRule" 
            label="Введите количество в граммах"
          />
        </v-form>
      </div>
    </div>
    <div class="d-flex justify-space-between mt-8 ml-16 mr-16">
      <p class="text-h6 mt-2">
        Фильтры:
      </p>
    </div>
    <div class="d-flex justify-space-around mt-4">
      <p>Калории</p>
      <p>Белки</p>
      <p>Жиры</p>
      <p>Углеводы</p>
    </div>
    <range-slider-component
      :value="productStore.modalFilterRanges"
      :min-max-val="productStore.findMinMaxRange"
      :disabled-val="blockSliders"
      max-width-val="150px"
      @change-value="changeValInit"
    />
    <div 
      v-if="isButtonAvailable"
      class="d-flex justify-center align-center h-25 mt-2"
    >
      <p 
        class="text-h6 font-weight-light"
      > 
        Здесь будут отображены данные о продукте
      </p>
    </div>
    <div 
      v-else
      class="h-25 mt-2"
    >
      <div class="d-flex justify-center pb-8">
        <p class="text-h6">
          Информация о выбранном продукте 
        </p>
      </div>
      <hr>
      <product-table
        :resulted-array="showInfoAboutProduct"
      />
      <hr>
    </div>                         
    <div class="d-flex justify-center mt-8">
      <v-btn 
        :disabled="isButtonAvailable"
        @click="addToProductStore"
      > 
        Добавить продукт 
      </v-btn>
    </div> 
  </v-card>
</template>

<script>
import { useProductStore } from '../../store/productStore'
import validationRules from '../../shared/rules' 
import RangeSliderComponent from '../parts/RangeSlider.vue'
import ProductTable from '../parts/ProductInfoTable.vue'

export default {
  components: {
    RangeSliderComponent,
    ProductTable
  },

  props: {
    curDay: {
      type: String,
      required: true
    },
    curMealTime: {
      type:Number,
      required: true
    },
    arrOfDays: {
      type: Array,
      required: true
    }
  },

  emits: ["switchOverlay"],

  data() {
    return {
      productStore: useProductStore(),
      currentProductName: null, //наименование продукта
      isFormValid: false,
      currentCountValue: null, // количество продукта в граммах
    }
  },

  computed: {
    returnProductMassRule() {
      return validationRules.inputCountRules;
    },

    blockSliders() {
      return this.currentProductName!== null;
    },

    isButtonAvailable() { //отвечает за блокировку/разблокировку кнопки
      return !(this.isFormValid && this.currentProductName != null);
    },

    showInfoAboutProduct() { //вывод информации о продукте
      let info = this.actualProductCounter;
      info.calories = info.calories + " Ккал";
      info.proteins = info.proteins + " г";
      info.fats = info.fats + " г";
      info.carbs = info.carbs + " г";
      return info;
    },

    actualProductCounter() { //высчитывает количество "состава" с учетом количества продукта
      const stats = ["calories", "proteins", "fats", "carbs"];
      const product = {...this.productStore.foodStorage.find((el) => el.name === this.currentProductName) };
      for (let i = 0; i < stats.length; i++) {
        const CHOICE = stats[i];
        product[CHOICE] = product[CHOICE].replace(/,/g, '.');
        product[CHOICE] = Number(product[CHOICE].replace(/[^0-9.]+/g,""));
        product[CHOICE] = (product[CHOICE] * (this.currentCountValue / 100)).toFixed(2);
      }
      return product;
    },
  },

  methods: {
    changeValInit(data, string) {
      this.productStore.modalFilterRanges[string][0] = data[0];
      this.productStore.modalFilterRanges[string][1] = data[1]
    },

    addToProductStore() {//необходимо для корректного добавления продуктов и закрытия оверлея
      this.productStore.addToProductList(this.curDay, this.curMealTime, this.showInfoAboutProduct, this.arrOfDays);
      this.$emit('switchOverlay');
    },
  }
}
</script>