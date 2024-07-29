<template>
  <v-menu
    :model-value="drawerValue"
    location="bottom"
  >
    <v-list>
      <v-list-item>
        <v-btn 
          variant="text"
          width="150"
          @click="goToStatsPage()"
        >
          Статистика
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn 
          variant="text"
          width="150"
          @click="goToBasePage()"
        >
          База данных
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu> 
</template>

<script>
import { useStatsStore } from '../../store/statsStore'

export default {
  props: {
    drawerValue: {
      type: Boolean,
      required: true
    }
  },

  emits: ['closeExpandables'],

  data () {
    return {
      statsStore: useStatsStore(),
    }
  },

  methods: {
    goToStatsPage() {
      this.$router.push('/stats');
      this.statsStore.showSuccessCard = false;
      this.statsStore.showErrorCard = false;
      this.$emit('closeExpandables')
    },

    goToBasePage() {
      this.$emit('closeExpandables')
      this.$router.push('/base');
    },
  }
}
</script>