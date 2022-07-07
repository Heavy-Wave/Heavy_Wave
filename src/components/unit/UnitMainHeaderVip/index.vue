<template>
  <div class="UnitMainHeaderVip">
    <table @click="onClick">
      <tbody>

        <tr>
          <th class="fixed" style="border-left-width: 0;">会员号</th>
          <td colspan="2" style="border-left-width: 0; width: 9em;">
            <template v-if="model !== null && model.data !== null">{{ model.data.CardNo }}</template>
          </td>
          <td colspan="2" style="width: 10em;">
            <form-input
              ref="input"
              v-model="keywords"
              type="text"
              pattern="\d*"
              placeholder="请输入会员编号"
              :disabled="model !== null && model.data !== null"
              @keypress.enter="onSearch"
            />
          </td>
          <td class="action" style="width: 5em;">
            <template v-if="model !== null && model.data !== null">
              <template v-if="hasClear">
                <button @click="onClickClear">会员清除</button>
              </template>
            </template>
            <template v-else>
              <template v-if="hasSearch">
                <button @click="onSearch">会员查询</button>
              </template>
            </template>
          </td>
        </tr>

        <tr>
          <th class="fixed" style="border-left-width: 0; border-bottom-width: 0;">会员等级</th>
          <td style="border-bottom-width: 0; width: 5em;">
            <template v-if="model !== null && model.data !== null">{{ model.data.MemberShipName }}</template>
          </td>
          <th class="fixed" style="border-bottom-width: 0;">会员积分</th>
          <td style="border-bottom-width: 0; width: 5em;">
            <template v-if="model !== null && model.data !== null">{{ model.data.CurrentPoint }}</template>
          </td>
          <th class="fixed" style="border-bottom-width: 0;">会员名</th>
          <td style="border-bottom-width: 0; width: 5em;">
            <template v-if="model !== null && model.data !== null">{{ model.data.ConsumerName }}</template>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainHeaderVip',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      keywords: ''
    }
  },
  computed: {
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '会员查询')
    },
    hasClear () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '会员清除')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '会员信息')
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '会员信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
        .then(() => {
          // 清空会员编号输入框
          this.keywords = ''
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '会员信息':
          return this.load()
      }
    },

    onClick () {
      this.$refs.input.focus()
    },

    /**
     * 回调：搜索框被回车
     */
    onSearch () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.keywords.toString(), 'posMain.vipCarNo')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '会员查询')
        })
        .catch(error => {
          this.$message.error(error)

          // 出错时，清空会员编号输入框
          this.keywords = ''
          this.$refs.input.focus()
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：会员清除按钮被点击
     */
    onClickClear () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '会员清除')
        .then(() => {
          this.keywords = ''
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
.UnitMainHeaderVip {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  letter-spacing: 0.02px;
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  td, th {
    padding: 5px;
    border: 1px solid #dedede;
    box-sizing: border-box;
    @include single-text-ellipsis;
    &.fixed {
      width: 4em;
      max-width: 4em;
    }
    &.action {
      padding-top: 2px;
      padding-bottom: 2px;
      text-align: center;
    }
  }
  th {
    font-weight: initial;
    text-align: initial;
  }
  .FormInput {
    border-width: 0;
    padding: 0;
  }
  button {
    width: 100%;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid var(--pt-color-bordered);
    background-color: #ffffff;
    border-radius: 2px;
    font-size: 14px;
    line-height: 20px;
    color: var(--pt-color-bordered);
    letter-spacing: 0.02px;
    text-align: center;
    &:hover {
      background-color: #eeeeee;
    }
    &:active {
      background-color: var(--pt-color-bordered);
      color: #ffffff;
    }
  }
}
</style>
