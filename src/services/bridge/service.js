import setup from './setup'
import eventsService from '@/services/events'

export default {
  active: null,
  desktopBridge: null,
  mobileBridge: null,

  /**
   * 初始化
   *
   * @returns Promise
   */
  load () {
    if (this._isAndroid() || this._isIOS()) {
      return this._loadForMobile()
    } else {
      return this._loadForDesktop()
    }
  },

  /**
   * 主调
   *
   * @returns Promise
   */
  invoke (method, args = [], options = {}) {
    window.console.debug('🚀', '[主调]', method, args, '开始')

    let runner = null

    switch (this.active) {
      case 'desktop':
        if (typeof this.desktopBridge[method] !== 'function' && method !== 'loaded') {
          return Promise.reject(new Error('原生桥方法不存在'))
        }
        if (method === 'loaded') {
          return Promise.resolve(null)
        }
        runner = () => this.desktopBridge[method](...args)
        break
      case 'mobile':
        runner = () => new Promise(resolve => {
          this.mobileBridge.callHandler('default', { method, args }, resolve)
        })
        break
      default:
        return Promise.reject(new Error('原生桥不存在'))
    }

    const waiter = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`接口 ${method} 调用超时`))
      }, options.timeout > 0 ? parseInt(options.timeout) : parseInt(process.env.VUE_APP_BRIDGE_INVOKE_TIMEOUT))
    })

    return Promise.race([
      runner(),
      waiter
    ])
      .then(res => {
        if (typeof res === 'string') {
          try {
            res = JSON.parse(res)
          } catch (e) { }
        }

        window.console.debug('✅', '[主调]', method, args, '成功:', res)

        return res
      })
      .catch(error => {
        const message = error instanceof Error ? error.message : error

        window.console.debug('🚫', '[主调]', method, args, '失败:', message)

        throw new Error(message)
      })
  },

  /**
   * 被调
   *
   * @returns Promise
   */
  trigger (method, args) {
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args)
      } catch (e) { }
    }

    window.console.debug('🚀', '[被调]', method, args)

    return eventsService.emit(`bridge.trigger.${method}`, args)
  },

  /**
   * 桌面端初始化
   *
   * @returns Promise
   */
  _loadForDesktop () {
    const runner = new Promise((resolve, reject) => {
      eventsService.once('bridge.trigger.loaded', () => {
        if (!('bridge' in window) || typeof window.bridge !== 'object' || window.bridge === null) {
          throw new Error('原生桥初始化失败')
        }

        window.console.debug('🚀', '初始化成功:', window.bridge)

        this.desktopBridge = window.bridge

        this._onReadyForDesktop()

        resolve()
      })
    })

    const waiter = new Promise((resolve, reject) => {
      setTimeout(function () {
        reject(new Error('原生桥初始化超时'))
      }, parseInt(process.env.VUE_APP_BRIDGE_INITIALIZATION_TIMEOUT))
    })

    return Promise.race([runner, waiter])
  },

  /**
   * 移动端初始化
   *
   * @returns Promise
   */
  _loadForMobile () {
    const runner = new Promise((resolve, reject) => {
      setup(bridge => {
        window.console.debug('🚀', '初始化成功:', bridge)

        this.mobileBridge = bridge

        this._onReadyForMobile()

        resolve()
      })
    })

    const waiter = new Promise((resolve, reject) => {
      setTimeout(function () {
        reject(new Error('原生桥初始化超时'))
      }, 3e3)
    })

    return Promise.race([runner, waiter])
  },

  _onReadyForDesktop () {
    this.active = 'desktop'
    this._onReady()
  },

  _onReadyForMobile () {
    this.active = 'mobile'
    this._onReady()
  },

  _onReady () {
    window.console.debug('🚀', '准备就绪:', this.active)

    switch (this.active) {
      case 'mobile':
        // 监听原生桥调用
        this.mobileBridge.registerHandler('default', (data, responseCallback) => {
          data = JSON.parse(data)
          this.trigger(data.method, data.args)
            .then(responseCallback)
        })
        break
    }

    eventsService.emit('bridge.loaded')
  },

  _isAndroid () {
    return (/Android/i.test(window.navigator.userAgent))
  },

  _isIOS () {
    return (/iPhone|iPad|iPod/i.test(window.navigator.userAgent))
  }
}
