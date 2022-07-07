<template>
  <div class="UnitMainMoneyNavi">

    <div class="unit-main-money-navi-wrap" v-if="elements.length > 0">

      <nav-wrapper :length="Math.ceil(elements.length / perPage)">

        <nav-prev-button>
          <pt-icon i="arrow-up" />
        </nav-prev-button>

        <template v-for="index in Math.ceil(elements.length / perPage)">
          <nav-panel :index="index - 1" :key="index">
            <template v-for="(el, index) in elements.slice(perPage * (index - 1), perPage * index)">
              <btn block outline :key="index" @click="onClickButton(el)" :active="selected === el.elements_name">
                <span style="white-space: pre-line;">{{ el.elements_name }}</span>
              </btn>
            </template>
          </nav-panel>
        </template>

        <nav-next-button>
          <pt-icon i="arrow-down" />
        </nav-next-button>

      </nav-wrapper>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainMoneyNavi',
  mixins: [
    unitMixin
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
      selected: null
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
            if (parseFloat(e1.auto_sort) > parseFloat(e2.auto_sort)) return 1
            if (parseFloat(e1.auto_sort) < parseFloat(e2.auto_sort)) return -1
            return 0
          })
      }
      return []
    }
  },
  mounted () {
    this.doAuto()
  },
  methods: {
    /**
     * 自动点击标记为自动执行的 ui_element
     */
    doAuto () {
      for (const el of this.elements) {
        if (parseInt(el.auto_flg) === this.$const.UI.ELEMENT.AUTO_FLG.YES) {
          window.console.debug('📺', '自动点击:', el.elements_id, el.elements_name)
          this.onClickButton(el)
        }
      }
    },

    /**
     * 回调：功能按钮被点击
     */
    onClickButton (uiElement) {
      this.$loading.show()
      this.$ui.runMoleculesByUiElement(this.unit.top_menu_id, uiElement)
        .then(() => {
          this.selected = uiElement.elements_name
        })
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
.UnitMainMoneyNavi {
  height: 100%;
}
.unit-main-money-navi-wrap {
  height: 100%;
  width: 130px;
  padding: 1px;
  box-sizing: border-box;
  .NavWrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .NavPrevButton,
  .NavNextButton {
    flex-grow: 0;
    flex-shrink: 0;
    height: 48px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .NavPanel {
    flex-grow: 1;
    flex-shrink: 1;
    height: 1px;
    padding-top: 2px;
    padding-bottom: 2px;
    .Btn {
      padding-top: 8px;
      padding-bottom: 8px;
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      text-align: center;
      & + .Btn {
        margin-top: 2px;
      }
    }
  }
}
</style>
