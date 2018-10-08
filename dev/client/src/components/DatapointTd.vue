<template>
  <td>{{ value }} {{ abbreviation }}</td>
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

    abbreviation () {
      const { datapoint } = this
      if (datapoint && datapoint.datastream) return datapoint.datastream.abbreviation
    },

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
