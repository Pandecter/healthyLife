<template>
  <router-view />
</template>

<script>
import { useProductStore } from './store/productStore';

export default {
  data() {
    return {
      productStore: useProductStore()
    }
  },
  mounted() {
    this.productStore.mountFunction();
  }
}
</script>
./store/productStore