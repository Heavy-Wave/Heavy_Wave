import keyboardStoreModule from './keyboardStoreModule'
import keyboardHolderComponent from './keyboardHolderComponent'

export default {
  install (Vue, options) {
    Vue.prototype.$kbd = this

    // 依赖注入
    this.$store = options.store

    // Vuex 模块
    this.$store.registerModule('keyboard', keyboardStoreModule)

    // Vue 组件
    Vue.component(keyboardHolderComponent.name, keyboardHolderComponent)
  },

  show ({ target, type }) {
    return this.$store.dispatch('showKeyboard', { vnode: target.$vnode, type })
  },

  hide () {
    return this.$store.dispatch('hideKeyboard')
  },

  getStatus () {
    return this.$store.getters.keyboard
  }

}
