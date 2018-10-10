import Vue from 'vue'
import store from './store'
import { degreesToName, SeqQueue } from './lib/utils'

const seqQueue = new SeqQueue()

Vue.config.productionTip = false

Vue.filter('degreesToName', degreesToName)

Vue.mixin({
  computed: {
    dataset () {
      return this.$root.$options.dataset
    }
  },

  methods: {
    seqPush (...args) {
      return seqQueue.push(...args)
    }
  }
})

function mount (element) {
  const dataset = JSON.parse(JSON.stringify(element.dataset))
  const { tag } = dataset

  if (!tag) return Promise.reject(new Error('Attribute data-tag undefined'))

  return import(/* webpackMode: "eager" */ `./apps/${tag}.vue`).then(module => {
    return new Vue({
      dataset,
      store,
      render: h => h(module.default)
    }).$mount(element)
  })
}

Array.prototype.filter.call(document.getElementsByClassName('dendra-app'), el => el.nodeName === 'DIV').forEach(div => {
  mount(div).then(app => {
    console.info(`Mounted ${app.dataset.tag}`)
  }).catch(err => {
    console.error(err.message)
  })
})
