<template>
  <div class="UnitMainRetailStats">

    <div class="unit-main-rtst-wrap">

      <div class="unit-main-rtst-data">

        <div class="unit-main-rtst-data-hd">
          <div class="unit-main-rtst-data-action">
            <template v-if="hasViewAll">
              <btn :primary="model !== null && model.type === $const.RETAIL_STATS.TYPE.ALL" @click="onClickViewAll">全部</btn>
            </template>
            <template v-if="hasViewByType">
              <btn :primary="model !== null && (model.type === $const.RETAIL_STATS.TYPE.SALES || model.type === $const.RETAIL_STATS.TYPE.RETURN)" @click="onClickViewByType">
                <template v-if="model !== null">
                  <template v-if="model.dimension !== $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY && model.dimension !== $const.RETAIL_STATS.DIMENSION.PRODUCT && model.dimension !== $const.RETAIL_STATS.DIMENSION.TIME_SPAN">
                    按类型
                  </template>
                  <template v-else>
                    <template v-if="model.type === $const.RETAIL_STATS.TYPE.ALL">按类型</template>
                    <template v-if="model.type === $const.RETAIL_STATS.TYPE.SALES">按类型：销售</template>
                    <template v-if="model.type === $const.RETAIL_STATS.TYPE.RETURN">按类型：退货</template>
                  </template>
                </template>
                <template v-else>
                  按类型
                </template>
              </btn>
            </template>
          </div>
          <div class="unit-main-rtst-data-title">
            <template v-if="model !== null">{{ model.class_title }}</template>
          </div>
          <div class="unit-main-rtst-data-action">
            <template v-if="model === null || (model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY || model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT || model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN)">
              <template v-if="hasViewLess">
                <btn :primary="model !== null && model.level === 1" @click="onClickViewLess">上一级</btn>
              </template>
              <template v-if="hasViewMore">
                <btn :primary="model !== null && model.level !== 1" @click="onClickViewMore">下一级</btn>
              </template>
            </template>
          </div>
        </div>

        <div class="unit-main-rtst-data-bd">
          <table-wrapper v-if="model !== null && model.info !== null">
            <thead>
              <tr>
                <th style="width: 5.5em;" @click="onClickListHead('sales_type')">
                  <template v-if="orderBy === 'sales_type'">
                    <template v-if="order === 'asc'">&utrif;</template>
                    <template v-else>&dtrif;</template>
                  </template>
                  <template>销售类型</template>
                </th>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <th>
                    <template>{{ model.column_name2 }}</template>
                  </th>
                </template>
                <template v-if="!(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && model.type === $const.RETAIL_STATS.TYPE.SALES) && !(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && !model.column_name1)">
                  <th @click="onClickListHead('cat_name')">
                    <template v-if="orderBy === 'cat_name'">
                      <template v-if="order === 'asc'">&utrif;</template>
                      <template v-else>&dtrif;</template>
                    </template>
                    <template>{{ model.column_name1 }}</template>
                  </th>
                </template>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT || model.dimension === $const.RETAIL_STATS.DIMENSION.STAFF || model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN">
                  <th style="width: 8.25em;" @click="onClickListHead('cat_id')">
                    <template v-if="orderBy === 'cat_id'">
                      <template v-if="order === 'asc'">&utrif;</template>
                      <template v-else>&dtrif;</template>
                    </template>
                    <template>{{ model.column_name2 }}</template>
                  </th>
                </template>
                <th style="width: 4em;" @click="onClickListHead('qty')">
                  <template v-if="orderBy === 'qty'">
                    <template v-if="order === 'asc'">&utrif;</template>
                    <template v-else>&dtrif;</template>
                  </template>
                  <template>数量</template>
                </th>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <th style="width: 6.25em;">
                    <template>金额(去税)</template>
                  </th>
                </template>
                <th style="width: 6.25em;" @click="onClickListHead('amt')">
                  <template v-if="orderBy === 'amt'">
                    <template v-if="order === 'asc'">&utrif;</template>
                    <template v-else>&dtrif;</template>
                  </template>
                  <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">金额(含税)</template>
                  <template v-if="!(model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY)">金额</template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item.line_no"
                :class="{ 'active': selected === item.line_no }"
                @click="onClickListRow(item)"
                @dblclick="onDblclickListRow(item)"
              >
                <td :class="[{'unit-main-rtst-rowspan-none' : item.rowspan === 0}, {'unit-main-rtst-rowspan-active' : selected === item.line_no}]" :rowspan = "item.rowspan">{{ item.sales_type }}</td>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td>{{ item.cat_id }}</td>
                </template>
                <template v-if="!(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && model.type === $const.RETAIL_STATS.TYPE.SALES) && !(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && !model.column_name1)">
                  <td style="text-align: left;">{{ item.cat_name }}</td>
                </template>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT || model.dimension === $const.RETAIL_STATS.DIMENSION.STAFF || model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN">
                  <td :style="{'text-align': !(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && !model.column_name1) ? 'left' : 'center'}">{{ item.cat_id }}</td>
                </template>
                <td style="text-align: right;">{{ item.qty }}</td>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td>{{ item.notax_amt }}</td>
                </template>
                <td style="text-align: right;">{{ item.amt }}</td>
              </tr>
              <tr v-for="seq in (perPage - items.length)" :key="`placeholder-${seq}`">
                <td>&nbsp;</td>
                <template v-if="!(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && model.type === $const.RETAIL_STATS.TYPE.SALES) && !(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && !model.column_name1)">
                  <td>&nbsp;</td>
                </template>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT || model.dimension === $const.RETAIL_STATS.DIMENSION.STAFF || model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN || model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td>&nbsp;</td>
                </template>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td>&nbsp;</td>
                </template>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style="text-align: left;">总计</td>
                <template v-if="!(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && selectedType === $const.RETAIL_STATS.TYPE.SALES) && !(model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN && !model.column_name1)">
                  <td>&nbsp;</td>
                </template>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT || model.dimension === $const.RETAIL_STATS.DIMENSION.STAFF || model.dimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN || model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td>&nbsp;</td>
                </template>
                <td style="text-align: right;">{{ model.total_qty }}</td>
                <template v-if="model.dimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY">
                  <td style="text-align: right;">{{ model.total_notax_amt }}</td>
                </template>
                <td style="text-align: right;">{{ model.total_amt }}</td>
              </tr>
            </tfoot>
          </table-wrapper>
        </div>

        <div class="unit-main-rtst-data-ft">
          <template v-if="hasClose">
            <btn secondary @click="onClickClose" style="width: 20%;">返回</btn>
          </template>
          <btn
            style="width: 30%;"
            title="上一页"
            secondary
            @click="onClickPrev"
            :disabled="currentPage === 1"
          >
            <pt-icon i="arrow-up" />
          </btn>
          <btn
            style="width: 30%;"
            title="下一页"
            secondary
            @click="onClickNext"
            :disabled="totalPages === 0 || currentPage === totalPages"
          >
            <pt-icon i="arrow-down" />
          </btn>
          <template v-if="hasPrint">
            <btn primary @click="onClickPrint" style="width: 25%;">打印</btn>
          </template>
          <template>
            <btn primary @click="onClickToggleRight" style="width: 25%;">
              <template v-if="isRightHide">➡</template>
              <template v-else>⬅</template>
            </btn>
          </template>
        </div>

      </div>

      <div class="unit-main-rtst-ctrl" v-if="isRightHide">

        <div class="unit-main-rtst-ctrl-bd">

          <div class="unit-main-rtst-ctrl-part">
            <div class="unit-main-rtst-ctrl-title">统计维度</div>
            <div class="unit-main-rtst-ctrl-items">
              <btn
                :primary="selectedDimension === $const.RETAIL_STATS.DIMENSION.PAYMENT_METHOD"
                @click="selectedDimension = $const.RETAIL_STATS.DIMENSION.PAYMENT_METHOD"
              >支付方式</btn>
              <btn
                :primary="selectedDimension === $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY"
                @click="selectedDimension = $const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY"
              >商品分类</btn>
              <btn
                :primary="selectedDimension === $const.RETAIL_STATS.DIMENSION.PRODUCT"
                @click="selectedDimension = $const.RETAIL_STATS.DIMENSION.PRODUCT"
              >商品</btn>
              <btn
                :primary="selectedDimension === $const.RETAIL_STATS.DIMENSION.STAFF"
                @click="selectedDimension = $const.RETAIL_STATS.DIMENSION.STAFF"
              >收银员</btn>
              <btn
                :primary="selectedDimension === $const.RETAIL_STATS.DIMENSION.TIME_SPAN"
                @click="selectedDimension = $const.RETAIL_STATS.DIMENSION.TIME_SPAN"
              >时段</btn>
            </div>
          </div>

          <div class="unit-main-rtst-ctrl-part">
            <div class="unit-main-rtst-ctrl-title">统计周期</div>
            <div class="unit-main-rtst-ctrl-form">
              <div class="unit-main-rtst-ctrl-form-group">
                <span>从</span>
                <form-input ref="inputDateFromY" v-model="dateFromY" @input="onInputDateFromY" />
                <span>年</span>
                <form-input ref="inputDateFromM" v-model="dateFromM" @input="onInputDateFromM" />
                <span>月</span>
                <form-input ref="inputDateFromD" v-model="dateFromD" @input="onInputDateFromD" />
                <span>日</span>
              </div>
              <div class="unit-main-rtst-ctrl-form-group">
                <span>到</span>
                <form-input ref="inputDateToY" v-model="dateToY" @input="onInputDateToY" />
                <span>年</span>
                <form-input ref="inputDateToM" v-model="dateToM" @input="onInputDateToM" />
                <span>月</span>
                <form-input ref="inputDateToD" v-model="dateToD" @input="onInputDateToD" />
                <span>日</span>
              </div>
            </div>
            <div class="unit-main-rtst-ctrl-items">
              <btn
                :primary="isSelectedDateThisDay"
                @click="onClickDateThisDay"
              >今天</btn>
              <btn
                :primary="isSelectedDateLastDay"
                @click="onClickDateLastDay"
              >昨天</btn>
              <btn
                :primary="isSelectedDateThisWeek"
                @click="onClickDateThisWeek"
              >本周</btn>
              <btn
                :primary="isSelectedDateLastWeek"
                @click="onClickDateLastWeek"
              >上周</btn>
              <btn
                :primary="isSelectedDateThisMonth"
                @click="onClickDateThisMonth"
              >本月</btn>
              <btn
                :primary="isSelectedDateLastMonth"
                @click="onClickDateLastMonth"
              >上月</btn>
              <btn
                :primary="isSelectedDateThisQuarter"
                @click="onClickDateThisQuarter"
              >本季度</btn>
              <btn
                :primary="isSelectedDateLastQuarter"
                @click="onClickDateLastQuarter"
              >上季度</btn>
              <keyboard-holder />
            </div>
          </div>

        </div>

        <div class="unit-main-rtst-ctrl-ft">
          <template v-if="hasOk">
            <btn secondary title="隐藏键盘" @click="onClickHideKbd">
              <pt-icon i="kbd-hide" />
            </btn>
            <btn primary @click="onClickOk">确认</btn>
          </template>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import moment from 'moment'

