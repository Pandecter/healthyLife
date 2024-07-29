<template>
  <v-table>
    <thead>
      <th>
        Параметр
      </th>
      <th>
        Значение
      </th>
    </thead>
    <tbody>
      <tr>
        <td>
          Промежуток времени
        </td>
        <td>
          {{ statsStore.returnStats.dates }}
        </td>
      </tr>
      <tr>
        <td>
          Калории
        </td>
        <td>
          {{ statsStore.returnStats.calories }} кКал
        </td>
      </tr>
      <tr>
        <td>
          Белки
        </td>
        <td>
          {{ statsStore.returnStats.proteins }} г.
        </td>
      </tr>
      <tr>
        <td>
          Жиры
        </td>
        <td>
          {{ statsStore.returnStats.fats }} г.
        </td>
      </tr>
      <tr>
        <td>
          Углеводы
        </td>
        <td>
          {{ statsStore.returnStats.carbs }} г.
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import {useStatsStore} from '../../store/statsStore.js'

export default{
  data () {
    return {
      statsStore: useStatsStore()
    }
  }
}
</script>