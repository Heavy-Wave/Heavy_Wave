<template>
  <div class="UnitMainExchangePopEqual">

    <div class="unit-main-ret-pop-bd">

      <div class="unit-main-ret-pop-col">
        <div class="unit-main-ret-pop-title">退入</div>
        <div class="unit-main-ret-pop-content" v-if="modelIn !== null && modelIn.sales_dtl !== null">
          <div class="unit-main-ret-pop-line" v-for="item in modelIn.sales_dtl" :key="item.key">
            <div class="unit-main-ret-pop-lbl">{{ item.label }}</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="item.key === 'qty'">
                <form-input :value="quantity.toString()" disabled />
              </template>
              <template v-else-if="item.key === 'sales_real_amt'">
                <form-input :value="(modelInPrice * quantity).toString()" disabled />
              </template>
              <template v-else-if="item.values !== null">
                <form-input :value="item.values.toString()" disabled />
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="unit-main-ret-pop-col narrow">
        <div class="unit-main-ret-pop-actions with-title">
          <btn @click="onClickPlus">&plus;</btn>
          <btn @click="onClickMinus">&minus;</btn>
          <template v-if="hasQuantity">
            <btn @click="onClickQuantity">数</btn>
          </template>
          <template v-if="hasSearch">
            <btn @click="onSearch">查</btn>
          </template>
        </div>
      </div>

      <div class="unit-main-ret-pop-col">
        <div class="unit-main-ret-pop-title">换出</div>
        <div class="unit-main-ret-pop-content">
          <div class="unit-main-ret-pop-line" v-if="hasInputSearch">
            <div class="unit-main-ret-pop-lbl">商品编号</div>
            <div class="unit-main-ret-pop-ctrl">
              <form-input
                v-model="keywords"
                type="text"
                pattern="\d*"
                placeholder="输入商品编号"
                @keypress.enter="onSearch"
              />
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">商品名称</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelOutInfo !== null">
                <form-input :value="modelOutInfo.item_name.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">标准单价</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelOutInfo !== null">
                <form-input :value="modelOutInfo.std_price.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">商品数量</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelOutInfo !== null">
                <form-input :value="quantity.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="unit-main-ret-pop-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">返回</btn>
      </template>
      <template v-if="hasOk">
        <btn primary @click="onClickOk">确认换货</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainExchangePopEqual',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelIn: null,
      modelOut: null,

      keywords: '',
      quantity: 1
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确认换货')
    },
    hasQuantity () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '数')
    },
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '查')
    },
    hasInputSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '检索框')
    },
    hasDetailsIn () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品信息')
    },
    hasDetailsOut () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品信息2')
    },

    modelInId () {
      if (this.modelIn !== null && this.modelIn.sales_dtl !== null) {
        const item = this.modelIn.sales_dtl.find(el => el.key === 'item_id')
        if (item) {
          return item.values
        }
      }

      return null
    },

    modelInPrice () {
      if (this.modelIn !== null && this.modelIn.sales_dtl !== null) {
        const item = this.modelIn.sales_dtl.find(el => el.key === 'std_price')
        if (item) {
          return item.values
        }
      }

      return null
    },

    modelOutInfo () {
      if (this.modelOut !== null && Array.isArray(this.modelOut.itme_info) && this.modelOut.itme_info.length > 0) {
        return this.modelOut.itme_info[0]
      }

      return null
    }
  },
  mounted () {
    Promise.all([
      this.loadIn()
    ])
  },
  methods: {
    loadIn () {
      this.$loading.show()
      return this.fetchIn()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchIn () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelIn = data
        })
    },

    loadOut () {
      this.$loading.show()
      return this.fetchOut()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchOut () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品信息2')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelOut = data
        })
        .then(() => {
          if (this.modelOutInfo !== null && this.modelOutInfo.qty !== null) {
            this.quantity = this.modelOutInfo.qty
          }
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品信息':
          return this.loadIn()
        case '商品信息2':
          return this.loadOut()
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
     * 回调：搜索框被回车
     */
    onSearch () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.keywords.toString(), 'posMain.Return.search.ItemID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '查')
        })
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
      if (this.modelInId === null) return
      if (this.quantity === null) return
      if (this.modelOutInfo === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.modelInId.toString(), 'posMain.PartReturn.selected.ItemID'),
        this.$ui.setData(this.quantity.toString(), 'posMain.PartReturn.ItemQty'),
        this.$ui.setData((this.modelInPrice * this.quantity).toString(), 'posMain.PartReturn.ItemAmt'),
        this.$ui.setData(this.modelOutInfo.item_id.toString(), 'posMain.PartReturn.search.ItemID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确认换货')
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
.UnitMainExchangePopEqual {
}
</style>
