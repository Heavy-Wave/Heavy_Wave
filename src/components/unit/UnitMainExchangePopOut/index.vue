<template>
  <div class="UnitMainExchangePopOut">

    <div class="unit-main-ret-pop-bd">

      <div class="unit-main-ret-pop-col">
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
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.item_name.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">标准单价</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.std_price.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">商品折扣</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.dis_per.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">商品数量</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.qty.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">商品金额</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.sales_amt.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
              </template>
            </div>
          </div>
          <div class="unit-main-ret-pop-line">
            <div class="unit-main-ret-pop-lbl">折扣原因</div>
            <div class="unit-main-ret-pop-ctrl">
              <template v-if="modelInfo !== null">
                <form-input :value="modelInfo.dis_reason.toString()" disabled />
              </template>
              <template v-else>
                <form-input disabled />
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
          <template v-if="hasDiscount">
            <btn @click="onClickDiscount">折</btn>
          </template>
          <template v-if="hasPrice">
            <btn @click="onClickPrice">价</btn>
          </template>
          <template v-if="hasGive">
            <btn @click="onClickGive">赠</btn>
          </template>
          <template v-if="hasSearch">
            <btn @click="onClickSearch">检索</btn>
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
  name: 'UnitMainExchangePopOut',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      keywords: '',
      quantity: 1
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
    },
    hasQuantity () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '数')
    },
    hasPlus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '加')
    },
    hasMinus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '减')
    },
    hasDiscount () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '折')
    },
    hasPrice () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '价')
    },
    hasGive () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '赠')
    },
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '检索')
    },
    hasInputSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '检索框')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品信息')
    },

    modelInfo () {
      if (this.model !== null && Array.isArray(this.model.itme_info) && this.model.itme_info.length > 0) {
        return this.model.itme_info[0]
      }

      return null
    }
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
        .then(() => {
          this.$nextTick(() => {
            // 自动填充「商品编号」输入框
            if (this.modelInfo !== null) {
              this.keywords = this.modelInfo.item_id
            }
          })
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
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '加')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：减号按钮被点击
     */
    onClickMinus () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '减')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“数”按钮被点击
     */
    onClickQuantity () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '数')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“折”按钮被点击
     */
    onClickDiscount () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '折')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“价”按钮被点击
     */
    onClickPrice () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '价')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“赠”按钮被点击
     */
    onClickGive () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.modelInfo), 'posMain.popOut.ItemInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '赠')
        })
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
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'input', '检索框')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：检索按钮被点击
     */
    onClickSearch () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '检索')
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
      if (this.modelInfo === null) return
      if (this.quantity === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.modelInfo.item_id.toString(), 'posMain.PartReturn.selected.ItemID'),
        this.$ui.setData(this.modelInfo.qty.toString(), 'posMain.PartReturn.ItemQty'),
        this.$ui.setData(this.modelInfo.sales_amt.toString(), 'posMain.PartReturn.ItemAmt') // TODO
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
.UnitMainExchangePopOut {
}
</style>
