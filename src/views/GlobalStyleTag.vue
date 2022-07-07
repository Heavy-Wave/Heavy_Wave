<script>
export default {
  name: 'GlobalStyleTag',
  data () {
    return {
      // 样式：无印良品版
      colorPrimary: '#9b1222',
      colorSecondary: '#efefef',
      colorSelection: '#9b1222',
      colorBtnGroup: '#efefef',
      colorBtnGroupAlt: '#efefef',
      colorListHighlight: '#f9eeee',
      colorAlert: '#9b1222',
      colorDanger: '#9b172c',
      colorSecondaryContent: '#000000',
      colorPrimaryContent: '#ffffff',
      colorPrice: '#ff0000',
      colorBordered: '#9b1222'

      /*
      // 样式：戴永红版
      colorPrimary: '#365e8e',
      colorSecondary: '#365e8e',
      colorSelection: '#f17734',
      colorBtnGroup: '#e6eef7',
      colorBtnGroupAlt: '#f6f6f6',
      colorListHighlight: '#fafae1',
      colorAlert: '#29344d',
      colorDanger: '#c9172c',
      colorSecondaryContent: '#ffffff',
      colorPrimaryContent: '#ffffff',
      colorPrice: '#ff0000',
      colorBordered: '#29344d'
      */
    }
  },
  props: {
    topMenuId: {
      type: String,
      required: true
    }
  },
  computed: {
    css () {
      return `:root {
        --pt-color-primary: ${this.colorPrimary};
        --pt-color-secondary: ${this.colorSecondary};
        --pt-color-selection: ${this.colorSelection};
        --pt-color-btn-group: ${this.colorBtnGroup};
        --pt-color-btn-group-alt: ${this.colorBtnGroupAlt};
        --pt-color-list-highlight: ${this.colorListHighlight};
        --pt-color-alert: ${this.colorAlert};
        --pt-color-danger: ${this.colorDanger};
        --pt-color-secondary-content: ${this.colorSecondaryContent};
        --pt-color-primary-content: ${this.colorPrimaryContent};
        --pt-color-price: ${this.colorPrice};
        --pt-color-bordered: ${this.colorBordered};
      }`
    }
  },
  created () {
    this.$events.on('ui.loaded', this.onUiLoaded)
  },
  beforeDestroy () {
    this.$events.off('ui.loaded', this.onUiLoaded)
  },
  methods: {
    /**
     * 回调：界面配置加载完毕
     */
    onUiLoaded () {
      // 通过界面配置 sys_setting 获取样式值

      /** 颜色：主要按钮背景、Tab 栏、特殊画面背景 */
      this.colorPrimary = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '1').set_char1

      /** 颜色：次要按钮背景 */
      this.colorSecondary = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '2').set_char1

      /** 颜色：选中、气泡 */
      this.colorSelection = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '3').set_char1

      /** 颜色：按钮列表 1 */
      this.colorBtnGroup = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '4').set_char1

      /** 颜色：按钮列表 2 */
      this.colorBtnGroupAlt = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '5').set_char1

      /** 颜色：数据列表高亮选中 */
      this.colorListHighlight = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '6').set_char1

      /** 颜色：行内提示 */
      this.colorAlert = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '7').set_char1

      /** 颜色：警告按钮 */
      this.colorDanger = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '8').set_char1

      /** 颜色：次要按钮前景 */
      this.colorSecondaryContent = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '9').set_char1

      /** 颜色：主要按钮前景 */
      this.colorPrimaryContent = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '10').set_char1

      /** 颜色：金额文本 */
      this.colorPrice = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '11').set_char1

      /** 颜色：线框按钮 */
      this.colorBordered = this.$ui.getSysSetting(this.topMenuId, 'SYS_COLOR_TYPE', '12').set_char1
    }
  },
  render (createElement) {
    return createElement(
      'style',
      {
        attrs: {
          type: 'text/css'
        }
      },
      [
        this.css,
        this.$slots.default
      ]
    )
  }
}
</script>
