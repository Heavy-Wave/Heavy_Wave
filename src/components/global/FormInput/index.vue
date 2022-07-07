<template>
  <div class="FormInput"
    :class="{ 'disabled': disabled }"
  >

    <input
      ref="control"
      :value="value"
      :type="type"
      :pattern="pattern"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @input="onInput"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @keypress="$emit('keypress', $event)"
      @click="$emit('click', $event)"
      @dblclick="$emit('dblclick', $event)"
      @focus="onFocus"
      @blur="onBlur"
    />

  </div>
</template>

<script>
import flatpickr from 'flatpickr'

export default {
  name: 'FormInput',
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    pattern: {
      type: String,
      required: false,
      default: null
    },
    placeholder: {
      type: String,
      required: false,
      default: null
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    min: {
      type: Number,
      required: false,
      default: null
    },
    max: {
      type: Number,
      required: false,
      default: null
    },
    step: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    keyboardType () {
      return 'decimal'
    }
  },
  watch: {
    value () {
      if (this.type === 'date') {
        this._datePicker.setDate(this.value)
      }
    }
  },
  created () {
    if (this.type === 'date') {
      this._datePicker = null
    }
  },
  mounted () {
    this.attachPicker()
  },
  beforeDestroy () {
    this.detatchPicker()
  },
  methods: {
    focus () {
      this.$refs.control.focus()
    },
    blur () {
      this.$refs.control.blur()
    },
    input (value) {
      switch (this.type) {
        case 'number':
          // 校验 min 和 max 限制
          if (!isNaN(value)) {
            if (this.min !== null && value < this.min) {
              value = this.min
            } else if (this.max !== null && value > this.max) {
              value = this.max
            }
          } else {
            value = ''
          }
          this.$refs.control.value = value.toString()
          break
        case 'text':
          this.$refs.control.value = value.toString()
          break
      }
      this.$emit('input', value.toString())
    },

    onInput (event) {
      this.input(event.target.value)
    },
    onFocus (event) {
      this.$emit('focus', event)

      // 显示键盘
      this.$kbd.show({
        target: this,
        type: this.keyboardType
      })
    },
    onBlur (event) {
      this.$emit('blur', event)
    },

    attachPicker () {
      if (this.type === 'date') {
        this._datePicker = flatpickr(this.$refs.control, {
          altFormat: 'Y-m-d',
          altInput: true,
          allowInput: true,
          dateFormat: 'Y-m-d',
          onReady (selectedDates, inputValue, self) {
            self.altInput.setAttribute('unselectable', 'on') // hack

            // 输入时格式化
            self.altInput.addEventListener('input', function (event) {
              let value = event.target.value
              if (typeof value === 'string') {
                if (event.inputType !== 'deleteContentBackward') {
                  if (/^\d{4}$/.test(value) || /^\d{4}-\d{2}$/.test(value)) {
                    value += '-'
                  }
                }
              }
              event.target.value = value.toString()
            }, false)
          }
        })
      }
    },
    detatchPicker () {
      if (this._datePicker) {
        this._datePicker.destroy()
      }
    }
  }
}
</script>

<style lang="scss">
.FormInput {
  padding: 4px 9px;
  border: 1px solid #000000;
  border-radius: 2px;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  font-weight: 500;
  input[type="text"],
  input[type="password"],
  input[type="number"],
  input[type="tel"],
  input[type="email"] {
    display: block;
    width: 100%;
    height: 20px; // hack
    box-sizing: border-box;
    border-width: 0;
    padding: 0;
    background-color: transparent;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
    }
  }
  &.disabled {
    opacity: .5;
    pointer-events: none;
  }
}
</style>
