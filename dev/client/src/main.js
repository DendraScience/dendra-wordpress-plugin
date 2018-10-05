import Vue from 'vue'
import createStore from './store'

Vue.config.productionTip = false

function mount (element) {
  const data = JSON.parse(JSON.stringify(element.dataset))

  if (!data.tag) return Promise.reject(new Error('Attribute data-tag undefined'))

  return import(/* webpackMode: "eager" */ `./apps/${data.tag}.vue`).then(module => {
    return {
      app: new Vue({
        store: createStore(data),
        render: h => h(module.default)
      }).$mount(element),

      tag: data.tag
    }
  })
}

Array.prototype.filter.call(document.getElementsByClassName('dendra-app'), el => el.nodeName === 'DIV').forEach(div => {
  mount(div).then(({tag}) => {
    console.info(`Mounted ${tag}`)
  }).catch(err => {
    console.error(err.message)
  })
})
