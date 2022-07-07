<template>
  <div class="ViewRootPartNetDiag">

    <div class="part-hd">
      网络检测
    </div>

    <div class="part-bd">

      <div class="part-col">
        <div
          class="part-item"
          :class="{
            'status-ok': code < -1,
            'status-ng': code >= -1
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-host.svg" alt="本地虚拟服务器" />
          </div>
          <label>本地虚拟服务器</label>
        </div>
      </div>

      <div class="part-col">
        <div
          class="part-item conn-prev"
          :class="{
            'status-ok': code < $const.NET_STATUS.CODE.ERROR_LOCAL,
            'status-ng': code >= $const.NET_STATUS.CODE.ERROR_LOCAL
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-local.svg" alt="Postime" />
          </div>
          <label>Postime</label>
          <template v-if="code === $const.NET_STATUS.CODE.ERROR_LOCAL">
            <div class="part-item-error">{{ message }}</div>
          </template>
        </div>
      </div>

      <div class="part-col">
        <div
          class="part-item conn-prev"
          :class="{
            'status-ok': code < $const.NET_STATUS.CODE.ERROR_ROUTER,
            'status-ng': code >= $const.NET_STATUS.CODE.ERROR_ROUTER
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-router.svg" alt="店内路由" />
          </div>
          <label>店内路由</label>
          <template v-if="code === $const.NET_STATUS.CODE.ERROR_ROUTER">
            <div class="part-item-error">{{ message }}</div>
          </template>
        </div>
      </div>

      <div class="part-col">
        <div
          class="part-item conn-prev"
          :class="{
            'status-ok': code < $const.NET_STATUS.CODE.ERROR_INTERNET,
            'status-ng': code >= $const.NET_STATUS.CODE.ERROR_INTERNET
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-internet.svg" alt="互联网" />
          </div>
          <label>互联网</label>
          <template v-if="code === $const.NET_STATUS.CODE.ERROR_INTERNET">
            <div class="part-item-error">{{ message }}</div>
          </template>
        </div>
      </div>

      <div class="part-col length-2">
        <div
          class="part-item conn-prev"
          :class="{
            'status-ok': code < $const.NET_STATUS.CODE.ERROR_SERVER,
            'status-ng': code >= $const.NET_STATUS.CODE.ERROR_SERVER
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-server.svg" alt="Postime 云主机" />
          </div>
          <label>Postime 云主机</label>
          <template v-if="code === $const.NET_STATUS.CODE.ERROR_SERVER">
            <div class="part-item-error">{{ message }}</div>
          </template>
        </div>
        <div
          class="part-item conn-prev"
          :class="{
            'status-ok': code < $const.NET_STATUS.CODE.ERROR_PAY,
            'status-ng': code >= $const.NET_STATUS.CODE.ERROR_PAY
          }"
        >
          <div class="part-item-image">
            <img src="@/assets/img/netdiag-pay.svg" alt="支付服务" />
          </div>
          <label>支付服务</label>
          <template v-if="code === $const.NET_STATUS.CODE.ERROR_PAY">
            <div class="part-item-error">{{ message }}</div>
          </template>
        </div>
      </div>

    </div>

    <div class="part-ft">
      <div class="part-ft-start">
        <btn secondary @click="onClickClose">关闭</btn>
        <btn secondary @click="onClickRetry">再次尝试</btn>
      </div>
      <div class="part-ft-end">
        <template v-if="$sys.connectId !== $const.SYSTEM.CONNECT_ID.LOCAL">
          <btn primary @click="onClickLocal">本地模式</btn>
        </template>
        <template v-if="$sys.connectId !== $const.SYSTEM.CONNECT_ID.REMOTE">
          <btn primary @click="onClickRemote">应急远程</btn>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ViewRootPartNetDiag',
  props: {
    code: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    /**
     * 回调：“关闭”按钮被点击
     */
    onClickClose () {
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
     * 回调：“再次尝试”按钮被点击
     */
    onClickRetry () {
      this.$emit('load')
    },

    /**
     * 回调：“本地模式”按钮被点击
     */
    onClickLocal () {
      Promise.resolve()
        .then(() => {
          this.$loading.show('正在切换连接模式')
          return this.$sys.updateConnectId(this.$const.SYSTEM.CONNECT_ID.LOCAL)
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
     * 回调：“应急远程”按钮被点击
     */
    onClickRemote () {
      Promise.resolve()
        .then(() => {
          this.$loading.show('正在切换连接模式')
          return this.$sys.updateConnectId(this.$const.SYSTEM.CONNECT_ID.REMOTE)
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
    }
  }
}
</script>

<style lang="scss">
.ViewRootPartNetDiag {
  height: 100vh;
  min-height: 768px;
  padding: 0 16px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  .part-hd {
    flex: 0 0 auto;
    padding: 36px 0;
    font-size: 26px;
    line-height: 37px;
    color: #000000;
    font-weight: bold;
    text-align: center;
  }
  .part-bd {
    flex: 1 1 auto;
    height: 1px;
    border: 1px solid #000;
    background-color: #f1f2f6;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .part-ft {
    margin-top: 12px;
    padding-bottom: 48px;
    display: flex;
    justify-content: space-between;
    &-start {
      display: flex;
    }
    &-end {
      display: flex;
    }
    .Btn {
      width: 120px;
      padding: 9px 4px;
      font-size: 20px;
      line-height: 28px;
      & + .Btn {
        margin-left: 10px;
      }
    }
  }

  // structure

  .part-col {
    flex: 0 0 auto;
    width: 120px;
  }
  .part-item {
    position: relative;
    &-image {
      padding-left: 15px;
      padding-right: 15px;
      margin-bottom: 12px;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    label {
      display: block;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      font-weight: bold;
      text-align: center;
    }
    & + .part-item {
      margin-top: 80px;
    }
  }

  // conn

  .part-col {
    margin-right: 86px;
    &:first-child {
      .part-item {
        &.conn-prev {
          &::after {
            display: none;
          }
        }
      }
    }
    &:last-child {
      margin-right: initial;
      .part-item {
        &.conn-next {
          &::after {
            display: none;
          }
        }
      }
    }
    &.length-2 {
      .part-item {
        &.conn-prev {
          &:nth-child(1) {
            &::after {
              transform-origin: 86px center;
              transform: translateY(-50%) rotate(-30deg);
            }
          }
          &:nth-child(2) {
            &::after {
              transform-origin: 86px center;
              transform: translateY(-50%) rotate(30deg);
            }
          }
        }
        &.conn-next {
          &:nth-child(1) {
            &::after {
              transform-origin: 0 center;
              transform: translateY(-50%) rotate(30deg);
            }
          }
          &:nth-child(2) {
            &::after {
              transform-origin: 0 center;
              transform: translateY(-50%) rotate(-30deg);
            }
          }
        }
      }
    }
  }
  .part-item {
    &.conn-prev,
    &.conn-next {
      &::after {
        content: '';
        display: block;
        width: 86px;
        height: 11px;
        background-image: url('~@/assets/img/netdiag-conn.svg');
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
      }
    }
    &.conn-prev {
      &::after {
        right: 100%;
      }
    }
    &.conn-next {
      &::after {
        left: 100%;
      }
    }
    &-error {
      width: 86px;
      font-size: 12px;
      line-height: 17px;
      color: #c9172c;
      text-align: center;
      position: absolute;
      right: 100%;
      top: 50%;
      z-index: 1;
      transform: translateY(-15px);
      &::before {
        content: '';
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 3px;
        width: 30px;
        height: 30px;
        background-image: url('~@/assets/img/netdiag-err.svg');
        background-size: 100% 100%;
      }
    }
  }

  // status

  .part-item {
    &::before {
      content: '';
      display: block;
      width: 32px;
      height: 32px;
      background-size: 100% 100%;
      position: absolute;
      top: -24px;
      right: -12px;
      z-index: 1;
    }
    &.status-chk {
      &::before {
        background-image: url('~@/assets/img/netdiag-chk.svg');
      }
    }
    &.status-ok {
      &::before {
        background-image: url('~@/assets/img/netdiag-ok.svg');
      }
    }
    &.status-ng {
      &::before {
        background-image: url('~@/assets/img/netdiag-ng.svg');
      }
    }
  }
}
</style>