import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainRetailStats',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  props: {
    autoTriggerFirstItem: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      model: null,

      currentPage: 1,
      perPage: 17,

      orderBy: null,
      order: 'asc',

      selected: null,
      selectedType: this.$const.RETAIL_STATS.TYPE.ALL,
      selectedLevel: 1,
      selectedDimension: this.$const.RETAIL_STATS.DIMENSION.PAYMENT_METHOD,
      isRightHide: true,

      dateFromY: moment().format('YYYY'),
      dateFromM: moment().format('MM'),
      dateFromD: moment().format('DD'),
      dateToY: moment().format('YYYY'),
      dateToM: moment().format('MM'),
      dateToD: moment().format('DD'),

      datePreset: {
        thisDay: null,
        lastDay: null,
        thisWeek: null,
        lastWeek: null,
        thisMonth: null,
        lastMonth: null,
        thisQuarter: null,
        lastQuarter: null
      },
      spanArr: []
    }
  },
  computed: {
    hasViewAll () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '全部按钮')
    },
    hasViewByType () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '按类型按钮')
    },
    hasViewLess () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '汇总按钮')
    },
    hasViewMore () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '明细按钮')
    },
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回按钮')
    },
    hasPrint () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '打印按钮')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '确认按钮')
    },
    hasList () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '零售统计数据')
    },

    items () {
      if (this.model !== null && this.model.info !== null) {
        // 从 model 克隆列表数据数组
        const list = this.model.info.filter(() => true)
        // 按 orderBy 和 order 进行排序
        list.sort((e1, e2) => {
          let cmp
          switch (this.orderBy) {
            case null:
              cmp = 0
              break
            case 'sales_type':
            case 'cat_name':
            case 'cat_id':
              if (e1[this.orderBy] === null) {
                cmp = -1
                break
              }
              if (e2[this.orderBy] === null) {
                cmp = 1
                break
              }
              cmp = e1[this.orderBy].toString().localeCompare(e2[this.orderBy].toString())
              break
            case 'qty':
            case 'amt':
              if (e1[this.orderBy] === null) {
                cmp = -1
                break
              }
              if (e2[this.orderBy] === null) {
                cmp = 1
                break
              }
              cmp = (function (e1, e2) {
                if (parseFloat(e1[this.orderBy]) > parseFloat(e2[this.orderBy])) return 1
                if (parseFloat(e1[this.orderBy]) < parseFloat(e2[this.orderBy])) return -1
                return 0
              }.apply(this, [e1, e2]))
              break
          }
          return cmp === 0 ? 0 : this.order === 'asc' ? cmp : cmp === 1 ? -1 : 1
        })
        // 分页
        this.combineCell(list.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage))
        return list.slice(this.perPage * (this.currentPage - 1), this.perPage * this.currentPage)
      }

      return null
    },
    totalPages () {
      if (this.model !== null && this.model.info !== null) {
        return Math.max(1, Math.ceil(this.model.info.length / this.perPage))
      }

      return 0
    },

    levelMax () {
      if (this.model !== null && this.model.dimension === this.$const.RETAIL_STATS.DIMENSION.PRODUCT) {
        return 3
      }

      return 6
    },

    dateFrom () {
      if (this.dateFromY && this.dateFromM && this.dateFromD) {
        return `${this.dateFromY}-${this.dateFromM}-${this.dateFromD}`
      }
      return ''
    },
    dateTo () {
      if (this.dateToY && this.dateToM && this.dateToD) {
        return `${this.dateToY}-${this.dateToM}-${this.dateToD}`
      }
      return ''
    },

    isSelectedDateThisDay () {
      return this.dateFromY === this.datePreset.thisDay[0] &&
        this.dateFromM === this.datePreset.thisDay[1] &&
        this.dateFromD === this.datePreset.thisDay[2] &&
        this.dateToY === this.datePreset.thisDay[3] &&
        this.dateToM === this.datePreset.thisDay[4] &&
        this.dateToD === this.datePreset.thisDay[5]
    },
    isSelectedDateLastDay () {
      return this.dateFromY === this.datePreset.lastDay[0] &&
        this.dateFromM === this.datePreset.lastDay[1] &&
        this.dateFromD === this.datePreset.lastDay[2] &&
        this.dateToY === this.datePreset.lastDay[3] &&
        this.dateToM === this.datePreset.lastDay[4] &&
        this.dateToD === this.datePreset.lastDay[5]
    },
    isSelectedDateThisWeek () {
      return !this.isSelectedDateThisDay &&
        this.dateFromY === this.datePreset.thisWeek[0] &&
        this.dateFromM === this.datePreset.thisWeek[1] &&
        this.dateFromD === this.datePreset.thisWeek[2] &&
        this.dateToY === this.datePreset.thisWeek[3] &&
        this.dateToM === this.datePreset.thisWeek[4] &&
        this.dateToD === this.datePreset.thisWeek[5]
    },
    isSelectedDateLastWeek () {
      return this.dateFromY === this.datePreset.lastWeek[0] &&
        this.dateFromM === this.datePreset.lastWeek[1] &&
        this.dateFromD === this.datePreset.lastWeek[2] &&
        this.dateToY === this.datePreset.lastWeek[3] &&
        this.dateToM === this.datePreset.lastWeek[4] &&
        this.dateToD === this.datePreset.lastWeek[5]
    },
    isSelectedDateThisMonth () {
      return !this.isSelectedDateThisDay &&
        !this.isSelectedDateThisWeek &&
        this.dateFromY === this.datePreset.thisMonth[0] &&
        this.dateFromM === this.datePreset.thisMonth[1] &&
        this.dateFromD === this.datePreset.thisMonth[2] &&
        this.dateToY === this.datePreset.thisMonth[3] &&
        this.dateToM === this.datePreset.thisMonth[4] &&
        this.dateToD === this.datePreset.thisMonth[5]
    },
    isSelectedDateLastMonth () {
      return this.dateFromY === this.datePreset.lastMonth[0] &&
        this.dateFromM === this.datePreset.lastMonth[1] &&
        this.dateFromD === this.datePreset.lastMonth[2] &&
        this.dateToY === this.datePreset.lastMonth[3] &&
        this.dateToM === this.datePreset.lastMonth[4] &&
        this.dateToD === this.datePreset.lastMonth[5]
    },
    isSelectedDateThisQuarter () {
      return !this.isSelectedDateThisDay &&
        !this.isSelectedDateThisWeek &&
        !this.isSelectedDateThisMonth &&
        this.dateFromY === this.datePreset.thisQuarter[0] &&
        this.dateFromM === this.datePreset.thisQuarter[1] &&
        this.dateFromD === this.datePreset.thisQuarter[2] &&
        this.dateToY === this.datePreset.thisQuarter[3] &&
        this.dateToM === this.datePreset.thisQuarter[4] &&
        this.dateToD === this.datePreset.thisQuarter[5]
    },
    isSelectedDateLastQuarter () {
      return this.dateFromY === this.datePreset.lastQuarter[0] &&
        this.dateFromM === this.datePreset.lastQuarter[1] &&
        this.dateFromD === this.datePreset.lastQuarter[2] &&
        this.dateToY === this.datePreset.lastQuarter[3] &&
        this.dateToM === this.datePreset.lastQuarter[4] &&
        this.dateToD === this.datePreset.lastQuarter[5]
    }
  },
  created () {
    this.setComputedData()
  },
  mounted () {
    this.doAuto()
  },
  beforeDestroy () {
    this.$kbd.hide()
  },
  methods: {
    setComputedData () {
      this.datePreset.thisDay = this._getPresetDateThisDay()
      this.datePreset.lastDay = this._getPresetDateLastDay()
      this.datePreset.thisWeek = this._getPresetDateThisWeek()
      this.datePreset.lastWeek = this._getPresetDateLastWeek()
      this.datePreset.thisMonth = this._getPresetDateThisMonth()
      this.datePreset.lastMonth = this._getPresetDateLastMonth()
      this.datePreset.thisQuarter = this._getPresetDateThisQuarter()
      this.datePreset.lastQuarter = this._getPresetDateLastQuarter()
    },

    _getPresetDateThisDay () {
      const thisDay = moment()
      return [thisDay.format('YYYY'), thisDay.format('MM'), thisDay.format('DD'), thisDay.format('YYYY'), thisDay.format('MM'), thisDay.format('DD')]
    },
    _getPresetDateLastDay () {
      const lastDay = moment().subtract(1, 'days')
      return [lastDay.format('YYYY'), lastDay.format('MM'), lastDay.format('DD'), lastDay.format('YYYY'), lastDay.format('MM'), lastDay.format('DD')]
    },
    _getPresetDateThisWeek () {
      const from = moment().day(1)
      const to = moment()
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },
    _getPresetDateLastWeek () {
      const from = moment().subtract(1, 'weeks').day(1)
      const to = moment().subtract(1, 'weeks').day(1).add(6, 'days')
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },
    _getPresetDateThisMonth () {
      const from = moment().date(1)
      const to = moment()
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },
    _getPresetDateLastMonth () {
      const from = moment().subtract(1, 'month').date(1)
      const to = moment().date(1).subtract(1, 'day')
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },
    _getPresetDateThisQuarter () {
      const from = moment().month((moment().quarter() - 1) * 3).date(1)
      const to = moment()
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },
    _getPresetDateLastQuarter () {
      const from = moment().month((moment().quarter() - 1) * 3).date(1).subtract(1, 'quarter')
      const to = moment().month(moment().quarter() * 3).date(1).subtract(1, 'quarter').subtract(1, 'days')
      return [from.format('YYYY'), from.format('MM'), from.format('DD'), to.format('YYYY'), to.format('MM'), to.format('DD')]
    },

    doAuto () {
      if (this.$ui.isMoleculesAuto(this.unit.top_menu_id, this.unit.menu_id, 'button', '确认按钮')) {
        return this.onClickOk()
      }
    },

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
          // TODO: 注入 `dimension` 字段
          data.dimension = this.selectedDimension

          // TODO: 注入 `type` 字段
          data.type = this.selectedType

          // TODO: 注入 `level` 字段
          data.level = this.selectedLevel

          // TODO: 注入 `info[].line_no` 字段
          if (data.info !== null) {
            let current = 0
            data.info.forEach((el, i) => {
              data.info[i].line_no = current
              current++
            })
          }

          this.model = data
        })
        .then(() => {
          this.currentPage = 1
          this.selected = null
        })
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
     * 回调：“今天”按钮被点击
     */
    onClickDateThisDay () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.thisDay
    },

    /**
     * 回调：“昨天”按钮被点击
     */
    onClickDateLastDay () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.lastDay
    },

    /**
     * 回调：“本周”按钮被点击
     */
    onClickDateThisWeek () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.thisWeek
    },

    /**
     * 回调：“上周”按钮被点击
     */
    onClickDateLastWeek () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.lastWeek
    },

    /**
     * 回调：“本月”按钮被点击
     */
    onClickDateThisMonth () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.thisMonth
    },

    /**
     * 回调：“上月”按钮被点击
     */
    onClickDateLastMonth () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.lastMonth
    },

    /**
     * 回调：“本季”度按钮被点击
     */
    onClickDateThisQuarter () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.thisQuarter
    },

    /**
     * 回调：“上季”度按钮被点击
     */
    onClickDateLastQuarter () {
      [this.dateFromY, this.dateFromM, this.dateFromD, this.dateToY, this.dateToM, this.dateToD] = this.datePreset.lastQuarter
    },

    /**
     * 回调：“全部”按钮被点击
     */
    onClickViewAll () {
      const typeNew = this.$const.RETAIL_STATS.TYPE.ALL

      if (this.selectedType === typeNew) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(typeNew.toString(), 'posMain.RetailStatistics.salesType')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '全部按钮')
        })
        .then(() => {
          this.selectedType = typeNew
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“按类型”按钮被点击
     */
    onClickViewByType () {
      if (this.model === null) return

      const typeNew = this.selectedType === this.$const.RETAIL_STATS.TYPE.ALL
        ? this.$const.RETAIL_STATS.TYPE.SALES
        : this.model.dimension === this.$const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY || this.model.dimension === this.$const.RETAIL_STATS.DIMENSION.PRODUCT || this.model.dimension === this.$const.RETAIL_STATS.DIMENSION.TIME_SPAN
          ? this.selectedType === this.$const.RETAIL_STATS.TYPE.SALES
            ? this.$const.RETAIL_STATS.TYPE.RETURN
            : this.$const.RETAIL_STATS.TYPE.SALES
          : this.$const.RETAIL_STATS.TYPE.SALES

      if (this.selectedType === typeNew) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(typeNew.toString(), 'posMain.RetailStatistics.salesType')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '按类型按钮')
        })
        .then(() => {
          this.selectedType = typeNew
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“上一级”按钮被点击
     */
    onClickViewLess () {
      const levelNew = Math.min(this.levelMax, Math.max(1, this.selectedLevel - 1))

      if (this.selectedLevel === levelNew) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(levelNew.toString(), 'posMain.RetailStatistics.classLvl')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '汇总按钮')
        })
        .then(() => {
          this.selectedLevel = levelNew
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：“下一级”按钮被点击
     */
    onClickViewMore () {
      const levelNew = Math.min(this.levelMax, Math.max(1, this.selectedLevel + 1))

      if (this.selectedLevel === levelNew) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(levelNew.toString(), 'posMain.RetailStatistics.classLvl')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '明细按钮')
        })
        .then(() => {
          this.selectedLevel = levelNew
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：列表头被点击
     */
    onClickListHead (column) {
      if (this.orderBy !== column) {
        this.orderBy = column
        this.order = 'asc'
      } else {
        switch (this.order) {
          case 'asc':
            this.order = 'desc'
            break
          case 'desc':
            this.orderBy = null
            this.order = 'asc'
            break
        }
      }
    },

    /**
     * 回调：列表项被点击
     */
    onClickListRow (item) {
      this.selected = item.line_no
    },

    /**
     * 回调：列表项被双击
     */
    onDblclickListRow (item) {
      if (item === null) return
      if (this.model === null) return
      if (this.model.dimension !== this.$const.RETAIL_STATS.DIMENSION.PRODUCT_CATEGORY) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(JSON.stringify(item), 'posMain.RetailStatistics.dtl.Info')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '零售统计数据')
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
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '返回按钮')
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
        this.$ui.setData(JSON.stringify(this.model), 'posMain.RetailStatistics.Info')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '打印按钮')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
    * 回调：开关边栏按钮被点击
    */
    onClickToggleRight () {
      this.isRightHide = !this.isRightHide
    },

    /**
     * 回调：隐藏键盘按钮被点击
     */
    onClickHideKbd () {
      this.$kbd.hide()
    },

    /**
     * 回调：“确认”按钮被点击
     */
    onClickOk () {
      const typeNew = this.$const.RETAIL_STATS.TYPE.ALL
      const levelNew = 1

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.selectedDimension.toString(), 'posMain.RetailStatistics.dimension'),
        this.$ui.setData(this.dateFrom.toString(), 'posMain.RetailStatistics.startDt'),
        this.$ui.setData(this.dateTo.toString(), 'posMain.RetailStatistics.endDt'),
        this.$ui.setData(typeNew.toString(), 'posMain.RetailStatistics.salesType'),
        this.$ui.setData(levelNew.toString(), 'posMain.RetailStatistics.classLvl')
      ])
        .then(() => {
          this.selectedType = typeNew
          this.selectedLevel = levelNew
        })
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确认按钮')
        })
        .then(() => {
          this.orderBy = null
          this.order = 'asc'
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：起始年被输入
     */
    onInputDateFromY () {
      this.$nextTick(() => {
        this.dateFromY = this.dateFromY.substr(0, 4)
        if (this.dateFromY.length === 4) {
          this.dateFromM = ''
          this.$refs.inputDateFromM.focus()
        }
      })
    },

    /**
     * 回调：起始月被输入
     */
    onInputDateFromM () {
      this.$nextTick(() => {
        this.dateFromM = this.dateFromM.substr(0, 2)
        if (this.dateFromM.length === 2) {
          if (parseInt(this.dateFromM) <= 12) {
            this.dateFromD = ''
            this.$refs.inputDateFromD.focus()
          } else {
            this.dateFromM = this.dateFromM.substr(0, this.dateFromM.length - 1)
          }
        }
      })
    },

    /**
     * 回调：起始日被输入
     */
    onInputDateFromD () {
      this.$nextTick(() => {
        this.dateFromD = this.dateFromD.substr(0, 2)
        if (this.dateFromD.length === 2) {
          if (parseInt(this.dateFromD) <= moment(`${this.dateFromY}-${this.dateFromM}`, 'YYYY-MM').daysInMonth()) {
            this.dateToY = ''
            this.$refs.inputDateToY.focus()
          } else {
            this.dateFromD = this.dateFromD.substr(0, this.dateFromD.length - 1)
          }
        }
      })
    },

    /**
     * 回调：结束年被输入
     */
    onInputDateToY () {
      this.$nextTick(() => {
        this.dateToY = this.dateToY.substr(0, 4)
        if (this.dateToY.length === 4) {
          this.dateToM = ''
          this.$refs.inputDateToM.focus()
        }
      })
    },

    /**
     * 回调：结束月被输入
     */
    onInputDateToM () {
      this.$nextTick(() => {
        this.dateToM = this.dateToM.substr(0, 2)
        if (this.dateToM.length === 2) {
          if (parseInt(this.dateToM) <= 12) {
            this.dateToD = ''
            this.$refs.inputDateToD.focus()
          } else {
            this.dateToM = this.dateToM.substr(0, this.dateToM.length - 1)
          }
        }
      })
    },

    /**
     * 回调：结束日被输入
     */
    onInputDateToD () {
      this.$nextTick(() => {
        this.dateToD = this.dateToD.substr(0, 2)
        if (this.dateToD.length === 2) {
          if (parseInt(this.dateToD) <= moment(`${this.dateToY}-${this.dateToM}`, 'YYYY-MM').daysInMonth()) {
            this.$refs.inputDateToD.blur()
          } else {
            this.dateToD = this.dateToD.substr(0, this.dateToD.length - 1)
          }
        }
      })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '零售统计数据':
          return this.load()
      }
    },

    combineCell (list) {
      if (!list) return
      this.spanArr = []
      let contactDot = 0
      list.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.sales_type === list[index - 1].sales_type) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
      // 0代表display:none 有数字的代表折叠几行 rowspan
      for (const i in list) {
        list[i].rowspan = this.spanArr[i]
      }
    }
  }
}
</script>

