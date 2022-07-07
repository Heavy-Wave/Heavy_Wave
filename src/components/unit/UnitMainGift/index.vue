<template>
  <div class="UnitMainGift">

    <div class="unit-main-gift-bd">

      <div class="unit-main-gift-title">满足促销条件的活动</div>

      <div class="unit-main-gift-data">

        <div class="unit-main-gift-table">

          <table-wrapper>
            <thead>
              <tr>
                <th>活动编号</th>
                <th>活动名称</th>
                <th>开始时间</th>
                <th>截止时间</th>
                <th>状态</th>
                <th>分组ID</th>
              </tr>
            </thead>
            <tbody v-if="model !== null && model.prom_info !== null">
              <tr
                v-for="item in model.prom_info.slice(perPage * (currentPage - 1), perPage * currentPage)"
                :key="`${item.prom_id}:${item.group_id}`"
                :class="{ 'active': selected === `${item.prom_id}:${item.group_id}` }"
                @click="onClickItem(item)"
              >
                <td>{{ item.prom_id }}</td>
                <td>{{ item.prom_name }}</td>
                <td>{{ item.start_dt }}</td>
                <td>{{ item.end_dt }}</td>
                <td>{{ item.op_sta }}</td>
                <td>{{ item.group_id }}</td>
              </tr>
            </tbody>
          </table-wrapper>

        </div>

        <div class="unit-main-gift-pagi">

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

      <div class="unit-main-gift-title">满赠活动声明</div>

      <div class="unit-main-gift-anno">

      </div>

    </div>

    <div class="unit-main-gift-ft">
      <div class="unit-main-prom-ft-start">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">确认并返回</btn>
        </template>
      </div>
      <div class="unit-main-prom-ft-end">
        <template v-if="hasChoose">
          <btn secondary @click="onClickChoose">选赠品</btn>
        </template>
        <template v-if="hasPay">
          <btn primary @click="onClickPay">支付</btn>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainGift',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      selected: null,
      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '满赠活动弹窗关闭')
    },
    hasPay () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '跳转支付')
    },
    hasChoose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '赠品列表')
    },
    totalPages () {
      if (this.model === null || this.model.prom_info === null) return 0

      return Math.ceil(this.model.prom_info.length / this.perPage)
    }
  },
  mounted () {
    Promise.all([
      this.load()
    ])
  },
  methods: {
    load () {
      this.$loading.show()
      return this.fetch()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetch () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '满赠活动列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '满赠活动列表':
          return this.load()
      }
    },

    /**
     * 回调：列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.prom_id.toString(), 'posMain.posGift.selectedProm.promId'),
        this.$ui.setData(item.group_id.toString(), 'posMain.posGift.selectedProm.groupId'),
        this.$ui.setData(item.gift_qty.toString(), 'posMain.posGift.prom.promQty')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '满赠活动列表')
        })
        .then(() => {
          this.selected = `${item.prom_id}:${item.group_id}`
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onClickPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    onClickPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：关闭按钮被点击
     */
    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '满赠活动弹窗关闭')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：支付按钮被点击
     */
    onClickPay () {
      if (this.tabsCurrent === null) return

      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '跳转支付')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：选择按钮被点击
     */
    onClickChoose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '赠品列表')
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
.UnitMainGift {
  width: 896px;
}
.unit-main-gift-bd {
  padding: 8px;
}
.unit-main-gift-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 25px;
  color: #000000;
}
.unit-main-gift-data {
  display: flex;
  align-items: stretch;
}
.unit-main-gift-table {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  & > .TableWrapper {
    border-color: #000000;
    border-radius: 2px;
    height: 296px;
  }
}
.unit-main-gift-pagi {
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
.unit-main-gift-anno {
  height: 86px;
  border: 1px solid #000000;
  border-radius: 2px;
  overflow: auto;
}
.unit-main-gift-ft {
  margin-top: 1px; // hack
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  align-items: center;
  .Btn {
    width: 120px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    & + .Btn {
      margin-left: 4px;
    }
  }
}
.unit-main-gift-ft-start {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
}
.unit-main-gift-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
