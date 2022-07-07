<template>
  <div
    class="ImageBox"
    :class="{
      'state-loading': state === 'loading',
      'state-fail': state === 'fail',
      'state-success': state === 'success'
    }"
    :style="state === 'success' ? `background-image: url('${src}');` : ''"
  />
</template>

<script>
export default {
  name: 'ImageBox',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      state: 'loading'
    }
  },
  watch: {
    src () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.src.length > 0) {
        return this.load()
      }
      return this.onFail(new Error('src 为空'))
    },
    load () {
      if (this.checkCache()) {
        this.onSuccess()
      } else {
        this.$set(this, 'state', 'loading')
        const image = new Image()
        image.onload = event => {
          this.onSuccess(event)
        }
        image.onerror = event => {
          this.onFail(event)
        }
        image.src = this.src
      }
    },
    checkCache () {
      const image = new Image()
      image.src = this.src
      if (image.complete || image.naturalWidth > 0) {
        return true
      }
      return false
    },
    onSuccess (event) {
      this.$set(this, 'state', 'success')
      this.$emit('load', event)
    },
    onFail (event) {
      this.$set(this, 'state', 'fail')
      this.$emit('error', event)
    }
  }
}
</script>

<style lang="scss">
.ImageBox {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
</style>
