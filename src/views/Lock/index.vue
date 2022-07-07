<template>
  <div class="ViewLock">

    <div class="part-bd">

      <div class="part-form">

        <div class="part-logo">
          <img src="@/assets/img/lock-hd.svg" alt="挂起" />
        </div>

        <div class="part-subtitle" v-if="$sys.lockNotice !== null">
          <div>{{ $sys.lockNotice }}</div>
        </div>

        <div class="part-form-group">
          <label class="part-form-control-label">帐号</label>
          <label class="part-form-control">
            <form-staff
              v-model="staffId"
              :options="staffOptions"
              :is-dropdown="$sys.settings === null || $sys.settings.inputType === '1'"
            />
          </label>
        </div>

        <div class="part-form-group">
          <label class="part-form-control-label">密码</label>
          <label class="part-form-control">
            <form-input v-model="passWd" type="password" @keypress.enter="onClickSubmit" />
          </label>
        </div>

        <div class="part-form-action">
          <btn block outline @click="onClickMinimize">最小化窗口</btn>
          <btn block outline @click="onClickExit">退出系统</btn>
          <btn block primary @click="onClickSubmit">进入系统</btn>
        </div>

        <!-- 键盘输入开始 -->
        <div class="part-form-kbd">
          <keyboard-holder />
        </div>
        <!-- 键盘输入结束 -->

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'ViewLock',
  data () {
    return {
      staffList: null,

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
    }
  },
  watch: {
    staffId () {
      this.passWd = ''
    }
  },
  created () {
    this.load()
  },
  beforeDestroy () {
    this.$kbd.hide()
  },
  methods: {
    load () {
      return Promise.resolve()
        .then(() => {
          this.$loading.show('正在加载员工数据')
          return this.fetchStaffList()
            .finally(() => {
              this.$loading.hide('正在加载员工数据')
            })
        })
        .catch(error => {
          this.$message.error(error)
        })
    },

    fetchStaffList () {
      return this.$bridge.staffListGet()
        .then(({ msg, data }) => {
          this.staffList = data.staff_list
        })
    },

    /**
     * 回调：“最小化窗口”按钮被点击
     */
    onClickMinimize () {
      this.$loading.show()
      return this.$sys.minimizeWindow()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“退出系统”按钮被点击
     */
    onClickExit () {
      this.$loading.show()
      return this.$sys.exit()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“进入系统”按钮被点击
     */
    onClickSubmit () {
      if (!this.$validation.notBlank(this.staffId)) {
        return this.$message.notice('请选择帐号')
      }
      if (!this.$validation.notBlank(this.passWd)) {
        return this.$message.notice('请输入密码')
      }

      this.$loading.show('正在登录')
      return this.$sys.login({
        staffId: this.staffId,
        passWd: this.passWd
      })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide('正在登录')
        })
    }
  }
}
</script>

<style lang="scss">
.ViewLock {
  height: 100vh;
  min-height: 768px;
  background-color: var(--pt-color-primary);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .part-bd {
    max-width: 336px;
  }
  .part-form {
  }
  .part-logo {
    margin-bottom: 25px;
    width: 233px;
    margin-left: auto;
    margin-right: auto;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .part-subtitle {
    margin-bottom: 44px;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
  }
  .part-form-group {
    display: flex;
    align-items: center;
    & + .part-form-group {
      margin-top: 20px;
    }
  }
  .part-form-control-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 46px;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
    font-weight: 500;
  }
  .part-form-control {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    .FormInput {
      padding: 6px 9px;
      border-color: #ffffff;
      background-color: #ffffff;
    }
  }
  .part-form-action {
    margin-top: 24px;
    display: flex;
    .Btn {
      padding: 12px 0;
      font-size: 16px;
      line-height: 22px;
      & + .Btn {
        margin-left: 20px;
      }

      &.btn-primary {
        border-color: #ffffff;
        background-color: #ffffff;
        color: var(--pt-color-primary);
        &:hover {
          background-color: #efefef;
        }
        &:active {
          background-color: #000000;
          color: #ffffff;
        }
      }
      &.btn-outline {
        border-color: #ffffff;
        background-color: var(--pt-color-bordered);
        color: #ffffff;
        &:hover {
          opacity: .85;
        }
        &:active {
          opacity: 1;
        }
      }
    }
  }
  .part-form-kbd {
    margin-top: 48px;
    & > .KeyboardHolder {
      height: 160px;
    }
  }
}
</style>
