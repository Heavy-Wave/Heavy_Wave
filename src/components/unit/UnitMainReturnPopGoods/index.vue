<template>
  <div class="UnitMainReturnPopGoods">

    <div class="unit-main-ret-pop-bd">

      <div class="unit-main-ret-goods" v-if="model !== null && model.sales_dtl !== null">
        <div class="unit-main-ret-goods-wrap">
          <div class="unit-main-ret-goods-line" v-for="item in model.sales_dtl" :key="item.key">
            <div class="unit-main-ret-goods-label">{{ item.label }}</div>
            <div class="unit-main-ret-goods-value">{{ item.values }}</div>
          </div>
        </div>
      </div>

    </div>

    <div class="unit-main-ret-pop-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">返回</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainReturnPopGoods',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品明细')
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品明细')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品明细':
          return this.load()
      }
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
    }
  }
}
</script>

<style lang="scss">
.UnitMainReturnPopGoods {
}
.unit-main-ret-goods {
  margin: 6px 0;
  border: 1px solid #000000;
  border-radius: 2px;
  &-wrap {
    width: 100%;
    box-sizing: border-box;
    display: table;
    table-layout: fixed;
    border-collapse: collapse;
  }
  &-line {
    display: table-row-group;
    &:first-child {
      .unit-main-ret-goods-label,
      .unit-main-ret-goods-value {
        border-top-width: 0;
      }
    }
    &:last-child {
      .unit-main-ret-goods-label,
      .unit-main-ret-goods-value {
        border-bottom-width: 0;
      }
    }
  }
  &-label,
  &-value {
    display: table-cell;
    border: 1px solid #000000;
    background-color: #ffffff;
    padding: 5px 16px;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    @include single-text-ellipsis;
    &:first-child {
      border-left-width: 0;
    }
    &:last-child {
      border-right-width: 0;
    }
  }
  &-label {
    display: table-cell;
    width: 127px;
    background-color: var(--pt-color-primary);
    color: var(--pt-color-primary-content);
    text-align: center;
  }
}
</style>
