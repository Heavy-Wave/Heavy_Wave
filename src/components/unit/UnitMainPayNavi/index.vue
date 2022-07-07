<template>
  <div class="UnitMainPayNavi">

    <div class="unit-main-pay-navi-wrap">

      <tabs v-model="selected" v-if="model !== null && model.op_type !== null">
        <template slot="navs">
          <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">
            <template v-if="hasMeta">
              <tab-nav :value="'meta'">顾客信息</tab-nav>
            </template>
            <template v-if="hasCoupons">
              <tab-nav :value="'coupons'">用券</tab-nav>
            </template>
          </template>
          <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">
            <template v-if="hasMeta">
              <tab-nav :value="'meta'">退换货原因</tab-nav>
            </template>
          </template>

        </template>
      </tabs>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPayNavi',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  props: {
    elementGroupType: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      model: null,

      selected: 'meta'
    }
  },
  computed: {
    hasMeta () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '顾客信息')
    },
    hasCoupons () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '用券')
    }
  },
  watch: {
    selected (val) {
      let el
      switch (val) {
        case 'meta':
          el = this.$ui.findElementByUnit(this.unit, 'button', '顾客信息')
          break
        case 'coupons':
          el = this.$ui.findElementByUnit(this.unit, 'button', '用券')
          break
        default:
          el = null
      }
      if (el !== null) {
        this.onClickButton(el)
      }
    }
  },
  mounted () {
    Promise.all([
      this.load()
    ])
  },
  methods: {
    load () {
      this.$loading.show()
      return this.fetch()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetch () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '导航栏')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '导航栏':
          return this.load()
      }
    },

    /**
     * 回调：功能按钮被点击
     */
    onClickButton (uiElement) {
      this.$loading.show()
      this.$ui.runMoleculesByUiElement(this.unit.top_menu_id, uiElement)
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    }
  }
}
</script>

<style lang="scss">
.UnitMainPayNavi {
  height: 100%;
}
.unit-main-pay-navi-wrap {
  border-bottom: 1px solid #000000;
}
</style>
