<template>
  <div class="unit-main-ret-item" @click="$emit('click', $event)">
    <div class="unit-main-ret-item-hd">{{ item.item_id }}</div>
    <div class="unit-main-ret-item-bd">
      <div class="unit-main-ret-item-title">
        <div class="unit-main-ret-item-name">{{ item.item_name }}</div>
        <div class="unit-main-ret-item-qty"> &times; {{ item.qty }}</div>
      </div>
      <div class="unit-main-ret-item-price"><display-price :value="item.sales_real_amt" /><span class="symbol">元</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.unit-main-ret-item {
  border-bottom: 1px solid #bcbbc0;
  padding: 3px 10px;
  background-color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #f6f6f6;
  }
  &.active {
    background-color: #eeeeee;
  }
  &-hd {
    font-size: 12px;
    line-height: 17px;
    color: #000000;
    @include single-text-ellipsis;
  }
  &-bd {
    display: flex;
    align-items: center;
  }
  &-title {
    flex: 1 1 auto;
    width: 1px;
    margin-right: 10px;
    display: flex;
    align-items: baseline;
  }
  &-name {
    flex: 0 1 auto;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    @include single-text-ellipsis;
  }
  &-qty {
    flex: 0 0 auto;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    white-space: nowrap;
  }
  &-price {
    flex: 0 0 auto;
    font-size: 18px;
    line-height: 20px;
    color: var(--pt-color-price);
    font-weight: bold;
    .symbol {
      font-size: 14px;
      color: #000000;
      font-weight: normal;
    }
    .original {
      display: inline-block;
      margin-right: 10px;
      font-size: 12px;
      line-height: 17px;
      color: #707070;
      text-decoration: line-through;
    }
  }
}
</style>
