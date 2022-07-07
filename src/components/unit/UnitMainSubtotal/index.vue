<template>
  <div class="UnitMainSubtotal">

    <div class="unit-main-subtotal-wrap" v-if="model !== null">
      <div class="unit-main-subtotal-item">
        <span class="label">合计数量</span>
        <template v-if="model !== null">
          <display-quantity :value="model.total_qty" />
        </template>
      </div>
      <div class="unit-main-subtotal-item">
        <span class="label">应收合计</span>
        <template v-if="model !== null">
          <display-price :value="model.total_amt" />
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainSubtotal',
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '小计金额数量')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '小计金额数量':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainSubtotal {
}
.unit-main-subtotal-wrap {
  border-top: 1px solid #000000;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
}
.unit-main-subtotal-item {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 20px;
  line-height: 28px;
  color: #707070;
  font-weight: bold;
  .label {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
    color: #000000;
  }
}
</style>
