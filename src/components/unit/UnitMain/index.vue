<template>
  <div class="UnitMain">

    <div class="unit-main-part-hd">

      <div class="unit-main-part-header">
        <pt-slot top-menu-id="POS_MAIN" name="main-receipt_header" />
        <pt-slot top-menu-id="POS_MAIN" name="main-vip" />
      </div>

      <div class="unit-main-part-menu">
        <pt-slot top-menu-id="POS_MAIN" name="main-menu" />
      </div>

    </div>

    <div class="unit-main-part-bd">

      <pt-slot top-menu-id="POS_MAIN" name="main-inner">

        <div class="unit-main-part-bd-wrap">

          <div class="unit-main-part-primary">

            <div class="unit-main-part-desk">

              <div class="unit-main-part-desk-left">

                <div class="unit-main-part-desk-left-wrap">
                  <pt-slot top-menu-id="POS_MAIN" name="main-func1" />
                </div>

                <part-list-nav />

              </div>

              <div class="unit-main-part-desk-center">
                <pt-slot top-menu-id="POS_MAIN" name="main-list" />
              </div>

              <div class="unit-main-part-desk-right">
                <pt-slot top-menu-id="POS_MAIN" name="main-func2" />
              </div>

            </div>

            <div class="unit-main-part-subtotal">
              <pt-slot top-menu-id="POS_MAIN" name="main-subtotal" />
            </div>

            <div class="unit-main-part-action">
              <pt-slot top-menu-id="POS_MAIN" name="main-action" />
            </div>

            <div class="unit-main-part-total">
              <pt-slot top-menu-id="POS_MAIN" name="main-sale-close" />
            </div>

          </div>

          <div class="unit-main-part-secondary">

            <div class="unit-main-part-subarea">
              <pt-slot top-menu-id="POS_MAIN" name="main-subarea" />
            </div>

            <div class="unit-main-part-more">
              <pt-slot top-menu-id="POS_MAIN" name="main-more" />
            </div>

            <div class="unit-main-part-actions">
              <pt-slot top-menu-id="POS_MAIN" name="main-func3" />
            </div>

          </div>

        </div>

      </pt-slot>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'

import PartListNav from './part-list-nav'

export default {
  name: 'UnitMain',
  mixins: [
    unitMixin
  ],
  components: {
    PartListNav
  }
}
</script>

<style lang="scss">
.UnitMain {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-part-hd {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}
.unit-main-part-bd {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  border-top: 1px solid #9d9d9d;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-bd-wrap {
  height: 100%;
  display: flex;
  align-items: stretch;
}
.unit-main-part-header {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
}
.unit-main-part-menu {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
}
.unit-main-part-primary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  flex-direction: column;
}
.unit-main-part-desk {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  display: flex;
  align-items: stretch;
}
.unit-main-part-desk-left {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.unit-main-part-desk-left-wrap {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-desk-left-btns {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 1px;
  display: flex;
  flex-direction: column;
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    display: block;
    height: 60px;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
    letter-spacing: 0.02px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & + .Btn {
      margin-top: 2px;
    }
  }
}
.unit-main-part-desk-center {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-desk-right {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-subtotal {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-action {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-total {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-secondary {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  border-left: 1px solid #9d9d9d;
  display: flex;
  flex-direction: column;
}
.unit-main-part-subarea {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-more {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
.unit-main-part-actions {
  flex-grow: 0;
  flex-shrink: 0;
  & > .PtSlot {
    height: 100%;
  }
}
</style>
