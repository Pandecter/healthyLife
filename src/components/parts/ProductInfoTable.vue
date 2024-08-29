<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Название продукта
        </th>
        <th class="text-left">
          Калории
        </th>
        <th class="text-left">
          Белки
        </th>
        <th class="text-left">
          Жиры
        </th>
        <th class="text-left">
          Углеводы
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td 
          v-for="stat in resultedArray"
          :key="stat.name"
        >
          {{ stat }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    resultedArray: {
      type: Object,
      required: true
    }
  }
}
</script>