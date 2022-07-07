<template>
  <div class="UnitMainBroken">

    <div class="unit-main-brk-wrap">

      <div class="unit-main-brk-left" v-if="hasList">

        <scroller tag="table-wrapper" ref="ctnList">
          <thead>
            <tr>
              <th>报损单号</th>
              <th>日期</th>
            </tr>
          </thead>
          <tbody v-if="modelList !== null && modelList.prepare_data !== null">
            <tr
              v-for="item in modelList.prepare_data"
              :key="item.op_id"
              :class="{ 'active': selected === item.op_id }"
              @click="onClickListItem(item)"
            >
              <td>{{ item.op_id }}</td>
              <td>{{ item.acpt_dt | datetime }}</td>
            </tr>
          </tbody>
        </scroller>

        <div class="unit-main-brk-ft">
          <div class="unit-main-brk-ft-start">
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
          <div class="unit-main-brk-ft-end">
          </div>
        </div>

      </div>

      <div class="unit-main-brk-right" v-if="hasDetails">

        <scroller tag="table-wrapper" ref="ctnDetails">
          <thead>
            <tr>
              <th>商品编号</th>
              <th>商品名称</th>
              <th>报损数量</th>
              <th>商品售价</th>
              <th>报损说明</th>
            </tr>
          </thead>
          <tbody v-if="modelDetails !== null && modelDetails.prepare_data !== null">
            <tr
              v-for="item in modelDetails.prepare_data"
              :key="item.line_no"
            >
              <td>{{ item.item_id }}</td>
              <td>{{ item.item_name }}</td>
              <td>{{ item.qty }}</td>
              <td>{{ item.std_price }}/{{ item.base_unit }}</td>
              <td>{{ item.broken_info }}</td>
            </tr>
          </tbody>
        </scroller>

        <div class="unit-main-brk-ft">
          <div class="unit-main-brk-ft-start">
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
          <div class="unit-main-brk-ft-end">
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
  name: 'UnitMainBroken',
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点主数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelList = data
        })
        .then(() => {
          this.selected = null
        })
    },

    fetchDetails () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点单明细')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelDetails = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '盘点主数据':
          return this.loadList()
        case '盘点单明细':
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
        this.$ui.setData(item.op_id.toString(), 'posMain.brokenMain.opId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '盘点主数据')
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
    }
  }
}
</script>

<style lang="scss">
.UnitMainBroken {
  height: 100%;
}
.unit-main-brk-wrap {
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
  }
}
.unit-main-brk-left {
  flex-grow: 0;
  flex-shrink: 0;
  width: 310px;
}
.unit-main-brk-right {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  margin-left: 4px;
}
.unit-main-brk-left,
.unit-main-brk-right {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.unit-main-brk-ft {
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
.unit-main-brk-ft-start {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
}
.unit-main-brk-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
