<template>
  <div class="Keyboard">

    <div class="kbd-wrap">

      <div class="kbd-row">
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('7')">7</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('8')">8</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('9')">9</a>
        <template v-if="type === 'integer'">
          <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('00')">00</a>
        </template>
        <template v-if="type === 'decimal'">
          <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('.')">.</a>
        </template>
      </div>

      <div class="kbd-row">
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('4')">4</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('5')">5</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('6')">6</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('0')">0</a>
      </div>

      <div class="kbd-row">
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('1')">1</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('2')">2</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickAppend('3')">3</a>
        <a class="kbd-cell" href="javascript:void(0);" @click="onClickBackspace">⌫</a>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Keyboard',
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    onClickAppend (input) {
      if (typeof this.value === 'string') {
        if (input === '0' && this.value === '0') {
          // noop
        } else if (input === '00' && (this.value === '' || this.value === '0')) {
          // noop
        } else if (input === '.' && (this.value.includes('.') || this.value === '')) {
          // noop
        } else {
          this.$emit('input', `${this.value !== '' ? this.value : ''}${input}`)
        }
      } else {
        this.$emit('input', input)
      }
    },
    onClickBackspace () {
      if (typeof this.value === 'string' && this.value.length > 0) {
        this.$emit('input', this.value.substring(0, this.value.length - 1))
      }
    }
  }
}
</script>

<style lang="scss">
.Keyboard {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  font-size: 20px;
  line-height: 28px;
  color: #000000;
  font-weight: bold;
  text-align: center;
}
.kbd-wrap {
  flex-grow: 1;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
}
.kbd-row {
  flex-grow: 1;
  flex-shrink: 0;

  display: flex;
  align-items: stretch;

  & + .kbd-row {
    margin-top: 3px;
  }
}
.kbd-cell {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;

  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 6px;
  padding: 4px 0;

  display: flex;
  align-items: center;
  justify-content: center;

  & + .kbd-cell {
    margin-left: 3px;
  }

  &:hover {
    background-color: #eeeeee;
  }

  &:active {
    background-color: #000000;
    color: #ffffff;
  }
}
</style>
