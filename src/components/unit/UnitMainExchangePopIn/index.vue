<template>
  <div class="UnitMainExchangePopIn">

    <div class="unit-main-ret-pop-bd">

      <div class="unit-main-ret-pop-col">
        <div class="unit-main-ret-pop-content" v-if="model !== null && model.sales_dtl !== null">
          <div class="unit-main-ret-pop-line" v-for="item in model.sales_dtl" :key="item.key">
            <div class="unit-main-ret-pop-lbl">{{ item.label }}</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="item.key === 'qty'">
                <form-input :value="item.values.toString()" disabled />
              </template>
              <template v-else-if="item.key === 'sales_real_amt'">
                <form-input :value="item.values.toString()" disabled />
              </template>
              <template v-else-if="item.values !== null">
                <form-input :value="item.values.toString()" disabled />
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="unit-main-ret-pop-col narrow">
        <div class="unit-main-ret-pop-actions">
          <template v-if="hasPlus">
            <btn @click="onClickPlus">&plus;</btn>
          </template>
          <template v-if="hasMinus">
            <btn @click="onClickMinus">&minus;</btn>
          </template>
          <template v-if="hasQuantity">
            <btn @click="onClickQuantity">数</btn>
          </template>
        </div>
      </div>

    </div>

    <div class="unit-main-ret-pop-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">返回</btn>
      </template>
      <template v-if="hasOk">
        <btn primary @click="onClickOk">确认</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainExchangePopIn',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      quantity: 1
    }
  },
  computed: {
    hasPlus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '加号')
    },
    hasMinus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '减号')
    },
    hasQuantity () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '数')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品信息')
    },

    modelId () {
      if (this.model !== null && this.model.sales_dtl !== null) {
        const item = this.model.sales_dtl.find(el => el.key === 'item_id')
        if (item) {
          return item.values
        }
      }

      return null
    },
    modelQty () {
      if (this.model !== null && this.model.sales_dtl !== null) {
        const item = this.model.sales_dtl.find(el => el.key === 'qty')
        if (item) {
          return item.values
        }
      }

      return null
    },
    modelAmt () {
      if (this.model !== null && this.model.sales_dtl !== null) {
        const item = this.model.sales_dtl.find(el => el.key === 'sales_real_amt')
        if (item) {
          return item.values
        }
      }

      return null
    },
    modelPrice () {
      if (this.model !== null && this.model.sales_dtl !== null) {
        const item = this.model.sales_dtl.find(el => el.key === 'std_price')
        if (item) {
          return item.values
        }
      }

      return null
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品信息':
          return this.load()
      }
    },

    /**
     * 回调：加号按钮被点击
     */
    onClickPlus () {
      this.quantity = Math.min(999999, this.quantity + 1)
    },

    /**
     * 回调：减号按钮被点击
     */
    onClickMinus () {
      this.quantity = Math.max(1, this.quantity - 1)
    },

    /**
     * 回调：“数”按钮被点击
     */
    onClickQuantity () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '数')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“返回”按钮被点击
     */
    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '返回')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“确认”按钮被点击
     */
    onClickOk () {
      this.$loading.show()
      if (this.modelId === null) return
      if (this.quantity === null) return

      return Promise.all([
        this.$ui.setData(this.modelId.toString(), 'posMain.PartReturn.selected.ItemID'),
        this.$ui.setData(this.modelQty.toString(), 'posMain.PartReturn.ItemQty'),
        this.$ui.setData(this.modelAmt.toString(), 'posMain.PartReturn.ItemAmt') // TODO
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定')
        })
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
.UnitMainExchangePopIn {
}
</style>
