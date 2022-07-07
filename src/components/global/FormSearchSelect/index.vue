<template>
  <div class="FormSearchSelect">

    <form-input
      ref="control"
      :value="keywords"
      :placeholder="placeholder"
      @input="onInput"
      @click="onClick"
      @focus="onFocus"
      @blur="onBlur"
    />

    <div class="form-searchselect-ret" v-show="isShowResults">
      <template v-if="results.length > 0">
        <div
          v-for="ret in results.slice(perPage * (currentPage - 1), perPage * currentPage)"
          :key="ret.value"
          :class="{ 'active': value === ret.value }"
          class="form-searchselect-ret-item"
          @click="onClickResultItem(ret)"
        >{{ ret.label }}</div>
        <div class="form-searchselect-ret-pagi" @click="onClickResultsPagi">
          <btn
            title="上一页"
            :disabled="currentPage === 1"
            @click="onClickResultsPagiPrev"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            :disabled="totalPages === 0 || currentPage === totalPages"
            @click="onClickResultsPagiNext"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </div>
      </template>
      <template v-else>
        <div class="form-searchselect-ret-item disabled">无匹配结果</div>
      </template>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FormSearchSelect',
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
    placeholder: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      isShowResults: false,
      keywords: '',

      currentPage: 1,
      perPage: 5
    }
  },
  computed: {
    selectedOption () {
      return this.options.find(el => el.value === this.value) || null
    },
    results () {
      if (this.keywords.length > 0) {
        return this.options.filter(el => el.label.includes(this.keywords))
      }

      return this.options
    },
    totalPages () {
      return Math.ceil(this.results.length / this.perPage)
    }
  },
  watch: {
    value () {
      if (this.value === null) return

      if (this.selectedOption !== null) {
        this.$refs.control.$refs.control.value = this.selectedOption.label
      }
    }
  },
  created () {
    this._blurTimeout = null
  },
  methods: {
    focus () {
      this.$refs.control.focus()
    },
    blur () {
      this.$refs.control.blur()
    },

    onInput (value) {
      this.keywords = value
      this.currentPage = 1

      if (value === '') {
        this.$emit('input', null)
      }
    },
    onClick () {
      this.keywords = ''
      this.isShowResults = true
      this._clearBlurTimeout()
    },
    onFocus () {
      this.isShowResults = true
      this._clearBlurTimeout()
    },
    onBlur () {
      this._setBlurTimeout()
    },

    onClickResultItem ({ value }) {
      this.$emit('input', value)
      this._setBlurTimeout()
    },

    onClickResultsPagi () {
      this._clearBlurTimeout()
      this.focus()
    },
    onClickResultsPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },
    onClickResultsPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    _setBlurTimeout () {
      this._blurTimeout = window.setTimeout(() => {
        this.isShowResults = false
      }, 200)
    },
    _clearBlurTimeout () {
      window.clearTimeout(this._blurTimeout)
    }
  }
}
</script>

<style lang="scss">
.FormSearchSelect {
  position: relative;
}
.form-searchselect-ret {
  width: 100%;
  border: 1px solid #000000;
  box-sizing: border-box;
  background-color: #ffffff;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
}
.form-searchselect-ret-item {
  padding: 3px 8px;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  cursor: pointer;
  @include single-text-ellipsis;
  &:hover,
  &.active {
    background-color: var(--pt-color-selection);
    color: var(--pt-color-primary-content);
  }
  &.disabled {
    opacity: .5;
  }
}
.form-searchselect-ret-pagi {
  display: flex;
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    margin: 1px;
    padding: 4px 0;
  }
}
</style>
