<template>
  <div class="UnitMainPayPop">

    <div class="unit-main-pay-pop-bd">

      <div class="unit-main-pay-pop-form-wrap">

        <template v-if="hasDetails">
          <div class="unit-main-pay-pop-form-group" v-if="model !== null">
            <label class="unit-main-pay-pop-form-label">
              <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">支付方式：</template>
              <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">退款方式：</template>
            </label>
            <div class="unit-main-pay-pop-form-control">
              <strong>
                <template v-if="isFastPay">快捷支付</template>
                <template v-else>{{ model.pay_name }}</template>
              </strong>
            </div>
          </div>
        </template>

        <template v-if="hasPrice">
          <div class="unit-main-pay-pop-form-group" v-if="model !== null">
            <label class="unit-main-pay-pop-form-label">
              <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">支付金额：</template>
              <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">退款金额：</template>
            </label>
            <div class="unit-main-pay-pop-form-control">
              <template v-if="isFastPay">
                <form-input
                  :value="model.surplus_amt.toString()"
                  type="text"
                  readonly
                />
              </template>
              <template v-else>
                <form-input
                  ref="inputPrice"
                  v-model="price"
                  type="text"
                  pattern="\d*"
                  :disabled="model.op_type === $const.PAY.OP_TYPE.REFUND"
                  @keypress.enter="onEnterPrice"
                />
              </template>
            </div>
          </div>
        </template>

        <template v-if="hasBarcode">
          <div class="unit-main-pay-pop-form-group">
            <label class="unit-main-pay-pop-form-label">扫码：</label>
            <div class="unit-main-pay-pop-form-control">
              <form-input
                ref="inputBarcode"
                v-model="barcode"
                type="text"
                @keypress.enter="onEnterBarcode"
              />
            </div>
          </div>
        </template>

      </div>

      <template v-if="model !== null && model.op_type === $const.PAY.OP_TYPE.PAY && !isFastPay">
        <div class="unit-main-pay-pop-total-wrap">
          <div class="unit-main-pay-pop-total-title">找零/溢收</div>
          <div class="unit-main-pay-pop-total-content">{{ overPrice | decimal($sys.settings.precisionPrice, true) }}</div>
        </div>
      </template>

      <template v-if="hasDetails">
        <div class="unit-main-pay-pop-table-wrap" v-if="model !== null">
          <pay-list
            v-model="selected"
            :model="model"
            :show-retry="hasRetry"
            :show-delete="hasDelete"
            @retry="onClickRetry"
            @delete="onClickDelete"
          />
        </div>
      </template>

      <template v-if="clock === null">
        <div class="unit-main-pay-pop-kbd-wrap">
          <keyboard-holder />
        </div>
      </template>
      <template v-else>
        <div class="unit-main-pay-pop-clock">
          <div class="unit-main-pay-pop-clock-title">正在在线支付,请稍后&hellip;</div>
          <div class="unit-main-pay-pop-clock-value">{{ clock }}</div>
        </div>
      </template>

    </div>

    <div class="unit-main-pay-pop-ft">
      <template v-if="hasClose">
        <div class="unit-main-pay-pop-ft-start">
          <btn secondary @click="onClickClose">返回</btn>
        </div>
      </template>
      <template v-if="hasOk">
        <div class="unit-main-pay-pop-ft-end">
          <btn primary @click="onClickOk">确定</btn>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPayPop',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  props: {
    isFastPay: {
      type: Boolean,
      required: false,
      default: false
    },
    isWaitResult: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      model: null,

      selected: null,
      price: '',
      barcode: '',

      clock: null
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
    },
    hasRetry () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '重试')
    },
    hasDelete () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '删除')
    },
    hasPrice () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '金额输入框')
    },
    hasBarcode () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '扫码输入框')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '支付明细')
    },
    overPrice () {
      if (this.model === null || this.model.surplus_amt === null) return 0

      return Math.max(0, (parseFloat(this.price) || 0) - (parseFloat(this.model.surplus_amt) || 0))
    }
  },
  created () {
    this._timer = null
  },
  mounted () {
    Promise.all([
      this.load()
    ])
  },
  beforeDestroy () {
    // 停止倒计时
    this.stopClock()
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付明细')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
        .then(() => {
          // 初始金额值
          if (typeof this.price !== 'string' || this.price.length === 0) {
            this.price = this.model.surplus_amt.toString()
          }
        })
        .then(() => {
          // 获取焦点
          this.focus()
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '支付明细':
          return this.load()
      }
    },

    /**
     * 获取焦点
     */
    focus () {
      if (this.hasPrice && this.model.op_type !== this.$const.PAY.OP_TYPE.REFUND) {
        if ('inputPrice' in this.$refs) {
          this.$refs.inputPrice.focus()
        }
      }
    },

    /**
     * 开始倒计时
     */
    startClock () {
      this.stopClock()
      this._timer = window.setInterval(() => {
        this.stepClock()
      }, 1e3)

      this.clock = 300
    },

    /**
     * 结束倒计时
     */
    stopClock () {
      if (this._timer) {
        window.clearInterval(this._timer)
        this._timer = null
      }

      this.clock = null
    },

    /**
     * 步进倒计时
     */
    stepClock () {
      this.clock--
    },

    /**
     * 回调：重试按钮被点击
     */
    onClickRetry () {
      const item = this.model.pay_list.find(el => el.line_no === this.selected)

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.line_no.toString(), 'posMain.pay.pop.payList.recodeId'),
        this.$ui.setData(item.pay_type.toString(), 'posMain.pay.pop.payType'),
        this.$ui.setData(item.pay_amt.toString(), 'posMain.pay.pop.amt'),
        this.$ui.setData(item.up_op_id.toString(), 'posMain.posReceiptHeader.UpReceiptId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '重试')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：删除按钮被点击
     */
    onClickDelete () {
      if (this.isWaitResult) {
        // 开始倒计时
        this.startClock()
      }

      const item = this.model.pay_list.find(el => el.line_no === this.selected)

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.line_no.toString(), 'posMain.pay.pop.payList.recodeId'),
        this.$ui.setData(item.pay_type.toString(), 'posMain.pay.pop.payType'),
        this.$ui.setData(item.pay_amt.toString(), 'posMain.pay.pop.amt')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '删除', { timeout: this.isWaitResult ? 300e3 : undefined })
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          if (this.isWaitResult) {
            // 停止倒计时
            this.stopClock()
          }

          this.$loading.hide()
        })
    },

    /**
     * 回调：金额输入框被回车
     */
    onEnterPrice () {
      if (this.hasBarcode) {
        this.$refs.inputBarcode.focus()
      } else {
        return this.onClickOk()
      }
    },

    /**
     * 回调：扫码输入框被回车
     */
    onEnterBarcode () {
      return this.onClickOk()
    },

    /**
     * 回调：确定按钮被点击
     */
    onClickOk () {
      if (this.isWaitResult) {
        // 开始倒计时
        this.startClock()
      }

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.model.pay_id, 'posMain.pay.pop.payType'),
        this.$ui.setData(this.price, 'posMain.pay.pop.amt'),
        this.$ui.setData(this.barcode, 'posMain.pay.pop.barcode')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定', { timeout: this.isWaitResult ? 300e3 : undefined })
        })
        .catch(error => {
          this.$message.error(error)

          // 清空扫码输入框
          this.barcode = ''
        })
        .finally(() => {
          if (this.isWaitResult) {
            // 停止倒计时
            this.stopClock()
          }

          this.$loading.hide()
        })
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
    }
  }
}
</script>

