<template>
  <div class="UnitMainPayMeta">

    <div class="unit-main-pay-meta-mt-wrap">

      <div
        class="unit-main-pay-meta-mt-item"
        v-for="(optionGroup, index) in optionGroups"
        :key="index"
      >
        <div class="unit-main-pay-meta-mt-title">{{ optionGroup.name }}</div>
        <div class="unit-main-pay-meta-mt-opts-wrap">
          <div class="unit-main-pay-meta-mt-opts">
            <button
              v-for="option in optionGroup.options"
              :key="option.value"
              :class="{ 'active': selected[optionGroup.id] === option.value }"
              @click="onClickItem(optionGroup.id, option.value)"
            >{{ option.label }}</button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPayMeta',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      selected: {}
    }
  },
  computed: {
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '顾客信息')
    },
    optionGroups () {
      if (this.model !== null && this.model.data !== null) {
        return this.model.data.reduce((sumGroup, el) => {
          if (!sumGroup.some(el2 => el2.id === el.set_id)) {
            sumGroup.push({
              id: el.set_id,
              name: el.set_name,
              options: this.model.data.reduce((sumOption, el2) => {
                if (el2.set_id === el.set_id) {
                  sumOption.push({
                    value: el2.data_id,
                    label: el2.data_name
                  })
                }
                return sumOption
              }, [])
            })
          }
          return sumGroup
        }, [])
      }

      return []
    }
  },
  mounted () {
    Promise.all([
      this.load()
    ])
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '顾客信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          const selected = {}
          if (data !== null && data.data !== null) {
            for (const item of data.data) {
              if (!(item.set_id in this.selected)) {
                selected[item.set_id] = null
              }
            }
          }
          this.selected = selected
          this.model = data
        })
        .then(() => {
          return this.$ui.setData(JSON.stringify(this.model.data), 'posMain.CustomerOtherInfo')
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '顾客信息':
          return this.load()
      }
    },

    onClickItem (groupId, value) {
      let pending
      if (this.selected[groupId] !== value) {
        pending = value
      } else {
        pending = null
      }

      const data = this.model.data.map(el => {
        const cloned = Object.assign({}, el)
        if (cloned.set_id !== groupId) {
          if (cloned.data_id === this.selected[cloned.set_id]) {
            cloned.def_flg = '1'
          }
        } else {
          if (cloned.data_id === pending && pending !== null) {
            cloned.def_flg = '1'
          }
        }
        return cloned
      })

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(data), 'posMain.CustomerOtherInfo')
      ])
        .then(() => {
          this.selected[groupId] = pending
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
.UnitMainPayMeta {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-meta-mt-wrap {
}
.unit-main-pay-meta-mt-item {
  border-bottom: 1px solid #c4c4c4;
  padding: 13px 5px 20px;
}
.unit-main-pay-meta-mt-title {
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}
.unit-main-pay-meta-mt-opts-wrap {
  display: flex;
}
.unit-main-pay-meta-mt-opts {
  margin-top: 8px;
  max-width: 475px;
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}
.unit-main-pay-meta-mt-wrap button {
  width: 95px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  background-color: #ffffff;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  text-align: center;
  &:hover {
    background-color: #eeeeee;
  }
  &:active,
  &.active {
    background-color: var(--pt-color-selection);
    color: var(--pt-color-primary-content);
  }
}
</style>
