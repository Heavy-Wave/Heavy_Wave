export default {
  install (Vue, options) {
    Vue.prototype.$message = this

    // 依赖注入
    this.$dialog = Vue.prototype.$dialog
    this.$toast = Vue.prototype.$toast
  },

  notice (content) {
    return this.$dialog.alert(content.toString(), '提示')
  },

  error (error) {
    window.console.warn(error)
    switch (error.code) {
      case 2:
        return this.$toast.info(error.message, { ttl: 2e3 })
      default:
        return this.$dialog.alert(error.message, '提示')
    }
  }
}
