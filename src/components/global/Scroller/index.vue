<template>
  <component
    :is="tag"
    class="Scroller"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Scroller',
  props: {
    /** @var {String} 元素标记名称 */
    tag: {
      type: String,
      required: false,
      default: 'div'
    },

    /** @var {Number} 单次滚动步长 */
    step: {
      type: Number,
      required: false,
      default: 200
    }
  },
  data () {
    return {
      /** @var {Number} 当前纵向滚动偏移长度 */
      scrollTop: 0,

      /** @var {Number} 当前纵向可滚动长度 */
      scrollHeight: 0,

      /** @var {Number} 当前纵向内容长度 */
      clientHeight: 0,

      /** @var {Number} 当前横向滚动偏移长度 */
      scrollLeft: 0,

      /** @var {Number} 当前横向可滚动长度 */
      scrollWidth: 0,

      /** @var {Number} 当前横向内容长度 */
      clientWidth: 0
    }
  },
  computed: {
    /** @var {Boolean} 当前是否可向上滚动 */
    canGoUp () {
      return this.scrollTop > 0
    },

    /** @var {Boolean} 当前是否可向下滚动 */
    canGoDown () {
      return this.scrollTop < (this.scrollHeight - this.clientHeight)
    },

    /** @var {Boolean} 当前是否可向左滚动 */
    canGoLeft () {
      return this.scrollLeft > 0
    },

    /** @var {Boolean} 当前是否可向右滚动 */
    canGoRight () {
      return this.scrollLeft < (this.scrollWidth - this.clientWidth)
    }
  },
  mounted () {
    this.onUpdate()

    this.$el.addEventListener('scroll', () => this.onScroll(), { capture: true, passive: true })
  },
  updated () {
    this.onUpdate()
  },
  methods: {
    /**
     * 向上滚动
     */
    goUp () {
      this.$el.scrollTop -= this.step
    },

    /**
     * 向下滚动
     */
    goDown () {
      this.$el.scrollTop += this.step
    },

    /**
     * 向左滚动
     */
    goLeft () {
      this.$el.scrollLeft -= this.step
    },

    /**
     * 向右滚动
     */
    goRight () {
      this.$el.scrollLeft += this.step
    },

    onScroll () {
      this.scrollTop = this.$el.scrollTop
      this.scrollLeft = this.$el.scrollLeft
    },

    onUpdate () {
      this.scrollHeight = this.$el.scrollHeight
      this.clientHeight = this.$el.clientHeight
      this.scrollWidth = this.$el.scrollWidth
      this.clientWidth = this.$el.clientWidth
    }
  }
}
</script>

<style lang="scss">
.Scroller {
  overflow: auto;
}
</style>
