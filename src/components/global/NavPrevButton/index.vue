<template>
  <btn class="NavPrevButton" title="上一页" :disabled="!isAvailable" @click="onClick">
    <slot />
  </btn>
</template>

<script>
export default {
  name: 'NavPrevButton',
  inject: ['wrapper'],
  computed: {
    isAvailable () {
      return this.wrapper.current > 0
    }
  },
  methods: {
    onClick () {
      this.wrapper.goPrev()
    }
  }
}
</script>

<style lang="scss">
.NavPrevButton {
}
</style>
