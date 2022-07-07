<template>
  <div class="UnitMainPaySeller">

    <div class="unit-main-pay-meta-op-wrap" v-if="model !== null && model.staff_list !== null">

      <div class="unit-main-pay-meta-op-title">销售员选择</div>

      <div class="unit-main-pay-meta-op-list">

        <div class="unit-main-pay-meta-op-item" v-if="hasStaffs && (hasStaff01Id || hasStaff01IdSelector)">
          <div class="unit-main-pay-meta-op-label">销售员1</div>
          <div class="unit-main-pay-meta-op-control">
            <form-staff :value="selectedStaff01" :options="staffOptions" :is-dropdown="hasStaff01IdSelector" @input="onInputStaff01" />
          </div>
        </div>

        <div class="unit-main-pay-meta-op-item" v-if="hasStaffs && (hasStaff02Id || hasStaff02IdSelector)">
          <div class="unit-main-pay-meta-op-label">销售员2</div>
          <div class="unit-main-pay-meta-op-control">
            <form-staff :value="selectedStaff02" :options="staffOptions" :is-dropdown="hasStaff02IdSelector" @input="onInputStaff02" />
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
  name: 'UnitMainPaySeller',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      selectedStaff01: null,
      selectedStaff02: null
    }
  },
  computed: {
    hasStaff01Id () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '销售员一')
    },
    hasStaff01IdSelector () {
      return this.$ui.hasElementByUnit(this.unit, 'option', '销售员一')
    },
    hasStaff02Id () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '销售员二')
    },
    hasStaff02IdSelector () {
      return this.$ui.hasElementByUnit(this.unit, 'option', '销售员二')
    },
    hasStaffs () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '员工列表')
    },
    staffOptions () {
      if (this.model !== null && this.model.staff_list !== null) {
        return this.model.staff_list.map(el => ({
          value: el.staff_id,
          label: `${el.staff_id}: ${el.staff_name}`
        }))
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '员工列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '员工列表':
          return this.load()
      }
    },

    /**
     * 回调：销售员一输入框被改变
     */
    onInputStaff01 (value) {
      if (value === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(value.toString(), 'posMain.TopArea.saleIDOne')
      ])
        .then(() => {
          this.selectedStaff01 = value
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：销售员二输入框被改变
     */
    onInputStaff02 (value) {
      if (value === null) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(value.toString(), 'posMain.TopArea.saleIDTwo')
      ])
        .then(() => {
          this.selectedStaff02 = value
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
.UnitMainPaySeller {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-pay-meta-op-wrap {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 13px 5px 20px;
  background-color: #ffffff;
}
.unit-main-pay-meta-op-title {
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}
.unit-main-pay-meta-op-list {
  margin-top: 13px;
  display: flex;
  flex-wrap: wrap;
}
.unit-main-pay-meta-op-item {
  margin-right: 38px;
  display: flex;
  align-items: center;
}
.unit-main-pay-meta-op-label {
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 11px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  font-weight: bold;
}
.unit-main-pay-meta-op-control {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  .FormInput {
    width: 144px;
    padding: 4px;
    box-sizing: border-box;
    border-color: #999999;
  }
}
</style>
