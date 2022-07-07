<template>
  <div class="UnitMainInventory">

    <div class="unit-main-invt-wrap">

      <div class="unit-main-invt-left" v-if="hasList">

        <table-wrapper>
          <thead>
            <tr>
              <th style="width: 10.46153846em;">{{ colName1 }}</th>
              <th style="width: 6.84615385em;">{{ colName2 }}</th>
              <th>{{ colName3 }}</th>
            </tr>
          </thead>
          <tbody id="listTable" v-if="list != null">
            <tr
              v-for="item in list"
              :key="item.op_id"
              :class="{ 'active': selected === item.op_id }"
              @click="onClickListItem(item)"
            >
              <td style="width: 10.46153846em;">{{ item.op_id }}</td>
              <td style="width: 6.84615385em;">{{ item.check_dt }}</td>
              <td>{{ item.staff_name }}</td>
            </tr>
          </tbody>
        </table-wrapper>

        <div class="unit-main-invt-ft">
          <div class="unit-main-invt-ft-start">
            <template v-if="hasList">
              <btn title="上一页" @click="onClickListPrev" :disabled="isUpAvailable">
                <pt-icon i="arrow-up" />
              </btn>
              <btn title="下一页" @click="onClickListNext" :disabled="isDownAvailable">
                <pt-icon i="arrow-down" />
              </btn>
            </template>
          </div>
        </div>

      </div>

      <div class="unit-main-invt-right" v-if="hasDetails">

        <table-wrapper>
          <thead>
            <tr style="table-row-group;">
              <th @click="onClickToggleExpand()">{{ colName4 }}</th>
              <th v-show="isExpand">销售笔数</th>
              <th v-show="isExpand">销售金额</th>
              <th v-show="isExpand">退款笔数</th>
              <th v-show="isExpand">退款金额</th>
              <th>{{ colName5 }}</th>
              <th>{{ colName6 }}</th>
              <!--
              <th>合计盘点笔数</th>
              -->
              <th>{{ colName7 }}</th>
              <th>{{ colName8 }}</th>
            </tr>
          </thead>
          <tbody id="detailsTable" v-if="details != null">
            <tr
              v-for="(item, key) in details"
              :key="key"
            >
              <td>{{ item.pay_name }}</td>
              <td v-show="isExpand">{{ item.sales_qty }}</td>
              <td v-show="isExpand">{{ item.sales_amt }}</td>
              <td v-show="isExpand">{{ item.refund_qty }}</td>
              <td v-show="isExpand">{{ item.refund_amt }}</td>
              <td>{{ item.payment_qty }}</td>
              <td>{{ item.payment_amt }}</td>
              <!--
              <td>{{ item.money_qty }}</td>
              -->
              <td>{{ item.money_amt }}</td>
              <td>{{ item.diff_amt }}</td>
            </tr>
          </tbody>
        </table-wrapper>

        <div class="unit-main-invt-ft">
          <div class="unit-main-invt-ft-start">
            <template v-if="hasDetails">
              <btn title="上一页" @click="onClickDetailsPrev" :disabled="isDetailsPrevAvailable">
                <pt-icon i="arrow-up" />
              </btn>
              <btn title="下一页" @click="onClickDetailsNext" :disabled="isDetailsNextAvailable">
                <pt-icon i="arrow-down" />
              </btn>
            </template>
          </div>
          <div class="unit-main-invt-ft-end">
            <template v-if="hasCreate">
              <btn @click="onClickCreate">新增</btn>
            </template>
            <template v-if="hasUpdate">
              <btn @click="onClickUpdate">修改</btn>
            </template>
            <template v-if="hasPrint">
              <btn @click="onClickPrint" primary>打印</btn>
            </template>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment'

