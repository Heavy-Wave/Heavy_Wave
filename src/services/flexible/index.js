export default {
  install (Vue, options) {
    Vue.prototype.$flexible = this

    window.addEventListener('load', this.setRemUnit)

    window.addEventListener('resize', this.setRemUnit)
  },

  setRemUnit () {
    let rem = process.env.VUE_APP_FLEXIBLE_REM_UNIT

    if (window.innerWidth >= window.innerHeight) {
      // 横屏
      rem = Math.min(1440, Math.max(768, window.innerHeight)) / 768 * process.env.VUE_APP_FLEXIBLE_REM_UNIT
    } else {
      // 竖屏
      rem = Math.min(2560, Math.max(1024, window.innerWidth)) / 1024 * process.env.VUE_APP_FLEXIBLE_REM_UNIT
    }

    window.document.documentElement.style.fontSize = rem + 'px'
  },

  trans (px) {
    return px / process.env.VUE_APP_FLEXIBLE_REM_UNIT
  }
}
