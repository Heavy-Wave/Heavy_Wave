<template>
  <div class="UnitMainFuncHorizontalPagi">

    <div class="unit-main-func-horizontal-pagi-wrap">

      <div class="nav-prev">
        <btn
          secondary
          title="上一页"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <pt-icon i="arrow-left" />
        </btn>
      </div>

      <div class="nav-content">
        <template v-for="(el, index) in elements.slice(perPage * (currentPage - 1), perPage * currentPage)">
          <btn secondary :key="index" :title="el.elements_name" @click="onClickButton(el)">
            <span style="white-space: pre-line;">{{ el.elements_name }}</span>
          </btn>
        </template>
      </div>

      <div class="nav-next">
        <btn
          secondary
          title="下一页"
          :disabled="totalPages === 0 || currentPage === totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          <pt-icon i="arrow-right" />
        </btn>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainFuncHorizontalPagi',
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
      default: 5
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
      return Math.ceil(this.elements.length / this.perPage)
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
.UnitMainFuncHorizontalPagi {
}
.unit-main-func-horizontal-pagi-wrap {
  padding: 1px;
  display: flex;
  align-items: stretch;
  .nav-prev,
  .nav-next {
    flex-grow: 0;
    flex-shrink: 0;
    .Btn {
      height: 100%;
      box-sizing: border-box;
      padding: 0 14px;
    }
  }
  .nav-content {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding-left: 1px;
    padding-right: 1px;
    display: flex;
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
}
</style>
