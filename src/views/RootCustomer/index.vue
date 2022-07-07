<template>
  <div class="ViewRootCustomer">

    <view-customer />

    <global-style-tag top-menu-id="POS_CLIENT" />

  </div>
</template>

<script>
import GlobalStyleTag from '@/views/GlobalStyleTag'

import ViewCustomer from '@/views/Customer'
export default {
  name: 'ViewRootCustomer',
  components: {
    GlobalStyleTag,
    ViewCustomer
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
                { value: 'retry', label: '重试' }
              ]
            }
          )
            .then(() => {
              window.location.reload()
            })
        })
    },

    /**
     * 业务：获取界面配置
     */
    fetchUi () {
      return this.$ui.load('POS_CLIENT')
    },

    /**
     * 回调：原生桥加载完毕
     */
    onBridgeLoaded () {
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
.ViewRootCustomer {
}
</style>
