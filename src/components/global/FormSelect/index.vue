<template>
  <div class="FormSelect">

    <select
      :value="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.value)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >{{ option.label }}</option>
    </select>

  </div>
</template>

<script>
export default {
  name: 'FormSelect',
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: null
    },
    options: {
      type: Array,
      required: true
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
.FormSelect {
  padding: 4px 9px;
  border: 1px solid #000000;
  border-radius: 2px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  font-weight: 500;
  select {
    display: block;
    width: 100%;
    height: 20px; // hack
    box-sizing: border-box;
    border-width: 0;
    padding: 0;
    background-color: transparent;
  }
}
</style>
