<template>
  <div class="Tabs">

    <div class="tabs-navs">
      <slot name="navs" />
    </div>

    <div class="tabs-panes">
      <slot />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  provide () {
    return {
      tabs: this
    }
  }
}
</script>

<style lang="scss">
.Tabs {
  padding-top: 7px;
  .tabs-navs {
    border-top: 1px solid #000000;
    border-left: 1px solid #000000;
    border-right: 1px solid #000000;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background-color: #ffffff;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    text-align: center;
    display: flex;
    align-items: center;
  }
  .tabs-panes {
  }
  .TabNav {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
  }
}
</style>
