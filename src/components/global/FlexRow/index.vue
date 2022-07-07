<template>
  <div class="FlexRow">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FlexRow'
}
</script>

<style lang="scss">
.FlexRow {
  display: flex;
  align-items: stretch;
}
</style>
