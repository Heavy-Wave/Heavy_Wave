<template>
  <div class="UnitMainInfo">

    <template v-if="unit.slot !== 'pop'">

      <pt-tips />

      <pt-slot top-menu-id="POS_MAIN" name="main-scan" />

    </template>

    <div class="unit-main-info-wrap">

      <template v-if="model !== null && model.sales_dtl !== null">

        <div
          v-for="item in items"
          :key="item.key"
          class="unit-main-info-item"
        >
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>

      </template>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainInfo',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
    }
  },
  computed: {
    items () {
      if (this.model === null || this.model.sales_dtl === null) return null

      return this.model.sales_dtl
        // 克隆数组
        .filter(() => true)
        // 按 sort 字段排序
        .sort((e1, e2) => {
          if (parseFloat(e1.sort) > parseFloat(e2.sort)) return 1
          if (parseFloat(e1.sort) < parseFloat(e2.sort)) return -1
          return 0
        })
        // 组装
        .map(el => {
          return {
            key: el.key,
            label: el.label,
            value: el.values
          }
        })
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品明细')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品明细':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainInfo {
}
.unit-main-info-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 20px;
  display: table;
}
.unit-main-info-item {
  display: table-row-group;
  .label {
    display: table-cell;
    width: 1px;
    padding: 6px 15px 6px 0;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    font-weight: bold;
    letter-spacing: 0.02px;
    text-align: justify;
    white-space: nowrap;
    text-align-last: justify;
  }
  .value {
    display: table-cell;
    padding: 6px 0;
    font-size: 16px;
    line-height: 20px;
    color: #707070;
    letter-spacing: 0.02px;
  }
}
</style>
