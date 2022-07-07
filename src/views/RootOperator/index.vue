<template>
  <div class="ViewRootOperator">

    <template v-if="$sys.netStatusCode === $const.NET_STATUS.CODE.NORMAL">

      <template v-if="$sys.authStatus === $const.SYSTEM.LOGIN_STATUS.GUEST">
        <view-login />
      </template>

      <template v-if="$sys.authStatus === $const.SYSTEM.LOGIN_STATUS.LOGGED_IN">
        <view-operator />
      </template>

      <template v-if="$sys.authStatus === $const.SYSTEM.LOGIN_STATUS.HUNG_UP">
        <view-lock />
      </template>

    </template>

    <template v-else-if="$sys.netStatusCode < 0">
      <view-root-part-net-diag
        :code="$sys.netStatusCode"
        :message="$sys.netStatusMessage"
        @load="load"
      />
    </template>

    <view-root-part-modal-settings />

    <global-style-tag top-menu-id="POS_MAIN" />

  </div>
</template>

<script>
import GlobalStyleTag from '@/views/GlobalStyleTag'

import ViewLogin from '@/views/Login'
import ViewLock from '@/views/Lock'
import ViewOperator from '@/views/Operator'
import ViewRootPartModalSettings from './part-modal-settings'
import ViewRootPartNetDiag from './part-net-diag'
export default {
  name: 'ViewRootOperator',
  components: {
    GlobalStyleTag,
    ViewLogin,
    ViewLock,
    ViewOperator,
    ViewRootPartModalSettings,
    ViewRootPartNetDiag
  },
  created () {
    this.$events.on('bridge.loaded', this.onBridgeLoaded)
    this.$events.on('settings.changed', this.onSettingsChanged)
  },
  beforeDestroy () {
    this.$events.off('bridge.loaded', this.onBridgeLoaded)
    this.$events.off('settings.changed', this.onSettingsChanged)
  },
  methods: {
    load () {
      return Promise.resolve()
        .then(() => {
          this.$loading.show('正在获取系统信息')
          return this.$sys.load()
            .finally(() => {
              this.$loading.hide('正在获取系统信息')
            })
        })
        .then(() => {
          this.$loading.show('正在获取界面配置')
          return this.fetchUi()
            .finally(() => {
              this.$loading.hide('正在获取系统配置')
            })
        })
        .then(() => {
          this.$sys.clearNetStatus()
        })
        .catch(error => {
          this.$dialog.alert(
            `错误信息：${error.message}`,
            '程序初始化失败',
            {
              buttons: [
                { value: 'settings', label: '系统设置', secondary: true },
                { value: 'retry', label: '重试' }
              ]
            }
          )
            .then(value => {
              switch (value) {
                case 'settings':
                  this.$store.dispatch('modalShow', 'settings')
                  break
                default:
                  window.location.reload()
              }
            })
        })
    },

    /**
     * 业务：获取界面配置
     */
    fetchUi () {
      return this.$ui.load('POS_MAIN')
    },

    /**
     * 回调：原生桥加载完毕
     */
    onBridgeLoaded () {
      this.$bridge.showDevTools()

      this.load()
    },

    /**
     * 回调：系统设置被改变
     */
    onSettingsChanged () {
      return this.load()
    }
  }
}
</script>

<style lang="scss">
.ViewRootOperator {
}
</style>
