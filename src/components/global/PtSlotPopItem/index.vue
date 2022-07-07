<script>
export default {
  name: 'PtSlotPopItem',
  props: {
    unit: {
      type: Object,
      required: true
    }
  },
  render (createElement) {
    return createElement({
      computed: {
        unit: () => {
          return this.unit
        }
      },
      template: `<div class="PtSlot">${this.unit.ui_unit_file_content}</div>`
    })
  }
}
</script>
