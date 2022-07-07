<template>
  <div class="ViewRootPartModalSettings">

    <modal :value="$store.getters.modalShown.includes('settings')" :visible="visible" @show="onModalShow" @hide="onModalHide">

      <template slot="header">系统设置</template>

      <div class="form-wrap" v-if="model !== null">

        <div class="form-group">
          <label class="form-label">默认 WS 地址</label>
          <div class="form-control">
            <form-input
              v-model="model.defWs"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">POS 机号</label>
          <div class="form-control smaller">
            <form-input
              v-model="model.posId"
            />
          </div>
          <label class="form-label">公司</label>
          <div class="form-control smaller">
            <form-input
              v-model="model.coId"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">分公司</label>
          <div class="form-control smaller">
            <form-input
              v-model="model.brId"
            />
          </div>
          <label class="form-label">部门</label>
          <div class="form-control smaller">
            <form-input
              v-model="model.deptId"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">PT 编号</label>
          <div class="form-control">
            <form-input
              v-model="model.ptUid"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">客显屏位置</label>
          <div class="form-control">
            <form-input
              v-model="model.clientLocation"
              placeholder="请输入整数（0、1、2、3…），0 为不开启"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">小票打印方式</label>
          <div class="form-control">
            <form-select
              v-model="model.printType"
              :options="printTypeOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">电子秤端口</label>
          <div class="form-control">
            <form-input
              v-model="model.weightScalePort"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">电子秤类型</label>
          <div class="form-control">
            <form-select
              v-model="model.weightScaleType"
              :options="weightScaleTypeOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">打印收银小票</label>
          <div class="form-control">
            <form-checkbox
              v-model="printReceiptFlg"
            >启动</form-checkbox>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">客显屏显示</label>
          <div class="form-control">
            <form-checkboxes
              v-model="clientContent"
              :options="clientContentOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">指纹端口</label>
          <div class="form-control">
            <form-input
              v-model="model.fingerPort"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">指纹设备类型</label>
          <div class="form-control">
            <form-select
              v-model="model.fingerType"
              :options="fingerTypeOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">小票打印端口</label>
          <div class="form-control">
            <form-input
              v-model="model.printPort"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">输入框类型</label>
          <div class="form-control">
            <form-radio
              v-model="model.inputType"
              :options="inputTypeOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">单位切换</label>
          <div class="form-control">
            <form-select
              v-model="model.unitFlg"
              :options="unitFlgOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">消息提示</label>
          <div class="form-control">
            <form-select
              v-model="model.msgFlg"
              :options="msgFlgOptions"
            />
          </div>
        </div>

      </div>

      <template slot="footer">
        <div class="form-actions">
          <btn secondary @click="onClickClose">关闭</btn>
          <btn primary @click="onClickOk">保存</btn>
        </div>
      </template>

    </modal>

  </div>
</template>

