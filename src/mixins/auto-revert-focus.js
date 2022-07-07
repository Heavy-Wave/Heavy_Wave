export default {
  _revertFocusLastActiveEl: null,
  mounted () {
    this.$nextTick(() => {
      this.$el.addEventListener('mousedown', this.onRevertFocusMousedown, { capture: true })
      this.$el.addEventListener('click', this.onRevertFocusClick, false)
    })
  },
  beforeDestroy () {
    this.$el.removeEventListener('mousedown', this.onRevertFocusMousedown, { capture: true })
    this.$el.removeEventListener('click', this.onRevertFocusClick, false)
  },
  methods: {
    onRevertFocusMousedown (event) {
      this._revertFocusLastActiveEl = window.document.activeElement
    },
    onRevertFocusClick (event) {
      if (event.target.tagName.toUpperCase() === 'INPUT') return

      if (this._revertFocusLastActiveEl !== null) {
        this._revertFocusLastActiveEl.focus()
        this._revertFocusLastActiveEl = null
      }
    }
  }
}
