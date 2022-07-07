<template>
  <span class="DisplayQuantity">{{ formatted }}</span>
</template>

<script>
import numbro from 'numbro'

export default {
  name: 'DisplayQuantity',
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
        mantissa: this.$sys.settings.precisionQuantity,
        optionalMantissa: false,
        trimMantissa: true
      })
    }
  }
}
</script>

<style lang="scss">
.DisplayQuantity {
}
</style>
