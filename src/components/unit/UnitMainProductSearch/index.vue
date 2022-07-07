<template>
  <div class="UnitMainProductSearch">

    <div class="unit-main-prdsrh-bd">

      <div class="unit-main-prdsrh-search">
        <label>商品检索</label>
        <form-input
          ref="input"
          v-model="keywords"
          type="text"
          pattern="\d*"
          placeholder="输入商品编号"
          @keypress.enter="onEnter"
        />
        <btn primary @click="onEnter">检索</btn>
      </div>

      <div class="unit-main-prdsrh-data">
        <table-wrapper>
          <thead>
            <template v-if="header !== null">
              <tr>
                <th
                  v-for="col in header"
                  :key="col.key"
                  :style="{
                    'width': (col.width > 0 ? `${$flexible.trans(col.width)}rem` : 'initial')
                  }"
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
                :class="{ 'active': selected === item.item_id }"
                @click="onClickItem(item)"
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

      <div class="unit-main-prdsrh-navi">
        <btn
          title="上一页"
          secondary
          @click="onClickPrev"
          :disabled="currentPage === 1"
        >
          <pt-icon i="arrow-up" />
        </btn>
        <btn
          title="下一页"
          secondary
          @click="onClickNext"
          :disabled="totalPages === 0 || currentPage === totalPages"
        >
          <pt-icon i="arrow-down" />
        </btn>
      </div>

    </div>

    <div class="unit-main-prdsrh-ft">
      <btn secondary @click="onClickClose">返回</btn>
      <btn primary @click="onClickOk">确定</btn>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainProductSearch',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      currentPage: 1,
      perPage: 10,

      keywords: '',
      selected: null
    }
  },
  computed: {
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '添加')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasSearch () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '检索')
    },
    hasKeywords () {
      return this.$ui.hasElementByUnit(this.unit, 'input', '商品检索框')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品列表')
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
      if (this.model !== null && this.model.item_info !== null) {
        return this.model.item_info.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.model !== null && this.model.item_info !== null) {
        return Math.max(1, Math.ceil(this.model.item_info.length / this.perPage))
      }

      return 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
        .then(() => {
          // 列表回到首页
          this.currentPage = 1

          // 列表自动选中首项
          if (this.model !== null && this.model.item_info !== null && this.model.item_info.length > 0) {
            this.onClickItem(this.model.item_info[0])
          }
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品列表':
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
     * 回调：搜索框被回车
     */
    onEnter () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.keywords.toString(), 'posMain.iteamSearch.itemID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '检索')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品列表')
        .then(() => {
          this.selected = item.item_id
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“添加”按钮被点击
     */
    onClickOk () {
      if (typeof this.selected !== 'string' || this.selected.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.selected.toString(), 'posMain.posScan.itemInfo.itemId'),
        this.$ui.setData(this.selected.toString(), 'posMain.Return.search.ItemID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '添加')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
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
.UnitMainProductSearch {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.unit-main-prdsrh-search {
  display: flex;
  align-items: center;
  label {
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 10px;
    display: block;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
  .FormInput {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    border-color: #707070;
  }
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 6px 23px;
    margin-left: 8px;
  }
}
.unit-main-prdsrh-navi {
  margin-top: 8px;
  display: flex;
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    padding: 10px 15px;
    font-size: 20px;
    line-height: 28px;
    & + .Btn {
      margin-left: 8px;
    }
  }
}
.unit-main-prdsrh-data {
  margin-top: 8px;
  td, th {
    @include single-text-ellipsis;
  }
}
.unit-main-prdsrh-bd {
  padding: 8px;
}
.unit-main-prdsrh-ft {
  margin-top: 1px; // hack
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  .Btn {
    width: 120px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    & + .Btn {
      margin-left: 20px;
    }
  }
}
</style>
