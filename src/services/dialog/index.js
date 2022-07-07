import dialogStoreModule from './dialogStoreModule'
import dialogHolderComponent from './dialogHolderComponent'

export default {
  install (Vue, options) {
    Vue.prototype.$dialog = this

    // 依赖注入
    this.store = options.store
    this.buttonLabels = {
      ok: options.okButtonLabel || 'OK',
      cancel: options.cancelButtonLabel || 'Cancel',
      yes: options.yesButtonLabel || 'Yes',
      no: options.noButtonLabel || 'No'
    }

    // Vuex 模块
    this.store.registerModule('dialog', dialogStoreModule)

    // Vue 组件
    Vue.component(dialogHolderComponent.name, dialogHolderComponent)
  },

  open ({ message, title = null, buttons = [], html = false }) {
    return new Promise((resolve, reject) => {
      this.store.dispatch('dialogOpen', {
        message,
        title,
        buttons,
        html,
        callback: resolve
      })
    })
  },

  close ({ id }) {
    return this.store.dispatch('dialogClose', { id })
  },

  alert (message, title = null, options = {}) {
    return this.open(Object.assign({
      message,
      title,
      buttons: [
        {
          value: 'ok',
          label: options.okButtonLabel || this._getButtonLabel('ok')
        }
      ]
    }, options))
  },

  confirm (message, title = null, options = {}) {
    return this.open(Object.assign({
      message,
      title,
      buttons: [
        {
          value: 'no',
          label: options.noButtonLabel || this._getButtonLabel('no'),
          secondary: true
        },
        {
          value: 'yes',
          label: options.yesButtonLabel || this._getButtonLabel('yes')
        }
      ]
    }, options))
  },

  _getButtonLabel (type) {
    if (type in this.buttonLabels) {
      if (typeof this.buttonLabels[type] === 'function') {
        return this.buttonLabels[type]()
      }
      return this.buttonLabels[type]
    }
    return 'Button'
  }
}
