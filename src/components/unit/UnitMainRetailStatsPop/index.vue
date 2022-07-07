<template>
  <div class="UnitMainRetailStatsPop">

    <div class="unit-main-rtst-pop-bd">
      <table-wrapper>
        <thead>
          <template v-if="header !== null">
            <tr>
              <th
                v-for="col in header"
                :key="col.key"
                :style="{ 'width': (col.width > 0 ? `${$flexible.trans(col.width)}rem` : 'initial') }"
              >{{ col.label }}</th>
            </tr>
          </template>
          <template v-else>
            <tr>
              <th v-for="seq in 5" :key="`placeholder-${seq}`">&nbsp;</th>
            </tr>
          </template>
        </thead>
        <tbody>
          <template v-if="header !== null && items !== null">
            <tr
              v-for="item in items"
              :key="item.item_id"
            >
              <td v-for="col in header" :key="col.key">{{ item[col.key] }}</td>
            </tr>
            <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
              <td v-for="col in header" :key="col.key">&nbsp;</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="seq in perPage" :key="`placeholder-${seq}`">
              <td v-for="seq in 5" :key="`placeholder-${seq}`">&nbsp;</td>
            </tr>
          </template>
        </tbody>
      </table-wrapper>
    </div>

    <div class="unit-main-rtst-pop-ft">
      <btn
        style="width: 30%;"
        title="上一页"
        secondary
        :disabled="currentPage === 1"
        @click="onClickPrev"
      >
        <pt-icon i="arrow-up" />
      </btn>
      <btn
        style="width: 30%;"
        title="下一页"
        secondary
        :disabled="totalPages === 0 || currentPage === totalPages"
        @click="onClickNext"
      >
        <pt-icon i="arrow-down" />
      </btn>
      <template v-if="hasClose">
        <btn secondary @click="onClickClose">关闭</btn>
      </template>
      <template v-if="hasPrint">
        <btn primary @click="onClickPrint">打印</btn>
      </template>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainRetailStatsPop',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '关闭')
    },
    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '零售统计数据')
    },

    header () {
      if (this.model !== null && this.model.item_title !== null) {
        return this.model.item_title
          // 克隆数组
          .filter(() => true)
          // 按 paixu 字段排序
          .sort((e1, e2) => {
            if (e1.paixu > e2.paixu) return 1
            if (e1.paixu < e2.paixu) return -1
            return 0
          })
          // 组装
          .map(el => {
            return {
              key: el.key,
              label: el.values,
              width: el.width
            }
          })
      }

      return null
    },
    items () {
      if (this.model !== null && this.model.return_info !== null) {
        return this.model.return_info.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.model !== null && this.model.return_info !== null) {
        return Math.max(1, Math.ceil(this.model.return_info.length / this.perPage))
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '零售统计数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '零售统计数据':
          return this.load()
      }
    },

    /**
     * 回调：上一页按钮被点击
     */
    onClickPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    /**
     * 回调：下一页按钮被点击
     */
    onClickNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：“关闭”按钮被点击
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
    },

    /**
     * 回调：“打印”按钮被点击
     */
    onClickPrint () {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(this.model), 'posMain.RetailStatistics.Info.pop')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '打印')
        })
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
.UnitMainRetailStatsPop {
}
.unit-main-rtst-pop {
  &-bd {
    padding: 8px;
    td, th {
      @include single-text-ellipsis;
    }
  }
  &-ft {
    padding: 8px;
    border-top: 1px solid #dddde2;
    display: flex;
    align-items: center;
    justify-content: center;
    .Btn {
      width: 100px;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 25px;
      text-align: center;
      & + .Btn {
        margin-left: 14px;
      }
    }
  }
}
</style>
