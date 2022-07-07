<template>
  <div class="UnitMainCheckout">

    <div class="unit-main-checkout-quantity">
      <div class="unit-main-checkout-quantity-item">
        <span class="label">优惠金额</span>
        <template v-if="model !== null">
          <display-price :value="model.total_dis_amt" />
        </template>
      </div>
      <div class="unit-main-checkout-quantity-item">
        <span class="label">预定金额</span>
        <template v-if="model !== null">
          <display-price :value="model.total_pay_amt" />
        </template>
      </div>
      <div class="unit-main-checkout-quantity-item">
        <span class="label">已收金额</span>
        <template v-if="model !== null">
          <display-price :value="model.total_real_amt" />
        </template>
      </div>
    </div>

    <div class="unit-main-checkout-actions">
      <div class="unit-main-checkout-actions-gateways" v-if="hasFastPay">
        <button @click="onClickFastPay">
          <img src="@/assets/img/home-payment-wechatpay.png" alt="微信支付" width="30" height="30" />
          <img src="@/assets/img/home-payment-alipay.png" alt="支付宝支付" width="30" height="30" />
        </button>
      </div>
      <div class="unit-main-checkout-actions-sum">
        <div class="unit-main-checkout-actions-we" v-if="modelWeight !== null">
          <div class="unit-main-checkout-actions-we-item">
            <div
              class="unit-main-checkout-actions-we-sw"
              :class="{ 'inactive': !isWeightStable, 'active': isWeightStable }"
            >稳定</div>
            <div class="unit-main-checkout-actions-we-label">重量</div>
            <div
              class="unit-main-checkout-actions-we-value"
            >{{ modelWeight.weight | decimal(3, true) }}</div>
          </div>
          <div class="unit-main-checkout-actions-we-item">
            <div class="unit-main-checkout-actions-we-sw">净重</div>
            <div class="unit-main-checkout-actions-we-label">单价</div>
            <div
              class="unit-main-checkout-actions-we-value"
            >{{ modelWeight.unit_price | decimal(2, true) }}</div>
          </div>
          <div class="unit-main-checkout-actions-we-item">
            <div
              class="unit-main-checkout-actions-we-sw"
              :class="{ 'inactive': !isWeightZero, 'active': isWeightZero }"
            >零位</div>
            <div class="unit-main-checkout-actions-we-label">金额</div>
            <div
              class="unit-main-checkout-actions-we-value"
            >{{ modelWeight.price | decimal(2, true) }}</div>
          </div>
        </div>
        <div class="unit-main-checkout-actions-total">
          <div class="unit-main-checkout-actions-total-label">实收</div>
          <div class="unit-main-checkout-actions-total-value">
            <template v-if="model !== null">
              <display-price :value="model.total_inv_real_amt" />
            </template>
          </div>
        </div>
      </div>
      <div class="unit-main-checkout-actions-btn" v-if="hasPay">
        <template v-if="model !== null">
          <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">
            <button @click="onClickPay">
              <span class="primary">收 银</span>
              <span class="secondary">正常收银</span>
            </button>
          </template>
          <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">
            <button class="negative" @click="onClickPay">
              <span class="primary">退 款</span>
              <span class="secondary">退货并退款</span>
            </button>
          </template>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainCheckout',
  mixins: [
    unitMixin,
    unitListenRefreshMixin,
    autoRevertFocus
  ],
  data () {
    return {
      model: null,
      modelWeight: null,

      fetchingWeight: false
    }
  },
  computed: {
    hasPay () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '结账按钮')
    },
    hasFastPay () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '快捷支付')
    },
    hasData () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '结单金额')
    },

    /**
     * @var Boolean 称数据是否稳定
     */
    isWeightStable () {
      return this.modelWeight !== null && this.modelWeight.is_stable
    },

    /**
     * @var Boolean 称数据是否零位
     */
    isWeightZero () {
      return this.modelWeight !== null && window.parseFloat(this.modelWeight.weight) === 0
    }
  },
  created () {
    if (this.$sys.settings !== null && window.parseInt(this.$sys.settings.weightScaleType) !== 0) {
      /** 定时器：在不稳定时获取称数据 */
      this._timerUnstable = window.setInterval(() => {
        if (this.fetchingWeight) return

        this.fetchWeightUnstable()
          .catch(error => {
            // 出错后停止定时器
            window.clearInterval(this._timerUnstable)

            this.$message.error(error)
          })
      }, 200)

      /** 定时器：在稳定时获取称数据 */
      this._timerStable = window.setInterval(() => {
        if (this.fetchingWeight) return

        this.fetchWeightStable()
          .catch(error => {
            // 出错后停止定时器
            window.clearInterval(this._timerStable)

            this.$message.error(error)
          })
      }, 1000)
    }
  },
  beforeDestroy () {
    this._timerUnstable && window.clearInterval(this._timerUnstable)
    this._timerStable && window.clearInterval(this._timerStable)
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '结单金额')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    /**
     * 获取称数据
     */
    fetchWeight () {
      this.fetchingWeight = true

      // 重试机制
      let fails = 0
      const run = () => this.$bridge.getScale()
        .then(({ msg, data }) => {
          this.modelWeight = data
        })
        .catch(error => {
          fails++
          if (error.code === -1 || fails > 5) {
            throw error
          }
          return run()
        })

      return run()
        .finally(() => {
          this.fetchingWeight = false
        })
    },

    /**
     * 在不稳定时获取称数据
     */
    fetchWeightUnstable () {
      if (this.modelWeight !== null && this.modelWeight.is_stable) return Promise.resolve()

      return this.fetchWeight()
    },

    /**
     * 在稳定时获取称数据
     */
    fetchWeightStable () {
      if (this.modelWeight !== null && !this.modelWeight.is_stable) return Promise.resolve()

      return this.fetchWeight()
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '结单金额':
          return this.load()
      }
    },

    /**
     * 回调：“第三方支付”按钮被点击
     */
    onClickFastPay () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '快捷支付')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“收银”按钮被点击
     */
    onClickPay () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '结账按钮')
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
.UnitMainCheckout {
  .unit-main-checkout-quantity {
    border-top: 1px solid #e6e6e6;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
  }
  .unit-main-checkout-quantity-item {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 20px;
    line-height: 28px;
    color: #707070;
    font-weight: bold;
    letter-spacing: 0.02px;
    .label {
      display: inline-block;
      margin-right: 10px;
      font-size: 16px;
      color: #000000;
    }
  }
  .unit-main-checkout-others {
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    padding: 2px;
    .NavWrapper {
      display: flex;
    }
    .NavPrevButton,
    .NavNextButton {
      flex-grow: 0;
      flex-shrink: 0;
      padding: 13px 18px;
      border: 1px solid #000000;
      background-color: #f6f6f6;
      border-radius: 2px;
      &:hover {
        background-color: lighten(#f6f6f6, 10%);
      }
      &:active {
        background-color: darken(#f6f6f6, 10%);
      }
    }
    .NavPanel {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      padding-left: 3px;
      padding-right: 3px;
      display: flex;
      .Btn {
        flex-grow: 1;
        flex-shrink: 1;
        width: 1px;
        margin-left: 3px;
        margin-right: 3px;
        font-size: 16px;
        line-height: 22px;
        font-weight: bold;
        letter-spacing: 0.02px;
        text-align: center;
      }
    }
  }
  .unit-main-checkout-actions {
    padding: 1px;
    border-top: 1px solid #e6e6e6;
    display: flex;
  }
  .unit-main-checkout-actions-gateways {
    display: flex;
    flex-direction: column;
    button {
      flex-grow: 1;
      flex-shrink: 0;
      width: 78px;
      height: 100px;
      box-sizing: border-box;
      border: 1px solid #000000;
      background-image: linear-gradient(135deg, #ffffff 0%, #e3e3e3 100%);
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:hover {
        background-image: linear-gradient(
          135deg,
          lighten(#ffffff, 10%) 0%,
          lighten(#e3e3e3, 10%) 100%
        );
      }
      &:active {
        background-image: linear-gradient(
          135deg,
          darken(#ffffff, 10%) 0%,
          darken(#e3e3e3, 10%) 100%
        );
      }
      & + button {
        margin-top: 2px;
      }
      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      img + img {
        margin-top: 16px;
      }
    }
  }
  .unit-main-checkout-actions-sum {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    align-self: center;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
  }
  .unit-main-checkout-actions-we {
    flex-grow: 0;
    flex-shrink: 0;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
  }
  .unit-main-checkout-actions-we-item {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding-top: 2px;
    text-align: center;
  }
  .unit-main-checkout-actions-we-sw {
    font-size: 12px;
    line-height: 20px;
    color: #000000;
    &::before {
      content: "";
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      background-color: #000000;
      border-radius: 2px;
      vertical-align: middle;
    }
    &.inactive {
      &::before {
        background-color: #ff4444;
      }
    }
    &.active {
      &::before {
        background-color: #00de24;
      }
    }
  }
  .unit-main-checkout-actions-we-label {
    font-size: 13px;
    line-height: 20px;
    color: #000000;
    font-weight: bold;
  }
  .unit-main-checkout-actions-we-value {
    font-size: 16px;
    line-height: 20px;
    color: var(--pt-color-primary);
    font-weight: bold;
  }
  .unit-main-checkout-actions-total {
    flex-grow: 1;
    flex-shrink: 0;
    font-size: 34px;
    line-height: 48px;
    color: #000000;
    font-weight: bold;
    letter-spacing: 0.04px;
    text-align: right;
    display: flex;
  }
  .unit-main-checkout-actions-total-label {
    flex-grow: 1;
    flex-shrink: 0;
    margin-right: 10px;
    font-size: 28px;
    text-align: center;
  }
  .unit-main-checkout-actions-total-value {
    flex-grow: 1;
    flex-shrink: 0;
    text-align: center;
  }
  .unit-main-checkout-actions-btn {
    width: 196px;
    button {
      display: block;
      width: 100%;
      background-color: var(--pt-color-primary-content);
      border: 1px solid var(--pt-color-primary);
      border-radius: 2px;
      .primary {
        display: block;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: var(--pt-color-primary);
        font-size: 34px;
        line-height: 48px;
        color: var(--pt-color-primary-content);
        font-weight: bold;
        letter-spacing: 0.03px;
        text-align: center;
      }
      .secondary {
        display: block;
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 16px;
        line-height: 22px;
        color: var(--pt-color-primary);
        letter-spacing: 0.02px;
        text-align: center;
      }
      &:hover {
        opacity: 0.85;
        .primary {
          opacity: 0.85;
        }
      }
      &:active {
        opacity: 1;
        .primary {
          opacity: 1;
        }
      }
      &.negative {
        border-color: #000000;
        .primary {
          background-color: #000000;
        }
        .secondary {
          color: #000000;
        }
        &:hover {
          border-color: lighten(#000000, 20%);
          .primary {
            background-color: lighten(#000000, 20%);
          }
        }
        &:active {
          border-color: lighten(#000000, 10%);
          .primary {
            background-color: lighten(#000000, 10%);
          }
        }
      }
    }
  }
}
</style>
