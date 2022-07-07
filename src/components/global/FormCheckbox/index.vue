<template>
  <div class="FormCheckbox" @click="$emit('input', !value)">

    <div class="form-checkbox-icon">
      <template v-if="value">
        <svg width="27" height="27" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 0a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm0 1H4a3 3 0 0 0-3 3v19a3 3 0 0 0 3 3h19a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z" fill="#000" />
          <path d="M11.62 21.702c1.275-2.329 5.729-6.495 8.909-8.621l1.25-.763c.397-.23.823-.406 1.266-.525-.98-2.235-.12-4.051.019-6.146a19.041 19.041 0 0 0-3.524 2.432l-1.331 1.2a57.242 57.242 0 0 0-6.887 8.107l-2.238-4.331L4 15.522c2.151.767 5.443 3.5 7.614 6.178l.006.002z" />
        </svg>
      </template>
      <template v-else>
        <svg width="27" height="27" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 0a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm0 1H4a3 3 0 0 0-3 3v19a3 3 0 0 0 3 3h19a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z" fill="#000" />
        </svg>
      </template>
    </div>

    <slot />

  </div>
</template>

<script>
export default {
  name: 'FormCheckbox',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss">
.FormCheckbox {
  min-height: 27px;
  padding-left: 38px;
  line-height: 27px;
  position: relative;
}
.form-checkbox-icon {
  svg {
    display: block;
    fill: var(--pt-color-primary);
  }
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
