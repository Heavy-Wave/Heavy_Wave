<template>
  <flex-row class="UnitMainMoney">

    <flex-column>

      <expanded vertical class="unit-main-money-left">
        <pt-slot top-menu-id="POS_MAIN" name="main-money-navi" />
      </expanded>

      <div class="unit-main-money-action" v-if="hasBack">
        <btn secondary block @click="onClickBack">关闭</btn>
      </div>

    </flex-column>

    <expanded horizontal class="unit-main-money-content">
      <pt-slot top-menu-id="POS_MAIN" name="main-money-subarea" />
    </expanded>

  </flex-row>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainMoney',
  mixins: [
    unitMixin
  ],
  computed: {
    hasBack () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    }
  },
  methods: {
    /**
     * 回调：关闭按钮被点击
     */
    onClickBack () {
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
.UnitMainMoney {
  height: 100%;
}
.unit-main-money-left {
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-money-content {
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-money-action {
  padding: 1px;
  .Btn {
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
