<template>
  <div class="FormRadio">

    <form-checkbox
      v-for="option in options"
      :key="option.value"
      :value="value === option.value"
      @input="onInputOption(option)"
    >{{ option.label }}</form-checkbox>

  </div>
</template>

<script>
export default {
  name: 'FormRadio',
  props: {
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    onInputOption ({ value }) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss">
.FormRadio {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -11px;
  .FormCheckbox {
    margin-right: 17px;
    margin-bottom: 11px;
  }
}
</style>
