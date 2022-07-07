<template>
  <div class="UnitMainReturn">

    <div class="unit-main-ret-wrap">

      <div class="unit-main-ret-hd">原单商品部分退</div>

      <div class="unit-main-ret-bd">

        <div class="unit-main-ret-col">

          <div class="unit-main-ret-row">

            <div class="unit-main-ret-title">
              原单商品一览
              <div class="unit-main-ret-title-more">
                <form-input
                  v-model="keywords"
                  type="text"
                  pattern="\d*"
                  placeholder="输入商品编号"
                  @keypress.enter="onSearch"
                />
                <btn secondary @click="onSearch">查询</btn>
              </div>
            </div>

            <div class="unit-main-ret-content">
              <div class="unit-main-ret-nav" v-if="'ctnItems' in $refs">
                <btn
                  title="上一页"
                  :disabled="!$refs.ctnItems.canGoUp"
                  @click="$refs.ctnItems.goUp()"
                >
                  <pt-icon i="arrow-up" />
                </btn>
                <btn
                  title="下一页"
                  :disabled="!$refs.ctnItems.canGoDown"
                  @click="$refs.ctnItems.goDown()"
                >
                  <pt-icon i="arrow-down" />
                </btn>
              </div>
              <div class="unit-main-ret-list">
                <scroller ref="ctnItems">
                  <template v-if="model !== null && model.sales_list !== null">
                    <part-list-item
                      v-for="item in model.sales_list"
                      :item="item"
                      :key="item.line_no"
                      :class="{ 'active': selected === item.line_no }"
                      @click="onClickItem(item)"
                    />
                  </template>
                </scroller>
              </div>
            </div>

          </div>

        </div>

        <div class="unit-main-ret-col narrow">
          <div class="unit-main-ret-actions">
            <template v-if="hasIn">
              <btn @click="onClickIn">退</btn>
            </template>
            <template v-if="hasClear">
              <btn @click="onClickClear">清</btn>
            </template>
            <template v-if="hasDelete">
              <btn @click="onClickDelete">删</btn>
            </template>
            <template v-if="hasDetails">
              <btn @click="onClickDetails">详</btn>
            </template>
          </div>
        </div>

        <div class="unit-main-ret-col">

          <div class="unit-main-ret-row">

            <div class="unit-main-ret-title">
              退货商品一览
            </div>

            <div class="unit-main-ret-content">
              <div class="unit-main-ret-list">
                <scroller ref="returns">
                  <template v-if="model !== null && model.return_list !== null">
                    <part-list-item
                      v-for="item in model.return_list"
                      :item="item"
                      :key="item.line_no"
                      :class="{ 'active': selected === item.line_no }"
                      @click="onClickItem(item)"
                    />
                  </template>
                </scroller>
              </div>
              <div class="unit-main-ret-nav" v-if="'returns' in $refs">
                <btn
                  title="上一页"
                  :disabled="!$refs.returns.canGoUp"
                  @click="$refs.returns.goUp"
                >
                  <pt-icon i="arrow-up" />
                </btn>
                <btn
                  title="下一页"
                  :disabled="!$refs.returns.canGoDown"
                  @click="$refs.returns.goDown"
                >
                  <pt-icon i="arrow-down" />
                </btn>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="unit-main-ret-ft">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">返回</btn>
        </template>
        <template v-if="hasOk">
          <btn primary @click="onClickOk">确认退货</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

import PartListItem from '../UnitMainExchange/part-list-item'

