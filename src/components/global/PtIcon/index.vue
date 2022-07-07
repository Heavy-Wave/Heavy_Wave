<template>
  <span
    class="PtIcon"
    :class="`pt-icon-${i}`"
  />
</template>

<script>
export default {
  name: 'PtIcon',
  props: {
    i: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
.PtIcon {
  font-family: 'pt-icon' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: middle;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@font-face {
  font-family: 'pt-icon';
  src: url('~@/assets/font/pt-icon.ttf') format('truetype'),
       url('~@/assets/font/pt-icon.woff') format('woff'),
       url('~@/assets/font/pt-icon.svg#pt-icon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.pt-icon-qty-plus:before {
  content: "\e907";
}
.pt-icon-qty-minus:before {
  content: "\e906";
}
.pt-icon-arrow-up:before {
  content: "\e903";
}
.pt-icon-arrow-down:before {
  content: "\e900";
}
.pt-icon-arrow-left:before {
  content: "\e901";
}
.pt-icon-arrow-right:before {
  content: "\e902";
}
.pt-icon-kbd-hide:before {
  content: "\e904";
}
.pt-icon-kbd-show:before {
  content: "\e905";
}
</style>
