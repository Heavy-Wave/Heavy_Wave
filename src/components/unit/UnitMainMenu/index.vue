<template>
  <div class="UnitMainMenu">

    <div class="unit-main-menu-wrap">

      <template v-for="item1 in items">
        <template v-if="item1.parent === null">

          <div class="unit-main-menu-item" :key="item1.elements_id">

            <button @click="onClickTopMenuItem(item1)">
              <template v-if="Object.keys(menuItemIconMap).includes(item1.elements_name)">
                <div class="unit-main-menu-icon" :class="menuItemIconMap[item1.elements_name]" />
              </template>

              <template
                v-if="hasBadges && modelBadges !== null && Object.keys(modelBadges).includes(item1.elements_name)"
              >
                <div class="unit-main-menu-badge">{{ modelBadges[item1.elements_name] }}</div>
              </template>

              <span>{{ item1.elements_name }}</span>
            </button>

            <template v-if="item1.elements_type === null && currentSubmenu === item1.elements_name">
              <div class="unit-main-submenu">
                <template v-for="item2 in items">
                  <template v-if="item2.parent === item1.elements_name">
                    <button
                      class="unit-main-submenu-item"
                      @click="onClickMenuItem(item2)"
                      :key="item2.elements_id"
                    >
                      {{ item2.elements_name }}
                      <template v-if="hasBadges && modelBadges !== null && Object.keys(modelBadges).includes(item2.elements_name)">
                        <span class="unit-main-submenu-badge">{{ modelBadges[item2.elements_name] }}</span>
                      </template>
                    </button>
                  </template>
                </template>
              </div>
            </template>

          </div>

        </template>
      </template>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainMenu',
  mixins: [
    unitMixin,
    unitListenRefreshMixin,
    autoRevertFocus
  ],
  data () {
    return {
      modelBadges: null,

      currentSubmenu: null
    }
  },
  computed: {
    hasBadges () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '挂单数量')
    },

    menuItemIconMap () {
      return {
        分类: 'products',
        商品分类: 'products',
        销售开单: 'sell',
        退货: 'return',
        挂单: 'pending',
        挂单列表: 'pending',
        挂单检索: 'pending',
        单据: 'desk',
        单据列表: 'desk',
        单据检索: 'desk',
        台桌: 'desk',
        系统: 'system'
      }
    },

    elements () {
      if (this.unit.ui_element !== null) {
        return this.unit.ui_element.filter(
          el =>
            el !== null &&
            el.elements_type === 'button'
        )
          .sort((e1, e2) => {
            if (parseFloat(e1.auto_sort) > parseFloat(e2.auto_sort)) return 1
            if (parseFloat(e1.auto_sort) < parseFloat(e2.auto_sort)) return -1
            return 0
          })
      }
      return []
    },

    items () {
      const ret = this.elements
        .map(el => ({
          ui_unit_set_id: el.ui_unit_set_id,
          elements_id: el.elements_id,
          elements_name: !el.elements_name.includes(':') ? el.elements_name : el.elements_name.split(':', 2)[1],
          elements_type: el.elements_type,
          element_group_type: el.element_group_type,
          parent: !el.elements_name.includes(':') ? null : el.elements_name.split(':')[0]
        }))

      for (let i = 0; i < ret.length; i++) {
        if (ret[i].parent !== null && !ret.some(el => el.elements_name === ret[i].parent)) {
          ret.splice(i, 0, {
            ui_unit_set_id: null,
            elements_id: null,
            elements_name: ret[i].parent,
            elements_type: null,
            element_group_type: null,
            parent: null
          })
        }
      }

      return ret
    }
  },
  mounted () {
    this.doAuto()
    this.load()
  },
  methods: {
    /**
     * 自动点击标记为自动执行的 ui_element
     */
    doAuto () {
      for (const el of this.elements) {
        if (parseInt(el.auto_flg) === this.$const.UI.ELEMENT.AUTO_FLG.YES) {
          window.console.debug('📺', '自动点击:', el.elements_id, el.elements_name)
          this.onClickMenuItem(el)
        }
      }
    },

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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '挂单数量')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelBadges = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '挂单数量':
          return this.load()
      }
    },

    /**
     * 切花当前显示的子菜单
     */
    switchSubmenu (id) {
      this.currentSubmenu = this.currentSubmenu !== id ? id : null
    },

    /**
     * 回调：一级菜单项被点击
     */
    onClickTopMenuItem (item) {
      if (item.elements_type === null) {
        // 点击了一个父级的一级菜单项
        this.switchSubmenu(item.elements_name)
      } else {
        // 点击了一个普通的一级菜单项
        this.onClickMenuItem(item)
      }
    },

    /**
     * 回调：菜单项被点击
     */
    onClickMenuItem (item) {
      this.$loading.show()
      return this.$ui.runMoleculesByUiElement(this.unit.top_menu_id, {
        ui_unit_set_id: item.ui_unit_set_id,
        elements_id: item.elements_id
      })
        .then(() => {
          // 特殊菜单项处理
          switch (item.element_group_type) {
            case '退出':
              return this.$sys.exit()
            case '挂起':
              return this.$sys.hangUp()
            case '更换用户':
              return this.$sys.logout()
            case '设定':
              return this.$store.dispatch('modalShow', 'settings')
            case '数据同步':
              return this.$message.notice('TODO')
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.switchSubmenu(null)
          this.$loading.hide()
        })
    }
  }
}
</script>

