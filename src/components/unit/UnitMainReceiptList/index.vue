<template>
  <div class="UnitMainReceiptList">

    <div class="unit-main-receipt-list-wrap">

      <div class="unit-main-receipt-list-tabs" v-if="hasTabs">

        <tabs :value="tabsCurrentValue" v-if="modelTabs !== null && modelTabs.tab_list !== null">

          <template slot="navs">
            <tab-nav
              v-for="tab in modelTabs.tab_list"
              :key="tab.op_type"
              :value="tab.op_type"
              @click="onClickTab(tab)"
            >{{ tab.tab_name }}</tab-nav>
          </template>

        </tabs>

      </div>

      <div class="unit-main-receipt-list-search" v-if="hasKeywords">
        <div class="unit-main-receipt-list-search-label">单据号</div>
        <div class="unit-main-receipt-list-search-control">
          <form-input
            ref="input"
            v-model="barcode"
            type="text"
            pattern="\d*"
            placeholder="扫码或输入单据号"
            @keypress.enter="onEnter"
          />
          <btn primary @click="onEnter">检索</btn>
        </div>
      </div>

      <div class="unit-main-receipt-list-items" v-if="hasList">
        <table-wrapper v-if="columns !== null">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.title">{{ column.title }}</th>
            </tr>
          </thead>
          <tbody v-if="modelItems !== null && modelItems.set_1 !== null">
            <template v-for="item in modelItems.set_1">
              <tr
                :class="{ 'active': selected === item.op_id }"
                :key="item.op_id"
                @click="onClickItem(item)"
              >
                <td v-for="column in columns" :key="column.title">{{ item[column.dataIndex] }}</td>
              </tr>
            </template>
          </tbody>
        </table-wrapper>
      </div>

      <div class="unit-main-receipt-list-kbd">
        <keyboard type="integer" v-model="barcode" />
      </div>

      <div class="unit-main-receipt-list-actions">
        <template v-if="hasClose">
          <btn @click="onClickBack">返回</btn>
        </template>
        <template v-if="hasPagiPrev">
          <btn title="上一页" :disabled="currentPage === 1" @click="onClickPrev">
            <pt-icon i="arrow-up" />
          </btn>
        </template>
        <template v-if="hasPagiNext">
          <btn title="下一页" @click="onClickNext">
            <pt-icon i="arrow-down" />
          </btn>
        </template>
        <template v-if="hasPaymentGateway">
          <btn primary @click="onClickPaymentGateway">支付类型</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainReceiptList',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelTabs: null,
      modelItems: null,

      barcode: '',
      currentPage: 1,
      selected: null
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasPagiPrev () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '上一页')
    },
    hasPagiNext () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '下一页')
    },
    hasPaymentGateway () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '支付类型')
    },
    hasKeywords () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '扫码框')
    },
    hasTabs () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '单据列表tab')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '单据列表')
    },

    /**
     * @var {Object} Tab 列表的首项
     */
    firstTab () {
      if (this.modelTabs === null || this.modelTabs.tab_list === null || this.modelTabs.tab_list.length === 0) return null

      return this.modelTabs.tab_list[0]
    },

    /**
     * @var {String} 当前的 op_type（选中的 Tab）
     */
    tabsCurrentValue () {
      if (this.modelItems !== null) {
        return this.modelItems.op_type
      } else if (this.firstTab !== null) {
        return this.firstTab.op_type
      }

      return null
    },

    /**
     * @var {Object} 当前选中的 Tab
     */
    tabsCurrent () {
      if (this.modelTabs === null || this.modelTabs.tab_list === null) return null
      if (this.tabsCurrentValue === null) return null

      return this.modelTabs.tab_list.find(el => el.op_type === this.tabsCurrentValue)
    },

    columns () {
      return [
        { title: '单据号', dataIndex: 'op_id' },
        { title: '数量', dataIndex: 'total_qty' },
        { title: '日期', dataIndex: 'checkout_dt' },
        { title: '金额', dataIndex: 'sale_real_amt' }
      ]
    },

    perPage () {
      return 8
    }
  },
  mounted () {
    Promise.all([
      this.loadTabs()
    ])
  },
  methods: {
    loadTabs () {
      this.$loading.show()
      return this.fetchTabs()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

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

    fetchTabs () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据列表tab')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelTabs = data
        })
        .then(() => {
          // 自动选中第一项
          if (this.modelTabs !== null && this.modelTabs.tab_list !== null) {
            return this.onClickTab(this.modelTabs.tab_list[0])
          }
        })
    },

    fetchItems () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelItems = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '单据列表tab':
          return this.loadTabs()
        case '单据列表':
          return this.loadItems()
      }
    },

    /**
     * 加载单据列表数据
     */
    toLoadItems (tab) {
      if (typeof tab === 'undefined') {
        tab = this.tabsCurrent
      }

      if (tab === null) return

      this.currentPage = 1

      return Promise.all([
        this.$ui.setData(this.barcode.toString(), 'posMain.subArea.receiptList.receiptId'),
        this.$ui.setData(tab.op_type.toString(), 'posMain.subArea.receiptList.opType'),
        this.$ui.setData(tab.op_sta.toString(), 'posMain.subArea.receiptList.opStatus'),
        this.$ui.setData(this.currentPage.toString(), 'posMain.subArea.receiptList.pageNo'),
        this.$ui.setData(this.perPage.toString(), 'posMain.subArea.receiptList.pageSize')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'input', '扫码框')
        })
    },

    /**
     * 回调：标签栏被切换
     */
    onClickTab (tab) {
      this.$loading.show()
      return this.toLoadItems(tab)
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
    onEnter () {
      this.$loading.show()
      return this.toLoadItems()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：单据列表项被点击
     */
    onClickItem (item) {
      if (item === null) return
      if (item.op_id === null) return
      if (item.vip_id === null) return
      if (item.dll_flg === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.op_id.toString(), 'posMain.posReceiptHeader.receiptId'),
        this.$ui.setData(item.vip_id.toString(), 'posMain.vipCarNo'),
        this.$ui.setData(item.dll_flg.toString(), 'posMain.isExcDll')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据列表')
        })
        .then(() => {
          this.selected = item.op_id
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：上一页按钮被点击
     */
    onClickPrev () {
      const currentPage = Math.max(1, this.currentPage - 1)

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.tabsCurrent.op_type.toString(), 'posMain.subArea.receiptList.opType'),
        this.$ui.setData(this.tabsCurrent.op_sta.toString(), 'posMain.subArea.receiptList.opStatus'),
        this.$ui.setData(currentPage.toString(), 'posMain.subArea.receiptList.pageNo'),
        this.$ui.setData(this.perPage.toString(), 'posMain.subArea.receiptList.pageSize')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '上一页')
        })
        .then(() => {
          this.currentPage = currentPage
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：下一页按钮被点击
     */
    onClickNext () {
      const currentPage = Math.min(Infinity, this.currentPage + 1)

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.tabsCurrent.op_type.toString(), 'posMain.subArea.receiptList.opType'),
        this.$ui.setData(this.tabsCurrent.op_sta.toString(), 'posMain.subArea.receiptList.opStatus'),
        this.$ui.setData(currentPage.toString(), 'posMain.subArea.receiptList.pageNo'),
        this.$ui.setData(this.perPage.toString(), 'posMain.subArea.receiptList.pageSize')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '下一页')
        })
        .then(() => {
          this.currentPage = currentPage
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：返回按钮被点击
     */
    onClickBack () {
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
     * 回调：支付类型按钮被点击
     */
    onClickPaymentGateway () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '支付类型')
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
.UnitMainReceiptList {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-receipt-list-wrap {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  padding: 1px;
  display: flex;
  flex-direction: column;
}
.unit-main-receipt-list-search {
  flex-grow: 0;
  flex-shrink: 0;
  border: 1px solid #000000;
  border-bottom-width: 0;
  padding: 3px;
  display: flex;
  align-items: center;
}
.unit-main-receipt-list-search-label {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 20px;
  margin-right: 17px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.unit-main-receipt-list-search-control {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  .FormInput {
    display: block;
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
  }
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 6px 23px;
    margin-left: 8px;
  }
}
.unit-main-receipt-list-tabs {
  flex-grow: 0;
  flex-shrink: 0;
}
.unit-main-receipt-list-items {
  flex-grow: 0;
  flex-shrink: 0;
  height: 244px;
  .TableWrapper {
    border-color: #000000;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    table {
      table-layout: initial;
    }
  }
}
.unit-main-receipt-list-kbd {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  margin-top: 3px;
}
.unit-main-receipt-list-actions {
  flex-grow: 0;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding: 9px 0;
    font-size: 20px;
    line-height: 28px;
    & + .Btn {
      margin-left: 4px;
    }
  }
}
</style>
