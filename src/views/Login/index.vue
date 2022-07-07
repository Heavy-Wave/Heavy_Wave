<template>
  <div class="ViewLogin">

    <div class="part-hd">

      <div class="part-hd-settings">
        <a href="javascript:void(0);" @click="onClickSettings">设置</a>
      </div>

      <div class="part-hd-lang">
        <label>语言选择</label>
        <form-select v-model="lang" :options="langOptions" />
      </div>

    </div>

    <div class="part-bd">

      <div class="part-form">

        <div class="part-logo">
          <img src="@/assets/img/login-logo.svg" alt="PosTime" />
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
          <div class="part-form-control-action">
            <btn block primary outline @click="onClickQueryStaff">查询</btn>
          </div>
        </div>

        <div class="part-form-group">
          <label class="part-form-control-label">密码</label>
          <label class="part-form-control">
            <form-input v-model="passWd" type="password" @keypress.enter="onClickSubmit" placeholder="请输入密码"/>
          </label>
          <div class="part-form-control-action">
            <btn block primary outline @click="onClickFingerprint">指纹</btn>
          </div>
        </div>

        <div class="part-form-group">
          <label class="part-form-control-label">模式</label>
          <label class="part-form-control">
            <form-select :value="$sys.connectId" :options="connectIdOptions" @input="onConnectIdInput" />
          </label>
          <div class="part-form-control-action">
          </div>
        </div>

        <div class="part-form-action">
          <btn outline @click="onClickExit">退出系统</btn>
          <btn outline @click="onClickChangePassword">修改密码</btn>
          <btn primary @click="onClickSubmit">登录</btn>
        </div>
      </div>
      <!-- 键盘输入开始 -->
      <div class="part-form-kbd">
        <keyboard-holder />
      </div>
      <!-- 键盘输入结束 -->
    </div>

    <view-login-part-modal-cgpwd
      v-if="staffList !== null"
      :staff-list="staffList"
      :visible.sync="isShowLoginChpwd"
      @close="isShowLoginChpwd = false"
    />

    <view-login-part-modal-search
      v-if="staffList !== null"
      v-model="staffId"
      :staff-list="staffList"
      :visible.sync="isShowLoginSearch"
      @close="isShowLoginSearch = false"
    />

  </div>
</template>