<style lang="scss">
.UnitMainMenu {
}
.unit-main-menu-wrap {
  position: relative;
  display: flex;
}
.unit-main-menu-item {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  & + .unit-main-menu-item {
    position: relative;
    &::before {
      content: "";
      display: block;
      width: 1px;
      height: 50px;
      background-color: #dedede;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  & > button {
    width: 100%;
    padding-top: 22px;
    padding-bottom: 14px;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    letter-spacing: 0.02px;
    text-align: center;
  }
  &:hover {
    & > button {
      opacity: 0.65;
    }
  }
  &:active,
  &.active {
    & > button {
      opacity: 0.35;
    }
  }
}
.unit-main-menu-icon {
  width: 30px;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 6px;
  background-size: 100% 100%;
  &.products {
    background-image: url("~@/assets/img/home-action-products.png");
  }
  &.sell {
    background-image: url("~@/assets/img/home-action-sell.png");
  }
  &.return {
    background-image: url("~@/assets/img/home-action-return.png");
  }
  &.pending {
    background-image: url("~@/assets/img/home-action-pending.png");
  }
  &.member {
    background-image: url("~@/assets/img/home-action-member.png");
  }
  &.desk {
    background-image: url("~@/assets/img/home-action-desk.png");
  }
  &.system {
    background-image: url("~@/assets/img/home-action-system.png");
  }
}
.unit-main-menu-badge {
  padding: 1px 6px;
  border-radius: 2px;
  background-color: var(--pt-color-primary);
  font-size: 13px;
  line-height: 18px;
  color: var(--pt-color-primary-content);
  position: absolute;
  top: 12px;
  right: 6px;
}
.unit-main-submenu {
  width: 134px;
  border: 1px solid #000000;
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 5;
  transform: translateX(-50%);
  &::after {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-left: 1px solid #000000;
    border-top: 1px solid #000000;
    background-color: #ffffff;
    border-radius: 2px;
    position: absolute;
    top: calc(-8px / 2 * 1.414 + 1px);
    left: 50%;
    z-index: 0;
    transform: translateX(-50%) rotate(45deg);
  }
}
.unit-main-menu-wrap > .unit-main-menu-item:last-child > .unit-main-submenu {
  left: initial;
  transform: initial;
  right: 0px;
}
.unit-main-submenu-item {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 6px;
  font-size: 18px;
  line-height: 25px;
  color: #000000;
  text-align: center;
  position: relative;
  z-index: 1;
  &:hover {
    background-color: var(--pt-color-selection);
    color: var(--pt-color-primary-content);
  }
  &:active {
    opacity: 0.85;
  }
  & + .unit-main-submenu-item {
    margin-top: 1px;
    &::after {
      content: "";
      display: block;
      height: 1px;
      background-color: #bcbbc0;
      position: absolute;
      top: -1px;
      left: 19px;
      right: 19px;
    }
  }
}
.unit-main-submenu-badge {
  padding: 1px 6px;
  border-radius: 2px;
  background-color: var(--pt-color-primary);
  font-size: 13px;
  line-height: 18px;
  color: var(--pt-color-primary-content);
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
