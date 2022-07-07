<template>
  <div class="UnitMainPayCoupons">

    <div class="unit-main-paycp-wrap">

      <div class="unit-main-paycp-search">
        <template v-if="hasKeywords">
          <form-input
            ref="input"
            v-model="keywords"
            type="text"
            pattern="\d*"
            placeholder="输入券编号"
            @keypress.enter="onEnter"
          />
        </template>
        <template v-if="hasOk">
          <btn secondary @click="onEnter">确认</btn>
        </template>
      </div>

      <div class="unit-main-paycp-list" v-if="list !== null">
        <div class="unit-main-paycp-items">
          <template v-for="item in list">
            <div class="unit-main-paycp-item" :key="item.GcId">
              <button @click="onClickItem(item)">
                <span class="name">{{ item.GcName }}</span>
                <span class="price">
                  <template v-if="item.GcFlag === 0">{{ item.GcOff * 10 }}折</template>
                  <template v-if="item.GcFlag === 1">¥{{ item.Amount }}</template>
                </span>
              </button>
            </div>
          </template>
        </div>
        <div class="unit-main-paycp-listnav">
          <btn
            title="上一页"
            secondary
            :disabled="listCurrentPage === 1"
            @click="onClickListPrev"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            secondary
            :disabled="listTotalPages === 0 || listCurrentPage === listTotalPages"
            @click="onClickListNext"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </div>
      </div>

      <div class="unit-main-paycp-history">
        <table-wrapper>
          <thead>
            <tr>
              <th width="25%">券号</th>
              <th>券名</th>
              <th width="25%">期限</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="history !== null">
              <tr
                v-for="item in history"
                :key="item.line_no"
                :class="{ 'active': selected === item.line_no }"
                @click="onClickHistoryItem(item)"
              >
                <td>{{ item.coupon_id }}</td>
                <td>{{ item.coupon_name }}</td>
                <td>{{ item.end_dt }}</td>
              </tr>
              <tr v-for="seq in (historyPerPage - history.length)" :key="`placeholder-${seq}`">
                <td v-for="seq in 3" :key="`placeholder-${seq}`">&nbsp;</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="seq in historyPerPage" :key="`placeholder-${seq}`">
                <td v-for="seq in 3" :key="`placeholder-${seq}`">&nbsp;</td>
              </tr>
            </template>
          </tbody>
        </table-wrapper>
      </div>

      <div class="unit-main-paycp-ft">
        <btn
          title="上一页"
          secondary
          :disabled="historyCurrentPage === 1"
          @click="onClickHistoryPrev"
        >
          <pt-icon i="arrow-up" />
        </btn>
        <btn
          title="下一页"
          secondary
          :disabled="historyTotalPages === 0 || historyCurrentPage === historyTotalPages"
          @click="onClickHistoryNext"
        >
          <pt-icon i="arrow-down" />
        </btn>
        <template v-if="hasUndo">
          <btn primary :disabled="selected === null" @click="onClickUndo">撤销</btn>
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
  name: 'UnitMainPayCoupons',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelList: null,
      modelHistory: null,

      keywords: '',
      selected: null,

      listCurrentPage: 1,
      listPerPage: 10,

      historyCurrentPage: 1,
      historyPerPage: 7
    }
  },
  computed: {
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确认')
    },
    hasUndo () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '撤销')
    },
    hasKeywords () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '券号输入框')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '会员券')
    },
    hasHistory () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '用券履历')
    },

    list () {
      if (this.modelList !== null && this.modelList.data !== null && this.modelList.data.GcList !== null) {
        return this.modelList.data.GcList.slice(this.listPerPage * (this.listCurrentPage - 1), this.listPerPage * this.listCurrentPage)
      }

      return null
    },
    listTotalPages () {
      if (this.modelList !== null && this.modelList.data !== null && this.modelList.data.GcList !== null) {
        return Math.max(1, Math.ceil(this.modelList.data.GcList.length / this.listPerPage))
      }

      return 0
    },

    history () {
      if (this.modelHistory !== null && this.modelHistory.return_info !== null) {
        return this.modelHistory.return_info.slice(this.historyPerPage * (this.historyCurrentPage - 1), this.historyPerPage * this.historyCurrentPage)
      }

      return null
    },
    historyTotalPages () {
      if (this.modelHistory !== null && this.modelHistory.return_info !== null) {
        return Math.max(1, Math.ceil(this.modelHistory.return_info.length / this.historyPerPage))
      }

      return 0
    }
  },
  mounted () {
    Promise.all([
      this.loadList(),
      this.loadHistory()
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '会员券')
        .then(res => res[0])
        .then(({ msg, data }) => {
          // 按 StartDate 和 EndDate 过滤
          if (data !== null && data.data !== null && data.data.GcList !== null) {
            data.data.GcList = data.data.GcList.filter(el => {
              return moment(el.StartDate, 'YYYY.MM.DD').isSameOrBefore(moment()) && moment(el.EndDate, 'YYYY.MM.DD').isSameOrAfter(moment())
            })
          }

          this.modelList = data
        })
    },

    loadHistory () {
      this.$loading.show()
      return this.fetchHistory()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchHistory () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '用券履历')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelHistory = data
        })
        .then(() => {
          this.selected = null
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '会员券':
          return this.loadList()
        case '用券履历':
          return this.loadHistory()
      }
    },

    /**
     * 回调：券上一页按钮被点击
     */
    onClickListPrev () {
      this.listCurrentPage = Math.max(1, this.listCurrentPage - 1)
    },

    /**
     * 回调：券下一页按钮被点击
     */
    onClickListNext () {
      this.listCurrentPage = Math.min(this.listTotalPages, this.listCurrentPage + 1)
    },

    /**
     * 回调：履历上一页按钮被点击
     */
    onClickHistoryPrev () {
      this.historyCurrentPage = Math.max(1, this.historyCurrentPage - 1)
    },

    /**
     * 回调：履历下一页按钮被点击
     */
    onClickHistoryNext () {
      this.historyCurrentPage = Math.min(this.historyTotalPages, this.historyCurrentPage + 1)
    },

    /**
     * 回调：搜索框被回车
     */
    onEnter () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      const item = Array.isArray(this.list)
        ? this.list.find(el => el.GcId === this.keywords) || null
        : null

      if (item === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(item), 'posMain.GcList')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确认')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：券列表项被点击
     */
    onClickItem (item) {
      this.keywords = item.GcId

      // 自动点击一次“确认”按钮
      this.onEnter()
    },

    /**
     * 回调：履历列表项被点击
     */
    onClickHistoryItem (item) {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '用券履历')
        .then(() => {
          this.selected = item.line_no
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“撤销”按钮被点击
     */
    onClickUndo () {
      if (this.selected === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.selected.toString(), 'posMain.GcLineNo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '撤销')
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
.UnitMainPayCoupons {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-paycp {
  &-wrap {
    height: 100%;
    box-sizing: border-box;
    padding: 2px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &-search {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    .FormInput {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      padding: 7px 11px;
      border-color: #707070;
      background-color: #ffffff;
    }
    .Btn {
      flex-grow: 0;
      flex-shrink: 0;
      padding: 8px 24px;
      margin-left: 10px;
    }
  }
  &-list {
    flex: 0 0 auto;
    margin-top: 2px;
    padding: 1px;
    min-height: 166px;
    border: 1px solid #000000;
    border-radius: 2px;
    display: flex;
    align-items: stretch;
  }
  &-items {
    flex: 1 1 auto;
    width: 1px;
    display: flex;
    flex-wrap: wrap;
  }
  &-item {
    flex-grow: 0;
    flex-shrink: 0;
    width: 20%;
    box-sizing: border-box;
    padding: 1px;
    button {
      display: block;
      width: 100%;
      padding: 4px;
      box-sizing: border-box;
      background-color: rgba(157, 157, 157, .1);
      border: 1px solid #707070;
      border-radius: 2px;
      font-size: 12px;
      line-height: 17px;
      color: #000000;
      letter-spacing: 0.01px;
      &.disabled {
        opacity: .2;
      }
      &:hover {
        background-color: lighten(#f6f6f6, 10%);
      }
      &:active {
        background-color: darken(#f6f6f6, 10%);
      }
      .name {
        height: 51px;
        @include multiple-text-ellipsis(3);
      }
      .price {
        font-size: 14px;
        line-height: 20px;
        color: var(--pt-color-price);
      }
    }
  }
  &-listnav {
    flex: 0 0 auto;
    margin-left: 6px;
    padding: 1px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .Btn {
      flex: 1 1 auto;
      height: 1px;
      min-height: 38px;
      padding: 8px 19px;
      & + .Btn {
        margin-top: 2px;
      }
    }
  }
  &-history {
    flex: 1 1 auto;
    height: 1px;
    margin-top: 2px;
    .TableWrapper {
      border-color: #000000;
      border-radius: 2px;
    }
  }
  &-ft {
    flex: 0 0 auto;
    margin-top: 2px;
    display: flex;
    .Btn {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      padding: 10px 0;
      font-size: 20px;
      line-height: 28px;
      & + .Btn {
        margin-left: 4px;
      }
    }
  }
}
</style>
