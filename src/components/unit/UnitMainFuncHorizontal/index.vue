<template>
  <div class="UnitMainFuncHorizontal">

    <div class="unit-main-func-horizontal-wrap" v-if="elements.length > 0">

      <template v-for="(el, index) in elements">
        <btn secondary :key="index" :title="el.elements_name" @click="onClickButton(el)">
          <span style="white-space: pre-line;">{{ el.elements_name }}</span>
        </btn>
      </template>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainFuncHorizontal',
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
.UnitMainFuncHorizontal {
}
.unit-main-func-horizontal-wrap {
  padding-top: 1px;
  display: flex;
  align-items: stretch;
  .Btn {
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    letter-spacing: 0.02px;
    text-align: center;
  }
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    height: 100%;
    box-sizing: border-box;
    margin-left: 1px;
    margin-right: 1px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
