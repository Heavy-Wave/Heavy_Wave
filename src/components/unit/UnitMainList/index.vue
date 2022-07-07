<template>
  <div class="UnitMainList">

    <div class="unit-main-list-wrap" v-if="model !== null">
      <template v-if="model !== null && model.sells_list">
        <div
          class="unit-main-list-item"
          v-for="item in model.sells_list.slice($store.getters.listPagiPerPage * ($store.getters.listPagiCurrentPage - 1), $store.getters.listPagiPerPage * $store.getters.listPagiCurrentPage)"
          :key="item.line_no"
          :class="{ 'active': selected === item.line_no }"
          @click="onClickItem(item)"
        >
          <div class="unit-main-list-item-hd">
            <div class="unit-main-list-item-barcode">{{ item.item_id }}</div>
            <div class="unit-main-list-item-prom" v-if="item.prom_name">{{ item.prom_name }}</div>
          </div>
          <div class="unit-main-list-item-bd">
            <div class="unit-main-list-item-title">
              <div class="unit-main-list-item-name">{{ item.item_name }}</div>
              <div class="unit-main-list-item-qty"> &times; <display-quantity :value="item.qty" /></div>
            </div>
            <div class="unit-main-list-item-price">
              <template v-if="item.std_price > 0 && item.sales_real_amt !== item.std_price">
                <span class="original"><display-price :value="item.std_price" />元</span>
              </template>
              <display-price :value="item.sales_real_amt" /><span class="symbol">元</span>
            </div>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainList',
  mixins: [
    unitMixin,
    unitListenRefreshMixin,
    autoRevertFocus
  ],
  props: {
    perPage: {
      type: Number,
      required: false,
      default: 8
    }
  },
  data () {
    return {
      model: null,

      selected: null
    }
  },
  mounted () {
    // 分页
    this.$store.dispatch('listPagiSetPerPage', this.perPage)
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据商品列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
        .then(() => {
          // 分页
          if (this.model !== null && this.model.sells_list !== null) {
            this.$store.dispatch('listPagiSetTotal', this.model.sells_list.length)
            this.$store.dispatch('listPagiSetCurrentPage', 1)
          }
        })
        .then(() => {
          // 自动选中第一项
          if (this.model !== null && this.model.sells_list !== null && this.model.sells_list.length > 0) {
            return Promise.all([
              this.$ui.setData(this.model.sells_list[0].item_id.toString(), 'posMain.posList.selectedItem.itemId'),
              this.$ui.setData(this.model.sells_list[0].line_no.toString(), 'posMain.posList.selectedItem.recordId')
            ])
              .then(() => {
                this.selected = this.model.sells_list[0].line_no
              })
          } else if (this.selected !== null) {
            return Promise.all([
              this.$ui.setData('', 'posMain.posList.selectedItem.itemId'),
              this.$ui.setData('', 'posMain.posList.selectedItem.recordId')
            ])
              .then(() => {
                this.selected = null
              })
          }
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '单据商品列表':
          return this.load()
      }
    },

    /**
     * 回调：商品列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.item_id.toString(), 'posMain.posList.selectedItem.itemId'),
        this.$ui.setData(item.line_no.toString(), 'posMain.posList.selectedItem.recordId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据商品列表')
        })
        .then(() => {
          this.selected = item.line_no
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
.UnitMainList {
  height: 100%;
}
.unit-main-list-wrap {
  height: 100%;
  overflow: auto;
  background: transparent url('~@/assets/img/home-list-bg.svg') no-repeat center center / 300px 300px;
}
.unit-main-list-item {
  padding: 4px 10px;
  border-bottom: 1px solid #e6e6e6;
  background-color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #f6f6f6;
  }
  &.active {
    background-color: var(--pt-color-list-highlight);
    .unit-main-list-item-title {
      font-weight: bold;
    }
  }
}
.unit-main-list-item-hd {
  display: flex;
  align-items: center;
}
.unit-main-list-item-barcode {
  flex-grow: 1;
  flex-shrink: 0;
  margin-right: 10px;
  font-size: 12px;
  line-height: 17px;
  color: #000000;
  @include single-text-ellipsis;
}
.unit-main-list-item-prom {
  flex-grow: 0;
  flex-shrink: 1;
  font-size: 12px;
  line-height: 17px;
  color: #707070;
  @include single-text-ellipsis;
}
.unit-main-list-item-bd {
  display: flex;
  align-items: center;
}
.unit-main-list-item-title {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  margin-right: 10px;
  display: flex;
  align-items: baseline;
}
.unit-main-list-item-name {
  flex-grow: 0;
  flex-shrink: 1;
  font-size: 16px;
  line-height: 20px;
  color: #000000;
  @include single-text-ellipsis;
}
.unit-main-list-item-qty {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 5px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  white-space: nowrap;
}
.unit-main-list-item-price {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 18px;
  line-height: 20px;
  color: var(--pt-color-price);
  font-weight: bold;
  .symbol {
    font-size: 14px;
    color: #000000;
    font-weight: normal;
  }
  .original {
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    line-height: 17px;
    color: #707070;
    text-decoration: line-through;
  }
}
</style>
