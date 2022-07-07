<template>
  <div class="NavWrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NavWrapper',
  provide () {
    return {
      wrapper: this
    }
  },
  props: {
    length: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      current: 0
    }
  },
  methods: {
    go (value) {
      this.current = Math.min(this.length - 1, Math.max(0, value))
    },
    goPrev () {
      this.go(this.current - 1)
    },
    goNext () {
      this.go(this.current + 1)
    },
    goFirst () {
      this.go(0)
    },
    goLast () {
      this.go(this.length - 1)
    }
  }
}
</script>

<style lang="scss">
.NavWrapper {
}
</style>
