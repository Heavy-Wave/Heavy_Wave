<template>
  <div class="UnitMainPromotion">

    <template v-if="unit.slot !== 'pop'">

      <pt-tips />

      <pt-slot top-menu-id="POS_MAIN" name="main-scan" />

    </template>

    <div class="unit-main-prom-wrap">

      <div class="unit-main-prom-btns">

        <template v-if="hasReasons">
          <div class="unit-main-prom-btns-list">
            <btn-group>
              <btn
                v-for="reason in reasonOptions.slice(reasonPerPage * (reasonCurrentPage - 1), reasonPerPage * reasonCurrentPage)"
                :key="reason.value"
                :primary="reasonId === reason.value"
                @click="reasonId = (reasonId !== reason.value ? reason.value : '')"
              >{{ reason.label }}</btn>
            </btn-group>
          </div>
          <div class="unit-main-prom-btns-navs" v-if="reasonTotalPages > 1">
            <btn
              title="上一页"
              :disabled="reasonCurrentPage === 1"
              @click="reasonCurrentPage = Math.max(1, reasonCurrentPage - 1)"
            >
              <pt-icon i="arrow-up" />
            </btn>
            <btn
              title="下一页"
              :disabled="reasonTotalPages === 0 || reasonCurrentPage === reasonTotalPages"
              @click="reasonCurrentPage = Math.min(reasonTotalPages, reasonCurrentPage + 1)"
            >
              <pt-icon i="arrow-down" />
            </btn>
          </div>
        </template>

      </div>

      <div class="unit-main-prom-hd">

        <!--
        <div class="unit-main-prom-label" v-if="modelTitle !== null">{{ modelTitle.panel_name }}</div>
        -->

        <div class="unit-main-prom-types" v-if="hasTypes">
          <btn
            v-for="type in typeOptions"
            :key="type.value"
            :primary="typeId === type.value"
            :flat="typeId !== type.value"
            @click="typeId = (typeId !== type.value ? type.value : '')"
          >{{ type.label }}</btn>
        </div>

        <div class="unit-main-prom-fields">

          <div class="unit-main-prom-fields-left">
            <div class="unit-main-prom-field" v-if="hasPrice">
              <div class="unit-main-prom-field-label">价格</div>
              <div class="unit-main-prom-field-control">
                <form-input ref="inputValue" v-model="value" type="string" :min="0" />
              </div>
            </div>
            <div class="unit-main-prom-field" v-if="hasDiscount">
              <div class="unit-main-prom-field-label">折扣</div>
              <div class="unit-main-prom-field-control">
                <form-input ref="inputValue" v-model="value" type="string" :min="0" :max="99" @input="quantityInput" />
              </div>
            </div>
            <div class="unit-main-prom-field" v-if="hasQuantity">
              <div class="unit-main-prom-field-label">数量</div>
              <div class="unit-main-prom-field-control">
                <form-input ref="inputValue" v-model="value" type="number" :min="0" @input="quantityInput" />
              </div>
            </div>
          </div>

          <div class="unit-main-prom-fields-right">
            <div class="unit-main-prom-field" v-if="hasStaffs && (hasStaffId || hasStaffIdSelector)">
              <div class="unit-main-prom-field-label">审批人</div>
              <div class="unit-main-prom-field-control">
                <form-staff v-model="staffId" :options="staffOptions" :is-dropdown="hasStaffIdSelector" />
              </div>
            </div>
            <div class="unit-main-prom-field" v-if="hasStaffs && hasPassword">
              <div class="unit-main-prom-field-label">密码</div>
              <div class="unit-main-prom-field-control">
                <form-input ref="inputPassWd" v-model="passWd" type="password" />
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="unit-main-prom-kbd">
        <keyboard-holder />
      </div>

      <div class="unit-main-prom-ft">
        <div class="unit-main-prom-ft-start">
          <template v-if="hasClose">
            <btn secondary @click="onClickClose">返回</btn>
          </template>
          <btn secondary title="隐藏键盘" @click="onClickHideKbd">
            <pt-icon i="kbd-hide" />
          </btn>
        </div>
        <div class="unit-main-prom-ft-end">
          <template v-if="hasOk">
            <btn primary @click="onClickOk">确定</btn>
          </template>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainPromotion',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelTitle: null,
      modelReasons: null,
      modelTypes: null,
      modelStaffs: null,

      reasonCurrentPage: 1,

      reasonId: '',
      typeId: '',
      value: '',
      staffId: '',
      passWd: ''
    }
  },
  computed: {
    reasonPerPage () {
      return 10
    },
    reasonTotalPages () {
      if (this.modelReasons !== null && this.modelReasons.reasons !== null) {
        return Math.ceil(this.modelReasons.reasons.length / this.reasonPerPage)
      }

      return 0
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确定')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasStaffId () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '审批人')
    },
    hasStaffIdSelector () {
      return this.$ui.hasElementByUnit(this.unit, 'option', '审批人')
    },
    hasPassword () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '密码')
    },
    hasReasons () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '打折原因')
    },
    hasTypes () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '折扣类型')
    },
    hasStaffs () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '员工列表')
    },
    hasPrice () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '价格输入框')
    },
    hasDiscount () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '折扣输入框')
    },
    hasQuantity () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '数量输入框')
    },
    reasonOptions () {
      if (this.modelReasons !== null && this.modelReasons.reasons !== null) {
        return this.modelReasons.reasons.map(el => ({
          value: el.reason_id,
          label: el.reason_name
        }))
      }

      return []
    },
    typeOptions () {
      if (this.modelTypes !== null && this.modelTypes.prom_types !== null) {
        return this.modelTypes.prom_types.map(el => ({
          value: el.type_id,
          label: el.type_name
        }))
      }

      return []
    },
    staffOptions () {
      if (this.modelStaffs !== null && this.modelStaffs.staff_list !== null) {
        return this.modelStaffs.staff_list.map(el => ({
          value: el.staff_id,
          label: `${el.staff_id}: ${el.staff_name}`
        }))
      }

      return []
    },
    keyboardType () {
      return 'decimal'
    }
  },
  mounted () {
    const ps = [
    ]

    if (this.hasReasons) {
      ps.push(
        this.loadReasons()
      )
    }

    if (this.hasTypes) {
      ps.push(
        this.loadTypes()
      )
    }

    if (this.hasStaffs) {
      ps.push(
        this.loadStaffs()
      )
    }

    Promise.all(ps)

    // 获取焦点
    if (this.hasPrice || this.hasDiscount || this.hasQuantity) {
      this.$refs.inputValue.focus()
    }
  },
  methods: {

    loadReasons () {
      this.$loading.show()
      return this.fetchReasons()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadTypes () {
      this.$loading.show()
      return this.fetchTypes()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadStaffs () {
      this.$loading.show()
      return this.fetchStaffs()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchReasons () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '打折原因')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelReasons = data
        })
    },

    fetchTypes () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '折扣类型')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelTypes = data
        })
    },

    fetchStaffs () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '员工列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelStaffs = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '打折原因':
          return this.loadReasons()
        case '折扣类型':
          return this.loadTypes()
        case '员工列表':
          return this.loadStaffs()
      }
    },

    /**
     * 回调：确定按钮被点击
     */
    onClickOk () {
      if (this.hasTypes && !this.$validation.notBlank(this.typeId)) {
        return this.$message.notice('请选择折扣类型')
      }
      if (!this.$validation.notBlank(this.value)) {
        if (this.hasPrice) {
          return this.$message.notice('请输入金额')
        }
        if (this.hasDiscount) {
          return this.$message.notice('请输入折扣')
        }
        if (this.hasQuantity) {
          return this.$message.notice('请输入数量')
        }
      }
      if (this.hasStaffs && (this.hasStaffId || this.hasStaffIdSelector)) {
        if (!this.$validation.notBlank(this.staffId)) {
          return this.$message.notice('请选择审批人')
        }
      }
      if (this.hasStaffs && this.hasPassword) {
        if (!this.$validation.notBlank(this.passWd)) {
          return this.$message.notice('请输入密码')
        }
      }

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.reasonId.toString(), 'posMain.subArea.discount.reasonId'),
        this.$ui.setData(this.typeId.toString(), 'posMain.subArea.discount.type'),
        this.$ui.setData(this.value.toString(), 'posMain.subArea.discount.disPer'),
        this.$ui.setData(this.staffId.toString(), 'posMain.subArea.discount.reviewerId'),
        this.$ui.setData(this.passWd.toString(), 'posMain.subArea.discount.reviewerPwd')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
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
     * 回调：隐藏键盘按钮被点击
     */
    onClickHideKbd () {
      if (this.$kbd.getStatus()) {
        this.$kbd.hide()
      } else {
        this.$kbd.show({
          target: this,
          type: this.keyboardType
        })
      }
    },

    quantityInput () {
      // 判断不能输入小数点
      const str = '' + this.value
      if (str.indexOf('.') !== -1) {
        const arr = str.split('')
        arr.splice(arr.length - 1)
        const str2 = arr.join('')
        this.value = +str2
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainPromotion {
  height: 100%;
  min-height: 536px;
  display: flex;
  flex-direction: column;
}
.unit-main-prom-wrap {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  padding: 1px;
  display: flex;
  flex-direction: column;
}
.unit-main-prom-btns {
  flex-grow: 0;
  flex-shrink: 0;
  margin-bottom: 1px;
  display: flex;
  align-items: stretch;
}
.unit-main-prom-hd {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  margin-top: 1px;
  padding: 18px 20px;
  border: 1px solid #000000;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}
.unit-main-prom-kbd {
  flex-grow: 0;
  flex-shrink: 0;
  & > .KeyboardHolder {
    margin-top: 2px;
    height: 160px;
  }
}
.unit-main-prom-ft {
  flex-grow: 0;
  flex-shrink: 0;
  margin-top: 2px;
}
.unit-main-prom-btns-list {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  .Btn {
    height: 40px;
  }
  .BtnGroup .Btn {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.unit-main-prom-btns-navs {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 2px;
  .Btn {
    height: 40px;
    width: 58px;
    & + .Btn {
      margin-top: 2px;
    }
  }
}
.unit-main-prom-types {
  margin-bottom: 18px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: 164px;
    padding-top: 11px;
    padding-bottom: 11px;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    border-radius: initial;
    & + .Btn {
      margin-left: initial;
    }
    &:first-child {
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    &:last-child {
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}
.unit-main-prom-label {
  flex-grow: 0;
  flex-shrink: 0;
  width: 100px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  font-weight: bold;
}
.unit-main-prom-fields {
  display: flex;
}
.unit-main-prom-fields-left,
.unit-main-prom-fields-right {
  flex-grow: 0;
  flex-shrink: 0;
  width: calc(50% - 8px);
}
.unit-main-prom-fields-right {
  margin-left: 16px;
}
.unit-main-prom-field {
  display: flex;
  align-items: center;
  & + .unit-main-prom-field {
    margin-top: 12px;
  }
}
.unit-main-prom-field-label {
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 10px;
  width: 70px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  text-align: right;
}
.unit-main-prom-field-control {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
}
.unit-main-prom-ft {
  display: flex;
  align-items: center;
  .Btn {
    width: 125px;
    padding-top: 9px;
    padding-bottom: 8px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @include single-text-ellipsis;
    & + .Btn {
      margin-left: 3px;
    }
    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    &.disabled {
      opacity: .35;
    }
  }
}
.unit-main-prom-ft-start {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
}
.unit-main-prom-ft-end {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
</style>
