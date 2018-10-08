<template>
  <td v-if="!aggReq">&ndash;</td>
  <td v-else-if="aggReq.isPending">Calculating...</td>
  <td v-else>{{ value }} {{ abbreviation }}</td>
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

    abbreviation () {
      const { aggReq } = this
      if (aggReq && aggReq.datastream) return aggReq.datastream.abbreviation
    },

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
      return item ? item[this.field].value : '(no value)'
    }
  }
}
</script>
