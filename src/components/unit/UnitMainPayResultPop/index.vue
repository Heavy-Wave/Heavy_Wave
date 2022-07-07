<template>
  <div class="UnitMainPayResultPop">

    <div class="unit-main-pay-retpop-bd">

      <div class="unit-main-pay-retpop-cont">
        <div class="unit-main-pay-retpop-title">银联设备是否交易成功并打印小票？</div>
        <div class="unit-main-pay-retpop-subtitle">如已成功，请填写相关参数，才能点击【确定】哦！</div>
      </div>

      <div class="unit-main-pay-retpop-form">
        <div class="unit-main-pay-retpop-row">
          <div class="unit-main-pay-retpop-lbl">银行卡号</div>
          <div class="unit-main-pay-retpop-val">
            <form-input v-model="cardNo" />
          </div>
        </div>
        <div class="unit-main-pay-retpop-row">
          <div class="unit-main-pay-retpop-lbl">凭证号</div>
          <div class="unit-main-pay-retpop-val">
            <form-input v-model="voucherNo" />
          </div>
        </div>
        <div class="unit-main-pay-retpop-row">
          <div class="unit-main-pay-retpop-lbl">参考号</div>
          <div class="unit-main-pay-retpop-val">
            <form-input v-model="referenceNo" />
          </div>
        </div>
        <div class="unit-main-pay-retpop-row">
          <div class="unit-main-pay-retpop-lbl">商户号</div>
          <div class="unit-main-pay-retpop-val">
            <form-input v-model="merchantNo" />
          </div>
        </div>
        <div class="unit-main-pay-retpop-row">
          <div class="unit-main-pay-retpop-lbl">终端号</div>
          <div class="unit-main-pay-retpop-val">
            <form-input v-model="terminalNo" />
          </div>
        </div>
      </div>

    </div>

    <div class="unit-main-pay-retpop-ft">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">没有</btn>
      </template>
      <template v-if="hasOk">
        <btn primary @click="onClickOk">已成功交易</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainPayResultPop',
  mixins: [
    unitMixin
  ],
  data () {
    return {
      cardNo: '',
      voucherNo: '',
      referenceNo: '',
      merchantNo: '',
      terminalNo: ''
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '完成')
    }
  },
  methods: {
    /**
     * 回调：“已成功交易”按钮被点击
     */
    onClickOk () {
      if (typeof this.referenceNo !== 'string' || this.referenceNo.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.cardNo.toString(), 'posMain.UnionPay.CardNo'),
        this.$ui.setData(this.voucherNo.toString(), 'posMain.UnionPay.VoucherNo'),
        this.$ui.setData(this.referenceNo.toString(), 'posMain.UnionPay.ReferenceNo'),
        this.$ui.setData(this.merchantNo.toString(), 'posMain.UnionPay.MerchantNo'),
        this.$ui.setData(this.terminalNo.toString(), 'posMain.UnionPay.TerminalNo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '完成')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“没有”按钮被点击
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
.UnitMainPayResultPop {
  width: 641px;
}
.unit-main-pay-retpop {
  &-bd {
    padding: 14px;
    display: flex;
    align-items: stretch;
  }
  &-cont {
    flex: 1 1 auto;
    width: 1px;
    border: 1px solid #a3a2a8;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
  }
  &-title {
    flex: 1 1 auto;
    height: 1px;
    padding: 24px 33px 0;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }
  &-subtitle {
    flex: 0 0 auto;
    padding: 0 33px 24px;
    font-size: 13px;
    line-height: 18px;
    color: #ff0000;
  }
  &-form {
    margin-left: 14px;
    flex: 1 1 auto;
    width: 1px;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    .FormInput {
      padding: 0;
      border-width: 0;
      font-size: inherit;
      line-height: inherit;
    }
  }
  &-row {
    display: flex;
    align-items: center;
    & + .unit-main-pay-retpop-row {
      margin-top: 32px;
    }
  }
  &-lbl {
    flex: 0 0 auto;
    width: 66px;
  }
  &-val {
    flex: 1 1 auto;
    width: 1px;
    padding: 7px;
    background-color: #e7e7e7;
  }
  &-ft {
    padding: 14px;
    display: flex;
    align-items: center;
    .Btn {
      flex: 1 1 auto;
      width: 1px;
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
}
</style>
