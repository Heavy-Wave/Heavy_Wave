<template>
  <div class="ViewLoginPartModalCgpwd">

    <modal :value="visible" @show="onModalShow">

      <template slot="header">修改密码</template>

      <div class="form-wrap">

        <div class="form-group">
          <label class="form-label">帐号</label>
          <div class="form-control">
            <form-staff
              v-model="form.staffId"
              :options="staffOptions"
              :is-dropdown="$sys === null || $sys.inputType === '1'"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">原密码</label>
          <div class="form-control">
            <form-input v-model="form.oldPwd" type="password" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">新密码</label>
          <div class="form-control">
            <form-input v-model="form.newPwd" type="password" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">确认密码</label>
          <div class="form-control">
            <form-input v-model="form.newPwdRe" type="password" />
          </div>
        </div>

      </div>

      <div class="form-actions">
        <btn secondary @click="onClickClose">返回</btn>
        <btn primary @click="onClickOk">确定</btn>
      </div>

    </modal>

  </div>
</template>

<script>
export default {
  name: 'ViewLoginPartModalCgpwd',
  props: {
    staffList: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        staffId: '',
        oldPwd: '',
        newPwd: '',
        newPwdRe: ''
      }
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
    }
  },
  methods: {
    submit () {
      return this.$bridge.staffCgPwd(this.form)
        .then(({ msg, data }) => {
          this.$message.notice('修改密码成功')
        })
    },

    /**
     * 回调：模态被显示
     */
    onModalShow () {
      this.form.staffId = ''
      this.form.oldPwd = ''
      this.form.newPwd = ''
      this.form.newPwdRe = ''
    },

    /**
     * 回调：确定按钮被点击
     */
    onClickOk () {
      if (!this.$validation.notBlank(this.form.staffId)) {
        return this.$message.notice('请选择帐号')
      }
      if (!this.$validation.notBlank(this.form.oldPwd)) {
        return this.$message.notice('请输入原密码')
      }
      if (!this.$validation.notBlank(this.form.newPwd)) {
        return this.$message.notice('请输入新密码')
      }
      if (!this.$validation.notBlank(this.form.newPwdRe)) {
        return this.$message.notice('请输入确认密码')
      }

      this.$loading.show()
      return this.submit()
        .then(() => {
          this.$emit('update:visible', false)
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
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.ViewLoginPartModalCgpwd {
  .modal-outer {
    width: 368px;
  }
  .form-wrap {
    padding: 29px 35px;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
  }
  .form-group {
    & + .form-group {
      margin-top: 16px;
    }
  }
  .form-label {
  }
  .form-control {
  }
  .form-label + .form-control {
    margin-top: 8px;
  }
  .form-actions {
    margin-top: 1px; // hack
    padding: 10px 35px 23px;
    display: flex;
    .Btn {
      flex-grow: 1;
      flex-shrink: 1;
      width: 1px;
      padding: 12px 0;
      font-size: 16px;
      line-height: 22px;
      & + .Btn {
        margin-left: 20px;
      }
    }
  }
}
</style>
