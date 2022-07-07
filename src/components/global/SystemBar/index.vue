<template>
  <div class="SystemBar">

    <div class="system-bar-wrap">

      <div class="system-bar-primary">

        <div class="system-bar-item">
          <span>登录模式：</span>
          <span>
            <template v-if="$sys.connectId === $const.SYSTEM.CONNECT_ID.LOCAL">本地</template>
            <template v-if="$sys.connectId === $const.SYSTEM.CONNECT_ID.REMOTE">远程</template>
          </span>
        </div>

        <div class="system-bar-item">
          <span>版本号：</span>
          <span>{{ $sys.version }}</span>
        </div>

      </div>

      <div class="system-bar-secondary">

        <div class="system-bar-item">
          <span>CPU 占用：</span>
          <span>{{ $sys.cpuPercent }}%</span>
        </div>

        <div class="system-bar-item">
          <span>内存：</span>
          <span>{{ $sys.memoryAvailable }}/{{ $sys.physicalMemory }}MB</span>
        </div>

        <div class="system-bar-item">
          <span>网络连接：</span>
          <span>
            <template v-if="$sys.isNetworkOk">正常</template>
            <template v-else>中断</template>
          </span>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'SystemBar'
}
</script>

<style lang="scss">
.SystemBar {
}
.system-bar-wrap {
  padding: 1px 7px;
  background-color: #000000;
  display: flex;

  font-size: 13px;
  line-height: 18px;
  color: #ffffff;
  letter-spacing: 0.01px;
}
.system-bar-primary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  .system-bar-item {
    margin-right: 58px;
    @media (max-width: 768px) {
      margin-right: 29px;
    }
  }
}
.system-bar-secondary {
  flex-grow: 0;
  flex-shrink: 0;
  .system-bar-item {
    margin-left: 58px;
    @media (max-width: 768px) {
      margin-left: 29px;
    }
  }
}
.system-bar-primary,
.system-bar-secondary {
  display: flex;
  flex-wrap: wrap;
}
.system-bar-item {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
