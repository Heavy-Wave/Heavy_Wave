<template>
  <span class="DisplayPrice">{{ integer }}<span class="decimal" v-if="decimal.length > 0">.{{ decimal }}</span></span>
</template>

<script>
import numbro from 'numbro'

export default {
  name: 'DisplayPrice',
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    formatted () {
      return numbro(this.value).format({
        thousandSeparated: false,
        mantissa: this.$sys.settings.precisionPrice,
        optionalMantissa: true,
        trimMantissa: false
      })
    },
    integer () {
      if (this.formatted.indexOf('.') !== -1) {
        return this.formatted.split('.')[0]
      }
      return this.formatted
    },
    decimal () {
      if (this.formatted.indexOf('.') !== -1) {
        return this.formatted.split('.')[1]
      }
      return '0'.repeat(this.$sys.settings.precisionPrice)
    }
  }
}
</script>

<style lang="scss">
.DisplayPrice {
  .decimal {
    font-size: smaller;
  }
}
</style>
