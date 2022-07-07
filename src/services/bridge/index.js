import eventsService from '@/services/events'

import service from './service'

export default {
  install (Vue, options) {
    Vue.prototype.$bridge = this

    this.$events = Vue.prototype.$events

    // 事件监听
    this.$events.on('after-mount', () => {
      return service.load()
        .then(() => {
          this.invoke('loaded')
        })
    })
  },

  /**
   * UI 调用 Bridge
   */
  invoke (method, args = [], options = {}) {
    return service.invoke(method, args, options)
  },

  /**
   * CEF 触发 UI
   */
  eventExec (method, args = null) {
    return service.trigger(method, args)
  },

  _processWs (res) {
    let error = null
    if (res === null) {
      error = new Error('返回值为 null')
    } else if (res === '') {
      error = new Error('返回值为空字符串')
    } else if (res === undefined) {
      error = new Error('返回值为 undefined')
    } else if (parseInt(res.return_main_status) === 1) {
      return {
        msg: res.return_msg,
        data: res.return_values
      }
    } else {
      error = new Error(res.return_msg)
      error.code = parseInt(res.return_main_status)
    }

    // 事件触发
    eventsService.emit('bridge.error', error)

    throw error
  },

  /**
   * UI 调用 CEF: 显示 WebView 调试工具
   */
  showDevTools () {
    return this.invoke('showDevTools', [])
  },

  /**
   * UI 调用 CEF: 最小化窗口
   */
  minimizeWindow () {
    return this.invoke('minimizeWindow', [])
  },

  /**
   * UI 调用 CEF: 打开屏幕键盘
   */
  openKeyboard () {
    return this.invoke('openKeyboard', [])
  },

  /**
   * UI 调用 CEF: 获取画面配置
   */
  settingsGet ({ topMenuId }, options) {
    return this.invoke('settingsGet', [topMenuId], options)
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 执行功能分子
   */
  molExec ({ topMenuId, uiUnitSetId, uiElementId }, options) {
    return this.invoke('molExec', [topMenuId, uiUnitSetId, uiElementId], options)
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 保存通用变量
   */
  paramsPut ({ paramsPath, paramsValue }, options) {
    return this.invoke('paramsPut', [paramsPath, paramsValue], options)
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 读取通用变量
   */
  paramsGet ({ paramsPath }, options) {
    return this.invoke('paramsGet', [paramsPath], options)
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取数据源
   */
  dataGet ({ topMenuId, uiUnitSetId, uiElementId }, options) {
    return this.invoke('dataGet', [topMenuId, uiUnitSetId, uiElementId], options)
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取系统状态
   */
  systemCheck () {
    return this.invoke('systemCheck', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取系统状态
   */
  systemMonitor () {
    return this.invoke('systemMonitor', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取系统配置
   */
  systemSettingsGet () {
    return this.invoke('systemSettingsGet', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 写入系统配置
   */
  systemSettingsPut ({
    defWs,
    posId,
    ptUid,
    coId,
    brId,
    deptId,
    clientLocation,
    printType,
    weightScalePort,
    printReceiptFlg,
    clientContent,
    fingerPort,
    fingerType,
    printPort,
    inputType,
    unitFlg,
    msgFlg,
    weightScaleType
  }) {
    return this.invoke('systemSettingsPut', [
      defWs,
      posId,
      ptUid,
      coId,
      brId,
      deptId,
      clientLocation,
      printType,
      weightScalePort,
      printReceiptFlg,
      clientContent,
      fingerPort,
      fingerType,
      printPort,
      inputType,
      unitFlg,
      msgFlg,
      weightScaleType
    ])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取系统连接类型
   */
  systemConnectSwitch ({ connectId }) {
    return this.invoke('systemConnectSwitch', [connectId])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取员工列表
   */
  staffListGet () {
    return this.invoke('staffListGet', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 修改员工密码
   */
  staffCgPwd ({ staffId, oldPwd, newPwd, newPwdRe }) {
    return this.invoke('staffCgPwd', [staffId, oldPwd, newPwd, newPwdRe])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 退出程序
   */
  systemExit () {
    return this.invoke('systemExit', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 员工登录
   */
  staffLogin ({ staffId, passWd }) {
    return this.invoke('staffLogin', [staffId, passWd])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 员工退出登录
   */
  staffLogout () {
    return this.invoke('staffLogout', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 员工挂起
   */
  staffHangup () {
    return this.invoke('staffHangup', [])
      .then(this._processWs)
  },

  /**
   * UI 调用 CEF: 获取称数据
   */
  getScale () {
    return this.invoke('getScale', [])
      .then(this._processWs)
  }
}
