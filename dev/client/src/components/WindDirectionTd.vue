<template>
  <td>{{ value | degreesToName }}</td>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: String
  },

  computed: {
    ...mapGetters({
      getDatapoint: 'datapoints/get'
    }),

    datapoint () {
      return this.getDatapoint(this.id)
    },

    value () {
      const { datapoint } = this
      if (datapoint) return datapoint.v
    }
  }
}
</script>
