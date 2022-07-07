<template>
  <div class="UnitMainPayTotal">

    <div class="unit-main-pay-total-wrap">

      <div class="unit-main-pay-total-info">
        <div class="unit-main-pay-total-info-item" v-if="model !== null">
          <div class="unit-main-pay-total-label">待支付金额</div>
          <div class="unit-main-pay-total-value price">
            <display-price :value="model.surplus_amt" />
          </div>
        </div>
        <div class="unit-main-pay-total-info-item" v-if="model !== null">
          <div class="unit-main-pay-total-label">已付 / 应付</div>
          <div class="unit-main-pay-total-value">
            <display-price :value="model.pay_amt" /> / <display-price :value="model.total_amt" />
          </div>
        </div>
        <div class="unit-main-pay-total-info-item" v-if="model !== null">
          <div class="unit-main-pay-total-label highlight">溢收</div>
          <div class="unit-main-pay-total-value price">
            <display-price :value="model.excess_amt" />
          </div>
        </div>
      </div>

    </div>

    <div class="unit-main-pay-list-wrap">

      <div class="unit-main-pay-list-items">
        <div class="unit-main-pay-list-items-tr header">
          <div class="unit-main-pay-list-items-td">支付类型</div>
          <div class="unit-main-pay-list-items-td align-right">金额</div>
          <div class="unit-main-pay-list-items-td">备注</div>
        </div>
        <template v-if="model !== null && model.pay_list !== null">
          <div
            v-for="item in model.pay_list"
            :key="item.line_no"
            class="unit-main-pay-list-items-tr body"
          >
            <div class="unit-main-pay-list-items-td">{{ item.pay_name }}</div>
            <div class="unit-main-pay-list-items-td align-right">
              <display-price :value="item.pay_amt" />
            </div>
            <div class="unit-main-pay-list-items-td">{{ item.pay_info }}</div>
          </div>
        </template>
      </div>

      <div class="unit-main-pay-list-action">
        <div class="unit-main-pay-list-action-secondary">
          <template v-if="hasClose">
            <btn secondary @click="onClickClose">返回</btn>
          </template>
        </div>
        <div class="unit-main-pay-list-action-primary">
          <template v-if="hasOk">
            <btn primary @click="onClickSubmit">确认</btn>
          </template>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPayTotal',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '支付列表':
          return this.load()
      }
    },

    /**
     * 回调：返回按钮被点击
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
     * 回调：确定按钮被点击
     */
    onClickSubmit () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定')
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
.UnitMainPayTotal {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-total-wrap {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 1px 3px 2px;
}
.unit-main-pay-total-info {
  border: 1px solid #000000;
  background-color: #ffffff;
  border-radius: 2px;
}
.unit-main-pay-total-info-item {
  display: flex;
  align-items: center;
  & + .unit-main-pay-total-info-item {
    border-top: 1px solid #000000;
  }
  .highlight {
    color: #ff0000;
  }
  .price {
    color: var(--pt-color-price);
  }
}
.unit-main-pay-total-label {
  flex-grow: 0;
  flex-shrink: 0;
  width: 33.3333%;
  font-size: 18px;
  line-height: 25px;
  color: #333333;
  text-align: center;
}
.unit-main-pay-total-value {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  padding-right: 13px;
  font-size: 24px;
  line-height: 33px;
  color: #707070;
  text-align: right;
}
.unit-main-pay-list-wrap {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  padding: 1px 3px 2px;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-list-items {
  flex-grow: 1;
  flex-shrink: 1;
  height: 82px;
  border: 1px solid #000000;
  background-color: #ffffff;
  border-radius: 2px;
  overflow: auto;
  font-size: 18px;
  line-height: 25px;
  color: #000000;
}
.unit-main-pay-list-items-tr {
  padding-top: 7px;
  padding-bottom: 7px;
  display: flex;
  &.header {
    padding-top: 8px;
    padding-bottom: 9px;
    background-color: #eeeeee;
  }
  &.body {
    border-bottom: 1px solid #eeeeee;
    cursor: pointer;
    &:hover {
      background-color: #f6f6f6;
    }
    &.active {
      background-color: #eeeeee;
    }
  }
}
.unit-main-pay-list-items-td {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  padding-left: 24px;
  padding-right: 24px;
  @include single-text-ellipsis;
  &.align-right {
    text-align: right;
  }
}
.unit-main-pay-list-action {
  margin-top: 3px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
.unit-main-pay-list-action-secondary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: 99px;
    padding-top: 9px;
    padding-bottom: 8px;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    text-align: center;
    @include single-text-ellipsis;
    & + .Btn {
      margin-left: 3px;
    }
  }
}
.unit-main-pay-list-action-primary {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: 139px;
    padding-top: 9px;
    padding-bottom: 8px;
    font-size: 20px;
    line-height: 28px;
    color: #ffffff;
    text-align: center;
    @include single-text-ellipsis;
  }
}
</style>
