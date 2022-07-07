<template>
  <flex-column class="ViewOperator">

    <div class="part-status-bar">

      <status-bar />

    </div>

    <expanded vertical class="part-main">

      <pt-slot top-menu-id="POS_MAIN" name="main-outer" />

    </expanded>

    <div class="part-system-bar">

      <system-bar />

    </div>

    <pt-slot-pop-holder top-menu-id="POS_MAIN" />

  </flex-column>
</template>

<script>
export default {
  name: 'ViewOperator'
}
</script>

<style lang="scss">
.ViewOperator {
  height: 100vh;
  min-height: 768px;
  .part-main {
    & > .PtSlot {
      height: 100%;
    }
  }
  .part-status-bar {
  }
  .part-system-bar {
  }
}
</style>
