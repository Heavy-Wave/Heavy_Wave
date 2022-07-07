<template>
  <button
    class="Btn"
    :class="{
      'btn-block': block,
      'btn-primary': primary,
      'btn-secondary': secondary,
      'btn-flat': flat,
      'btn-outline': outline,
      'btn-active': active,
      'btn-disabled': disabled
    }"
    @click="$emit('click', $event)"
  ><slot /></button>
</template>

<script>
export default {
  name: 'Btn',
  props: {
    block: {
      type: Boolean,
      required: false,
      default: false
    },
    primary: {
      type: Boolean,
      required: false,
      default: false
    },
    secondary: {
      type: Boolean,
      required: false,
      default: false
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    outline: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss">
.Btn {
  display: block;
  box-sizing: border-box;
  border: 1px solid #000000;
  background-color: var(--pt-color-secondary);
  border-radius: 2px;
  color: var(--pt-color-secondary-content);
  text-align: center;
  &:hover {
    opacity: .85;
  }
  &:active,
  &.btn-active {
    opacity: 1;
  }

  & > img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  &.btn-block {
    width: 100%;
  }

  &.btn-primary {
    border-color: var(--pt-color-primary);
    background-color: var(--pt-color-primary);
    border-radius: 2px;
    color: var(--pt-color-primary-content);
    &:hover {
      opacity: .85;
    }
    &:active,
    &.btn-active {
      opacity: 1;
    }
  }

  &.btn-secondary {
    border: 1px solid #000000;
    background-image: linear-gradient(135deg, #ffffff 0%, #e3e3e3 100%);
    border-radius: 2px;
    color: #000000;
    &:hover {
      background-image: linear-gradient(135deg, lighten(#ffffff, 10%) 0%, lighten(#e3e3e3, 10%) 100%);
    }
    &:active,
    &.btn-active {
      background-image: linear-gradient(135deg, darken(#ffffff, 10%) 0%, darken(#e3e3e3, 10%) 100%);
    }
  }

  &.btn-flat {
    border-color: #e7e7e7;
    background-color: #e7e7e7;
    border-radius: 2px;
    color: #707070;
    &:hover {
      border-color: lighten(#e7e7e7, 5%);
      background-color: lighten(#e7e7e7, 5%);
    }
    &:active,
    &.btn-active {
      border-color: darken(#e7e7e7, 10%);
      background-color: darken(#e7e7e7, 10%);
    }
  }

  &.btn-outline {
    border-color: var(--pt-color-primary);
    background-color: var(--pt-color-primary-content);
    color: var(--pt-color-primary);
    &:hover {
      opacity: .85;
    }
    &:active,
    &.btn-active {
      opacity: 1;
      background-color: var(--pt-color-primary);
      color: var(--pt-color-primary-content);
    }
  }

  &.btn-primary.btn-outline {
    border: 1px solid var(--pt-color-bordered);
    background-color: #ffffff;
    border-radius: 2px;
    color: var(--pt-color-bordered);
    &:hover {
      background-color: #eeeeee;
    }
    &:active,
    &.btn-active {
      background-color: var(--pt-color-bordered);
      color: #ffffff;
    }
  }

  &.btn-disabled {
    opacity: .5;
    pointer-events: none;
  }
}
</style>
