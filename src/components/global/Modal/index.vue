<template>
  <div class="Modal" v-if="value" v-show="visible">

    <div class="modal-outer">

      <div class="modal-inner">

        <div class="modal-hd" v-if="'header' in $slots">
          <slot name="header" />
        </div>

        <div class="modal-bd" :style="{ 'width': `${$flexible.trans(bdWidth)}rem`, 'height': `${$flexible.trans(bdHeight)}rem` }">
          <slot />
        </div>

        <div class="modal-ft" v-if="'footer' in $slots">
          <slot name="footer" />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    width: {
      type: Number,
      required: false,
      default: null
    },
    height: {
      type: Number,
      required: false,
      default: null
    },
    visible: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    /**
     * @var Number 主内容区宽度（单位：像素）
     */
    bdWidth () {
      if (this.width > 0) {
        return this.width
      }

      return 'initial'
    },

    /**
     * @var Number 主内容区高度（单位：像素）
     */
    bdHeight () {
      if (this.height > 0) {
        return this.height
      }

      return 'initial'
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.$emit('show')
      } else {
        this.$emit('hide')
      }
    }
  }
}
</script>

<style lang="scss">
.Modal {
  background-color: rgba(0, 0, 0, .20);
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.modal-outer {
  min-width: 360px;
  max-width: 95vw;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.modal-inner {
  max-height: 90vh;
  box-sizing: border-box;
  border: 1px solid #000000;
  background-color: #ffffff;
  border-radius: 1px;
  display: flex;
  flex-direction: column;
}
.modal-hd {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px 20px;
  border-bottom: 1px solid #dddde2;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
}
.modal-bd {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
}
.modal-ft {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 8px;
  border-top: 1px solid #dddde2;
}
</style>
