<template>
  <div class="UnitClientList">

    <div class="unit-client-list-inner" v-if="modelItems !== null">

      <div class="unit-client-list-body">

        <div class="unit-client-list-body-item" v-for="item in modelItems.sells_list" :key="item.line_no">

          <div class="unit-client-list-body-item-hd">
            <div class="unit-client-list-body-item-barcode">{{ item.item_id }}</div>
            <div class="unit-client-list-body-item-prom" v-if="item.prom_name">{{ item.prom_name }}</div>
          </div>

          <div class="unit-client-list-body-item-bd">
            <div class="unit-client-list-body-item-title">
              <div class="unit-client-list-body-item-name">{{ item.item_name }}</div>
              <div class="unit-client-list-body-item-quantity">&times; <display-quantity :value="item.qty" /></div>
            </div>
            <div class="unit-client-list-body-item-price">
              <template v-if="item.std_price > 0 && item.sales_real_amt !== item.std_price">
                <span class="original"><display-price :value="item.std_price" />元</span>
              </template>
              <display-price :value="item.sales_real_amt" /><span class="symbol">元</span>
            </div>
          </div>

        </div>

      </div>

      <div class="unit-client-list-total">

        <div class="unit-client-list-total-label">合计金额</div>

        <div class="unit-client-list-total-value">
          <display-price :value="modelTotal.total_inv_real_amt" />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitClientList',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelItems: null,
      modelTotal: null
    }
  },
  methods: {
    loadItems () {
      this.$loading.show()
      return this.fetchItems()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadTotal () {
      this.$loading.show()
      return this.fetchTotal()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchItems () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据商品列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelItems = data
        })
    },

    fetchTotal () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据金额')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelTotal = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '单据商品列表':
          return this.loadItems()
        case '单据金额':
          return this.loadTotal()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitClientList {
  height: 100%;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  &::before {
    content: '';
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    width: 382px;
    height: 52px;
    background-image: url('~@/assets/img/vip-list-hd@2x.png');
    background-size: 100% 100%;
  }
  &::after {
    content: '';
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    width: 382px;
    height: 28px;
    background-image: url('~@/assets/img/vip-list-ft@2x.png');
    background-size: 100% 100%;
  }
}
.unit-client-list-inner {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  padding-left: 31px;
  padding-right: 23px;
  background: transparent url('~@/assets/img/vip-list-bd@2x.png') repeat-y center center / 382px 1px;
  display: flex;
  flex-direction: column;
}
.unit-client-list-body {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  overflow: hidden;
}
.unit-client-list-body-item {
  padding: 4px 6px;
  border-bottom: 1px solid #bcbbc0;
}
.unit-client-list-body-item-hd {
  display: flex;
  align-items: center;
}
.unit-client-list-body-item-barcode {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  font-size: 10px;
  line-height: 14px;
  color: #000000;
}
.unit-client-list-body-item-prom {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
}
.unit-client-list-body-item-bd {
  display: flex;
  align-items: center;
}
.unit-client-list-body-item-title {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  margin-right: 10px;
  display: flex;
  align-items: center
}
.unit-client-list-body-item-name {
  flex-grow: 0;
  flex-shrink: 1;
  font-size: 16px;
  line-height: 22px;
  color: #060606;
}
.unit-client-list-body-item-quantity {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 5px;
  font-size: 12px;
  line-height: 17px;
  color: #9b9b9b;
  white-space: nowrap;
}
.unit-client-list-body-item-price {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  .original {
    display: inline-block;
    margin-right: 4px;
    font-size: 12px;
    line-height: 17px;
    color: #9b9b9b;
    text-decoration: line-through;
  }
  .symbol {
  }
}
.unit-client-list-total {
  flex-grow: 0;
  flex-shrink: 0;
  padding-top: 17px;
  padding-bottom: 17px;
  padding-left: 6px;
  padding-right: 6px;
  display: flex;
  align-items: center;
}
.unit-client-list-total-label {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  font-size: 20px;
  line-height: 28px;
  color: #000000;
  font-weight: 600;
}
.unit-client-list-total-value {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 20px;
  line-height: 28px;
  color: var(--pt-color-price);
  font-weight: 600;
}
</style>
