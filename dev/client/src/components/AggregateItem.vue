<template>
  <td>{{ value }}</td>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    date: Object,
    field: String,
    id: String
  },

  computed: {
    ...mapGetters({
      getAggregateRequest: 'aggregateRequest/get'
    }),

    aggReq () {
      return this.getAggregateRequest(this.id)
    },

    item () {
      const { aggReq, t } = this
      if (aggReq && aggReq.result && aggReq.result.data) {
        return aggReq.result.data.find(item => item.t === t)
      }
    },

    t () {
      return this.date.toISOString()
    },

    value () {
      const { item } = this
      if (item) return item[this.field].value
    }
  }
}
</script>
