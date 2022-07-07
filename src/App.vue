<template>
  <div
    id="app"
    @click.capture="onActive"
    @mousedown.capture="onActive"
    @touchstart.capture="onActive"
    @mousemove.capture="onActive"
  >

    <router-view />

    <loading-holder />

    <dialog-holder />

    <vue-toast-holder />

  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    onActive () {
      this.$sys.resetCountdown()
    }
  }
}
</script>

<style lang="scss">
body {
  font-family: 'DengXian', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-size-adjust: 100%;
  overflow-wrap: break-word;
  user-select: none;
}
#app {
  min-width: 768px;
}
* {
  outline: none;
}
a {
  color: inherit;
  text-decoration: none;
}
button {
  font: inherit;
  color: inherit;
  text-align: inherit;
  padding: initial;
  border: initial;
  background: initial;
  border-radius: initial;
  cursor: pointer;
}
input {
  border: initial;
  background-color: initial;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  font-weight: inherit;
  font-style: inherit;
  letter-spacing: inherit;
  text-align: inherit;
}

#app .VueToastHolder {
  @media all and (min-width: 769px) {
    .toast-wraper {
      align-items: center;
    }
  }
  .toast-frame {
    padding: 30px;
    border-radius: 10px;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>
