<template>
  <div class="UnitMainPay">

    <div class="unit-main-pay-part-primary">

      <div class="unit-main-pay-part-toparea">

        <pt-slot top-menu-id="POS_MAIN" name="main-pay-toparea" />

      </div>

      <div class="unit-main-pay-part-navi">

        <pt-slot top-menu-id="POS_MAIN" name="main-pay-navi" />

      </div>

      <div class="unit-main-pay-part-subarea">

        <pt-slot top-menu-id="POS_MAIN" name="main-pay-subarea" />

      </div>

    </div>

    <div class="unit-main-pay-part-secondary">

      <div class="unit-main-pay-part-gateways">

        <pt-slot top-menu-id="POS_MAIN" name="main-pay-method" />

      </div>

      <div class="unit-main-pay-part-list">

        <pt-slot top-menu-id="POS_MAIN" name="main-pay-list" />

      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainPay',
  mixins: [
    unitMixin
  ]
}
</script>

<style lang="scss">
.UnitMainPay {
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: stretch;
}
.unit-main-pay-part-primary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-part-secondary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  border-left: 1px solid #9d9d9d;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-part-toparea {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-pay-part-navi {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-pay-part-subarea {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-pay-part-gateways {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-pay-part-list {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  & > .PtSlot {
    height: 100%;
  }
}
</style>
