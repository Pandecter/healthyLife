<template>
  <div class="d-flex justify-center mt-4 mb-4">
    <p class="text-decoration-underline">
      Нарушения
    </p>
  </div>
  <div v-if="areThereAnyMistakes">
    <v-table class="bg-red-lighten-4">
      <thead>
        <th>
          День
        </th>
        <th>
          Превышение
        </th>
      </thead>
      <tbody>
        <tr 
          v-for="excess in statsStore.returnExcess"
          :key="excess"
          color="error"
        >
          <td>
            {{ excess.date }}
          </td>
          <td>
            {{ excess.value }} кКал
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <div 
    v-else 
    class="d-flex justify-center bg-green-lighten-4"
  >
    Никаких нарушений найдено не было
  </div>
  <div class="d-flex justify-center mt-12 mb-4 text-decoration-underline">
    Статистика за промежуток
  </div>
  <div>
    <person-stat-table />
  </div>
</template>

<script>
  import { useStatsStore } from '../../store/statsStore'
  import PersonStatTable from '../parts/PersonStatisticTable.vue'

  export default {
    components: {
      PersonStatTable
    },

    data() {
      return {
        statsStore: useStatsStore()
      }
    },

    computed: {
      areThereAnyMistakes() {
        return !(this.statsStore.returnExcess.length === 0);
      }
  },
  }
</script>