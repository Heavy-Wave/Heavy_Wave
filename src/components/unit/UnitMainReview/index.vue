<template>
  <div class="UnitMainReview">

    <div class="unit-main-review-wrap">

      <div class="unit-main-review-bd">

        <template v-if="hasStaffs && (hasStaffId || hasStaffIdSelector)">
          <div class="part-form-group">
            <label class="part-form-label">审批人</label>
            <label class="part-form-control">
              <form-staff ref="staffIdInput" v-model="staffId" :options="staffOptions" :is-dropdown="hasStaffIdSelector" />
            </label>
          </div>
        </template>

        <template v-if="hasStaffs && hasPassword">
          <div class="part-form-group">
            <label class="part-form-label">密<span style="display: inline-block; width: 1em;" />码</label>
            <label class="part-form-control">
              <form-input v-model="passWd" type="password" @keypress.enter="onClickOk" />
            </label>
          </div>
        </template>

        <template v-if="hasStaffId">
          <div class="part-keyboard">
            <keyboard-holder />
          </div>
        </template>

      </div>

      <div class="unit-main-review-ft">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">关闭</btn>
        </template>
        <template v-if="hasOk">
          <btn primary @click="onClickOk">确认</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitMainReview',
  mixins: [
    unitMixin
  ],
  data () {
    return {
      staffList: [],
      staffId: '',
      passWd: ''
    }
  },
  computed: {
    staffOptions () {
      if (this.staffList !== null) {
        return this.staffList.map(el => ({
          value: el.staff_id,
          label: `${el.staff_id}: ${el.staff_name}`
        }))
      }

      return []
    },
    hasStaffId () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '审核人')
    },
    hasStaffIdSelector () {
      return this.$ui.hasElementByUnit(this.unit, 'option', '审核人')
    },
    hasPassword () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '密码')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasStaffs () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '员工列表')
    }
  },
  mounted () {
    this.load()
      .then(() => {
        // 自动为「审批人」输入框获取焦点
        this.$refs.staffIdInput.focus()
      })
  },
  methods: {
    load () {
      this.$loading.show()
      return this.fetchStaffList()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchStaffList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '员工列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.staffList = data.staff_list
        })
    },

    onClickOk () {
      if (this.hasStaffs && (this.hasStaffId || this.hasStaffIdSelector)) {
        if (!this.$validation.notBlank(this.staffId)) {
          return this.$message.notice('请选择审核人')
        }
      }

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.staffId.toString(), 'posMain.reviewId'),
        this.$ui.setData(this.passWd.toString(), 'posMain.reviewPwd')
      ]).then(() => {
        return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定')
      })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '关闭')
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
.UnitMainReview {
  width: 520px;
}
.unit-main-review-wrap {
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}
.unit-main-review-bd {
  padding: 8px;
  .part-form-group {
    margin: 16px 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .part-form-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 58px;
  }
  .part-form-control {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
  }
  .part-keyboard {
    margin-top: 26px;
    height: 236px;
  }
}
.unit-main-review-ft {
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .Btn {
    width: 101px;
    height: 48px;
  }
}
</style>
