<template>
  <div class="UnitMainOtheroddIntro">

    <div class="unit-main-othod-intro-wrap">

      <div class="unit-main-othod-intro-bd">

        <div class="unit-main-othod-intro-dtl">
          <table-wrapper>
            <thead>
              <tr>
                <th style="width: 6em;">收支类型</th>
                <th>收支项目</th>
              </tr>
            </thead>
            <tbody v-if="items !== null">
              <tr v-for="item in items" :key="item.line_no">
                <td>{{ item.inorout }}</td>
                <td>{{ item.pay_info }}</td>
              </tr>
              <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
                <td v-for="seq in 2" :key="`placeholder-${seq}`">&nbsp;</td>
              </tr>
            </tbody>
          </table-wrapper>
        </div>

        <div class="unit-main-othod-intro-pagi">
          <btn
            title="上一页"
            :disabled="currentPage === 1"
            @click="onClickPagiPrev"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            :disabled="totalPages === 0 || currentPage === totalPages"
            @click="onClickPagiNext"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </div>

      </div>

      <div class="unit-main-othod-intro-ft">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">返回</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainOtheroddIntro',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      modelList: null,

      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '收支项目说明')
    },

    items () {
      if (this.modelList !== null && this.modelList.v_info !== null) {
        return this.modelList.v_info.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.modelList === null || this.modelList.v_info === null) return 0

      return Math.ceil(this.modelList.v_info.length / this.perPage)
    }
  },
  mounted () {
    Promise.all([
      this.loadList()
    ])
  },
  methods: {
    loadList () {
      this.$loading.show()
      return this.fetchList()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchList () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '收支项目说明')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelList = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '收支项目说明':
          return this.loadList()
      }
    },

    onClickPagiPrev () {
      this.currentPage = Math.max(1, this.currentPage - 1)
    },

    onClickPagiNext () {
      this.currentPage = Math.min(this.totalPages, this.currentPage + 1)
    },

    /**
     * 回调：“返回”按钮被点击
     */
    onClickClose () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '返回')
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
.UnitMainOtheroddIntro {
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td,
    th {
      @include single-text-ellipsis;
    }
  }
}
.unit-main-othod-intro {
  &-wrap {
  }
  &-bd {
    padding: 10px;
    display: flex;
    align-items: stretch;
  }
  &-dtl {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    a {
      color: var(--pt-color-danger);
    }
    .FormInput,
    .FormSelect {
      padding: initial;
      border-width: 0;
      text-align: center;
    }
    .cell-input {
      background-color: var(--pt-color-list-highlight);
    }
  }
  &-pagi {
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: 7px;
    display: flex;
    flex-direction: column;
    .Btn {
      flex-grow: 1;
      flex-shrink: 1;
      height: 1px;
      padding-left: 10px;
      padding-right: 10px;
      & + .Btn {
        margin-top: 2px;
      }
    }
  }
  &-ft {
    padding: 8px;
    border-top: 1px solid #dddde2;
    display: flex;

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
