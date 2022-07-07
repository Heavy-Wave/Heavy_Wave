<template>
  <div class="UnitMainGiftChoose">

    <div class="unit-main-gift-choose-bd">

      <div class="unit-main-gift-choose-title">赠品可选</div>

      <div class="unit-main-gift-choose-data">

        <div class="unit-main-gift-choose-table">

          <table-wrapper>
            <thead>
              <tr>
                <th>商品编号</th>
                <th>商品名称</th>
                <th>换购数量</th>
                <th>换购单价</th>
                <th>换购金额</th>
              </tr>
            </thead>
            <tbody v-if="model !== null">
              <tr
                v-for="item in model.prom_item_list.slice(perPage * (currentPage - 1), perPage * currentPage)"
                :key="item.item_id"
                :class="{ 'active': selected === item.item_id }"
                @click="onClickItem(item)"
              >
                <td>{{ item.item_id }}</td>
                <td>{{ item.item_name }}</td>
                <td>{{ item.prom_qty }}</td>
                <td>{{ item.prom_price }}</td>
                <td>{{ item.prom_amt }}</td>
              </tr>
            </tbody>
          </table-wrapper>

        </div>

        <div class="unit-main-gift-choose-pagi">

          <template v-if="hasPlus">
            <btn @click="onClickPlus">&plus;</btn>
          </template>
          <template v-if="hasMinus">
            <btn @click="onClickMinus">&minus;</btn>
          </template>
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

    <div class="unit-main-gift-choose-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">返回</btn>
      </template>
      <template v-if="hasOk">
        <btn primary @click="onClickOk">确定</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainGiftChoose',
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
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回满赠活动窗口')
    },
    hasPlus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '加赠品')
    },
    hasMinus () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '减赠品')
    },
    totalPages () {
      if (this.model === null || this.model.prom_item_list === null) return 0

      return Math.ceil(this.model.prom_item_list.length / this.perPage)
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '满赠赠品')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '满赠赠品':
          return this.load()
      }
    },

    /**
     * 回调：列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.item_id.toString(), 'posMain.posGift.selectedItem.itemId'),
        this.$ui.setData(item.group_id.toString(), 'posMain.posGift.selectedProm.groupId'),
        this.$ui.setData(item.prom_price.toString(), 'posMain.posGift.prom.promPrice')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '满赠赠品')
        })
        .then(() => {
          this.selected = item.item_id
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
     * 回调：加按钮被点击
     */
    onClickPlus () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '加赠品')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：减按钮被点击
     */
    onClickMinus () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '减赠品')
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
     * 回调：确定按钮被点击
     */
    onClickOk () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '返回满赠活动窗口')
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
.UnitMainGiftChoose {
  width: 768px;
}
.unit-main-gift-choose-bd {
  padding: 8px;
}
.unit-main-gift-choose-title {
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 18px;
  line-height: 25px;
  color: #000000;
}
.unit-main-gift-choose-data {
  display: flex;
  align-items: stretch;
}
.unit-main-gift-choose-table {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  & > .TableWrapper {
    border-color: #000000;
    border-radius: 2px;
    height: 296px;
  }
}
.unit-main-gift-choose-pagi {
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
.unit-main-gift-choose-ft {
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  justify-content: center;
  .Btn {
    width: 120px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    & + .Btn {
      margin-left: 20px;
    }
  }
}
</style>
