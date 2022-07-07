<template>
  <div class="PtSlotPopHolder">

    <modal
      v-for="popup in popups"
      :key="popup.menuId"
      :value="true"
      :width="parseInt(popup.size.widthRatio) || 0"
      :height="parseInt(popup.size.heightRatio) || 0"
    >

      <template slot="header">{{ $ui.findUnit(topMenuId, popup.menuId).menu_name }}</template>

      <pt-slot-pop-item :unit="$ui.findUnit(topMenuId, popup.menuId)" />

    </modal>

  </div>
</template>

<script>
export default {
  name: 'PtSlotPopHolder',
  props: {
    topMenuId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      popups: []
    }
  },
  computed: {
    units () {
      return this.$ui.findUnitsBySlot(this.topMenuId, 'pop')
    }
  },
  created () {
    this.$events.on('bridge.trigger.popup', this.onBridgePopupEvent)
    this.$events.on('bridge.trigger.close', this.onBridgeCloseEvent)
  },
  beforeDestroy () {
    this.$events.off('bridge.trigger.popup', this.onBridgePopupEvent)
    this.$events.off('bridge.trigger.close', this.onBridgeCloseEvent)
  },
  methods: {
    onBridgePopupEvent ({ menuId, openType, size }) {
      // 跳过 openType 不是 popup 的事件
      if (openType !== 'popup') return

      const unit = this.$ui.findUnit(this.topMenuId, menuId)

      if (unit === null) {
        window.console.warn('🐞 无法匹配', this.topMenuId, menuId, '的 unit')
        return
      }

      // 跳过插槽不是 pop 的 unit
      if (unit.slot !== 'pop') return

      if (!this.popups.some(el => el.menuId === menuId)) {
        this.popups.push({ menuId, size })
      }
    },
    onBridgeCloseEvent ({ menuId }) {
      if (this.popups.some(el => el.menuId === menuId)) {
        this.popups.splice(this.popups.findIndex(el => el.menuId === menuId), 1)
      }
    }
  }
}
</script>
