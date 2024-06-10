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
  </v-app>
</template>

<script>
import { useAppStore } from '@/store/app' 

export default {
  data() {
    return {
      appStore: useAppStore(),
    }
  },

  methods: {
    goToMainPage() {
      this.$router.push('/');
    }
  }
}
</script>
