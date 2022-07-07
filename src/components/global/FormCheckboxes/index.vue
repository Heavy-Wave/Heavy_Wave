<template>
  <div class="FormCheckboxes">

    <form-checkbox
      v-for="option in options"
      :key="option.value"
      :value="value.includes(option.value)"
      @input="onInputOption(option)"
    >{{ option.label }}</form-checkbox>

  </div>
</template>

<script>
export default {
  name: 'FormCheckboxes',
  props: {
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    onInputOption ({ value }) {
      if (!this.value.includes(value)) {
        this.$emit('input', this.value.concat([value]))
      } else {
        this.$emit('input', this.value.slice(0, this.value.indexOf(value)).concat(this.value.slice(this.value.indexOf(value) + 1)))
      }
    }
  }
}
</script>

<style lang="scss">
.FormCheckboxes {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -11px;
  .FormCheckbox {
    margin-right: 17px;
    margin-bottom: 11px;
  }
}
</style>
