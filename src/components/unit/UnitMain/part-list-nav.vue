<template>
  <div class="unit-main-part-desk-left-btns">

    <btn
      title="上一页"
      :disabled="!$store.getters.listPagiCanGoPrev"
      @click="onClickListPagiPrev"
    >
      <pt-icon i="arrow-up" />
    </btn>

    <btn
      title="下一页"
      :disabled="!$store.getters.listPagiCanGoNext"
      @click="onClickListPagiNext"
    >
      <pt-icon i="arrow-down" />
    </btn>

  </div>
</template>

<script>
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  mixins: [
    autoRevertFocus
  ],
  methods: {
    onClickListPagiPrev () {
      this.$store.dispatch('listPagiSetCurrentPage', Math.max(1, this.$store.getters.listPagiCurrentPage - 1))
    },
    onClickListPagiNext () {
      this.$store.dispatch('listPagiSetCurrentPage', Math.min(this.$store.getters.listPagiTotalPages, this.$store.getters.listPagiCurrentPage + 1))
    }
  }
}
</script>