export default {
  name: 'UnitMainReturn',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  components: {
    PartListItem
  },
  data () {
    return {
      model: null,

      keywords: '',
      selected: null
    }
  },
  computed: {
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '检索')
    },
    hasIn () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '退')
    },
    hasClear () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '清')
    },
    hasDelete () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '删')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '详')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '退货')
    },
    hasInputSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '商品检索')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品一览')
    }
  },
  mounted () {
    this.load()
  },
  beforeDestroy () {
    this.$kbd.hide()
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品一览')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
        .then(() => {
          // 列表自动选中首项
          if (this.model !== null && this.model.sales_list !== null && this.model.sales_list.length > 0) {
            return this.makeSelected(this.model.sales_list[0])
          } else {
            return this.clearSelected()
          }
        })
    },

    onClickItemsPrev () {
    },

    onClickItemsNext () {
    },

    onClickReturnsPrev () {
    },

    onClickReturnsNext () {
    },

    onClickExchangesPrev () {
    },

    onClickExchangesNext () {
    },

    /**
     * 回调：搜索框被回车
     */
    onSearch () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.keywords.toString(), 'posMain.PartReturn.search.ItemID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '检索')
        })
        .then(() => {
          // TODO
          if (this.model !== null && this.model.sales_list !== null) {
            const item = this.model.sales_list.find(el => el.item_id === this.keywords) || null
            if (item) {
              this.onClickItem(item)
            }
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * “退”按钮被点击
     */
    onClickIn () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '退')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * “清”按钮被点击
     */
    onClickClear () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '清')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * “删”按钮被点击
     */
    onClickDelete () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '删')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * “详”按钮被点击
     */
    onClickDetails () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '详')
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
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '退货')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：商品列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return this.makeSelected(item)
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 设置已选商品
     */
    makeSelected (item) {
      return Promise.all([
        this.$ui.setData(item.item_id.toString(), 'posMain.PartReturn.selected.ItemID'),
        this.$ui.setData(item.line_no.toString(), 'posMain.PartReturn.selected.RecordID'),
        this.$ui.setData(item.op_type.toString(), 'posMain.PartReturn.selected.OpType')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品一览')
        })
        .then(() => {
          this.selected = item.line_no
        })
    },

    /**
     * 清空已选商品
     */
    clearSelected () {
      return Promise.all([
        this.$ui.setData('', 'posMain.PartReturn.selected.ItemID'),
        this.$ui.setData('', 'posMain.PartReturn.selected.RecordID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品一览')
        })
        .then(() => {
          this.selected = null
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品一览':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainReturn {
  height: 100%;
}
.unit-main-ret {
  &-wrap {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &-hd {
    flex: 0 0 auto;
    padding: 11.5px 15px;
    background-color: var(--pt-color-primary);
    font-size: 18px;
    line-height: 25px;
    color: var(--pt-color-primary-content);
    text-align: center;
  }
  &-bd {
    flex: 1 1 auto;
    height: 1px;
    display: flex;
    align-items: stretch;
  }
  &-ft {
    flex: 0 0 auto;
    padding: 5px 9px;
    display: flex;
    justify-content: space-between;
    .Btn {
      min-width: 100px;
      padding: 9px 19px;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      @include single-text-ellipsis;
    }
  }
  &-col {
    flex: 1 1 auto;
    width: 1px;
    padding-left: 6px;
    padding-right: 6px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    &.narrow {
      flex: 0 0 auto;
      width: initial;
      padding-left: initial;
      padding-right: initial;
    }
  }
  &-row {
    flex: 1 1 auto;
    height: auto;
    padding-left: 3px;
    padding-right: 3px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &-title {
    flex: 0 0 auto;
    height: 56px;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    font-weight: bold;
    display: flex;
    align-items: center;
    &-more {
      flex: 1 1 auto;
      width: 1px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      .FormInput {
        flex: 1 1 auto;
        width: 1px;
      }
      .Btn {
        margin-left: 10px;
        padding: 4px 30px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
  &-content {
    flex: 1 1 auto;
    height: 1px;
    display: flex;
    align-items: stretch;
  }
  &-nav {
    display: flex;
    flex-direction: column;
    .Btn {
      flex: 1 1 auto;
      height: 1px;
      padding: 15px 10px;
      & + .Btn {
        margin-top: 8px;
      }
    }
  }
  &-list {
    flex: 1 1 auto;
    width: 1px;
    .Scroller {
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #000000;
      border-radius: 2px;
    }
  }
  &-actions {
    margin-top: 56px;
    .Btn {
      width: 92px;
      padding: 8px 15px;
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      & + .Btn {
        margin-top: 5px;
      }
    }
  }
}
.unit-main-ret-nav + .unit-main-ret-list,
.unit-main-ret-list + .unit-main-ret-nav {
  margin-left: 5px;
}
</style>
