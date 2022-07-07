<template>
  <div
    class="TabNav"
    :active="tabs.value === value"
  >
    <a href="javascript:void(0);" @click.prevent="onClick"><slot /></a>
  </div>
</template>

<script>
export default {
  name: 'TabNav',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  inject: ['tabs'],
  methods: {
    onClick (event) {
      this.tabs.$emit('input', this.value)
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss">
.TabNav {
  & + .TabNav {
    margin-left: 1px;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 16px;
      background-color: #e6e6e6;
      position: absolute;
      left: -1px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  a {
    display: block;
    padding: 9px 4px;
    &:hover {
      background-color: #eeeeee;
    }
    &:active {
      background-color: var(--pt-color-primary);
      color: #ffffff;
    }
  }
  &:first-child[active] {
    margin-left: -1px;
  }
  &:last-child[active] {
    margin-right: -1px;
  }
  &[active] {
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 0;
      border-right: 8px solid transparent;
      border-bottom: 8px solid var(--pt-color-primary);
      box-sizing: border-box;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
    }
    a {
      padding-top: 2px;
      padding-bottom: 16px;
      background-color: var(--pt-color-primary);
      color: #ffffff;
      &::before {
        content: '';
        display: block;
        width: 22px;
        height: 3px;
        background-color: #ffffff;
        position: absolute;
        top: initial;
        bottom: 7px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
