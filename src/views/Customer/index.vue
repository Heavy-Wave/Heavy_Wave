<template>
  <flex-column class="ViewCustomer">

    <expanded vertical class="part-main">

      <pt-slot top-menu-id="POS_CLIENT" name="client-outer" />

    </expanded>

    <pt-slot-pop-holder top-menu-id="POS_CLIENT" />

  </flex-column>
</template>

<script>
export default {
  name: 'ViewCustomer'
}
</script>

<style lang="scss">
.ViewCustomer {
  height: 100vh;
  min-height: 768px;
  .part-main {
    & > .PtSlot {
      height: 100%;
    }
  }
}
</style>
