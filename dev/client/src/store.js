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

feathersClient.service('datastreams').hooks({
  before: {
    find (context) {
      context.params.query.$limit = 2000
    }
  }
})

feathersClient.service('aggregates/request').hooks({
  after: {
    create (context) {
      context.result._id = context.params.localId
    }
  }
})

const plugins = [
  service('stations', {
    enableEvents: false,

    instanceDefaults: {
      datastreams: 'Datastream',

      get currentTime () {
        return this.utc_offset && moment().utc().add(this.utc_offset, 's')
      }
    }
  }),

  service('datastreams', {
    enableEvents: false,

    instanceDefaults: {
      get resolvedTerms () {
        return (this.tags_info && this.tags_info.resolved_terms) || []
      },

      get dsLabels () {
        return this.resolvedTerms.filter(term => term.scheme_id === 'ds').sort((a, b) => {
          return a.vocabulary_label.localeCompare(b.vocabulary_label)
        }).map(term => term.label)
      },

      get dtLabels () {
        return this.resolvedTerms.filter(term => term.scheme_id === 'dt').sort((a, b) => {
          return a.vocabulary_label.localeCompare(b.vocabulary_label)
        }).map(term => term.label)
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
    namespace: 'aggregateRequest'
  })
]

const createStore = (state) => {
  return new Vuex.Store({
    plugins,

    state: Object.assign({
    }, state),

    mutations: {

    },

    actions: {

    }
  })
}

export default createStore
