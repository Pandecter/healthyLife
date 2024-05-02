<template>
  <router-view />
</template>

<script>
import { useAppStore } from './store/app';

export default {
  data() {
    return {
      appStore: useAppStore()
    }
  },
  mounted() {
    this.appStore.mountFunction();
  }
}
</script>
