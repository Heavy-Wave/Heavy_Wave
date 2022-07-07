<template>
  <div class="Expanded" :class="{
    'horizontal': horizontal,
    'vertical': vertical
  }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Expanded',
  props: {
    horizontal: {
      type: Boolean,
      required: false,
      default: false
    },
    vertical: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss">
.Expanded {
  flex-grow: 1;
  &.horizontal {
    width: 1px;
  }
  &.vertical {
    height: 1px;
  }
}
</style>
