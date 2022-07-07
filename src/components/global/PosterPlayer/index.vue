<template>
  <div class="PosterPlayer">
    <video
      v-if="srcType === 'video'"
      :src="src"
      :loop="loop"
      autoplay
      muted
      @ended="onVideoEnded"
      @error="onVideoError"
    />
    <image-box
      v-if="srcType === 'image'"
      :src="src"
      @load="onImageLoad"
      @error="onImageError"
    />
  </div>
</template>

<script>
export default {
  name: 'PosterPlayer',
  props: {
    value: {
      type: Array,
      required: true
    },
    duration: {
      type: Number,
      required: false,
      default: 60
    }
  },
  data () {
    return {
      current: 0
    }
  },
  computed: {
    src () {
      if (this.value.length === 0) return ''

      return this.value[this.current]
    },

    srcType () {
      if (this.src.length > 0) {
        if (/\.(png|jpe?g|gif|svg)$/i.test(this.src)) {
          return 'image'
        }
        if (/\.(mp4|m4v|mov|webm|ogg|ogv)$/i.test(this.src)) {
          return 'video'
        }
      }

      return 'none'
    },

    loop () {
      return this.value.length === 1
    }
  },
  methods: {
    roll () {
      this.current = this.current + 1 < this.value.length
        ? this.current + 1
        : 0
    },

    queueRoll () {
      setTimeout(() => {
        this.roll()
      }, this.duration * 1e3)
    },

    onVideoError () {
      window.console.error(new Error(`加载失败：${this.src}`))

      this.queueRoll()
    },

    onVideoEnded () {
      this.roll()
    },

    onImageLoad () {
      this.queueRoll()
    },

    onImageError () {
      window.console.error(new Error(`加载失败：${this.src}`))

      this.queueRoll()
    }
  }
}
</script>

<style lang="scss">
.PosterPlayer {
  video, .ImageBox {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
