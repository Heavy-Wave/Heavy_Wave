<template >
  <div class="UnitMainInventoryMk">

    <div class="unit-main-invt-mk-wrap">

      <div class="unit-main-invt-mk-hd">
        <div class="unit-main-invt-mk-hd-left">
          <div class="filter-item" v-if="hasPos">
            <label class="filter-item-label">区分POS机</label>
            <div class="filter-item-value">
              <form-select v-model="posFlg" :options="posFlgOptions" disabled />
            </div>
          </div>
          <div class="filter-item" v-if="hasDate">
            <label class="filter-item-label">日<span style="display: inline-block; width: 1em;" /><span style="display: inline-block; width: 1em;" />期</label>
            <div class="filter-item-value">
              <form-input v-model="date" type="date" />
            </div>
          </div>
        </div>
        <div class="unit-main-invt-mk-hd-right">
          <template v-if="hasSearch">
            <btn secondary @click="onClickSearch">检索</btn>
          </template>
        </div>
      </div>
      <div class="unit-main-invt-mk-remind">
        {{ accessInfo }}
      </div>
      <div class="unit-main-invt-mk-bd" v-if="hasItems">
        <table-wrapper ref="invenTable">
          <thead v-if="items != null && items.colNames !== null">
            <tr>
              <th>{{ colName1 }}</th>
              <th v-show="isExpand">销售笔数</th>
              <th v-show="isExpand">销售金额</th>
              <th v-show="isExpand">退款笔数</th>
              <th v-show="isExpand">退款金额</th>
              <th>{{ colName2 }}</th>
              <th>{{ colName3 }}</th>
              <th>{{ colName4 }}</th>
              <th>{{ colName5 }}</th>
              <th>{{ colName6 }}</th>
            </tr>
          </thead>
          <tbody id="invenTable" v-if="items != null">
            <tr
              v-for="(item, key) in items"
              :key="key"
            >
              <td>{{ item.pay_name }}</td>
              <td v-show="isExpand">{{ item.payment_qty }}</td>
              <td v-show="isExpand">{{ item.money_qty }}</td>
              <td v-show="isExpand">{{ item.money_amt }}</td>
              <td v-show="isExpand">{{ item.payment_amt }}</td>
              <td>{{ item.payment_qty }}</td>
              <td style="background-color: #ccd4f380;">
                <form-input
                  v-if="items[key].payment_qty !== '合计'"
                  :value="items[key].money_qty.toString()"
                  @input="onInputCount(key, $event)"
                  @focus="onFocus($event)"
                  @blur="onBlur($event)"
                  type="number"
                  :min="0"
                />
                <label v-if="items[key].payment_qty === '合计'">{{ changeListTotal.nums }}</label>
              </td>
              <td style="background-color: #ccd4f380;" v-if="items[key].payment_qty!='合计'">{{ parseFloat(item.money_amt) }}</td>
              <td style="background-color: #ccd4f380;" v-if="items[key].payment_qty=='合计'">{{ parseFloat(changeListTotal.price) }}</td>
              <td>{{ item.payment_amt }}</td>
              <td v-if="items[key].payment_qty!='合计'">{{ parseFloat(item.diff_amt) }}</td>
              <td v-if="items[key].payment_qty=='合计'">{{ parseFloat(changeListTotal.diffprice) }}</td>
            </tr>
          </tbody>
        </table-wrapper>
        <div class="unit-main-invt-mk-bd-kbd" v-if="kbdDisplay">
          <keyboard-holder />
        </div>
      </div>
      <!--
      <div class="unit-main-invt-kbd">
        <div class="closeKeyboard" v-show="isBtnExpand">
          <button @click="onClickCloseKeyboard">&times;</button>
        </div>
        <keyboard-holder />
      </div>
      -->
      <div class="unit-main-invt-mk-ft" v-if="hasSave || hasClose || hasItems">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">关闭</btn>
        </template>
        <template v-if="hasSave">
          <btn primary @click="onClickSave">保存</btn>
        </template>
        <template v-if="hasItems">
          <btn title="上一页" @click="onClickTablePrev" :disabled="isUpAvailable">
            <pt-icon i="arrow-up" />
          </btn>
          <btn title="下一页" @click="onClickTableNext" :disabled="isDownAvailable">
            <pt-icon i="arrow-down" />
          </btn>
        </template>
         <template>
          <btn secondary title="隐藏键盘" @click="onClickHideKbd">
            <pt-icon i="kbd-hide" />
          </btn>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment'