import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainInventory',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  props: {
    autoTriggerFirstItem: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      list: null,
      colName1: null,
      colName2: null,
      colName3: null,
      colName4: null,
      colName5: null,
      colName6: null,
      colName7: null,
      colName8: null,
      details: null,
      selected: null,
      isExpand: false,
      isUpAvailable: true,
      isDownAvailable: true,
      isDetailsPrevAvailable: true,
      isDetailsNextAvailable: true,
      date: ''
    }
  },
  computed: {
    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印')
    },
    hasCreate () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '新增收银盘点')
    },
    hasUpdate () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '修改收银盘点')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '盘点主数据')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '盘点单明细')
    }
  },
  mounted () {
    Promise.all([
      this.loadList()
    ])
  },
  methods: {
    // 加载盘点主单据
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
    // 加载盘点单明细数据
    loadDetails () {
      this.$loading.show()
      return this.fetchDetails()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 加载盘点主单据
    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点主数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.list = data.info
          this.colName1 = data.colName1
          this.colName2 = data.colName2
          this.colName3 = data.colName3
        })
        .then(() => {
          this.selected = null
        })
        .then(() => {
          if (this.autoTriggerFirstItem && this.list.length > 0) {
            return Promise.all([
              this.$ui.setData(this.list[0].op_id.toString(), 'posMain.inventory.inventoryId')
            ])
              .then(() => {
                return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点主数据')
              })
              .then(() => {
                this.selected = this.list[0].op_id
              })
          }
        })
        // 盘点单据主表向下按钮是否启用判断【许宁】
        .then(() => {
          if (this.list != null) {
            const el = document.getElementById('listTable')
            if (el != null && el.scrollHeight > el.clientHeight) {
              this.isDownAvailable = false
            }
          }
        })
    },
    // 加载盘点单明细数据
    fetchDetails () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点单明细')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.details = data.info
          this.colName4 = data.colName1
          this.colName5 = data.colName2
          this.colName6 = data.colName3
          this.colName7 = data.colName4
          this.colName8 = data.colName5
        })
        // 盘点单据明细向下按钮是否启用判断【许宁】
        .then(() => {
          if (this.list != null) {
            const el = document.getElementById('detailsTable')
            if (el != null && el.scrollHeight > el.clientHeight) {
              this.isDetailsNextAvailable = false
            }
          }
        })
    },
    // 点击主表获得明细表数据
    onClickListItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.check_dt.toString(), 'posMain.inventory.date'),
        this.$ui.setData(item.op_id.toString(), 'posMain.inventory.inventoryId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点主数据')
        })
        .then(() => {
          this.selected = item.op_id
          this.date = item.check_dt
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 新增事按钮
    onClickCreate () {
      // 盘点日期默认显示当天日期
      this.date = moment().format('YYYY-MM-DD')

      this.$loading.show()
      return Promise.all([
        this.$ui.setData('1', 'posMain.inventory.posFlg'),
        this.$ui.setData(this.date.toString(), 'posMain.inventory.date')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '新增收银盘点')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 修改按钮
    onClickUpdate () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.date.toString(), 'posMain.inventory.date')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '修改收银盘点')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 打印按钮
    onClickPrint () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '打印')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 盘点单据明细表隐藏事件
    onClickToggleExpand () {
      this.isExpand = !this.isExpand
    },
    // 盘点单据主表向上按钮操作【许宁】
    onClickListPrev () {
      document.getElementById('listTable').scrollTop -= 200
      const up = document.getElementById('listTable').scrollTop
      this.isDownAvailable = false
      if (up > 0) {
        this.isUpAvailable = false
      } else {
        this.isUpAvailable = true
      }
      // this.$refs.listTable.$el.scrollTop -= 200
    },
    // 盘点单据主表向下按钮操作【许宁】
    onClickListNext () {
      document.getElementById('listTable').scrollTop += 200
      const down = document.getElementById('listTable').scrollTop
      const dataHeight = (document.getElementById('listTable').scrollHeight) - (document.getElementById('listTable').clientHeight)
      this.isUpAvailable = false
      if (down === dataHeight) {
        this.isDownAvailable = true
      } else {
        this.isDownAvailable = false
      }
      // this.$refs.listTable.$el.scrollTop += 200
    },
    // 盘点单据明细表向上按钮操作【许宁】
    onClickDetailsPrev () {
      document.getElementById('detailsTable').scrollTop -= 200
      const ups = document.getElementById('detailsTable').scrollTop
      this.isDetailsNextAvailable = false
      if (ups > 0) {
        this.isDetailsPrevAvailable = false
      } else {
        this.isDetailsPrevAvailable = true
      }
      this.$refs.detailsTable.$el.scrollTop -= 200
    },
    // 盘点单据明细表向下按钮操作【许宁】
    onClickDetailsNext () {
      document.getElementById('detailsTable').scrollTop += 200
      const downs = document.getElementById('detailsTable').scrollTop
      const dataHeights = (document.getElementById('detailsTable').scrollHeight) - (document.getElementById('detailsTable').clientHeight)
      this.isDetailsPrevAvailable = false
      if (downs === dataHeights) {
        this.isDetailsNextAvailable = true
      } else {
        this.isDetailsNextAvailable = false
      }
      // this.$refs.detailsTable.$el.scrollTop += 200
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '盘点主数据':
          return this.loadList()
        case '盘点单明细':
          return this.loadDetails()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainInventory {
  height: 100%;
}
.unit-main-invt-wrap {
  height: 100%;
  box-sizing: border-box;
  padding: 4px;

  display: flex;
  align-items: stretch;

  font-size: 13px;
  line-height: 20px;
  color: #000000;

  .unit-main-invt-left {
    flex-grow: 0;
    flex-shrink: 0;
    width: 310px;
  }
  .unit-main-invt-right {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    margin-left: 4px;
  }
  .unit-main-invt-left,
  .unit-main-invt-right {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .TableWrapper {
    flex-grow: 1;
    flex-shrink: 1;
    height: 1px;
    border-color: #000000;
    border-radius: 2px;
  }
  td, th {
    padding-left: 4px;
    padding-right: 4px;
    @include single-text-ellipsis;
  }
  .expand {
    background-image: url('~@/assets/img/table-expand.svg');
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 18px 12px;
  }
  .collapse {
    background-image: url('~@/assets/img/table-collapse.svg');
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 18px 12px;
  }
}
.unit-main-invt-ft {
  flex-grow: 0;
  flex-shrink: 0;
  margin-top: 4px;
  display: flex;
  align-items: stretch;
  .Btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 48px;
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    & + .Btn {
      margin-left: 5px;
    }
  }
}
.unit-main-invt-ft-start {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
}
.unit-main-invt-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
