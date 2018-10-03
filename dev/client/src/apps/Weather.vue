<template>
  <div class="dendra-weather-app">

    <section v-for="station in stations" :key="station._id">

      <h1>{{ station.name }}</h1>

      <station-aggregates :station="station" />

      <table>
        <tr v-for="datastream in station.datastreams" :key="datastream._id">
          <td>{{ datastream._id }}</td>
          <td>{{ datastream.name }}</td>
          <td>{{ datastream.tagKey }}</td>
        </tr>
      </table>
    </section>

  </div>
</template>

<script>
import StationAggregates from '@/components/StationAggregates'
import { mapActions, mapGetters } from 'vuex'
import { avgByDayForMonth, sumByDayForMonth } from '@/lib/aggregate-factory'

export default {
  components: {
    StationAggregates
  },

  data () {
    return {
      isFetchPending: false,

      slugs: ['anza-borrego']
    }
  },

  mounted () {
    this.fetch()
  },

  computed: {
    ...mapGetters({
      findDatastreams: 'datastreams/find',
      findStations: 'stations/find'
    }),

    datastreams () {
      const { station } = this
      if (station) {
        return station.datastreams.sort((a, b) => a.tagKey.localeCompare(b.tagKey))
      }
    },

    stations () {
      return this.findStations({ query: this.stationsQuery }).data
    },

    stationsQuery () {
      return {
        slug: { $in: this.slugs }
      }
    }
  },

  methods: {
    ...mapActions({
      fetchStations: 'stations/find'
    }),

    async fetch () {
      this.isFetchPending = true

      const stationsRes = await this.fetchStations({ query: this.stationsQuery })
      const { AggregateRequest } = this.$FeathersVuex

      for (const station of stationsRes.data) {
        let aggReq

        aggReq = new AggregateRequest(sumByDayForMonth({
          datastreamId: this.findDatastreams({ query: {
            station_id: station._id,
            tagKey: 'Average_Solar_Radiation_WattPerSquareMeter'
          } }).data[0]._id,

          time: station.currentTime
        }))

        await aggReq.create({ localId: `${station._id}-totalSolRad` })

        aggReq = new AggregateRequest(avgByDayForMonth({
          datastreamId: this.findDatastreams({ query: {
            station_id: station._id,
            tagKey: 'Average_Air_Speed_MeterPerSecond'
          } }).data[0]._id,

          time: station.currentTime
        }))

        await aggReq.create({ localId: `${station._id}-avgAirSpeed` })
      }

      this.isFetchPending = false
    }
  }
}
</script>

<style>
</style>
