<template>
  <div class="BtnGroup">

    <slot />

  </div>
</template>

<script>
export default {
  name: 'BtnGroup'
}
</script>

<style lang="scss">
.BtnGroup {
  display: flex;
  flex-wrap: wrap;
  margin-left: -1px;
  margin-right: -1px;
  margin-bottom: -2px;
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    width: calc(20% - 2px);
    margin-left: 1px;
    margin-right: 1px;
    margin-bottom: 2px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
