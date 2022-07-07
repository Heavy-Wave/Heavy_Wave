<template>
  <Modal :value="block">
    <div class="money-keyboard-title"><slot /></div>
    <div class="money-keyboard-bg">
    <keyboard-holder />
    </div>
    <div class="money-keyboard-keyboard-ft">
        <btn @click="onClickClose">关闭</btn>
        <btn @click="onClickOk" primary>确认</btn>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'MoneyAdminKbd',
  props: {
    block: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created () {
    this.initValue()
  },
  methods: {
    onClickClose () {
      this.$emit('money-admin-kbd-close', null)
    },
    onClickOk () {
      this.$emit('money-admin-kbd-close', null)
    },
    // 显示键盘
    initValue () {
      this.$kbd.show({
        target: this,
        type: this.keyboardType
      })
    }
  },
  computed: {
    keyboardType () {
      return 'decimal'
    }
  }
}
</script>

<style lang="scss">
.money-keyboard-title {
  font-size: 28px;
  line-height: 22px;
  color: #000000;
  text-align: center;
  margin-top: 20px;
}
.money-keyboard-bg {
  width:500px;
  padding:30px;
  margin-top: 26px;
  height: 236px;
}
.money-keyboard-keyboard-ft {
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .Btn {
    width: 101px;
    height: 48px;
  }
}
</style>
