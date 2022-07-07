<template>
  <div class="UnitMainReport">

    <div class="unit-main-rept-wrap">

      <div class="unit-main-rept-hd">

        <template v-if="model !== null && model.title !== null">
          <div class="unit-main-rept-status">{{ model.title }}</div>
        </template>

      </div>

      <div class="unit-main-rept-bd">

        <table-wrapper>
          <thead>
            <tr>
              <th style="width: 6.5em;">序号</th>
              <th>内容</th>
              <th style="width: 8.75em;">进度</th>
            </tr>
          </thead>
          <tbody v-if="model !== null && model.info !== null">
            <tr
              v-for="(item, index) in model.info"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td style="text-align: left;">{{ item.label }}</td>
              <td>{{ item.values }}/{{ item.key }}</td>
            </tr>
          </tbody>
        </table-wrapper>

      </div>

      <div class="unit-main-rept-ft">
        <template v-if="hasClose">
          <btn secondary @click="onClickClose">返回</btn>
        </template>
        <template v-if="hasOk">
          <btn primary @click="onClickOk">上传</btn>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainReport',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
    }
  },
  computed: {
    hasClose () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '返回')
    },
    hasOk () {
      return this.$ui.hasElementByUnit(this.unit, 'button', '上传')
    },
    hasDetails () {
      return this.$ui.hasElementByUnit(this.unit, 'dataSource', '数据显示')
    }
  },
  created () {
    this._timer = null
  },
  beforeDestroy () {
    // 停止轮询
    this.stop()
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '数据显示')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '数据显示':
          return this.load()
      }
    },

    /**
     * 开始轮询
     */
    start () {
      this.stop()
      this._timer = window.setInterval(() => {
        this.fetch()
      }, 5e3)

      this.fetch()
    },

    /**
     * 结束轮询
     */
    stop () {
      if (this._timer) {
        window.clearInterval(this._timer)
        this._timer = null
      }
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
    },

    /**
     * 回调：“确认”按钮被点击
     */
    onClickOk () {
      if (this.modelInfo === null) return
      if (this.quantity === null) return

      // 开始轮询
      this.start()

      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '上传')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          // 停止轮询
          this.stop()

          this.$loading.hide()
        })
    }
  }
}
</script>

<style lang="scss">
.UnitMainReport {
  height: 100%;
  min-height: 536px;
}
.unit-main-rept {
  &-wrap {
    padding: 2px;
    height: 100%;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &-hd {
    flex: 0 0 auto;
  }
  &-status {
    height: 60px;
    padding: 0 15px;
    background-color: var(--pt-color-primary);
    border-radius: 2px;
    font-size: 16px;
    line-height: 22px;
    color: var(--pt-color-primary-content);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-bd {
    flex: 1 1 auto;
    height: 1px;
    margin-top: 2px;
    .TableWrapper {
      height: 100%;
      border: 1px solid #000000;
      border-radius: 2px;
      td, th {
        @include single-text-ellipsis;
      }
    }
  }
  &-ft {
    flex: 0 0 auto;
    margin-top: 2px;
    display: flex;
    justify-content: space-between;
    .Btn {
      padding: 10px 26px;
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
