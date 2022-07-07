<template>
  <div class="UnitMainReserveFund" v-if="existList !== null && changeList !== null">

    <div class="unit-main-rf-column">

      <div class="unit-main-rf-table">

        <div class="unit-main-rf-title">上次存取记录</div>

        <table-wrapper>
          <thead>
            <tr>
              <th>币别</th>
              <th width="33.33%">枚数</th>
              <th width="33.33%">账面金额</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="existList != null && existList.reserve_info !== null">
              <tr
                v-for="(item, key) in existList.reserve_info"
                :key="key"
              >
                <td>{{ item.amt_type }}</td>
                <td>{{ item.chg_no }}</td>
                <td>{{ item.end_amt }}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>{{ '合计：' + existListTotal.nums }}</td>
              <td>{{ '合计：' + existListTotal.price }}</td>
            </tr>
          </tfoot>
        </table-wrapper>

      </div>

      <div class="unit-main-rf-more" v-if="!kbdDisplay">
        <div class="unit-main-rf-shop-info">
          <div class="title">备用金</div>
          <div class="value">{{ existList.end_amt  }}</div>
        </div>
        <div class="unit-main-rf-shop-info">
          <div class="title">店铺番号</div>
          <div class="value">{{ existList.dept_id }}</div>
        </div>
        <div class="unit-main-rf-shop-info">
          <div class="title">店铺名称</div>
          <div class="value">{{ existList.dept_name }}</div>
        </div>
        <div class="unit-main-rf-shop-info">
          <div class="title">日<span style="display: inline-block; width: 1em;" /><span style="display: inline-block; width: 1em;" />期</div>
          <div class="value">{{ existList.access_dt }}</div>
        </div>
        <div class="unit-main-rf-shop-info">
          <div class="title">POS 机号</div>
          <div class="value">{{ existList.pos_id }}</div>
        </div>
        <div class="unit-main-rf-kbd-hide-more">
          <btn secondary title="隐藏键盘" @click="onClickHideKbd">
            <pt-icon i="kbd-hide" />
          </btn>
        </div>
      </div>
      <div class="unit-main-rf-kbd" v-if="kbdDisplay">
        <keyboard-holder />
        <div class="unit-main-rf-kbd-hide">
          <btn secondary title="隐藏键盘" @click="onClickHideKbd">
            <pt-icon i="kbd-hide" />
          </btn>
        </div>
      </div>

    </div>

    <div class="unit-main-rf-column">

      <div class="unit-main-rf-table">

        <div class="unit-main-rf-title">存取备用金操作</div>

        <table-wrapper>
          <thead>
            <tr>
              <th>币别</th>
              <th width="33.33%">枚数</th>
              <th width="33.33%">存/取金额</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="changeList != null && changeList.reserve_info !== null">
              <tr
                v-for="(item, index) in changeList.reserve_info"
                :key="index"
              >
                <td>{{ item.amt_type }}</td>
                <td style="background-color: rgba(204, 212, 243, 0.5);">
                  <form-input
                    :value="changeList.reserve_info[index].chg_no.toString()"
                    @input="onInput(index, $event)"
                    @blur="onBlur($event)"
                    @focus="openEnumModify()"
                    type="number"
                    :min="0"
                  />
                </td>
                <td>{{ item.end_amt }}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>合计：{{ changeListTotal.nums }}</td>
              <td>合计：{{ changeListTotal.price }}</td>
            </tr>
          </tfoot>
        </table-wrapper>

      </div>

      <div class="unit-main-rf-more">
        <template v-if="hasDeposit">
          <btn @click="onClickDeposit" primary>存入</btn>
        </template>
        <template v-if="hasWithdraw">
          <btn @click="onClickWithdraw" primary outline>取出</btn>
        </template>
        <template v-if="hasPrint">
          <btn @click="onPrint">打印</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainReserveFund',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      existList: null,
      changeList: null,
      kbdDisplay: false
    }
  },
  computed: {
    existListTotal () {
      const result = { nums: 0, price: 0 }
      if (this.existList === null || this.existList.reserve_info == null) return result
      this.existList.reserve_info.forEach((el, key) => {
        result.nums = result.nums + (parseFloat(el.chg_no) || 0)
        result.price = result.price + (parseFloat(el.end_amt) || 0)
      })
      return result
    },
    changeListTotal () {
      const result = { nums: 0, price: 0 }
      if (this.changeList === null || this.changeList.reserve_info == null) return result
      this.changeList.reserve_info.forEach((el, key) => {
        result.nums = result.nums + (parseFloat(el.chg_no) || 0)
        result.price = result.price + (parseFloat(el.amt_type) || 0) * 10 * (parseFloat(el.chg_no) || 0) / 10
      })
      return result
    },

    hasDeposit () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '备用金存入')
    },
    hasWithdraw () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '备用金取出')
    },
    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印')
    },
    keyboardType () {
      return 'decimal'
    }
  },
  mounted () {
    Promise.all([
      this.loadExist(),
      this.loadChange()
    ])
  },
  methods: {
    loadExist () {
      this.$loading.show()
      return this.fetchExistList()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadChange () {
      this.$loading.show()
      return this.fetchChangeList()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchExistList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '现有备用金列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.existList = data
        })
    },

    fetchChangeList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '修改备用金列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.changeList = data
        })
    },

    onInput (index, value) {
      if (this.changeList === null || this.changeList.reserve_info === null) return

      value = parseInt(value)

      if (isNaN(value) || value < 0) {
        value = 0
      }

      this.changeList.reserve_info[index].chg_no = value
      this.changeList.reserve_info[index].end_amt = this.changeList.reserve_info[index].amt_type * 10 * this.changeList.reserve_info[index].chg_no / 10
    },

    onBlur (event) {
      if (event.target.value === '') {
        event.target.value = 0
      }
    },

    onClickDeposit () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.changeList.reserve_info), 'posMain.posReserve.moneyInfo'),
        this.$ui.setData('1', 'posMain.posReserve.flg')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '备用金存入')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onClickWithdraw () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.changeList.reserve_info), 'posMain.posReserve.moneyInfo'),
        this.$ui.setData('2', 'posMain.posReserve.flg')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '备用金取出')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onPrint () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '打印')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '修改备用金列表':
          return this.loadChange()
        case '现有备用金列表':
          return this.loadExist()
      }
    },

    // 关闭金钱管理键盘
    enumModify () {
      this.kbdDisplay = false
      this.$kbd.hide()
    },

    // 打开金钱管理键盘
    openEnumModify () {
      this.kbdDisplay = true
      // 显示键盘
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
.UnitMainReserveFund {
  height: 100%;
  box-sizing: border-box;
  padding: 4px;
  display: flex;
  align-items: stretch;
}
.unit-main-rf-column {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  flex-direction: column;
  & + .unit-main-rf-column {
    margin-left: 4px;
  }
}
.unit-main-rf-table {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 18px;
  .TableWrapper {
    border-color: #000000;
    border-radius: 2px;
    thead {
      font-size: 14px;
    }
    td {
      padding: 4.5px 10px
    }
    tfoot {
      td {
        text-align: right;
      }
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
}
.unit-main-rf-more {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  margin-top: 4px;
  border: 1px solid #000000;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  .Btn {
    padding: 10px 6px;
    margin: 0 63px;
    font-size: 20px;
    line-height: 28px;
    & + .Btn {
      margin-top: 20px;
    }
  }
}
.unit-main-rf-title {
  padding: 4px 0 8px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  font-weight: bold;
}
.unit-main-rf-shop {
  box-sizing: border-box;
  padding: 12px 0;
}
.unit-main-rf-shop-info {
  display: flex;
  align-items: center;
  margin: 12px 83px 12px 43px;
  .title {
    flex-shrink: 0;
    flex-grow: 0;
    width: 66px;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    font-weight: normal;
  }
  .value {
    flex-shrink: 1;
    flex-grow: 1;
    width: 1px;
    padding: 8px 11px;
    border-radius: 2px;
    background-color: #e7e7e7;
    font-size: 14px;
    line-height: 19px;
    color: #000000;
    font-weight: bold;
  }
}
.unit-main-rf-kbd {
  position: relative;
  flex-grow: .68;
  flex-shrink: 1;
  margin-top: 4px;
  border: 1px solid #000000;
  border-radius: 2px;
  .Btn {
    flex: flex-right;
    width: 125px;
    padding-top: 9px;
    padding-bottom: 8px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @include single-text-ellipsis;
    & + .Btn {
      margin-left: 3px;
    }
    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    &.disabled {
      opacity: .35;
    }
  }
}
.unit-main-rf-kbd-hide {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}
.unit-main-rf-kbd-hide-more {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
  position: absolute;
  right: 45.5%;
  bottom: 3.1%;
  .Btn {
    flex: flex-right;
    width: 125px;
    padding-top: 9px;
    padding-bottom: 8px;
    margin: 0;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @include single-text-ellipsis;
    & + .Btn {
      margin-left: 3px;
    }
    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    &.disabled {
      opacity: .35;
    }
  }
}
</style>