<script>
import ViewLoginPartModalCgpwd from './part-modal-cgpwd'
import ViewLoginPartModalSearch from './part-modal-search'
export default {
  name: 'ViewLogin',
  components: {
    ViewLoginPartModalCgpwd,
    ViewLoginPartModalSearch
  },
  data () {
    return {
      staffList: null,

      isShowLoginChpwd: false,
      isShowLoginSearch: false,

      lang: 'zh_CN',
      staffId: '',
      passWd: ''
    }
  },
  computed: {
    langOptions () {
      return [
        { value: 'zh_CN', label: '简体中文' },
        { value: 'zh_HK', label: '繁体中文' },
        { value: 'ja_JP', label: '日语' },
        { value: 'en_US', label: '英语' }
      ]
    },
    staffOptions () {
      if (this.staffList !== null) {
        return this.staffList.map(el => ({
          value: el.staff_id,
          label: `${el.staff_id}: ${el.staff_name}`
        }))
      }

      return []
    },
    connectIdOptions () {
      return [
        { value: this.$const.SYSTEM.CONNECT_ID.LOCAL, label: '本地模式' },
        { value: this.$const.SYSTEM.CONNECT_ID.REMOTE, label: '远程模式' }
      ]
    }
  },
  watch: {
    staffId () {
      this.passWd = ''
    }
  },
  created () {
    this.$events.on('settings.changed', this.onSettingsChanged)

    this.load()
  },
  beforeDestroy () {
    this.$events.off('settings.changed', this.onSettingsChanged)

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
     * 回调：“模式”选择框被变更
     */
    onConnectIdInput (value) {
      Promise.resolve()
        .then(() => {
          this.$loading.show('正在切换连接模式')
          return this.$sys.updateConnectId(value)
            .finally(() => {
              this.$loading.hide('正在切换连接模式')
            })
        })
        .then(() => {
          return this.$events.emit('settings.changed')
        })
        .catch(error => {
          this.$message.error(error)
        })
    },

    /**
     * 回调：“设置”按钮被点击
     */
    onClickSettings () {
      this.$store.dispatch('modalShow', 'settings')
    },

    /**
     * 回调：“查询”按钮被点击
     */
    onClickQueryStaff () {
      this.isShowLoginSearch = true
    },

    /**
     * 回调：“指纹”按钮被点击
     */
    onClickFingerprint () {
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
     * 回调：“修改密码”按钮被点击
     */
    onClickChangePassword () {
      this.isShowLoginChpwd = true
    },

    /**
     * 回调：“登录”按钮被点击
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
    },

    /**
     * 回调：系统设置被改变
     */
    onSettingsChanged () {
      return this.load()
    }
  }
}
</script>

<style lang="scss">
.ViewLogin {
  height: 100vh;
  min-height: 768px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .part-hd {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .part-hd-settings {
    flex-grow: 0;
    flex-shrink: 0;
    a {
      display: block;
      padding: 34px 29px 34px 69px;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      font-weight: 500;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 31.697px;
        height: 31.144px;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMS42OTciIGhlaWdodD0iMzEuMTQ0Ij48cGF0aCBkPSJNMTEuNTMzIDMxLjE0NGExNS44MDUgMTUuODA1IDAgMDEtNC45MzctMi4zODFsLjA2Ny0zLjIwOGEyLjg4NSAyLjg4NSAwIDAwLTIuMy0yLjg4NWwtMy4xNDctLjY1MUExNS43ODkgMTUuNzg5IDAgMDEwIDE2LjY3N2wyLjU0OS0xLjk0OGEyLjg4NSAyLjg4NSAwIDAwLjgyMi0zLjZMMS45MTcgOC4yNjRhMTUuOTM2IDE1LjkzNiAwIDAxMy40Mi00LjI4N2wzLjExMi43NzlhMi44ODUgMi44ODUgMCAwMDMuMzI1LTEuNmwxLjMzNC0yLjkyYTE2LjA0IDE2LjA0IDAgMDE1LjQ4MSAwbDEuMzMzIDIuOTIxYTIuODg1IDIuODg1IDAgMDAzLjMyNSAxLjZsMy4xMTItLjc4YTE1LjkzNiAxNS45MzYgMCAwMTMuNDIgNC4yODVsLTEuNDUzIDIuODY0YTIuODg1IDIuODg1IDAgMDAuODIxIDMuNmwyLjU0OSAxLjk1MWExNS43ODkgMTUuNzg5IDAgMDEtMS4yMTUgNS4zNDVsLTMuMTQ2LjY1YTIuODg1IDIuODg1IDAgMDAtMi4zIDIuODg1bC4wNjYgMy4yMDlhMTUuODA1IDE1LjgwNSAwIDAxLTQuOTM3IDIuMzhsLTIuNDctMi4wNTRhMi44ODUgMi44ODUgMCAwMC0zLjY5IDBsLTIuNDcgMi4wNTV6bTQuMzE1LTguNzgzYTYuNDkyIDYuNDkyIDAgMTAtNi40OTItNi40OTIgNi40OTIgNi40OTIgMCAwMDYuNDkyIDYuNDkxeiIvPjwvc3ZnPg==');
        background-size: 100% 100%;
        position: absolute;
        left: 29px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .part-hd-lang {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 30px 28px;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    font-weight: 500;
    display: flex;
    align-items: center;
    .FormSelect {
      margin-left: 15px;
    }
  }
  .part-bd {
    max-width: 341px;
  }
  .part-form {
  }
  .part-logo {
    width: 341px;
    padding-bottom: 16px;
    border-bottom: 3px solid #000000;
    margin-bottom: 20px;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
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
    color: #000000;
    font-weight: 500;
  }
  .part-form-control {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    .FormSelect,
    .FormInput {
      padding: 6px 9px;
    }
  }
  .part-form-control-action {
    flex-grow: 0;
    flex-shrink: 0;
    width: 75px;
    margin-left: 10px;
    .Btn {
      padding: 6px 0;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .part-form-action {
    margin-top: 24px;
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
  .part-form-kbd{
    margin-top: 24px;
    & > .KeyboardHolder {
      height: 160px;
    }
  }
}
</style>
