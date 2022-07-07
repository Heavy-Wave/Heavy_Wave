<template>
  <div class="NavPanel" v-if="isActive">

    <slot />

  </div>
</template>

<script>
export default {
  name: 'NavPanel',
  inject: ['wrapper'],
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    isActive () {
      return this.wrapper.current === this.index
    }
  }
}
</script>

<style lang="scss">
.NavPanel {
}
</style>
