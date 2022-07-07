<template>
  <div class="UnitMainProducts">

    <template v-if="unit.slot !== 'pop'">

      <pt-tips />

      <pt-slot top-menu-id="POS_MAIN" name="main-scan" />

    </template>

    <div class="unit-main-products-cates">

      <div class="unit-main-products-cates-toggle">
        <button @click="onClickToggle">
          <template v-if="current === 0">
            <span class="primary">单品</span>
            <span class="secondary">&lt;套餐&gt;</span>
          </template>
          <template v-if="current === 1">
            <span class="primary">套餐</span>
            <span class="secondary">&lt;单品&gt;</span>
          </template>
        </button>
      </div>

      <div class="unit-main-products-cates-list">
        <template v-if="current === 0">
          <template v-for="cate in cates">
            <div class="unit-main-products-cates-item" :key="cate.cat_id">
              <button
                :class="{ 'active': selectedCate === cate.cat_id }"
                @click="onClickCate(cate)"
              >{{ cate.cat_name }}</button>
            </div>
          </template>
        </template>
        <template v-if="current === 1">
          <template v-for="suite in suites">
            <div class="unit-main-products-cates-item" :key="suite.op_id">
              <button
                :class="{ 'active': selectedSuite === suite.op_id }"
                @click="onClickSuite(suite)"
              >{{ suite.op_name }}</button>
            </div>
          </template>
        </template>
      </div>

      <div class="unit-main-products-cates-navs">
        <template v-if="current === 0">
          <btn
            title="上一页"
            secondary
            @click="catesCurrentPage = Math.max(1, catesCurrentPage - 1)"
            :disabled="catesCurrentPage === 1"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            secondary
            @click="catesCurrentPage = Math.min(catesTotalPages, catesCurrentPage + 1)"
            :disabled="catesTotalPages === 0 || catesCurrentPage === catesTotalPages"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </template>
        <template v-if="current === 1">
          <btn
            title="上一页"
            secondary
            @click="suitesCurrentPage = Math.max(1, suitesCurrentPage - 1)"
            :disabled="suitesCurrentPage === 1"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            secondary
            @click="suitesCurrentPage = Math.min(suitesTotalPages, suitesCurrentPage + 1)"
            :disabled="suitesTotalPages === 0 || suitesCurrentPage === suitesTotalPages"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </template>
      </div>

    </div>

    <div class="unit-main-products-items">

      <div class="unit-main-products-items-col">
        <template v-if="current === 0">
          <div class="unit-main-products-items-bd">
            <template v-for="item in items">
              <div class="unit-main-products-items-item" :key="item.item_id">
                <button
                  :class="{
                    'style-focus': item.item_id === focusItemId,
                    'style-primary': item.cat_flg === '1'
                  }"
                  @click="onClickItem(item)"
                >
                  <span class="name">{{ item.item_name }}</span>
                  <span class="price">{{ item.pos_price }}</span>
                </button>
              </div>
            </template>
          </div>
        </template>
        <template v-if="current === 1">
          <div class="unit-main-products-items-hd" v-if="selectedSuiteGroupId !== null">
            {{ suiteGroupInfos[selectedSuiteGroupId].name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ suiteGroupInfos[selectedSuiteGroupId].qty }}/{{ suiteGroupInfos[selectedSuiteGroupId].maxQty }}
          </div>
          <div class="unit-main-products-items-bd">
            <template v-for="item in suiteItems">
              <div class="unit-main-products-items-item" :key="item.item_id">
                <button
                  :class="{
                    'style-focus': item.item_id === focusItemId
                  }"
                  @click="onClickSuiteItem(item)"
                >
                  <span class="name">{{ item.item_name }}</span>
                  <span class="price">{{ item.pos_price }}</span>
                  <template v-if="item.item_id in selectedSuiteItems && selectedSuiteItems[item.item_id] > 0">
                    <span class="qty">{{ selectedSuiteItems[item.item_id] }}</span>
                  </template>
                </button>
              </div>
            </template>
          </div>
          <div class="unit-main-products-items-ft" v-if="modelSuiteItems !== null">
            <template v-if="hasSuitePrev">
              <btn
                :disabled="!isCanSuitePrev"
                @click="onClickSuitePrev"
                style="width: 10%;"
              >上一组</btn>
            </template>
            <template v-if="hasSuiteNext">
              <btn
                :disabled="!isCanSuiteNext"
                @click="onClickSuiteNext"
                style="width: 10%;"
              >下一组</btn>
            </template>
            <template v-if="hasDecrease">
              <btn
                primary
                :active="isDecreasing"
                @click="onClickSuiteDecrease"
                style="width: 5%;"
              >–</btn>
            </template>
            <template v-if="hasSuiteOk">
              <btn
                primary
                :disabled="!isCanSuiteOk"
                @click="onClickSuiteOk"
                style="width: 10%;"
              >确定</btn>
            </template>
          </div>
        </template>
      </div>

      <div class="unit-main-products-items-navs">
        <template v-if="current === 0">
          <template v-for="i in pagiPages">
            <btn
              :key="i"
              :class="{
                'selected': (i + itemsPagiOffset) === itemsCurrentPage
              }"
              :disabled="(i + itemsPagiOffset) > itemsTotalPages"
              @click="itemsCurrentPage = (i + itemsPagiOffset)"
            >{{ (i + itemsPagiOffset) }}</btn>
          </template>
          <btn
            title="上一页"
            secondary
            @click="itemsCurrentPage = Math.max(1, itemsCurrentPage - 1)"
            :disabled="itemsCurrentPage === 1"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            secondary
            @click="itemsCurrentPage = Math.min(itemsTotalPages, itemsCurrentPage + 1)"
            :disabled="itemsTotalPages === 0 || itemsCurrentPage === itemsTotalPages"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </template>
        <template v-if="current === 1">
          <template v-for="i in pagiPages">
            <btn
              :key="i"
              :class="{
                'selected': (i + suiteItemsPagiOffset) === suiteItemsCurrentPage
              }"
              :disabled="(i + suiteItemsPagiOffset) > suiteItemsTotalPages"
              @click="suiteItemsCurrentPage = (i + suiteItemsPagiOffset)"
            >{{ (i + suiteItemsPagiOffset) }}</btn>
          </template>
          <btn
            title="上一页"
            secondary
            @click="suiteItemsCurrentPage = Math.max(1, suiteItemsCurrentPage - 1)"
            :disabled="suiteItemsCurrentPage === 1"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            title="下一页"
            secondary
            @click="suiteItemsCurrentPage = Math.min(suiteItemsTotalPages, suiteItemsCurrentPage + 1)"
            :disabled="suiteItemsTotalPages === 0 || suiteItemsCurrentPage === suiteItemsTotalPages"
          >
            <pt-icon i="arrow-down" />
          </btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'
