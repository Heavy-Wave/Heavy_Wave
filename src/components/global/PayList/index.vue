<template>
  <div class="PayList">

    <table-wrapper>
      <thead>
        <tr>
          <th style="width: 35%;">
            <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">支付方式</template>
            <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">退款方式</template>
          </th>
          <th style="width: 25%;">
            <template v-if="model.op_type === $const.PAY.OP_TYPE.PAY">支付金额</template>
            <template v-if="model.op_type === $const.PAY.OP_TYPE.REFUND">退款金额</template>
          </th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody v-if="model.pay_list !== null">
        <tr
          v-for="item in model.pay_list.slice(perPage * (currentPage - 1), perPage * currentPage)"
          :key="item.line_no"
          :class="{ 'active': value === item.line_no }"
          @click="value !== item.line_no ? $emit('input', item.line_no) : $emit('input', null)"
        >
          <td>{{ item.pay_name }}</td>
          <td>{{ item.pay_amt | decimal($sys.settings.precisionPrice, true) }}</td>
          <td>{{ item.pay_info }}</td>
        </tr>
      </tbody>
    </table-wrapper>

    <div class="pay-list-part-table-actions">
      <btn
        style="width: 25%;"
        title="上一页"
        :disabled="currentPage === 1"
        @click="pagiPrev"
      >
        <pt-icon i="arrow-up" />
      </btn>
      <btn
        style="width: 25%;"
        title="下一页"
        :disabled="totalPages === 0 || currentPage === totalPages"
        @click="pagiNext"
      >
        <pt-icon i="arrow-down" />
      </btn>
      <template v-if="showRetry">
        <btn secondary :disabled="value === null" @click="$emit('retry', $event)">重试</btn>
      </template>
      <template v-if="showDelete">
        <btn secondary :disabled="value === null" @click="$emit('delete', $event)">删除</btn>
      </template>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PayList',
  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    model: {
      type: Object,
      required: true
    },
    showRetry: {
      type: Boolean,
      required: true
    },
    showDelete: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      currentPage: 1,
      perPage: 4
    }
  },
  computed: {
    totalPages () {
      if (this.model.pay_list !== null) {
        return Math.max(1, Math.ceil(this.model.pay_list.length / this.perPage))
      }

      return 0
    }
  },
  watch: {
    currentPage () {
      this.$emit('input', null)
    }
  },
  methods: {
    reset () {
      this.currentPage = 1
    },
    pagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },
    pagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    }
  }
}
</script>

<style lang="scss">
.PayList {
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td, th {
      @include single-text-ellipsis;
    }
  }
}
.pay-list-part-table-actions {
  margin-top: 4px;
  display: flex;
  .Btn {
    display: block;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 9px 30px;
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    & + .Btn {
      margin-left: 4px;
    }
  }
}
</style>
