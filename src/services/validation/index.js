export default {
  install (Vue, options) {
    Vue.prototype.$validation = this
  },

  /**
   * 判断给定值是否不为空
   */
  notNull (value) {
    return value !== null && typeof value !== 'undefined'
  },

  /**
   * 判断给定值是否不为空白
   */
  notBlank (value) {
    if (value === null || typeof value === 'undefined') {
      return false
    }
    if (typeof value === 'object') {
      return true
    }
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    if (typeof value === 'number') {
      return value > 0
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    if (typeof value === 'boolean') {
      return value === true
    }
    if (typeof value === 'symbol') {
      return true
    }
    return false
  }
}