import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainInventoryMk',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  props: {
    autoTriggerSearch: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      items: null,
      accessInfo: null,
      colName1: null,
      colName2: null,
      colName3: null,
      colName4: null,
      colName5: null,
      funds: null,
      posFlg: '0',
      isExpand: false,
      isBtnExpand: false,
      isUpAvailable: true,
      isDownAvailable: true,
      date: moment().format('YYYY-MM-DD'),
      kbdDisplay: false
    }
  },
  computed: {
    changeListTotal () {
      const result = { nums: 0, price: 0, diffprice: 0 }
      if (this.items === null) return result
      this.items.forEach((el, key) => {
        if (key < this.items.length) {
          result.nums = result.nums + (parseFloat(el.money_qty) || 0)
          result.price = result.price + (parseFloat(el.money_amt) || 0)
          result.diffprice = ((result.price * 100) - (el.payment_amt * 100)) / 100
        }
      })

      return result
    },

    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '检索')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasSave () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '保存盘点单')
    },
    hasPos () {
      return this.$ui.hasElementByUnit(this.unit, 'input', 'pos区分输入框')
    },
    hasDate () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '盘点日期输入框')
    },
    hasItems () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '新增盘点单')
    },
    posFlgOptions () {
      return [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ]
    },
    keyboardType () {
      return 'decimal'
    }
  },
  mounted () {
    if (this.autoTriggerSearch) {
      this.loadItems()
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
    loadFunds () {
      this.$loading.show()
      return this.fetchFunds()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    fetchItems () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '新增盘点单')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.items = data.info
          this.accessInfo = data.access_info
          this.colName1 = data.colName1
          this.colName2 = data.colName2
          this.colName3 = data.colName3
          this.colName4 = data.colName4
          this.colName5 = data.colName5
          this.colName6 = data.colName6

          // this.$kbd.hide()
        })
        // 收款方式向下按钮是否启用判断【许宁】
        .then(() => {
          if (this.items != null) {
            const el = document.getElementById('invenTable')
            if (el != null && el.scrollHeight > el.clientHeight) {
              this.isDownAvailable = false
            }
          }
        })
    },
    // onInputMoney (index, value) {
    //   if (this.items === null || this.items.inven_info === null) return
    //   value = value.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    //   this.items.inven_info[index].money_amt = value
    //   console.log(this.items.inven_info[index].money_amt)
    //   // 计算差异金额【许宁】
    //   const data1 = this.items.inven_info[index].money_amt
    //   const data2 = this.items.inven_info[index].payment_amt
    //   let r1, r2
    //   // 获取每个参数的小数的位数
    //   try { r1 = data1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    //   try { r2 = data2.toString().split('.')[1].length } catch (e) { r2 = 0 }

    //   // 计算底数为10以最大小数位数为次幂的值
    //   const m = Math.pow(10, Math.max(r1, r2))
    //   // 精度长度以最大小数位数为长度
    //   const n = (r1 >= r2) ? r1 : r2
    //   this.items.inven_info[index].diff_amt = ((data1 * m - data2 * m) / m).toFixed(n)
    // },
    onInputCount (index, value) {
      if (this.items === null) return
      value = parseInt(value)

      if (isNaN(value) || value < 0) {
        value = 0
      }

      this.items[index].money_qty = value
      this.items[index].money_amt = this.items[index].payment_qty * 10 * this.items[index].money_qty / 10
      this.items[(this.items.length - 1)].diff_amt = this.changeListTotal.diffprice
    },
    onFocus (event) {
      this.openEnumModify()
      this.$emit('focus', event)
      if (!this.isBtnExpand) {
        this.isBtnExpand = !this.isBtnExpand
      }
    },
    onBlur (event) {
      if (event.target.value === '') {
        event.target.value = 0
      }
    },

    /**
     * 回调：检索按钮被点击
     */
    onClickSearch () {
      // 检验日期是否为空【许宁】
      if (!this.$validation.notBlank(this.date)) {
        return this.$message.notice('请选择日期')
      }
      if (Date.parse(this.date) > new Date()) {
        return this.$message.notice('不能选择超过当前日期')
      }
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.posFlg.toString(), 'posMain.inventory.posFlg'),
        this.$ui.setData(this.date.toString(), 'posMain.inventory.date')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '检索')
        })
        .then(() => {
          this.isBtnExpand = false
        }
        )
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：关闭按钮被点击
     */
    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '关闭')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：保存按钮被点击
     */
    onClickSave () {
      this.items[(this.items.length - 1)].money_qty = this.changeListTotal.nums
      this.items[(this.items.length - 1)].money_amt = this.changeListTotal.price

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.posFlg.toString(), 'posMain.inventory.posFlg'),
        this.$ui.setData(this.date.toString(), 'posMain.inventory.date'),
        this.$ui.setData(JSON.stringify(this.items), 'posMain.inventory.dtl')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '保存盘点单')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onClickToggleExpand () {
      this.isExpand = !this.isExpand
    },

    onClickTablePrev () {
      // this.$refs.invenTable.$el.scrollTop -= 200
      document.getElementById('invenTable').scrollTop -= 200
      const up = document.getElementById('invenTable').scrollTop
      this.isDownAvailable = false
      if (up > 0) {
        this.isUpAvailable = false
      } else {
        this.isUpAvailable = true
      }
    },

    onClickTableNext () {
      // this.$refs.invenTable.$el.scrollTop += 200
      document.getElementById('invenTable').scrollTop += 200
      const down = document.getElementById('invenTable').scrollTop
      const dataHeight = (document.getElementById('invenTable').scrollHeight) - (document.getElementById('invenTable').clientHeight)
      this.isUpAvailable = false
      if (down === dataHeight) {
        this.isDownAvailable = true
      } else {
        this.isDownAvailable = false
      }
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '新增盘点单':
          return this.loadItems()
        case '修改盘点单':
          return this.loadItems()
        case '备用金提示':
          return this.loadFunds()
      }
    },
    onClickCloseKeyboard () {
      this.$loading.show()
      this.isBtnExpand = !this.isBtnExpand
      return this.$kbd.hide()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },
    // 关闭金钱管理键盘
    enumModify () {
      this.kbdDisplay = false
      this.$kbd.hide()
    },

    // 打开金钱管理键盘
    openEnumModify () {
      this.kbdDisplay = true
      this.$kbd.show({
        target: this,
        type: this.keyboardType
      })
    },

    // 点击隐藏键盘
    onClickHideKbd () {
      if (this.kbdDisplay) {
        this.enumModify()
      } else {
        this.openEnumModify()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainInventoryMk {
  width: 904px;
}
.unit-main-invt-mk-wrap {
}
.unit-main-invt-mk-hd {
  margin-top: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
}
.unit-main-invt-mk-bd {
  padding: 10px;
  .TableWrapper {
    height: 432px;
  }
  td, th {
    padding: 3px;
    white-space: nowrap;
  }
  tbody {
    td {
      height: 45px;
    }
  }
  .FormInput {
    padding: 0;
    border-width: 0;
    font-size: inherit;
    line-height: inherit;
    input {
      height: 100%; // hack
      text-align: center;
    }
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
.unit-main-invt-mk-hd-left {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  margin-bottom: -23px;
  display: flex;
  flex-wrap: wrap;
  .filter-item {
    flex-grow: 0;
    flex-shrink: 0;
    margin-bottom: 23px;
    box-sizing: border-box;
    padding: 0 4px;
    width: 50%;
    display: flex;
    align-items: center;
  }
  .filter-item-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 100px;
    padding-right: 10px;
    text-align: right;
  }
  .filter-item-value {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
  }
}
.unit-main-invt-mk-hd-right {
  flex-grow: 0;
  flex-shrink: 0;
  width: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
  .Btn {
    width: 226px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    line-height: 22px;
  }
}
.unit-main-invt-mk-remind {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 30px;
  line-height: 42px;
  color: red;
  text-align: center;
}
.unit-main-invt-mk-ft {
  flex-grow: 0;
  flex-shrink: 0;
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  justify-content: center;
  .Btn {
    width: 120px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 22px;
    & + .Btn {
      margin-left: 8px;
    }
  }
}
.unit-main-invt-kbd {
  position: fixed;
  width: 280px;
  margin: 240px 175px;
  background-color: #efefef;
  flex-grow: 0;
  flex-shrink: 0;
  & > .KeyboardHolder {
    margin-top: 2px;
    height: 160px;
  }
  & > .closeKeyboard{
    background-color:#efefef;
    font-size: 30px;
    padding-left: 250px;
  }
}
.unit-main-invt-mk-bd-kbd {
  position: absolute;
  box-sizing: border-box;
  background: white;
  width: 292px;
  height: 225px;
  right: 3.1%;
  top: 42.5%;
}
</style>
