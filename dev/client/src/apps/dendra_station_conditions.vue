<template>
  <div class="dendra-app dendra-station-oneday">
    <section v-for="station in stations" :key="station._id">
      <h2>{{ station.name }} <small v-if="isFetchPending">(Updating...)</small></h2>

      <station-conditions :station="station" />
<!-- NOTE: For debug only -->
<!--
      <table>
        <tr v-for="datastream in station.datastreams" :key="datastream._id">
          <td>{{ datastream._id }}</td>
          <td>{{ datastream.name }}</td>
          <td>{{ datastream.tagKey }}</td>
        </tr>
      </table>
 -->
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import StationConditions from '@/components/StationConditions'
import { mapActions, mapGetters, mapState } from 'vuex'
import { currYTDPrecip, twoDayPrecip } from '@/lib/aggregate-factory'

export default {
  components: {
    StationConditions
  },

  data () {
    return {
      isFetchPending: false
    }
  },

  mounted () {
    this.fetch()
  },

  computed: {
    ...mapGetters({
      findAggregateRequests: 'aggregateRequest/find',
      findDatastream: 'datastreams/findOne',
      findStations: 'stations/find'
    }),

    ...mapState({
      slug: 'attSlug'
    }),

    stations () {
      return this.findStations({ query: this.stationsQuery }).data
    },

    stationsQuery () {
      return {
        enabled: true,
        slug: this.slug || '',
        $limit: 1
      }
    }
  },

  methods: {
    ...mapActions({
      fetchDatapoints: 'datapoints/find',
      fetchStations: 'stations/find'
    }),

    clearTimer () {
      if (this.timerId) clearTimeout(this.timerId)
      this.timerId = null
    },

    startTimer (interval) {
      this.clearTimer()

      this.timerId = setTimeout(() => {
        this.timerId = null
        this.fetch()
      }, interval)
    },

    async fetch () {
      this.clearTimer()
      this.isFetchPending = true

      const stationsRes = await this.fetchStations({ query: this.stationsQuery })

      const { AggregateRequest } = this.$FeathersVuex

      for (const station of stationsRes.data) {
        const time = station.currentTime.clone().subtract(24, 'h').toISOString()

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Air_Temperature_DegreeCelsius',
          label: 'currAirTemp'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Air_Speed_MeterPerSecond',
          label: 'currAirSpd'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Air_Direction_DegreeAngle',
          label: 'currAirDir'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Air_RelativeHumidity_Percent',
          label: 'currAirRH'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Solar_PhotosyntheticallyActiveRadiation_MicromolePerSquareMeter',
          label: 'currSolPAR'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Solar_Radiation_WattPerSquareMeter',
          label: 'currSolRad'
        })

        await this.fetchCurrDatapoint({
          station,
          time,
          tagKey: 'Average_Air_BarometricPressure_Millibar',
          label: 'currAirBP'
        })

        const offset = station.utc_offset
        const offsetEdit = offset < 0 ? `su_${-offset}_s` : `ad_${offset}_s` // HACK: Or by design?
        const datastream = this.findDatastream({ query: {
          attributes: { $exists: false },
          station_id: station._id,
          tagKey: 'Precipitation_Height_Millimeter'
        } })

        if (!datastream) {
          console.warn(`Datastream Precipitation_Height_Millimeter not found for station ${station._id}`)
        } else {
          let aggReq

          aggReq = new AggregateRequest(currYTDPrecip({
            datastreamId: datastream._id,
            offsetEdit
          }))

          await aggReq.create({
            assign: {
              _id: `${station._id}-currYTDPrecip`,
              datastream
            }
          })

          aggReq = new AggregateRequest(twoDayPrecip({
            datastreamId: datastream._id,
            offsetEdit
          }))

          await aggReq.create({
            assign: {
              _id: `${station._id}-twoDayPrecip`,
              datastream
            }
          })
        }
      }

      this.isFetchPending = false

      /*
        Schedule refresh based on whether there are pending aggregate requests.
       */

      const aggReqRes = this.findAggregateRequests({ query: {
        isPending: true
      }})

      this.startTimer(aggReqRes.data & aggReqRes.data.length ? 20000 : 600000)
    },

    async fetchCurrDatapoint ({station, time, tagKey, label}) {
      const datastream = this.findDatastream({ query: {
        attributes: { $exists: false },
        station_id: station._id,
        tagKey
      } })

      if (!datastream) {
        console.warn(`Datastream ${tagKey} not found for station ${station._id}`)
      } else {
        await this.fetchDatapoints({
          query: {
            datastream_id: datastream._id,
            time,
            time_local: true,
            $limit: 1
          },
          assign: {
            _id: `${station._id}-${label}`,
            datastream
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
