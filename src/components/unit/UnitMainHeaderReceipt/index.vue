<template>
  <div class="UnitMainHeaderReceipt">
    <table>
      <tbody>

        <tr>
          <th class="fixed" style="border-left-width: 0; border-top-width: 0; border-bottom-width: 0;">单据号</th>
          <td colspan="3" style="border-top-width: 0; border-bottom-width: 0; width: 15em;">
            <template v-if="model !== null">{{ model.sale_so_id }}</template>
          </td>
          <th class="fixed" style="border-top-width: 0; border-bottom-width: 0;">桌号</th>
          <td style="border-top-width: 0; border-bottom-width: 0; width: 5em;">
            <template v-if="model !== null">{{ model.table_id }}</template>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainHeaderReceipt',
  mixins: [
    unitMixin,
    unitListenRefreshMixin,
    autoRevertFocus
  ],
  data () {
    return {
      model: null
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '单据信息')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '单据信息':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainHeaderReceipt {
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
}
</style>
