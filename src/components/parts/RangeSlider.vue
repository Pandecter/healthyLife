<template>
  <div class="d-flex justify-space-around mt-6">
    <v-range-slider 
      :model-value="value.caloriesRange"
      :min="minMaxVal[0][0]"
      :max="minMaxVal[0][1]"
      :disabled="disabledVal"
      :max-width="maxWidthVal"
      thumb-label="always"
      @update:model-value="changeValueOfSlider($event,'caloriesRange')"
    />
    <v-range-slider 
      :model-value="value.proteinsRange"
      :min="minMaxVal[1][0]"
      :max="minMaxVal[1][1]"
      :disabled="disabledVal"
      :max-width="maxWidthVal"
      thumb-label="always"
      @update:model-value="changeValueOfSlider($event, 'proteinsRange')"
    />
    <v-range-slider 
      :model-value="value.fatsRange"
      :min="minMaxVal[2][0]"
      :max="minMaxVal[2][1]"
      :disabled="disabledVal"
      :max-width="maxWidthVal"
      thumb-label="always"
      @update:model-value="changeValueOfSlider($event, 'fatsRange')"
    />
    <v-range-slider 
      :model-value="value.carbsRange"
      :min="minMaxVal[3][0]"
      :max="minMaxVal[3][1]"
      :disabled="disabledVal"
      :max-width="maxWidthVal"
      thumb-label="always"
      @update:model-value="changeValueOfSlider($event, 'carbsRange')"
    />
  </div>
</template>

<script>
import { useProductStore } from '../../store/productStore'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },

    minMaxVal: {
      type: Array,
      required: true
    },

    disabledVal: {
      type: Boolean,
      required: true
    },

    maxWidthVal: {
      type: String,
      required: true
    }
  },

  emits:['changeValue'],

  data () {
    return {
      productStore: useProductStore()
    }
  },

  methods: {
    changeValueOfSlider(value, string) {
      this.$emit('changeValue', value, string);
    }
  }
}
</script>