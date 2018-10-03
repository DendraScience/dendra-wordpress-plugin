import Vue from 'vue'
import Weather from './apps/Weather.vue'
import createStore from './store'

Vue.config.productionTip = false

function mount (className, App) {
  const els = document.getElementsByClassName(className)

  Array.prototype.filter.call(els, el => el.nodeName === 'DIV').forEach(div => {
    new Vue({
      store: createStore(),
      render: h => h(App)
    }).$mount(div)
  })
}

mount('dendra-weather-app', Weather)
