<template>
  <div class="TabPane" v-show="tabs.value === value">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TabPane',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  inject: ['tabs']
}
</script>

<style lang="scss">
.TabPane {
  &[active] {
  }
}
</style>
