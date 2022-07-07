import loadingStoreModule from './loadingStoreModule'
import loadingHolderComponent from './loadingHolderComponent'

export default {
  install (Vue, options) {
    Vue.prototype.$loading = this

    // 依赖注入
    this.$store = options.store

    // Vuex 模块
    this.$store.registerModule('loading', loadingStoreModule)

    // Vue 组件
    Vue.component(loadingHolderComponent.name, loadingHolderComponent)
  },

  /**
   * 显示加载提示
   *
   * @param {String} 提示文本
   */
  show (mark = null) {
    return this.$store.dispatch('showLoading', { mark })
  },

  /**
   * 隐藏加载提示
   *
   * @param {String} 提示文本
   */
  hide (mark = null) {
    return this.$store.dispatch('hideLoading', { mark })
  }
}
