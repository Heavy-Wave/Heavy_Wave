<template>
  <div class="UnitMainReceiptPayList">

    <div class="unit-main-receipt-pl-bd" v-if="model !== null">

      <div class="unit-main-receipt-pl-title">
        <strong>单号：</strong>{{ model.op_id }}
      </div>

      <div class="unit-main-receipt-pl-list">
        <table-wrapper>
          <thead>
            <tr>
              <th style="width: 35%;">支付方式</th>
              <th style="width: 25%;">金额</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody v-if="model.pay_info !== null">
            <tr
              v-for="(item, index) in model.pay_info.slice(perPage * (currentPage - 1), perPage * currentPage)"
              :key="index"
            >
              <td>{{ item.pay_name }}</td>
              <td>{{ item.payment_amt | decimal($sys.settings.precisionPrice, true) }}</td>
              <td>{{ item.pay_info }}</td>
            </tr>
          </tbody>
        </table-wrapper>
      </div>

      <div class="unit-main-receipt-pl-navs">
        <btn
          title="上一页"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <pt-icon i="arrow-up" />
        </btn>
        <btn
          title="下一页"
          :disabled="totalPages === 0 || currentPage === totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          <pt-icon i="arrow-down" />
        </btn>
      </div>

    </div>

    <div class="unit-main-receipt-pl-ft" v-if="hasClose">
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">返回</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainReceiptPayList',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      currentPage: 1
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasItems () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '支付类型')
    },
    perPage () {
      return 10
    },
    totalPages () {
      if (this.model !== null && this.model.pay_info !== null) {
        return Math.max(1, Math.ceil(this.model.pay_info.length / this.perPage))
      }

      return 0
    }
  },
  mounted () {
    Promise.all([
      this.load()
    ])
  },
  methods: {
    load () {
      this.$loading.show()
      return this.fetch()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetch () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '支付类型')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '支付类型':
          return this.load()
      }
    },

    /**
     * 回调：关闭按钮被点击
     */
    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '关闭')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    }
  }
}
</script>

<style lang="scss">
.UnitMainReceiptPayList {
  width: 520px;
}
.unit-main-receipt-pl-bd {
  padding: 8px;
}
.unit-main-receipt-pl-title {
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 18px;
  line-height: 25px;
  color: #000000;
}
.unit-main-receipt-pl-list {
  margin-top: 12px;
  .TableWrapper {
    border-color: #000000;
    border-radius: 2px;
  }
  td, th {
    @include single-text-ellipsis;
  }
}
.unit-main-receipt-pl-navs {
  margin-top: 8px;
  display: flex;
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding-top: 10px;
    padding-bottom: 10px;
    & + .Btn {
      margin-left: 8px;
    }
    img {
      display: block;
    }
    &.disabled {
      opacity: .35;
    }
  }
}
.unit-main-receipt-pl-ft {
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  justify-content: center;
  .Btn {
    width: 100px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    & + .Btn {
      margin-left: 14px;
    }
  }
}
</style>
