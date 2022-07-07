<template>
  <div class="UnitMainOtherodd">

    <div class="unit-main-othod-wrap">

      <div class="unit-main-othod-left" v-if="hasList">

        <scroller tag="table-wrapper" ref="ctnList">
          <thead>
            <tr>
              <th style="width: 7em;">日期</th>
              <th>其他收支单号</th>
              <th style="width: 5em;">审核状态</th>
            </tr>
          </thead>
          <tbody v-if="modelList !== null && modelList.v_main !== null">
            <tr
              v-for="item in modelList.v_main"
              :key="item.op_id"
              :class="{ 'active': selected === item.op_id }"
              @click="onClickListItem(item)"
            >
              <td>{{ item.op_dt | date }}</td>
              <td>{{ item.op_id }}</td>
              <td :class="{
                'danger': parseInt(item.op_sta) === 0
              }">{{ item.op_sta_info }}</td>
            </tr>
          </tbody>
        </scroller>

        <div class="unit-main-othod-ft">
          <div class="unit-main-othod-ft-start">
            <template v-if="hasList && 'ctnList' in $refs">
              <btn
                title="上一页"
                :disabled="!$refs.ctnList.canGoUp"
                @click="$refs.ctnList.goUp()"
              >
                <pt-icon i="arrow-up" />
              </btn>
              <btn
                title="下一页"
                :disabled="!$refs.ctnList.canGoDown"
                @click="$refs.ctnList.goDown()"
              >
                <pt-icon i="arrow-down" />
              </btn>
            </template>
          </div>
          <div class="unit-main-othod-ft-end"></div>
        </div>
      </div>

      <div class="unit-main-othod-right" v-if="hasDetails">
        <scroller tag="table-wrapper" ref="ctnDetails">
          <thead>
            <tr>
              <th style="width: 6em;">收支类型</th>
              <th style="width: 8em;">支付方式</th>
              <th style="width: 8em;">金额</th>
              <th>收支明细</th>
            </tr>
          </thead>
          <tbody v-if="modelDetails !== null && modelDetails.v_dtl !== null">
            <tr
              v-for="item in modelDetails.v_dtl"
              :key="item.line_no"
            >
              <td>{{ item.inorout }}</td>
              <td>{{ item.pay_type }}</td>
              <td :class="{
                'success': parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.IN,
                'danger': parseInt(item.inorout_id) === $const.ACCOUNTING.INOROUT.OUT
              }">{{ item.pay_amt }}</td>
              <td>{{ item.pay_info }}</td>
            </tr>
          </tbody>
        </scroller>

        <div class="unit-main-othod-ft">
          <div class="unit-main-othod-ft-start">
            <template v-if="hasDetails && 'ctnDetails' in $refs">
              <btn
                title="上一页"
                :disabled="!$refs.ctnDetails.canGoUp"
                @click="$refs.ctnDetails.goUp()"
              >
                <pt-icon i="arrow-up" />
              </btn>
              <btn
                title="下一页"
                :disabled="!$refs.ctnDetails.canGoDown"
                @click="$refs.ctnDetails.goDown()"
              >
                <pt-icon i="arrow-down" />
              </btn>
            </template>
          </div>
          <div class="unit-main-othod-ft-end">
            <template v-if="hasModify">
              <btn @click="onClickModify" :disabled="selected === null">编辑</btn>
            </template>
            <template v-if="hasCreate">
              <btn @click="onClickCreate">新增</btn>
            </template>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainOtherodd',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelList: null,
      modelDetails: null,

      selected: null
    }
  },
  computed: {
    hasCreate () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '新增')
    },
    hasModify () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '修改')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '主数据')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '明细数据')
    }
  },
  mounted () {
    Promise.all([
      this.loadList()
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

    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '主数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelList = data
        })
        .then(() => {
          // 自动选中第一项
          if (this.modelList !== null && this.modelList.v_main !== null) {
            return this.onClickListItem(this.modelList.v_main[0])
          }
        })
        .then(() => {
          this.selected = null
        })
    },

    fetchDetails () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '明细数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelDetails = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '主数据':
          return this.loadList()
        case '明细数据':
          return this.loadDetails()
      }
    },

    /**
     * 回调：列表数据行被点击
     */
    onClickListItem (item) {
      if (item.op_id === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.op_id.toString(), 'posMian.otherPayments.opId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '主数据')
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
     * 回调：“编辑”按钮被点击
     */
    onClickModify () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData('2', 'posMian.otherPayments.opMode')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '修改')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“新增”按钮被点击
     */
    onClickCreate () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData('1', 'posMian.otherPayments.opMode')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '新增')
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
.UnitMainOtherodd {
  height: 100%;
}
.unit-main-othod-wrap {
  height: 100%;
  box-sizing: border-box;
  padding: 4px;

  display: flex;
  align-items: stretch;

  font-size: 13px;
  line-height: 20px;
  color: #000000;

  .Scroller {
    flex-grow: 1;
    flex-shrink: 1;
    height: 1px;
  }

  .TableWrapper {
    border-color: #000000;
    border-radius: 2px;
  }
  td, th {
    padding-left: 4px;
    padding-right: 4px;
    @include single-text-ellipsis;

    &.danger {
      background-color: var(--pt-color-danger);
      color: var(--pt-color-primary-content);
    }
    &.success {
      background-color: #00ff00;
    }
  }
}
.unit-main-othod-left {
  flex-grow: 0;
  flex-shrink: 0;
  width: 310px;
}
.unit-main-othod-right {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  margin-left: 4px;
}
.unit-main-othod-left,
.unit-main-othod-right {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.unit-main-othod-ft {
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
.unit-main-othod-ft-start {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
}
.unit-main-othod-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
