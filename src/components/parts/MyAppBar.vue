<template>
  <v-app-bar 
    absolute 
    app
  >
    <template #image>
      <v-img gradient="to top right, rgba(81, 217, 61,.9), rgba(141,216,125,.5)" />
    </template>
    <v-btn 
      icon="mdi-keyboard-backspace"
      title="Вернуться на главную"
      @click="goToMainPage()"
    />
    <v-app-bar-title>
      {{ stringVal }}
    </v-app-bar-title>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    stringVal: {
      type: String,
      required: true
    }
  },

  methods: {
    goToMainPage() {
      this.$router.push('/');
    },
  }
}
</script>