<style lang="scss">
.UnitMainPayPop {
  width: 520px;
}
.unit-main-pay-pop-bd {
  padding: 8px;
}
.unit-main-pay-pop-ft {
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  align-items: center;
  .Btn {
    width: 100px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    & + .Btn {
      margin-left: 14px;
    }
  }
}
.unit-main-pay-pop-form-wrap {
  font-size: 18px;
  line-height: 25px;
  color: #000000;
}
.unit-main-pay-pop-form-group {
  display: flex;
  align-items: center;
  & + .unit-main-pay-pop-form-group {
    margin-top: 7px;
  }
}
.unit-main-pay-pop-form-label {
  flex-grow: 0;
  flex-shrink: 0;
  width: 100px;
}
.unit-main-pay-pop-form-control {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
}
.unit-main-pay-pop-total-wrap {
  margin-top: 11px;
  border: 1px solid #000000;
  border-radius: 2px;
}
.unit-main-pay-pop-total-title {
  background-color: #eeeeee;
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  text-align: center;
}
.unit-main-pay-pop-total-content {
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 28px;
  line-height: 40px;
  color: var(--pt-color-price);
  text-align: center;
}
.unit-main-pay-pop-table-wrap {
  margin-top: 4px;
}
.unit-main-pay-pop-kbd-wrap {
  margin-top: 6px;
  height: 236px;
}
.unit-main-pay-pop-clock {
  padding: 78px 15px;
}
.unit-main-pay-pop-clock-title {
  font-size: 18px;
  line-height: 25px;
  color: #000000;
  text-align: center;
}
.unit-main-pay-pop-clock-value {
  margin-top: 39px;
  font-size: 48px;
  line-height: 67px;
  color: #000000;
  font-weight: bold;
  text-align: center;
}
.unit-main-pay-pop-ft-start {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
}
.unit-main-pay-pop-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
