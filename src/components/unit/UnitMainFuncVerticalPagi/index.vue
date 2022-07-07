<template>
  <div class="UnitMainFuncVerticalPagi">

    <div class="unit-main-func-vertical-pagi-wrap" v-if="elements.length > 0">
      <btn @click="onClickPagi">切换</btn>
      <template v-for="(el, index) in elements.slice(perPage * (currentPage - 1), perPage * currentPage)">
        <btn :key="index" :title="el.elements_name" @click="onClickButton(el)">
          <template v-if="el.elements_name === '+'">
            <pt-icon i="qty-plus" />
          </template>
          <template v-else-if="el.elements_name === '-'">
            <pt-icon i="qty-minus" />
          </template>
          <template v-else>
            <span style="white-space: pre-line;">{{ el.elements_name | wordWrap(2) }}</span>
          </template>
        </btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainFuncVerticalPagi',
  mixins: [
    unitMixin,
    autoRevertFocus
  ],
  props: {
    elementGroupType: {
      type: String,
      required: false,
      default: null
    },
    perPage: {
      type: Number,
      required: false,
      default: 8
    }
  },
  data () {
    return {
      currentPage: 1
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
    },
    totalPages () {
      if (this.elements === null) return 1

      return Math.max(1, Math.ceil(this.elements.length / this.perPage))
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
    },

    /**
     * 回调：切换按钮被点击
     */
    onClickPagi () {
      this.currentPage < this.totalPages
        ? this.currentPage++
        : this.currentPage = 1
    }
  }
}
</script>

<style lang="scss">
.UnitMainFuncVerticalPagi {
  height: 100%;
}
.unit-main-func-vertical-pagi-wrap {
  height: 100%;
  width: 60px;
  padding: 1px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .Btn {
    display: block;
    flex-grow: 1;
    flex-shrink: 1;
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
