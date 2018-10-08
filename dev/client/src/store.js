import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from './lib/feathers-client'
import { shallowPopulate } from 'feathers-shallow-populate'

import moment from 'moment'

const { service, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '_id',
  replaceItems: true
})

Vue.use(Vuex)
Vue.use(FeathersVuex)

feathersClient.service('stations').hooks({
  after: {
    all: shallowPopulate({ include: {
      service: 'datastreams',
      nameAs: 'datastreams',
      keyHere: '_id',
      keyThere: 'station_id'
    } })
  }
})

feathersClient.service('datapoints').hooks({
  after: {
    find ({ params, result }) {
      const { assign } = params

      if (typeof assign === 'function') {
        result.data = result.data.map((item, index) => Object.assign(item, assign(item, index)))
      } else if (assign) {
        result.data = result.data.map(item => Object.assign(item, assign))
      }
    }
  }
})

feathersClient.service('datastreams').hooks({
  before: {
    find ({ params }) {
      params.query.$limit = 2000
    }
  }
})

feathersClient.service('aggregates/request').hooks({
  after: {
    create ({ params, result }) {
      const { assign } = params

      if (typeof assign === 'function') {
        Object.assign(result, assign(result))
      } else if (assign) {
        Object.assign(result, assign)
      }
    }
  }
})

const plugins = [
  service('stations', {
    enableEvents: false,

    instanceDefaults: {
      datastreams: 'Datastream',

      get currentTime () {
        const offset = this.utc_offset
        if (typeof offset === 'number') return moment().utc().add(offset, 's')
      },

      get startOfToday () {
        const { currentTime } = this
        if (currentTime) return currentTime.clone().startOf('d')
      },

      get startOfYesterday () {
        const { currentTime } = this
        if (currentTime) return currentTime.clone().startOf('d').subtract(1, 'd')
      },

      get startOfWaterYear () {
        const { currentTime } = this
        if (currentTime) return currentTime.clone().startOf('M').subtract(9, 'M').startOf('y').add(9, 'M')
      }
    }
  }),

  service('datapoints', {
    enableEvents: false
  }),

  service('datastreams', {
    enableEvents: false,

    getters: {
      findOne (state, { find }) {
        return (params) => {
          const res = find(params)
          return res.data && res.data[0]
        }
      }
    },

    instanceDefaults: {
      get abbreviation () {
        // Memoized getter
        if (!this.__abbreviation) {
          const { dtTerms } = this
          if (dtTerms && dtTerms[0]) this.__abbreviation = dtTerms[0].abbreviation
        }

        return this.__abbreviation
      },

      get resolvedTerms () {
        return (this.tags_info && this.tags_info.resolved_terms) || []
      },

      get dsLabels () {
        return this.dsTerms.sort((a, b) => a.vocabulary_label.localeCompare(b.vocabulary_label)).map(term => term.label)
      },

      get dsTerms () {
        return this.resolvedTerms.filter(term => term.scheme_id === 'ds')
      },

      get dtLabels () {
        return this.dtTerms.sort((a, b) => a.vocabulary_label.localeCompare(b.vocabulary_label)).map(term => term.label)
      },

      get dtTerms () {
        return this.resolvedTerms.filter(term => term.scheme_id === 'dt')
      },

      get tagKey () {
        // Memoized getter
        if (!this.__tagKey) {
          this.__tagKey = this.dsLabels.concat(this.dtLabels).join('_')
        }

        return this.__tagKey
      }
    }
  }),

  service('aggregates/request', {
    enableEvents: false,
    modelName: 'AggregateRequest',
    namespace: 'aggregateRequest',

    getters: {
      isPending () {
        return (this.status)
      }
    }
  })
]

const createStore = (state) => {
  return new Vuex.Store({
    plugins,

    state: Object.assign({
    }, state)

    // getters: {

    // },

    // mutations: {

    // },

    // actions: {

    // }
  })
}

export default createStore