import autoRevertFocus from '@/mixins/auto-revert-focus'

export default {
  name: 'UnitMainProducts',
  mixins: [
    unitMixin,
    unitListenRefreshMixin,
    autoRevertFocus
  ],
  data () {
    return {
      modelCates: null,
      modelItems: null,
      modelSuites: null,
      modelSuiteItems: null,

      selectedSuiteGroupId: null,
      selectedSuiteItems: {},
      isDecreasing: false,
      focusItemId: null,

      /**
       * @var {Number} 当前选中的模式，0: 单品; 1: 套餐。
       */
      current: 0,

      /**
       * @var {Number} 商品分类的当前页码
       */
      catesCurrentPage: 1,

      /**
       * @var {Number} 商品的当前页码
       */
      itemsCurrentPage: 1,

      /**
       * @var {Number} 套餐分类的当前页码
       */
      suitesCurrentPage: 1,

      /**
       * @var {Number} 套餐商品的当前页码
       */
      suiteItemsCurrentPage: 1,

      selectedCate: null,
      selectedSuite: null
    }
  },
  computed: {
    hasCates () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '商品分类')
    },
    hasItems () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '分类商品列表')
    },
    hasSuites () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '自选套餐')
    },
    hasSuiteItems () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '自选套餐分组商品')
    },
    hasSuitePrev () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '上一组')
    },
    hasSuiteNext () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '下一组')
    },
    hasDecrease () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '减号按钮')
    },
    hasSuiteOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '添加自选套餐商品')
    },

    /**
     * @var {Number} 商品分类的每页数量
     */
    catesPerPage () {
      return 10
    },

    /**
     * @var {Number} 商品的每页数量
     */
    itemsPerPage () {
      return 30
    },

    /**
     * @var {Number} 套餐分类的每页数量
     */
    suitesPerPage () {
      return 10
    },

    /**
     * @var {Number} 套餐商品的每页数量
     */
    suiteItemsPerPage () {
      return 30
    },

    /**
     * @var {Number} 商品列表页码显示数量
     */
    pagiPages () {
      return 7
    },

    /**
     * @var {Array} 商品分类（当前页）
     */
    cates () {
      if (this.modelCates !== null && this.modelCates.category_list !== null) {
        return this.modelCates.category_list
          .slice(
            this.catesPerPage * (this.catesCurrentPage - 1),
            this.catesPerPage * this.catesCurrentPage
          )
      }

      return null
    },

    /**
     * @var {Array} 商品（当前页）
     */
    items () {
      if (this.modelItems !== null && this.modelItems.item_list !== null) {
        return this.modelItems.item_list
          .slice(
            this.itemsPerPage * (this.itemsCurrentPage - 1),
            this.itemsPerPage * this.itemsCurrentPage
          )
      }

      return null
    },

    /**
     * @var {Array} 套餐分类（当前页）
     */
    suites () {
      if (this.modelSuites !== null && this.modelSuites.prom04_list !== null) {
        return this.modelSuites.prom04_list
          .slice(
            this.suitesPerPage * (this.suitesCurrentPage - 1),
            this.suitesPerPage * this.suitesCurrentPage
          )
      }

      return null
    },

    /**
     * @var {Array} 套餐商品（当前页）
     */
    suiteItems () {
      if (this.modelSuiteItems !== null && this.modelSuiteItems.prom04_item_list !== null) {
        return this.modelSuiteItems.prom04_item_list
          .filter(el => el.group_id === this.selectedSuiteGroupId)
          .slice(
            this.suiteItemsPerPage * (this.suiteItemsCurrentPage - 1),
            this.suiteItemsPerPage * this.suiteItemsCurrentPage
          )
      }

      return null
    },

    /**
     * @var {Number} 商品分类的总页数
     */
    catesTotalPages () {
      if (this.modelCates === null || this.modelCates.category_list === null) return 1

      return Math.ceil(this.modelCates.category_list.length / this.catesPerPage)
    },

    /**
     * @var {Number} 商品的总页数
     */
    itemsTotalPages () {
      if (this.modelItems === null || this.modelItems.item_list === null) return 1

      return Math.ceil(this.modelItems.item_list.length / this.itemsPerPage)
    },

    /**
     * @var {Number} 套餐分类的总页数
     */
    suitesTotalPages () {
      if (this.modelSuites === null || this.modelSuites.prom04_list === null) return 1

      return Math.ceil(this.modelSuites.prom04_list.length / this.suitesPerPage)
    },

    /**
     * @var {Number} 套餐商品的总页数
     */
    suiteItemsTotalPages () {
      if (this.modelSuiteItems === null || this.modelSuiteItems.prom04_item_list === null) return 1

      return Math.ceil(this.modelSuiteItems.prom04_item_list.length / this.suiteItemsPerPage)
    },

    /**
     * @var {Number} 显示商品时页码显示偏移量
     */
    itemsPagiOffset () {
      return Math.floor((this.itemsCurrentPage - 1) / this.pagiPages) * this.pagiPages
    },

    /**
     * @var {Number} 显示套餐商品时页码显示偏移量
     */
    suiteItemsPagiOffset () {
      return Math.floor((this.suiteItemsCurrentPage - 1) / this.pagiPages) * this.pagiPages
    },

    /**
     * @var {Array} 套餐商品分组 ID 列表
     */
    suiteGroupIds () {
      if (this.modelSuiteItems !== null && this.modelSuiteItems.prom04_item_list !== null) {
        return this.modelSuiteItems.prom04_item_list
          .reduce((sum, el) => {
            if (!sum.includes(el.group_id)) {
              sum.push(el.group_id)
            }
            return sum
          }, [])
      }

      return []
    },

    /**
     * @var {Object<String, Object<String, Any>>} 套餐商品分组信息字典，`group_id` 为键名，键值为「名称、已选数量、数量上限」组成的字典
     */
    suiteGroupInfos () {
      if (this.modelSuiteItems !== null && this.modelSuiteItems.prom04_item_list !== null) {
        return this.modelSuiteItems.prom04_item_list
          .reduce((ret, item) => {
            if (!(item.group_id in ret)) {
              ret[item.group_id] = {
                name: item.group_name,
                qty: Object.keys(this.selectedSuiteItems).reduce((sum, itemId) => {
                  const groupId = this.modelSuiteItems.prom04_item_list.find(el => el.item_id === itemId).group_id
                  if (item.group_id === groupId) {
                    sum += this.selectedSuiteItems[itemId]
                  }
                  return sum
                }, 0),
                maxQty: parseInt(item.qty_set)
              }
            }
            return ret
          }, {})
      }

      return {}
    },

    /**
     * @var {Boolean} “上一组”按钮是否可用
     */
    isCanSuitePrev () {
      if (this.suiteGroupIds.length > 0) {
        const index = this.suiteGroupIds.indexOf(this.selectedSuiteGroupId)
        if (index !== -1 && index > 0) {
          return true
        }
      }
      return false
    },

    /**
     * @var {Boolean} “下一组”按钮是否可用
     */
    isCanSuiteNext () {
      if (this.suiteGroupIds.length > 0) {
        const index = this.suiteGroupIds.indexOf(this.selectedSuiteGroupId)
        if (index !== -1 && index < (this.suiteGroupIds.length - 1)) {
          return true
        }
      }
      return false
    },

    /**
     * @var {Boolean} “确定”按钮是否可用
     */
    isCanSuiteOk () {
      return Object.values(this.suiteGroupInfos).every(el => el.qty === el.maxQty)
    }
  },
  mounted () {
    Promise.all([
      this.loadCates(),
      this.loadSuites()
    ])
  },
  methods: {
    loadCates () {
      this.$loading.show()
      return this.fetchCates()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadItems () {
      this.$loading.show()
      return this.fetchItems()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadSuites () {
      this.$loading.show()
      return this.fetchSuites()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    loadSuiteItems () {
      this.$loading.show()
      return this.fetchSuiteItems()
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    fetchCates () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品分类')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelCates = data
        })
        .then(() => {
          this.catesCurrentPage = 1
          this.selectedCate = null
        })
    },

    fetchItems () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '分类商品列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelItems = data
        })
        .then(() => {
          this.itemsCurrentPage = 1
        })
    },

    fetchSuites () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '自选套餐')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelSuites = data
        })
        .then(() => {
          this.suitesCurrentPage = 1
          this.selectedSuite = null
        })
    },

    fetchSuiteItems () {
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '自选套餐分组商品')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.modelSuiteItems = data
        })
        .then(() => {
          this.suiteItemsCurrentPage = 1
        })
        .then(() => {
          // 清空套餐商品选择状态
          if (this.suiteGroupIds.length > 0) {
            this.selectedSuiteGroupId = this.suiteGroupIds[0]
          }
          this.selectedSuiteItems = {}
          this.focusItemId = null
          this.isDecreasing = false
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '商品分类':
          return this.loadCates()
        case '分类商品列表':
          return this.loadItems()
        case '自选套餐':
          return this.loadSuites()
        case '自选套餐分组商品':
          return this.loadSuiteItems()
      }
    },

    /**
     * 回调：单品套餐切换按钮被点击
     */
    onClickToggle () {
      switch (this.current) {
        case 0:
          this.current = 1
          break
        case 1:
          this.current = 0
          break
        default:
          this.current = 0
      }

      this.catesCurrentPage = 1
      this.suitesCurrentPage = 1
      this.focusItemId = null
      this.isDecreasing = false
    },

    /**
     * 回调：商品分类项被点击
     */
    onClickCate (cate) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(cate.cat_id.toString(), 'posMain.subArea.selectedCat.recordId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '商品分类')
        })
        .then(() => {
          this.selectedCate = cate.cat_id
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：商品列表项被点击
     */
    onClickItem (item) {
      this.focusItemId = item.item_id

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.item_id.toString(), 'posMain.subArea.selectedItem.recordId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '分类商品列表')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：套餐分类项被点击
     */
    onClickSuite (suite) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(suite.op_id.toString(), 'posMain.subArea.selected.OpID'),
        this.$ui.setData((1).toString(), 'posMain.subArea.selected.GroupID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '自选套餐')
        })
        .then(() => {
          this.selectedSuite = suite.op_id
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：套餐商品列表项被点击
     */
    onClickSuiteItem (item) {
      this.focusItemId = item.item_id

      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '自选套餐分组商品')
        .then(() => {
          if (!this.isDecreasing) {
            // 增加
            if (this.suiteGroupInfos[this.selectedSuiteGroupId].qty >= this.suiteGroupInfos[this.selectedSuiteGroupId].maxQty) return

            if (item.item_id in this.selectedSuiteItems) {
              this.$set(this.selectedSuiteItems, item.item_id, this.selectedSuiteItems[item.item_id] + 1)
            } else {
              this.$set(this.selectedSuiteItems, item.item_id, 1)
            }
          } else {
            // 减少
            if (this.focusItemId in this.selectedSuiteItems) {
              if (this.selectedSuiteItems[this.focusItemId] > 1) {
                this.$set(this.selectedSuiteItems, this.focusItemId, this.selectedSuiteItems[this.focusItemId] - 1)
              } else {
                this.$set(this.selectedSuiteItems, this.focusItemId, 0)
              }
            }
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：上一组按钮被点击
     */
    onClickSuitePrev () {
      const index = this.suiteGroupIds.indexOf(this.selectedSuiteGroupId)
      this.selectedSuiteGroupId = this.suiteGroupIds[index - 1]
      this.focusItemId = null
      this.isDecreasing = false
    },

    /**
     * 回调：下一组按钮被点击
     */
    onClickSuiteNext () {
      const index = this.suiteGroupIds.indexOf(this.selectedSuiteGroupId)
      this.selectedSuiteGroupId = this.suiteGroupIds[index + 1]
      this.focusItemId = null
      this.isDecreasing = false
    },

    /**
     * 回调：减号按钮被点击
     */
    onClickSuiteDecrease () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '减号按钮')
        .then(() => {
          this.isDecreasing = !this.isDecreasing
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：确定按钮被点击
     */
    onClickSuiteOk () {
      // 组装入参
      const itemInfo = Object.keys(this.selectedSuiteItems).reduce((ret, itemId) => {
        ret.push({
          group_id: this.modelSuiteItems.prom04_item_list.find(el => el.item_id === itemId).group_id,
          item_id: itemId,
          item_qty: this.selectedSuiteItems[itemId]
        })
        return ret
      }, [])

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(itemInfo), 'posMain.subArea.itemInfo'),
        this.$ui.setData(this.modelSuiteItems.prom_id.toString(), 'posMain.subArea.promID')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '添加自选套餐商品')
        })
        .then(() => {
          // 清空套餐商品选择状态
          this.selectedSuiteGroupId = null
          this.selectedSuiteItems = {}
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
.UnitMainProducts {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.unit-main-products-cates {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 5px;
  display: flex;
  button {
    display: block;
    margin-top: 1px;
    margin-bottom: 1px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    background-color: var(--pt-color-secondary);
    border: 1px solid #000000;
    border-radius: 2px;
    font-size: 14px;
    line-height: 16px;
    color: var(--pt-color-secondary-content);
    letter-spacing: 0.01px;
    text-align: center;
    @include multiple-text-ellipsis(2);
    &.disabled {
      opacity: .2;
    }
    &:hover {
      opacity: .85;
    }
    &:active {
      opacity: 1;
    }
    &.active {
      border-color: var(--pt-color-selection);
      background-color: var(--pt-color-selection);
      color: var(--pt-color-primary-content);
    }
  }
}
.unit-main-products-cates-toggle {
  flex-grow: 0;
  flex-shrink: 0;
  width: 70px;
  padding-left: 1px;
  padding-right: 1px;
  button {
    height: 82px;
    .primary {
      display: block;
      font-size: 20px;
      line-height: 28px;
      color: var(--pt-color-secondary-content);
      font-weight: bold;
      letter-spacing: 0.02px;
    }
    .secondary {
      display: block;
      font-size: 14px;
      line-height: 20px;
      color: var(--pt-color-secondary-content);
      font-weight: bold;
      letter-spacing: 0.02px;
    }
  }
}
.unit-main-products-cates-list {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  flex-wrap: wrap;
}
.unit-main-products-cates-item {
  flex-grow: 0;
  flex-shrink: 0;
  width: 20%;
  box-sizing: border-box;
  padding-left: 1px;
  padding-right: 1px;
}
.unit-main-products-cates-navs {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 1px;
  padding-right: 1px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .Btn {
    flex-grow: 1;
    flex-shrink: 0;
    width: 58px;
    height: 40px;
  }
}
.unit-main-products-items {
  flex-grow: 1;
  flex-shrink: 0;
  height: 1px;
  padding: 5px;
  display: flex;
  position: relative;
  &::before {
    content: '';
    display: block;
    height: 1px;
    background-color: #dedede;
    position: absolute;
    top: 0;
    left: 6px;
    right: 6px;
  }
}
.unit-main-products-items-hd {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 10px 12px;
  margin-bottom: 2px;
  background-color: var(--pt-color-primary);
  border-radius: 2px;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
}
.unit-main-products-items-bd {
  flex-grow: 1;
  flex-shrink: 1;
  height: 1px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  button {
    display: block;
    width: 100%;
    height: 100%;
    padding: 4px;
    box-sizing: border-box;
    background-color: var(--pt-color-btn-group);
    border: 1px solid #000000;
    border-radius: 2px;
    font-size: 12px;
    line-height: 15px;
    color: #000000;
    letter-spacing: 0.01px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    position: relative;
    &.style-primary {
      background-color: var(--pt-color-secondary);
      border: 1px solid #000000;
      color: var(--pt-color-secondary-content);
      .name {
        max-height: (22px * 3);
        font-size: 14px;
        line-height: 22px;
        text-align: center;
      }
      .price {
        display: none;
      }
    }
    &.disabled {
      opacity: .2;
    }
    &:hover {
      opacity: .85;
    }
    &:active {
      opacity: 1;
    }
    &.style-focus {
      border-color: var(--pt-color-selection);
      background-color: var(--pt-color-selection) !important;
      color: var(--pt-color-primary-content);
    }
    .name {
      flex-grow: 1;
      flex-shrink: 1;
      height: 1px;
      max-height: (15px * 3);
      @include multiple-text-ellipsis(3);
    }
    .qty {
      display: block;
      width: 18px;
      height: 18px;
      background-color: var(--pt-color-selection);
      border-radius: 50%;
      font-size: 13px;
      line-height: 18px;
      color: #ffffff;
      text-align: center;
      @include single-text-ellipsis;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 1;
    }
    .price {
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 13px;
      line-height: 16px;
    }
  }
  .unit-main-products-items-item {
    &:nth-child(12n-5) button,
    &:nth-child(12n-4) button,
    &:nth-child(12n-3) button,
    &:nth-child(12n-2) button,
    &:nth-child(12n-1) button,
    &:nth-child(12n-0) button {
      background-color: var(--pt-color-btn-group-alt);
    }
  }
}
.unit-main-products-items-ft {
  flex-grow: 0;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  .Btn {
    flex-grow: 1;
    flex-shrink: 1;
    width: 1px;
    height: initial;
    padding: 9px 0;
    font-size: 20px;
    line-height: 28px;
    display: block;
    flex-direction: initial;
    & + .Btn {
      margin-left: 4px;
    }
    &.btn-active {
      background-color: var(--pt-color-danger);
    }
  }
}
.unit-main-products-items-col {
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  display: flex;
  flex-direction: column;
}
.unit-main-products-items-item {
  flex-grow: 0;
  flex-shrink: 0;
  width: 16.6667%;
  min-height: 70px;
  min-height: 20%;
  box-sizing: border-box;
  padding: 1px;
}
.unit-main-products-items-navs {
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 1px;
  padding-right: 1px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .Btn {
    flex-grow: 1;
    flex-shrink: 0;
    width: 58px;
    height: 30px;
    font-size: 16px;
    letter-spacing: 0.02px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & + .Btn {
      margin-top: 2px;
    }
    &.selected {
      background-color: var(--pt-color-selection);
      color: var(--pt-color-primary-content);
    }
  }
}
</style>