<style lang="scss">
.UnitMainRetailStats {
  height: 100%;
}
.unit-main-rtst-wrap {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
}
.unit-main-rtst-data {
  flex: 1 1 auto;
  width: 1px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  &-hd {
    flex: 0 0 auto;
    min-width: 100px;
    padding: 10px 5px;
    border-bottom: 1px solid #c4c4c4;
    display: flex;
    align-items: center;
  }
  &-title {
    flex: 1 1 auto;
    width: 1px;
    font-size: 18px;
    line-height: 25px;
    color: #000000;
    font-weight: bold;
    text-align: center;
  }
  &-action {
    flex: 0 0 auto;
    min-width: 100px;
    display: flex;
    .Btn {
      padding: 7px 20px;
      font-size: 12px;
      line-height: 17px;
      border-color: #707070;
      & + .Btn {
        border-left-width: 0;
      }
    }
  }
  &-bd {
    flex: 1 1 auto;
    height: 1px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .TableWrapper {
      flex: 1 1 auto;
      height: 1px;
      td, th {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
  &-ft {
    flex: 0 0 auto;
    padding: 0 5px 5px;
    display: flex;
    .Btn {
      flex-grow: 1;
      flex-shrink: 1;
      padding: 10px;
      font-size: 20px;
      line-height: 28px;
      & + .Btn {
        margin-left: 4px;
      }
    }
  }
  .TableWrapper {
    border: 1px solid #000000;
    border-radius: 2px;
    td, th {
      @include single-text-ellipsis;
    }
  }
}
.unit-main-rtst-ctrl {
  flex: 0 0 auto;
  width: 513px;
  box-sizing: border-box;
  padding: 5px;
  border-left: 1px solid #9d9d9d;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  &-bd {
    flex: 1 1 auto;
    height: 1px;
    overflow: auto;
  }
  &-part {
    margin-bottom: 5px;
  }
  &-title {
    padding: 11px 15px;
    border-left: 1px solid #000000;
    border-right: 1px solid #000000;
    border-top: 1px solid #000000;
    background-color: var(--pt-color-primary);
    font-size: 18px;
    line-height: 25px;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
  }
  &-items {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    .Btn {
      flex: 0 0 auto;
      padding: 12px 15px;
      width: 50%;
      font-size: 20px;
      line-height: 28px;
      border-width: 0;
      border-radius: 0;
      border-bottom: 1px solid #000000;
      &:nth-child(1),
      &:nth-child(2) {
        border-top: 1px solid #000000;
      }
      &:nth-child(2n) {
        border-right: 1px solid #000000;
      }
      &:nth-child(2n+1) {
        border-left: 1px solid #000000;
        border-right: 1px solid #000000;
      }
    }
    & > .KeyboardHolder {
      background-color: #ffffff;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
  &-form {
    padding: 10px 0 10px 50px;
    border-top: 1px solid #000000;
    border-left: 1px solid #000000;
    border-right: 1px solid #000000;
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 34px;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIzNCI+PHBhdGggZD0iTTguNzU4IDIxLjk0MmwtNC43ODggMS4yVjBILjAwMXYzMi45NjdhLjY1NC42NTQgMCAwMDEuMTc3LjM5NWw4LjA2Ny0xMC42ODRhLjQ2Ny40NjcgMCAwMC0uNDg2LS43MzV6IiBmaWxsPSIjYjZiNmJiIi8+PC9zdmc+');
      background-size: 100% 100%;
      position: absolute;
      left: 22px;
      top: 50%;
      transform: translateY(-50%);
    }
    .FormInput {
      width: 96px;
      box-sizing: border-box;
      margin: 0 10px;
      border-color: #707070;
      border-radius: 2px;
    }
  }
  &-form-group {
    display: flex;
    align-items: center;
    & + .unit-main-rtst-ctrl-form-group {
      margin-top: 12px;
    }
  }
  &-ft {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    .Btn {
      width: 30%;
      padding: 10px 15px;
      font-size: 20px;
      line-height: 28px;
      & + .Btn {
        margin-left: 4px;
      }
    }
  }
}
.unit-main-rtst-rowspan-none {
  display: none;
}
.unit-main-rtst-rowspan-active {
  background-color: #ffffff !important;
  color: #000000 !important;
}
</style>
