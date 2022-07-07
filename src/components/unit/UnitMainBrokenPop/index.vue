<template>
  <div class="UnitMainBrokenPop">

    <div class="unit-main-brk-pop-wrap">

      <div class="unit-main-brk-pop-hd">
        <div class="unit-main-brk-pop-hd-item">
          <label>日期：</label>
          <form-input v-model="date" type="date" style="font-weight: bold;" />
        </div>
      </div>

      <div class="unit-main-brk-pop-bd">

        <div class="unit-main-brk-pop-dtl">
          <table-wrapper>
            <thead>
              <tr>
                <th style="width: 120px;">商品编号</th>
                <th style="width: 160px;">商品名称</th>
                <th style="width: 80px;">报损数量</th>
                <th style="width: 100px;">商品售价</th>
                <th style="width: 120px;">报损说明</th>
                <th style="width: 60px;">操作</th>
              </tr>
            </thead>
            <tbody v-if="items !== null">
              <tr v-for="item in items" :key="item.line_no">
                <td>{{ item.item_id }}</td>
                <td>{{ item.item_name }}</td>
                <td class="cell-input">
                  <form-input type="number" v-model="item.qty" :min="1" />
                </td>
                <td>{{ item.std_price }}/{{ item.base_unit }}</td>
                <td class="cell-input">
                  <form-input type="text" v-model="item.memo" />
                </td>
                <td>
                  <a href="javascript:void(0);" @click="onClickItemDelete(item)">删除</a>
                </td>
              </tr>
              <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
                <td v-for="seq in 6" :key="`placeholder-${seq}`">&nbsp;</td>
              </tr>
            </tbody>
          </table-wrapper>
        </div>

        <div class="unit-main-brk-pop-pagi">
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

    <div class="unit-main-brk-pop-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">关闭</btn>
      </template>
      <template v-if="hasOk">
        <btn primary @click="onClickOk">保存</btn>
      </template>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainBrokenPop',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelList: null,

      date: moment().format('YYYY-MM-DD'),
      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    hasDate () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '日期输入框')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '保存')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '报损商品数据')
    },

    items () {
      if (this.modelList !== null && this.modelList.prepare_data !== null) {
        return this.modelList.prepare_data.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.modelList === null || this.modelList.prepare_data === null) return 0

      return Math.ceil(this.modelList.prepare_data.length / this.perPage)
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

    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '报损商品数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          // 对可填写的字段作预处理
          if (data.prepare_data !== null) {
            for (const i in data.prepare_data) {
              if (!('qty' in data.prepare_data[i])) data.prepare_data[i].qty = 0
              if (!('memo' in data.prepare_data[i])) data.prepare_data[i].memo = ''
              data.prepare_data[i].qty = data.prepare_data[i].qty.toString()
            }
          }

          this.modelList = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '报损商品数据':
          return this.loadList()
      }
    },

    onClickPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    onClickPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：“删除”按钮被点击
     */
    onClickItemDelete (item) {
      if (this.modelList === null) return
      if (this.modelList.prepare_data === null) return

      const index = this.modelList.prepare_data.findIndex(el => el.line_no === item.line_no)
      if (index !== -1) {
        this.modelList.prepare_data.splice(index, 1)
      }
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
    },

    /**
     * 回调：“保存”按钮被点击
     */
    onClickOk () {
      if (this.date === null) return
      if (this.modelList === null) return
      if (this.modelList.prepare_data === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.date.toString(), 'posMain.brokenPop.Date'),
        this.$ui.setData(JSON.stringify(this.modelList.prepare_data).toString(), 'posMain.brokenPop.Data')
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
.UnitMainBrokenPop {
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td,
    th {
      @include single-text-ellipsis;
    }
  }
}
.unit-main-brk-pop {
  &-wrap {
    padding: 10px;
  }
  &-hd {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    &-item {
      flex-grow: 0;
      flex-shrink: 0;
      width: 33.3333%;
      display: flex;
      align-items: center;
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
    margin-top: 1px; // hack
    padding: 8px;
    border-top: 1px solid #dddde2;
    display: flex;
    align-items: center;
    justify-content: center;
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
