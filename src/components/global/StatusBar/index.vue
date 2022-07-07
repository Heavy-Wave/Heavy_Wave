<template>
  <div class="StatusBar">

    <div class="status-bar-wrap">

      <div class="status-bar-primary">

        <div class="status-bar-item">
          <span>登录店铺：</span>
          <span>{{ $sys.deptName }}</span>
        </div>

        <div class="status-bar-item">
          <span>登录人：</span>
          <span>{{ $sys.staffName }}</span>
        </div>

        <div class="status-bar-item">
          <span>日期/时间：</span>
          <span>{{ clock }}</span>
        </div>

      </div>

      <div class="status-bar-secondary">

        <div class="status-bar-item">
          <span>锁屏倒计时：</span>
          <span>{{ $sys.countdown }}</span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  computed: {
    /**
     * @var {String} 日期/时间
     */
    clock () {
      if (this.$sys.clock !== null) {
        return new Date(this.$sys.clock).toLocaleString()
      }

      return ''
    }
  }
}
</script>

<style lang="scss">
.StatusBar {
}
.status-bar-wrap {
  padding: 1px 7px;
  background-color: #000000;
  display: flex;

  font-size: 13px;
  line-height: 18px;
  color: #fff;
  letter-spacing: 0.01px;
}
.status-bar-primary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  .status-bar-item {
    margin-right: 58px;
    @media (max-width: 768px) {
      margin-right: 29px;
    }
  }
}
.status-bar-secondary {
  flex-grow: 0;
  flex-shrink: 0;
  .status-bar-item {
    margin-left: 58px;
    @media (max-width: 768px) {
      margin-left: 29px;
    }
  }
}
.status-bar-primary,
.status-bar-secondary {
  display: flex;
  flex-wrap: wrap;
}
.status-bar-item {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
