<template>
  <btn class="NavNextButton" title="下一页" :disabled="!isAvailable" @click="onClick">
    <slot />
  </btn>
</template>

<script>
export default {
  name: 'NavNextButton',
  inject: ['wrapper'],
  computed: {
    isAvailable () {
      return this.wrapper.current < this.wrapper.length - 1
    }
  },
  methods: {
    onClick () {
      this.wrapper.goNext()
    }
  }
}
</script>

<style lang="scss">
.NavNextButton {
}
</style>
