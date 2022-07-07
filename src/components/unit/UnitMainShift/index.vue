<template>
  <div class="UnitMainShift">

    <div class="unit-main-shift-wrap">

      <div class="unit-main-shift-hd" v-if="hasStatus">
        <template v-if="modelStatus !== null">
          <span :class="{ 'danger': modelStatus.access_flg === '-1' }">{{ modelStatus.access_info }}</span>
        </template>
      </div>

      <div class="unit-main-shift-bd">
        <div class="unit-main-shift-info" v-if="hasInfo">
          <template v-if="modelInfo !== null">
            <div class="unit-main-shift-info-items">
              <div class="unit-main-shift-info-item">
                <label>收银员</label>
                <span class="value">{{ modelInfo.staff_id }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>交班时间</label>
                <span class="value">{{ modelInfo.shift_time }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>收款终端</label>
                <span class="value">{{ modelInfo.pos_id }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>营业日</label>
                <span class="value">{{ modelInfo.sales_dt }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>pos销售单据</label>
                <span class="value">{{ modelInfo.sales_qty }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>pos销售收入</label>
                <span class="value">{{ modelInfo.sales_amt }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>pos销售折扣</label>
                <span class="value">{{ modelInfo.sales_dis }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>会员卡卡单数</label>
                <span class="value">{{ modelInfo.vip_amt.deposit_amt }}</span>
                <span class="value">{{ modelInfo.vip_amt.continue_amt }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>会员卡卡收入</label>
                <span class="value">{{ modelInfo.vip_qty.deposit_qty }}</span>
                <span class="value">{{ modelInfo.vip_qty.continue_qty }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>消费券</label>
                <span class="value">{{ modelInfo.coupon_info.coupon_qty }}</span>
                <span class="value">{{ modelInfo.coupon_info.coupon_amt }}</span>
              </div>
              <div class="unit-main-shift-info-item">
                <label>收入合计</label>
                <span class="value">{{ modelInfo.income_toal }}</span>
              </div>
            </div>
          </template>
        </div>

        <div class="unit-main-shift-pri">
          <div class="unit-main-shift-tabs" v-if="hasTabs">
            <template v-if="modelTabs !== null && modelTabs.tab_list !== null">
              <tabs v-model="selectedTab">
                <template slot="navs">
                  <tab-nav
                    v-for="tab in modelTabs.tab_list"
                    :key="tab.tab_type"
                    :value="tab.tab_type"
                    @click="onClickTab(tab)"
                  >{{ tab.tab_name }}</tab-nav>
                </template>
              </tabs>
            </template>
          </div>

          <div class="unit-main-shift-list" v-if="hasList">
            <template>
              <table-wrapper>
                <thead>
                  <tr>
                    <th style="width: 30%;">收款方式</th>
                    <th>销售金额</th>
                  </tr>
                </thead>
                <tbody v-if="modelList !== null && modelList.info !== null">
                  <tr v-for="item in modelList.info" :key="item.pay_type">
                    <td>{{ item.pay_type }}</td>
                    <td>{{ item.amt }}</td>
                  </tr>
                </tbody>
              </table-wrapper>
            </template>
          </div>
        </div>
      </div>

    </div>

    <div class="unit-main-shift-ft">
      <template v-if="hasPrint">
        <btn secondary @click="onClickPrint">交班打印</btn>
      </template>
      <template v-if="hasReprint">
        <btn secondary @click="onClickReprint">重打交班打印</btn>
      </template>
      <template v-if="hasPrintAccount">
        <btn secondary @click="onClickPrintAccount">打印对账单</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainShift',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelStatus: null,
      modelInfo: null,
      modelTabs: null,
      modelList: null,

      selectedTab: ''
    }
  },
  computed: {
    /**
     * @var {Object} 当前选中的 Tab
     */
    tabsCurrent () {
      if (this.modelTabs === null || this.modelTabs.tab_list === null) return null
      if (this.selectedTab === '') return null

      return this.modelTabs.tab_list.find(el => el.tab_type === this.selectedTab)
    },

    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '交班打印')
    },
    hasReprint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '重打交班打印')
    },
    hasPrintAccount () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印对账单')
    },
    hasStatus () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '备用金信息')
    },
    hasInfo () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '基本信息')
    },
    hasTabs () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '金额信息标题')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '金额信息')
    }
  },
  mounted () {
    Promise.all([
      this.loadStatus(),
      this.loadInfo(),
      this.loadTabs()
    ])
  },
  methods: {
    loadStatus () {
      this.$loading.show()
      return this.fetchStatus()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadInfo () {
      this.$loading.show()
      return this.fetchInfo()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

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

    loadList () {
      this.$loading.show()
      return this.fetchList()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchStatus () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '备用金信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelStatus = data
        })
    },

    fetchInfo () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '基本信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelInfo = data
        })
    },

    fetchTabs () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '金额信息标题')
        .then(res => res[0])
        .then(({ msg, data }) => {
          data.tab_list
            .sort((e1, e2) => {
              if (parseFloat(e1.tab_sort) > parseFloat(e2.tab_sort)) return 1
              if (parseFloat(e1.tab_sort) < parseFloat(e2.tab_sort)) return -1
              return 0
            })

          this.modelTabs = data
        })
        .then(() => {
          // 自动选中第一项
          if (this.modelTabs !== null && this.modelTabs.tab_list !== null) {
            return this.onClickTab(this.modelTabs.tab_list[0])
          }
        })
    },

    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '金额信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelList = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '备用金信息':
          return this.loadStatus()
        case '基本信息':
          return this.loadInfo()
        case '金额信息标题':
          return this.loadTabs()
        case '金额信息':
          return this.loadList()
      }
    },

    /**
     * 加载收款信息列表数据
     */
    toLoadItems (tab) {
      if (typeof tab === 'undefined') {
        tab = this.tabsCurrent
      }

      if (tab === null) return

      return Promise.all([
        this.$ui.setData(tab.tab_type.toString(), 'posMain.shift.opMode')
      ])
        .then(() => {
          return this.fetchList()
        })
    },

    /**
     * 回调：标签栏被切换
     */
    onClickTab (tab) {
      this.$loading.show()
      return this.toLoadItems(tab)
        .then(() => {
          this.selectedTab = tab.tab_type
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“交班打印”按钮被点击
     */
    onClickPrint () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '交班打印')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“重打交班打印”按钮被点击
     */
    onClickReprint () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '重打交班打印')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“打印对账单”按钮被点击
     */
    onClickPrintAccount () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '打印对账单')
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
.UnitMainShift {
  padding: 4px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.unit-main-shift-wrap {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  border: 1px solid #707070;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
}
.unit-main-shift-hd {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 8px;
  font-size: 22px;
  line-height: 30px;
  color: var(--pt-color-primary);
  font-weight: bold;
  text-align: center;
  .danger {
    color: var(--pt-color-danger);
  }
}
.unit-main-shift-bd {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  padding: 0 7px;
  display: flex;
  align-items: stretch;
}
.unit-main-shift-info {
  flex-grow: 0;
  flex-shrink: 0;
  width: 350px;
  margin-right: 10px;
  overflow: auto;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.unit-main-shift-info-items {
}
.unit-main-shift-info-item {
  display: flex;
  label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 90px;
    margin-right: 10px;
    padding: 7px 0;
    text-align: right;
  }
  .value {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding: 7px 12px;
    background-color: #e7e7e7;
    font-weight: bold;
    @include single-text-ellipsis;
    & + .value {
      margin-left: 5px;
    }
  }
  & + .unit-main-shift-info-item {
    margin-top: 14px;
  }
}
.unit-main-shift-pri {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.unit-main-shift-tabs {
}
.unit-main-shift-list {
  .TableWrapper {
    border-color: #000000;
  }
}
.unit-main-shift-ft {
  flex-grow: 0;
  flex-shrink: 0;
  margin-top: 4px;
  display: flex;
  .Btn {
    padding: 13px 27px;
    font-size: 16px;
    line-height: 22px;
    & + .Btn {
      margin-left: 4px;
    }
  }
}
</style>
