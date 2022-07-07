<template>
  <div class="PtTips">
    <div class="pt-tips-wrap">
      <template v-if="$sys.tips !== null && $sys.tips.length > 0">{{ $sys.tips }}</template>
      <template v-else>前台操作时，请注意提示信息</template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PtTips'
}
</script>

<style lang="scss">
.PtTips {
}
.pt-tips-wrap {
  padding: 9px 9px 9px 38px;
  background: #29344d url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE0LjQwOCAxNC42OTdoMS44NmEuNTc0LjU3NCAwIDEgMCAwLTEuMTVoLS44MjNWOS4xMDJBNS41MTUgNS41MTUgMCAwIDAgMTEuMyAzLjc1OWExLjM3OCAxLjM3OCAwIDEgMC0yLjczNiAwQTUuNTE1IDUuNTE1IDAgMCAwIDQuNDIgOS4xdjQuNDQ2aC0uNjg0YS41NzQuNTc0IDAgMSAwIDAgMS4xNDloMTAuNjczWm0tNi41NDMgMS4zYTIuMDg5IDIuMDg5IDAgMCAwIDQuMTM0IDBINy44NjRaIiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=") no-repeat 9px 9px / 20px 20px;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
}
</style>
