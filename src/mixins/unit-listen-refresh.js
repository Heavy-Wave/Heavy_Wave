export default {
  created () {
    this.$events.on('bridge.trigger.refresh', this.onBridgeRefreshEvent)
  },
  beforeDestroy () {
    this.$events.off('bridge.trigger.refresh', this.onBridgeRefreshEvent)
  },
  methods: {
    onBridgeRefreshEvent ({ topMenuId, menuId, elementGroupType }) {
      // 跳过 如果当前 unit 为空
      if (typeof this.unit === 'undefined' || this.unit === null) return

      // 跳过 如果当前 unit 不是指定的 unit
      if (this.unit.top_menu_id !== topMenuId || this.unit.menu_id !== menuId) return

      // 查询指定的 dataSource 类型的 uiElement
      const element = this.unit.ui_element.find(
        el =>
          el !== null &&
          el.elements_type === 'dataSource' &&
          el.element_group_type === elementGroupType
      )

      // 跳过 如果 uiElement 为空
      if (typeof element === 'undefined' || element === null) return

      // 执行勾子
      if (typeof this.onBridgeRefresh === 'function') {
        this.onBridgeRefresh({
          elementGroupType: element.element_group_type
        })
      }
    }
  }
}
