<template>
  <div class="FormStaff">
    <template v-if="isDropdown">
      <form-search-select
        ref="input"
        :value="value"
        @input="$emit('input', $event)"
        :options="options"
        :placeholder="placeholder !== null ? placeholder : '请输入或选择帐号'"
      />
    </template>
    <template v-else>
      <form-input
        ref="input"
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="placeholder !== null ? placeholder : '请输入帐号'"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'FormStaff',
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    placeholder: {
      type: String,
      required: false,
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    isDropdown: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    }
  }
}
</script>

<style lang="scss">
.FormStaff {
}
</style>
