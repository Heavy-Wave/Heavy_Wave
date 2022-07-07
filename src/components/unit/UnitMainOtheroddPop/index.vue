<template>
  <div class="UnitMainOtheroddPop">

    <div class="unit-main-othod-pop-wrap">

      <div class="unit-main-othod-pop-hd">
        <div class="unit-main-othod-pop-hd-start">
          <label>收支单时间：</label>
          <form-input v-model="date" type="date" style="font-weight: bold;" />
        </div>
        <div class="unit-main-othod-pop-hd-end">
          <btn primary @click="onClickIntroduction">收支说明</btn>
        </div>
      </div>

      <div class="unit-main-othod-pop-bd">

        <div class="unit-main-othod-pop-dtl">
          <table-wrapper>
            <thead>
              <tr>
                <th style="width: 6em;">收支类型</th>
                <th>收支明细</th>
                <th style="width: 10em;">支付方式</th>
                <th style="width: 8em;">金额</th>
                <th style="width: 8em;">操作</th>
              </tr>
            </thead>
            <tbody v-if="items !== null">
              <tr v-for="item in items" :key="item.line_no">
                <td :class="{
                  'success': parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.IN,
                  'danger': parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.OUT
                }">
                  <template v-if="parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.IN">收入</template>
                  <template v-if="parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.OUT">支出</template>
                </td>
                <td class="cell-input">
                  <form-select :value="item.pay_info_id" @input="onInputItemTopic(item, $event)" :options="topicOptions" />
                </td>
                <td class="cell-input">
                  <form-select :value="item.pay_type_id" @input="onInputItemGateway(item, $event)" :options="gatewayOptions" />
                </td>
                <td class="cell-input">
                  <form-input type="number" v-model="item.pay_amt" :min="0" />
                </td>
                <td>
                  <a href="javascript:void(0);" @click="onClickItemDelete(item)">删除</a>
                </td>
              </tr>
              <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
                <td v-for="seq in 5" :key="`placeholder-${seq}`">&nbsp;</td>
              </tr>
            </tbody>
          </table-wrapper>
        </div>

        <div class="unit-main-othod-pop-pagi">
          <btn
            title="上一页"
            :disabled="currentPage === 1"
            @click="onClickPagiPrev"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            :disabled="totalPages === 0 || currentPage === totalPages"
            @click="onClickPagiNext"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </div>

      </div>

    </div>

    <div class="unit-main-othod-pop-ft">
      <div class="unit-main-othod-pop-ft-start">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">返回</btn>
        </template>
      </div>
      <div class="unit-main-othod-pop-ft-center">
        <template v-if="hasCreateExpenses">
          <btn secondary @click="onClickCreateExpenses">新增支出</btn>
        </template>
        <template v-if="hasCreateReceipts">
          <btn secondary @click="onClickCreateReceipts">新增收入</btn>
        </template>
      </div>
      <div class="unit-main-othod-pop-ft-end">
        <template v-if="hasOk">
          <btn primary @click="onClickOk">保存</btn>
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
  name: 'UnitMainOtheroddPop',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelList: null,
      modelTopics: null,
      modelGateways: null,

      date: moment().format('YYYY-MM-DD'),
      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    hasDate () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '日期输入框')
    },
    hasCreateReceipts () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '新增收入')
    },
    hasCreateExpenses () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '新增支出')
    },
    hasIntroduction () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '收支说明')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '保存')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '收支信息')
    },
    hasTopics () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '收支项目')
    },
    hasGateways () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '支付方式')
    },

    items () {
      if (this.modelList !== null && this.modelList.v_init_info !== null) {
        return this.modelList.v_init_info.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.modelList === null || this.modelList.v_init_info === null) return 0

      return Math.ceil(this.modelList.v_init_info.length / this.perPage)
    },

    /**
     * @var {Array} “收支项目”选项列表
     */
    topicOptions () {
      if (this.modelTopics !== null && this.modelTopics.pay_type !== null) {
        return [
          { value: '', label: '请选择' }
        ].concat(
          this.modelTopics.v_info.map(el => ({
            value: el.pay_info_id,
            label: el.pay_info
          }))
        )
      }

      return []
    },

    /**
     * @var {Array} “支付方式”选项列表
     */
    gatewayOptions () {
      if (this.modelGateways !== null && this.modelGateways.pay_type !== null) {
        return [
          { value: '', label: '请选择' }
        ].concat(
          this.modelGateways.pay_type.map(el => ({
            value: el.pay_id,
            label: el.pay_name
          }))
        )
      }

      return []
    }
  },
  created () {
    if (this.modelList === null) {
      this.modelList = {
        v_init_info: []
      }
    } else if (this.modelList.v_init_info === null) {
      this.modelList.v_init_info = []
    }
  },
  mounted () {
    Promise.all([
      this.loadTopics(),
      this.loadGateways()
    ])
  },
  methods: {
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

    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '收支信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          // 对可填写的字段作预处理
          if (data.v_init_info !== null) {
            for (const i in data.v_init_info) {
              if (!('pay_info' in data.v_init_info[i])) data.v_init_info[i].pay_info = ''
              if (!('pay_type_id' in data.v_init_info[i])) data.v_init_info[i].pay_type_id = ''
              if (!('pay_amt' in data.v_init_info[i])) data.v_init_info[i].pay_amt = 0
              data.v_init_info[i].pay_amt = data.v_init_info[i].pay_amt.toString()
            }
          }

          // 预填充日期
          if ('v_date' in data && typeof data.v_date === 'string') {
            this.date = data.v_date
          }

          this.modelList = data
        })
    },

    loadTopics () {
      this.$loading.show()
      return this.fetchTopics()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchTopics () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '收支项目')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelTopics = data
        })
    },

    loadGateways () {
      this.$loading.show()
      return this.fetchGateways()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchGateways () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付方式')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelGateways = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '收支信息':
          return this.loadList()
        case '收支项目':
          return this.loadTopics()
        case '支付方式':
          return this.loadGateways()
      }
    },

    onClickPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    onClickPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：列表项“收支明细”被输入
     */
    onInputItemTopic (item, value) {
      item.pay_info_id = value
      item.pay_info = this.modelTopics.v_info.find(el => el.pay_info_id === value).pay_info
    },

    /**
     * 回调：列表项“支付方式”被输入
     */
    onInputItemGateway (item, value) {
      item.pay_type_id = value
      item.pay_type = this.modelGateways.pay_type.find(el => el.pay_id === value).pay_name
    },

    /**
     * 回调：“删除”按钮被点击
     */
    onClickItemDelete (item) {
      if (this.modelList === null) return
      if (this.modelList.v_init_info === null) return

      const index = this.modelList.v_init_info.findIndex(el => el.line_no === item.line_no)
      if (index !== -1) {
        this.modelList.v_init_info.splice(index, 1)
      }
    },

    /**
     * 回调：“收支说明”按钮被点击
     */
    onClickIntroduction () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData('0', 'posMian.otherPayments.opMode')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '收支说明')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“新增支出”按钮被点击
     */
    onClickCreateExpenses () {
      if (this.modelList === null) return
      if (this.modelList.v_init_info === null) return

      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '新增支出')
        .then(() => {
          this.modelList.v_init_info.push({
            line_no: Math.random().toString(16).substring(2, 8),
            inorout_id: this.$const.ACCOUNTING.INOROUT.OUT.toString(),
            pay_info_id: '',
            pay_info: '',
            pay_type_id: '',
            pay_type: '',
            pay_amt: ''
          })
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“新增收入”按钮被点击
     */
    onClickCreateReceipts () {
      if (this.modelList === null) return
      if (this.modelList.v_init_info === null) return

      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '新增收入')
        .then(() => {
          this.modelList.v_init_info.push({
            line_no: Math.random().toString(16).substring(2, 8),
            inorout_id: this.$const.ACCOUNTING.INOROUT.IN.toString(),
            pay_info_id: '',
            pay_info: '',
            pay_type_id: '',
            pay_type: '',
            pay_amt: ''
          })
        })
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
     * 回调：“保存”按钮被点击
     */
    onClickOk () {
      if (this.date === null) return
      if (this.modelList === null) return
      if (this.modelList.v_init_info === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.date.toString(), 'posMian.otherPayments.opDt'),
        this.$ui.setData(JSON.stringify(this.modelList.v_init_info).toString(), 'posMian.otherPayments.infoJson')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '保存')
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
.UnitMainOtheroddPop {
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td,
    th {
      @include single-text-ellipsis;
    }
  }
}
.unit-main-othod-pop {
  &-wrap {
    padding: 10px;
  }
  &-hd {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;

    &-start {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      display: flex;
      align-items: center;
    }
    &-end {
      flex-grow: 0;
      flex-shrink: 0;
      margin-left: 10px;
      display: flex;
    }

    label {
      flex-grow: 0;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .FormInput {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
    }

    .Btn {
      padding: 4px 10px;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      & + .Btn {
        margin-left: 10px;
      }
    }
  }
  &-bd {
    display: flex;
    align-items: stretch;
  }
  &-dtl {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    a {
      color: var(--pt-color-danger);
    }
    .FormInput,
    .FormSelect {
      padding: initial;
      border-width: 0;
      text-align: center;
    }
    .cell-input {
      background-color: var(--pt-color-list-highlight);
    }
  }
  &-pagi {
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: 7px;
    display: flex;
    flex-direction: column;
    .Btn {
      flex-grow: 1;
      flex-shrink: 1;
      height: 1px;
      padding-left: 10px;
      padding-right: 10px;
      & + .Btn {
        margin-top: 2px;
      }
    }
  }
  &-ft {
    padding: 8px;
    border-top: 1px solid #dddde2;
    display: flex;
    &-start {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
    }
    &-center {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      display: flex;
      justify-content: center;
    }
    &-end {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
    }
    .Btn {
      width: 100px;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 25px;
      text-align: center;
      & + .Btn {
        margin-left: 14px;
      }
    }
  }
}
</style>
