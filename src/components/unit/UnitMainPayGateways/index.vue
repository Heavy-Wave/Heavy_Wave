<template>
  <div class="UnitMainPayGateways">

    <div class="unit-main-pay-gw-wrap">

      <div class="unit-main-pay-gw-groups">
        <tabs v-model="selected">
          <template slot="navs">
            <tab-nav
              v-for="group in groups"
              :key="group.group_id"
              :value="group.group_id"
            >{{ group.group_name }}</tab-nav>
          </template>
        </tabs>
      </div>

      <div class="unit-main-pay-gw-list">
        <template v-for="item in items">
          <button
            :key="item.pay_id"
            :disabled="item.enable_flg !== '1'"
            @click="onClickItem(item)"
          >
            <span class="name">{{ item.pay_name }}</span>
            <template v-if="item.pay_amt !== 0">
              <span class="badge">
                <template v-if="item.op_type === $const.PAY.OP_TYPE.PAY">已付：</template>
                <template v-if="item.op_type === $const.PAY.OP_TYPE.REFUND">已退：</template>
                <template>{{ item.pay_amt | decimal($sys.settings.precisionPrice, true) }}</template>
              </span>
            </template>
          </button>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPayGateways',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      selected: ''
    }
  },
  computed: {
    groups () {
      if (this.model === null || this.model.pay_type === null) return []

      return this.model.pay_type.reduce((sum, el) => {
        if (!sum.some(el2 => el2.group_id === el.group_id)) {
          sum.push({
            group_id: el.group_id,
            group_name: el.group_name
          })
        }

        return sum
      }, [])
    },
    items () {
      if (this.model === null || this.model.pay_type === null) return []

      return this.model.pay_type.reduce((sum, el) => {
        if (el.group_id === this.selected) {
          sum.push(el)
        }

        return sum
      }, [])
    }
  },
  watch: {
    model () {
      if (this.model === null || this.model.pay_type === null || this.model.pay_type.length === 0) return

      if (typeof this.selected !== 'string' || this.selected.length === 0) {
        this.selected = this.model.pay_type[0].group_id
      }
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付方式')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '支付方式':
          return this.load()
      }
    },

    onClickItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.pay_id.toString(), 'posMain.pay.payMethod.payType')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付方式')
        })
        .then(() => {
          // 写死
          switch (item.op_type) {
            case this.$const.PAY.OP_TYPE.PAY:
              return this.$bridge.eventExec(
                'popup',
                {
                  menuId: `POS_PAY_${item.pay_ias}_POP`,
                  openType: 'popup',
                  size: { widthRatio: '522' }
                }
              )
            case this.$const.PAY.OP_TYPE.REFUND:
              return this.$bridge.eventExec(
                'popup',
                {
                  menuId: `POS_REFUND_${item.pay_ias}_POP`,
                  openType: 'popup',
                  size: { widthRatio: '522' }
                }
              )
            default:
              throw new Error(`参数 op_type 超出预期：${JSON.stringify(item.op_type)}`)
          }
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
.UnitMainPayGateways {
  height: 100%;
}
.unit-main-pay-gw-wrap {
  padding: 3px 3px 2px;
}
.unit-main-pay-gw-groups {
  margin-top: 9px;
  border-bottom: 1px solid #000000;
}
.unit-main-pay-gw-list {
  padding-top: 3px;
  margin-left: -2px;
  margin-right: -2px;
  margin-bottom: -3px;
  display: flex;
  flex-wrap: wrap;
  button {
    width: calc(33.3333% - 4px);
    padding: 15px 6px 14px;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 3px;
    border: 1px solid #000000;
    background-color: #ffffff;
    border-radius: 2px;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    position: relative;
    z-index: 1;
    &:hover {
      background-color: #eeeeee;
    }
    &:active {
      background-color: var(--pt-color-selection);
      color: #ffffff;
    }
    &[disabled] {
      color: #999999;
      pointer-events: none;
    }
    .name {
      display: block;
      text-align: center;
      @include single-text-ellipsis;
    }
    .badge {
      padding: 2px 8px;
      background-color: var(--pt-color-selection);
      box-shadow: 0 0 6px rgba(0, 0, 0, .2);
      border-radius: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #ffffff;
      white-space: nowrap;
      position: absolute;
      top: -11px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      &::after {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        background-color: var(--pt-color-selection);
        position: absolute;
        bottom: calc(-8px / 2 * 1.414 + 2px);
        left: 50%;
        z-index: 0;
        transform: translateX(-50%) rotate(-45deg);
      }
    }
  }
}
</style>
