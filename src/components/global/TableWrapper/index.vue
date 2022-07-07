<template>
  <div class="TableWrapper">
    <table>
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableWrapper'
}
</script>

<style lang="scss">
.TableWrapper {
  border: 1px solid #bcbbc0;
  box-sizing: border-box;
  overflow: auto;
  table {
    width: 100%;
    max-height: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
    table-layout: fixed;
  }
  thead:first-child,
  tbody:first-child {
    td, th {
      border-top-width: 0;
    }
  }
  tfoot:last-child,
  tbody:last-child {
    td, th {
      border-bottom-width: 0;
    }
  }
  td, th {
    box-sizing: border-box;
    padding: 4px 10px;
    border: 1px solid #bcbbc0;
    text-align: center;
    &:first-child {
      border-left-width: 0;
    }
    &:last-child {
      border-right-width: 0;
    }
  }
  th {
    background-color: #efefef;
  }
  tr {
    &:nth-child(2n) {
      background-color: #ebedf5;
    }
    &.active {
      td {
        background-color: var(--pt-color-selection);
        color: #ffffff;
      }
    }
  }
  tfoot {
    background-color: #efefef;
    td, th {
      border-left-width: 0;
      border-right-width: 0;
    }
  }
}
</style>
