<template>
  <div class="KeyboardHolder" v-if="$store.getters.keyboard !== null">

    <keyboard
      :value="$store.getters.keyboard.vnode.componentInstance.value"
      :type="$store.getters.keyboard.type"
      @input="onInput"
    />

  </div>
</template>

<script>
export default {
  name: 'KeyboardHolder',
  methods: {
    onInput (event) {
      // 输入值
      this.$store.getters.keyboard.vnode.componentInstance.input(event)

      // 恢复焦点
      this.$store.getters.keyboard.vnode.componentInstance.focus()
    }
  }
}
</script>

<style lang="scss">
.KeyboardHolder {
  height: 100%;
}
</style>
