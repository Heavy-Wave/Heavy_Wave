<template>
  <div class="UnitMainFuncVertical">

    <div class="unit-main-func-vertical-wrap" v-if="elements.length > 0">
      <template v-for="(el, index) in elements">
        <btn :key="index" :title="el.elements_name" @click="onClickButton(el)">
          <span style="white-space: pre-line;">{{ el.elements_name | wordWrap(2) }}</span>
        </btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainFuncVertical',
  mixins: [
    unitMixin,
    autoRevertFocus
  ],
  props: {
    elementGroupType: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    elements () {
      if (this.unit.ui_element !== null) {
        return this.unit.ui_element.filter(
          el =>
            el !== null &&
            el.elements_type === 'button' &&
            (this.elementGroupType === null || el.element_group_type === this.elementGroupType)
        )
          .sort((e1, e2) => {
            if (e1.auto_sort > e2.auto_sort) return 1
            if (e1.auto_sort < e2.auto_sort) return -1
            return 0
          })
      }

      return []
    }
  },
  methods: {
    /**
     * 回调：功能按钮被点击
     */
    onClickButton (uiElement) {
      this.$loading.show()
      this.$ui.runMoleculesByUiElement(this.unit.top_menu_id, uiElement)
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
.UnitMainFuncVertical {
  height: 100%;
}
.unit-main-func-vertical-wrap {
  height: 100%;
  width: 60px;
  box-sizing: border-box;
  padding: 1px;
  display: flex;
  flex-direction: column;
  .Btn {
    display: block;
    flex-grow: 1;
    flex-shrink: 0;
    height: 35px;
    max-height: 80px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
    letter-spacing: 0.02px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & + .Btn {
      margin-top: 2px;
    }
  }
}
</style>