<script>
export default {
  name: 'ViewRootPartModalSettings',
  data () {
    return {
      model: null,

      visible: false
    }
  },
  computed: {
    printReceiptFlg: {
      get () {
        if (this.model === null) return false

        return this.model.printReceiptFlg === '1'
      },
      set (value) {
        if (this.model === null) return

        this.model.printReceiptFlg = value ? '1' : '2'
      }
    },
    clientContent: {
      get () {
        if (this.model === null) return []

        switch (this.model.clientContent) {
          case '1':
            return ['video']
          case '2':
            return ['picture']
          case '3':
            return ['video', 'picture']
          default:
            return []
        }
      },
      set (value) {
        if (this.model === null) return

        if (value.includes('video') && value.includes('picture')) {
          this.model.clientContent = '3'
        } else if (value.includes('video')) {
          this.model.clientContent = '1'
        } else if (value.includes('picture')) {
          this.model.clientContent = '2'
        } else {
          this.model.clientContent = '0'
        }
      }
    },
    printTypeOptions () {
      return [
        { value: '1', label: '指令集' },
        { value: '2', label: 'Windows' }
      ]
    },
    weightScaleTypeOptions () {
      return [
        { value: '0', label: '不选用秤' },
        { value: '1', label: '顶尖电子秤' },
        { value: '2', label: '托利电子秤' }
      ]
    },
    clientContentOptions () {
      return [
        { value: 'video', label: '视频' },
        { value: 'picture', label: '图片' }
      ]
    },
    fingerTypeOptions () {
      return [
        { value: '1', label: '串口设备' },
        { value: '2', label: 'USB' }
      ]
    },
    inputTypeOptions () {
      return [
        { value: '1', label: '有选项' },
        { value: '0', label: '无选项' }
      ]
    },
    unitFlgOptions () {
      return [
        { value: '1', label: '公斤' },
        { value: '2', label: '斤' }
      ]
    },
    msgFlgOptions () {
      return [
        { value: '0', label: '不展示' },
        { value: '1', label: '展示' }
      ]
    }
  },
  methods: {
    load () {
      this.$loading.show()
      return this.fetch()
        .then(() => {
          // 获取成功，显示弹窗
          this.visible = true
        })
        .catch(error => {
          this.$message.error(error)

          // 获取失败，关闭自身
          this.$store.dispatch('modalHide', 'settings')
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetch () {
      return this.$bridge.systemSettingsGet()
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    submit () {
      return this.$bridge.systemSettingsPut(this.model)
        .then(() => {
          return Promise.all([
            this.$ui.setData(this.model.defWs.toString(), 'sysConfig.def_ws'),
            this.$ui.setData(this.model.posId.toString(), 'sysConfig.pos_id'),
            this.$ui.setData(this.model.ptUid.toString(), 'sysConfig.pt_uid'),
            this.$ui.setData(this.model.coId.toString(), 'sysConfig.co_id'),
            this.$ui.setData(this.model.brId.toString(), 'sysConfig.br_id'),
            this.$ui.setData(this.model.deptId.toString(), 'sysConfig.dept_id'),
            this.$ui.setData(this.model.clientLocation.toString(), 'sysConfig.client_location'),
            this.$ui.setData(this.model.printType.toString(), 'sysConfig.print_type'),
            this.$ui.setData(this.model.weightScalePort.toString(), 'sysConfig.weight_scale_port'),
            this.$ui.setData(this.model.weightScaleType.toString(), 'sysConfig.weight_scale_type'),
            this.$ui.setData(this.model.printReceiptFlg.toString(), 'sysConfig.print_receipt_flg'),
            this.$ui.setData(this.model.clientContent.toString(), 'sysConfig.client_content'),
            this.$ui.setData(this.model.fingerPort.toString(), 'sysConfig.finger_port'),
            this.$ui.setData(this.model.fingerType.toString(), 'sysConfig.finger_type'),
            this.$ui.setData(this.model.printPort.toString(), 'sysConfig.print_port'),
            this.$ui.setData(this.model.inputType.toString(), 'sysConfig.input_type'),
            this.$ui.setData(this.model.unitFlg.toString(), 'sysConfig.unit_flg'),
            this.$ui.setData(this.model.msgFlg.toString(), 'sysConfig.msg_flg')
          ])
        })
        .then(({ msg, data }) => {
          return this.$events.emit('settings.changed')
        })
        .then(() => {
          this.$message.notice('保存成功')
        })
    },

    /**
     * 回调：模态被显示
     */
    onModalShow () {
      this.load()
    },

    /**
     * 回调：模态被隐藏
     */
    onModalHide () {
      this.model = null
    },

    /**
     * 回调：保存按钮被点击
     */
    onClickOk () {
      this.$loading.show()
      this.submit()
        .then(() => {
          this.$store.dispatch('modalHide', 'settings')
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
      this.$store.dispatch('modalHide', 'settings')
    }
  }
}
</script>

<style lang="scss">
.ViewRootPartModalSettings {
  .modal-outer {
    width: 510px;
  }
  .form-wrap {
    padding: 10px;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
  }
  .form-group {
    display: flex;
    align-items: center;
    & + .form-group {
      margin-top: 14px;
    }
  }
  .form-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 128px;
    margin-right: 8px;
    text-align: right;
  }
  .form-control {
    flex-grow: 0;
    flex-shrink: 0;
    width: 300px;
    &.smaller {
      width: 116px;
    }
  }
  .form-control + .form-label {
    width: 59px;
  }
  .form-help {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    margin-left: 8px;
  }
  .form-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .Btn {
      width: 120px;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 22px;
      & + .Btn {
        margin-left: 14px;
      }
    }
  }
}
</style>
