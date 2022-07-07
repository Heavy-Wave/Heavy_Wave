import EventEmitter from 'events-promisify'

export default {
  install (Vue) {
    Vue.prototype.$events = this

    this.ee = new EventEmitter()
  },

  on (eventName, listener) {
    return this.ee.on(eventName, listener)
  },

  once (eventName, listener) {
    return this.ee.once(eventName, listener)
  },

  off (eventName, listener) {
    return this.ee.off(eventName, listener)
  },

  emit (eventName, ...args) {
    return this.ee.emit(eventName, ...args)
  }
}
