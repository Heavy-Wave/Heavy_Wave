<template>
  <flex-row class="UnitClient">

    <expanded horizontal class="unit-client-part-secondary">
      <pt-slot top-menu-id="POS_CLIENT" name="client-subarea" />
    </expanded>

    <flex-column class="unit-client-part-primary">

      <div class="unit-client-part-brand">
        <pt-slot top-menu-id="POS_CLIENT" name="client-logo" />
      </div>

      <expanded vertical class="unit-client-part-body">
        <pt-slot top-menu-id="POS_CLIENT" name="client-list" />
      </expanded>

    </flex-column>

  </flex-row>
</template>

<script>
import unitMixin from '@/mixins/unit'

export default {
  name: 'UnitClient',
  mixins: [
    unitMixin
  ]
}
</script>

<style lang="scss">
.UnitClient {
  height: 100%;
}
.unit-client-part-secondary {
  & > .PtSlot {
    height: 100%;
  }
}
.unit-client-part-primary {
  width: 390px;
}
.unit-client-part-brand {
  & > .PtSlot {
    height: 100%;
  }
}
.unit-client-part-body {
  & > .PtSlot {
    height: 100%;
  }
}
</style>
