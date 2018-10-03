<template>
  <table class="table-auto">
    <thead>
      <tr>
        <th class="p-1">Day of Month</th>
        <th class="p-1">Day of Year</th>
        <th class="p-1">Total Solar Rad</th>
        <th class="p-1">Avg Wind Speed</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="date in dates" :key="date.valueOf()">
        <td class="p-1">{{ date.format('D') }}</td>
        <td class="p-1">{{ date.format('DDD') }}</td>

        <aggregate-item class="p-1" :date="date" field="v_sum" :id="`${station._id}-totalSolRad`" />
        <aggregate-item class="p-1" :date="date" field="v_avg" :id="`${station._id}-avgAirSpeed`" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import AggregateItem from './AggregateItem'

export default {
  components: {
    AggregateItem
  },

  props: {
    station: Object
  },

  computed: {
    dates () {
      const { station } = this
      if (station) {
        const { currentTime } = station
        return Array.from({
          length: currentTime.daysInMonth()
        }, (_, i) => currentTime.clone().startOf('M').add(i, 'd'))
      }
    }
  }
}
</script>
