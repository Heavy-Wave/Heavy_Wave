<template>
  <btn class="NavPageButton" :disabled="!isAvailable" :active="isActive" @click="onClick">
    <slot />
  </btn>
</template>

<script>
export default {
  name: 'NavPageButton',
  inject: ['wrapper'],
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    isActive () {
      return this.value === this.wrapper.current
    },
    isAvailable () {
      return this.value <= this.wrapper.length - 1
    }
  },
  methods: {
    onClick () {
      if (this.isAvailable) {
        this.wrapper.go(this.value)
      }
    }
  }
}
</script>

<style lang="scss">
.NavPageButton {
}
</style>
