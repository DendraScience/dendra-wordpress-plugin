<template>
  <table>
    <tbody>
      <tr>
        <th :class="$style.th">Station Time</th>
        <td>{{ station.currentTime.format('HH:mm') }} {{ station.time_zone }} (UTC {{ station.utc_offset/3600 }} hours)</td>
      </tr>

      <tr v-if="station.geo && station.geo.coordinates && station.geo.coordinates.length > 1">
        <th :class="$style.th">Coordinates</th>
        <td>
          {{ station.geo.coordinates[1] }}&deg;, {{ station.geo.coordinates[0] }}&deg;

          <a :href="`https://www.google.com/maps?q=${station.geo.coordinates[1]},${station.geo.coordinates[0]}`" target="_blank">Map</a>
        </td>
      </tr>

      <tr v-if="station.geo && station.geo.coordinates && station.geo.coordinates.length > 2">
        <th :class="$style.th">Elevation</th>
        <td>
          {{ station.geo.coordinates[2] }} m
        </td>
      </tr>

      <tr>
        <th :class="$style.th">Data Received</th>
        <td>{{ dataReceived }}</td>
      </tr>

      <tr>
        <th :class="$style.th">Air Temperature</th>
        <datapoint-td :id="`${station._id}-currAirTemp`" />
      </tr>

      <tr>
        <th :class="$style.th">Wind Speed</th>
        <datapoint-td :id="`${station._id}-currAirSpd`" />
      </tr>

      <tr>
        <th :class="$style.th">Wind Direction</th>
        <wind-direction-td :id="`${station._id}-currAirDir`" />
      </tr>

      <tr>
        <th :class="$style.th">Humidity</th>
        <datapoint-td :id="`${station._id}-currAirRH`" />
      </tr>

      <tr>
        <th :class="$style.th">PAR</th>
        <datapoint-td :id="`${station._id}-currSolPAR`" />
      </tr>

      <tr>
        <th :class="$style.th">Total Solar</th>
        <datapoint-td :id="`${station._id}-currSolRad`" />
      </tr>

      <tr>
        <th :class="$style.th">Barometric Pressure</th>
        <datapoint-td :id="`${station._id}-currAirBP`" />
      </tr>

      <tr>
        <th :class="$style.th">Precipitation Today</th>
        <aggregate-item-td :date="station.startOfToday" field="v_sum" :id="`${station._id}-twoDayPrecip`" />
      </tr>

      <tr>
        <th :class="$style.th">Precipitation Yesterday</th>
        <aggregate-item-td :date="station.startOfYesterday" field="v_sum" :id="`${station._id}-twoDayPrecip`" />
      </tr>

      <tr>
        <th :class="$style.th">Precipitation to Date</th>
        <aggregate-item-td :date="station.startOfWaterYear" field="v_sum" :id="`${station._id}-currYTDPrecip`" />
      </tr>
    </tbody>

  </table>
</template>

<script>
import moment from 'moment'
import AggregateItemTd from './AggregateItemTd'
import DatapointTd from './DatapointTd'
import WindDirectionTd from './WindDirectionTd'
import { mapGetters } from 'vuex'

export default {
  components: {
    AggregateItemTd,
    DatapointTd,
    WindDirectionTd
  },

  props: {
    station: Object
  },

  computed: {
    ...mapGetters({
      findDatapoints: 'datapoints/find'
    }),

    dataReceived () {
      const datapointsRes = this.findDatapoints({ query: {
        'datastream.station_id': this.station._id,
        $limit: 1,
        $sort: -1
      }})

      if (datapointsRes.data && datapointsRes.data.length) {
        return moment(datapointsRes.data[0].t).from()
      }
    }
  }
}
</script>

<style module>
.th {
  padding-right: .5rem;
  text-align: left;
}
</style>
