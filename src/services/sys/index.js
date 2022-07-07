export default {
  install (Vue, options) {
    Vue.prototype.$sys = new Vue({
      data () {
        return {
          /** @var Number 登录状态 */
          authStatus: null,

          /** @var String 登录店铺 */
          deptName: null,

          /** @var String 登录人 */
          staffName: null,

          /** @var String 登录模式 */
          connectId: null,

          /** @var String 当前时间 */
          localTime: null,

          /** @var Number 自动锁屏超时秒数 */
          lockSecs: null,

          /** @var String 锁屏提示文案 */
          lockNotice: null,

          /** @var String 版本号 */
          version: null,

          /** @var Object 当前系统配置值 */
          settings: null,

          /** @var String CPU 占用 */
          cpuPercent: null,

          /** @var String 总内存 */
          physicalMemory: null,

          /** @var String 可用内存 */
          memoryAvailable: null,

          /** @var Boolean 网络连接是否正常 */
          isNetworkOk: null,

          /** @var Number 日期时间（Unix 时间戳） */
          clock: null,

          /** @var Number 锁屏倒计时 */
          countdown: null,

          /** @var String 当前网络状态码 */
          netStatusCode: this.$const.NET_STATUS.CODE.NORMAL,

          /** @var String 当前网络状态描述 */
          netStatusMessage: null,

          /** @var String 当前常驻提示信息 */
          tips: null,

          mediaBaseUrl: '../media/',
          templateBaseUrl: '../template/'
        }
      },
      created () {
        this.resetCountdown()

        // 启动定时器
        this._statInterval = window.setInterval(() => {
          this.reloadStat()
        }, 10e3)
        this._clockInterval = window.setInterval(() => {
          this.reloadClock()
        }, 1e3)
        this._countdownInterval = window.setInterval(() => {
          this.reloadCountdown()
        }, 1e3)

        this.$events.on('auth.changed', this.onAuthChanged)
        this.$events.on('settings.changed', this.onSettingsChanged)
      },
      beforeDestroy () {
        // 取消定时器
        window.clearInterval(this._clockInterval)
        window.clearInterval(this._countdownInterval)
        window.clearInterval(this._statInterval)

        this.$events.off('auth.changed', this.onAuthChanged)
        this.$events.off('settings.changed', this.onSettingsChanged)
      },
      methods: {
        load () {
          return Promise.resolve()
            .then(() => {
              return this.$bridge.systemCheck()
                .then(({ msg, data }) => {
                  this.authStatus = (parseInt(data.loginStatus)) || 0
                  this.deptName = data.deptName
                  this.staffName = data.staffName
                  this.connectId = data.connectId
                  this.localTime = data.localTime
                  this.lockSecs = data.lockSecs
                  this.lockNotice = data.lockNotice
                  this.version = data.version

                  // 日期时间的初始值
                  this.clock = +new Date(data.localTime)
                })
            })
            .then(() => {
              return this.$bridge.systemSettingsGet()
                .then(({ msg, data }) => {
                  this.settings = data
                  this.settings.precisionPrice = 2 // TODO
                  this.settings.precisionQuantity = 3 // TODO
                })
            })
            .then(() => {
              this.$events.emit('sys.loaded')
            })
        },

        reloadStat () {
          return this.$bridge.systemMonitor()
            .then(({ msg, data }) => {
              this.cpuPercent = data.cpuPercent
              this.physicalMemory = data.physicalMemory
              this.memoryAvailable = data.memoryAvailable
              this.isNetworkOk = (parseInt(data.networkStatus) === 1)
            })
            .catch(error => {
              window.console.warn(error)
            })
        },

        reloadClock () {
          if (this.clock !== null) {
            this.clock += 1e3
          }
        },

        reloadCountdown () {
          if (this.authStatus === this.$const.SYSTEM.LOGIN_STATUS.LOGGED_IN) {
            if (this.countdown === null) {
              this.resetCountdown()
            } else {
              if (this.countdown <= 1) {
                this.hangUp()
              } else {
                this.countdown--
              }
            }
          }
        },

        resetCountdown () {
          this.countdown = this.lockSecs
        },

        /**
         * 更改网络状态信息
         */
        updateNetStatus ({ code, message }) {
          this.netStatusCode = code
          this.netStatusMessage = message
        },

        /**
         * 清空网络状态信息
         */
        clearNetStatus () {
          this.netStatusCode = this.$const.NET_STATUS.CODE.NORMAL
          this.netStatusMessage = null
        },

        /**
         * 更改常驻提示信息内容
         */
        updateTips (value) {
          this.tips = value
        },

        /**
         * 更改连接模式
         */
        updateConnectId (value) {
          return this.$bridge.systemConnectSwitch({ connectId: value })
        },

        /**
         * 最小化窗口
         */
        minimizeWindow () {
          return this.$bridge.minimizeWindow()
        },

        /**
         * 登录
         */
        login ({ staffId, passWd }) {
          return this.$bridge.staffLogin({
            staffId,
            passWd
          })
            .then(({ msg, data }) => {
              return this.$events.emit('auth.changed')
            })
        },

        /**
         * 退出登录
         */
        logout () {
          return this.$bridge.staffLogout()
            .then(({ msg, data }) => {
              return this.$events.emit('auth.changed')
            })
        },

        /**
         * 挂起
         */
        hangUp () {
          return this.$bridge.staffHangup()
            .then(({ msg, data }) => {
              return this.$events.emit('auth.changed')
            })
        },

        /**
         * 退出
         */
        exit () {
          return this.$bridge.systemExit()
        },

        /**
         * 回调：登录状态改变
         */
        onAuthChanged () {
          this.resetCountdown()

          return this.load()
        },

        /**
         * 回调：系统设置被改变
         */
        onSettingsChanged () {
          if (this.authStatus !== null) {
            this.logout()
          }

          return this.load()
        }
      }
    })
  }
}
