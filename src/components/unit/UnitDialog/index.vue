<template>
  <div class="UnitDialog">

    <div class="unit-dialog-wrap">

      <div class="unit-dialog-message" v-if="model !== null">{{ model.info }}</div>

      <div class="unit-dialog-actions">

        <template v-if="hasClose">
          <div class="unit-dialog-actions-start">
            <btn secondary @click="onClickClose">关闭</btn>
          </div>
          <div class="unit-dialog-actions-right">
            <template v-for="(el, index) in elements">
              <btn primary :key="index" @click="onClickButton(el)">{{ el.elements_name }}</btn>
            </template>
          </div>
        </template>

        <template v-else>
          <div class="unit-dialog-actions-center">
            <template v-for="(el, index) in elements">
              <btn primary :key="index" @click="onClickButton(el)">{{ el.elements_name }}</btn>
            </template>
          </div>
        </template>

      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitDialog',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
    }
  },
  mounted () {
    this.load()
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    elements () {
      if (this.unit.ui_element !== null) {
        return this.unit.ui_element.filter(
          el =>
            el !== null &&
            el.elements_type === 'button' &&
            el.element_group_type !== '关闭'
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '提示')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '提示':
          return this.load()
      }
    },

    /**
     * 回调：关闭按钮被点击
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
    },

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
.UnitDialog {
  width: 394px;
}
.unit-dialog-wrap {
}
.unit-dialog-message {
  padding: 60px 16px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  text-align: center;
}
.unit-dialog-actions {
  margin-top: 1px; // hack
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  .Btn {
    width: 102px;
    padding: 10px 8px;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    & + .Btn {
      margin-left: 10px;
    }
  }
}
.unit-dialog-actions-start {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
}
.unit-dialog-actions-right {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
.unit-dialog-actions-center {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  justify-content: center;
}
</style>
