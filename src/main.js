import Vue from 'vue'
import App from '@/App'

import store from '@/store'
import router from '@/router'

import filters from '@/filters'
import components from '@/components'
import directives from '@/directives'

import eventsService from '@/services/events'
import constService from '@/services/const'
import bridgeService from '@/services/bridge'
import uiService from '@/services/ui'
import sysService from '@/services/sys'
import dialogService from '@/services/dialog'
import messageService from '@/services/message'
import loadingService from '@/services/loading'
import validationService from '@/services/validation'
import kbdService from '@/services/kbd'
import flexibleService from '@/services/flexible'

Vue
  .use(filters)
  .use(components, { store })
  .use(directives)
  .use(eventsService)
  .use(constService)
  .use(bridgeService)
  .use(uiService)
  .use(sysService)
  .use(dialogService, { store })
  .use(messageService)
  .use(loadingService, { store })
  .use(validationService)
  .use(kbdService, { store })
  .use(flexibleService)

Vue.config.productionTip = false

// 将根 Vue 实例注入到 `window` 对象
window.$app = new Vue({
  router,
  store,
  created () {
    // 初始化
    return Promise.resolve()
      .then(() => {
        return this.$events.emit('before-mount')
      })
      .then(() => {
        this.$mount('#app')
      })
      .then(() => {
        return this.$events.emit('after-mount')
      })
      .catch(error => {
        window.console.error(error)
        window.alert(`错误：${error.message}`)
      })
  },
  render: h => h(App)
})
