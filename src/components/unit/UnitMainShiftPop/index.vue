<template>
  <div class="UnitMainShiftPop">
    <div class="unit-main-shift-pop-wrap">
      <div class="unit-main-shift-pop-hd" v-if="hasDate">
        <label>日期</label>
        <form-input v-model="date" type="date" style="font-weight: bold;" />
        <template v-if="hasSearch">
          <btn secondary @click="onClickSearch">查询</btn>
        </template>
      </div>

      <div class="unit-main-shift-pop-bd">
        <table-wrapper v-if="hasDetails">
          <thead>
            <tr>
              <th>收银员</th>
              <th>班次</th>
              <th>接班时间</th>
              <th>交班时间</th>
              <th>重新打印</th>
            </tr>
          </thead>
          <tbody v-if="items !== null">
            <tr
              v-for="item in items"
              :key="item.shift_start_dt"
              :class="{ 'active': selected === item.shift_start_dt }"
              @click="onClickListItem(item)"
            >
              <td>{{ item.staff_id }}</td>
              <td>{{ item.classes }}</td>
              <td>{{ item.shift_end_dt }}</td>
              <td>{{ item.shift_start_dt }}</td>
              <td>{{ item.print_flg }}</td>
            </tr>
            <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
              <td v-for="seq in 5" :key="`placeholder-${seq}`">&nbsp;</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="seq in perPage" :key="`placeholder-${seq}`">
              <td v-for="seq in 5" :key="`placeholder-${seq}`">&nbsp;</td>
            </tr>
          </tbody>
        </table-wrapper>
      </div>

      <div class="unit-main-shift-pop-ft">
        <div class="unit-main-shift-pop-ft-start">
          <template v-if="hasClose">
            <btn secondary @click="onClickClose">关闭</btn>
          </template>
        </div>
        <div class="unit-main-shift-pop-ft-end">
          <btn title="上一页" :disabled="currentPage === 1" @click="onClickPagiPrev">
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            :disabled="totalPages === 0 || currentPage === totalPages"
            @click="onClickPagiNext"
          >
            <pt-icon i="arrow-down" />
          </btn>
          <template v-if="hasPrint">
            <btn primary @click="onClickPrint">打印</btn>
          </template>
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
  name: 'UnitMainShiftPop',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      date: moment().format('YYYY-MM-DD'),
      selected: null,
      currentPage: 1,
      perPage: 5
    }
  },
  computed: {
    hasDate () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '日期输入框')
    },
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '查询')
    },
    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '交接班信息')
    },

    items () {
      if (this.model !== null && this.model.info !== null) {
        return this.model.info.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.model === null || this.model.info === null) return 0

      return Math.ceil(this.model.info.length / this.perPage)
    }
  },
  methods: {
    load () {
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '交接班信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '交接班信息':
          return this.load()
      }
    },

    onClickPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    onClickPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：“查询”按钮被点击
     */
    onClickSearch () {
      if (this.date === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.date.toString(), 'posMain.shift.Date')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '查询')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：列表项被点击
     */
    onClickListItem (item) {
      if (item.shift_start_dt === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(item).toString(), 'posMain.shift.printInfo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '交接班信息')
        })
        .then(() => {
          this.selected = item.shift_start_dt
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“打印”按钮被点击
     */
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

    /**
     * 回调：“关闭”按钮被点击
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
    }
  }
}
</script>

<style lang="scss">
.UnitMainShiftPop {
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td,
    th {
      @include single-text-ellipsis;
    }
  }
}
.unit-main-shift-pop {
  &-wrap {
  }
  &-hd {
    padding: 10px;
    display: flex;
    align-items: center;
    label {
      flex-grow: 0;
      flex-shrink: 0;
      width: 60px;
    }
    .FormInput {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
    }
    .Btn {
      margin-left: 4px;
      padding: 4px 12px;
      font-size: 14px;
      line-height: 20px;
    }
  }
  &-bd {
    padding: 10px;
    display: flex;
    align-items: stretch;
  }
  &-ft {
    padding: 8px 10px;
    border-top: 1px solid #dddde2;
    display: flex;
    align-items: center;
    &-start {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      display: flex;
    }
    &-end {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
    }
    .Btn {
      width: 100px;
      padding: 10px 0;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      & + .Btn {
        margin-left: 10px;
      }
    }
  }
}
</style>
