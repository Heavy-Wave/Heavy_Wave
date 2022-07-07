<template>
  <div class="UnitMainScan">

    <div class="unit-main-scan-wrap">

      <div class="unit-main-scan-icon" />

      <div class="unit-main-scan-control">
        <template v-if="hasKeywords">
          <input
            ref="input"
            v-model="value"
            type="text"
            placeholder="请输入商品编号"
            @keypress.enter.prevent="onEnter"
          />
          <btn secondary title="屏幕键盘" @click="onClickToggleKbd">
            <pt-icon i="kbd-show" />
          </btn>
        </template>
        <template v-if="hasSubmit">
          <btn primary @click="onClickSubmit">检索</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainScan',
  mixins: [
    unitMixin
  ],
  data () {
    return {
      value: ''
    }
  },
  computed: {
    hasKeywords () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '回车输入框')
    },
    hasSubmit () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '检索')
    }
  },
  mounted () {
    this.focus()
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },

    clear () {
      this.value = ''
    },

    /**
     * 回调：扫码框被回车
     */
    onEnter () {
      if (typeof this.value !== 'string' || this.value.length === 0) return

      this.$loading.show()
      return this.$ui.inputByUnit({
        'posMain.posScan.itemInfo.itemId': this.value
      }, this.unit.top_menu_id, this.unit.menu_id, 'input', '回车输入框')
        .then(() => {
          return this.clear()
        })
        .then(() => {
          return this.focus()
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“检索”按钮被点击
     */
    onClickSubmit () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData('1', 'posMain.posScan.searchFlg'),
        this.$ui.setData(this.value, 'posMain.posScan.itemInfo.itemId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '检索')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：键盘按钮被点击
     */
    onClickToggleKbd () {
      this.$loading.show()
      return this.$bridge.openKeyboard()
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
.UnitMainScan {
  border-bottom: 1px solid #e6e6e6;
}
.unit-main-scan-wrap {
  padding: 8px 12px 8px 8px;
  display: flex;
  align-items: center;
}
.unit-main-scan-icon {
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 8px;
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  background-image: url("~@/assets/img/home-scan.svg");
}
.unit-main-scan-control {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  display: flex;
  input {
    display: block;
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 6px 23px;
    margin-left: 8px;
  }
}
</style>
