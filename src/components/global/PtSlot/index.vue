<script>
export default {
  name: 'PtSlot',
  props: {
    topMenuId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      popup: null
    }
  },
  computed: {
    units () {
      return this.$ui.findUnitsBySlot(this.topMenuId, this.name)
    },
    unitsId () {
      return this.units.map(el => el.menu_id)
    },
    unitIndex () {
      let ret = null

      if (this.popup !== null) {
        ret = this.units.findIndex(el => el.menu_id === this.popup)
      } else if ('default' in this.$slots) {
        ret = null
      } else if (this.units.length === 1) {
        ret = 0
      } else if (this.units.length > 1) {
        ret = this.units.findIndex(el => parseInt(el.default_flg) === 1)
      }

      if (ret === -1) {
        ret = null
      }

      return ret
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
      const unit = this.$ui.findUnit(this.topMenuId, menuId)

      if (unit === null) {
        window.console.warn('🐞 无法匹配', this.topMenuId, menuId, '的 unit')
        return
      }

      // 跳过不属于本插槽的 unit
      if (unit.slot !== this.name) return

      // 跳过 openType 不是 inside 的事件
      if (openType !== 'inside') return

      this.popup = menuId
    },
    onBridgeCloseEvent ({ menuId }) {
      const unit = this.$ui.findUnit(this.topMenuId, menuId)
      if (unit.slot !== this.name) return

      if (this.popup === menuId) {
        this.popup = null
      }
    }
  },
  render (createElement) {
    if (this.unitIndex !== null) {
      return createElement({
        computed: {
          unit: () => {
            return this.units[this.unitIndex]
          }
        },
        template: `<div class="PtSlot">${this.units[this.unitIndex].ui_unit_file_content}</div>`
      })
    }

    return this.$slots.default
  }
}
</script>
