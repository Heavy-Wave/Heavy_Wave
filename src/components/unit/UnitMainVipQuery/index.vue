<template>
  <div class="UnitMainVipQuery" v-if="model !== null">

    <div class="unit-main-vip-query-bd">

      <div class="unit-main-vip-query-search">
        <form-input
          ref="input"
          v-model="keywords"
          type="text"
          pattern="\d*"
          placeholder="输入会员编号或会员名"
          @keypress.enter="onEnter"
        />
        <btn secondary @click="onEnter">查询</btn>
      </div>

      <div class="unit-main-vip-query-data">
        <table-wrapper>
          <thead>
            <tr>
              <th width="25%">会员编号</th>
              <th width="25%">会员名</th>
              <th width="12%">会员等级</th>
              <th width="19%">积分</th>
              <th width="19%">储值金额</th>
            </tr>
          </thead>
          <tbody v-if="model !== null && model.vip_list !== null">
            <template v-for="item in model.vip_list">
              <tr :class="{ 'active': selected === item.vip_id }" :key="item.vip_id" @click="onClickItem(item)">
                <td>{{ item.vip_id }}</td>
                <td>{{ item.vip_name }}</td>
                <td>{{ item.vip_lvl }}</td>
                <td>{{ item.vip_point }}</td>
                <td>{{ item.vip_money }}</td>
              </tr>
            </template>
          </tbody>
        </table-wrapper>
      </div>

    </div>

    <div class="unit-main-vip-query-ft">
      <btn secondary @click="onClickClose">返回</btn>
      <btn primary @click="onClickOk">确定</btn>
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitMainVipQuery',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null,

      keywords: '',
      selected: null
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '会员列表')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '会员列表':
          return this.load()
      }
    },

    /**
     * 回调：搜索框被回车
     */
    onEnter () {
      if (typeof this.keywords !== 'string' || this.keywords.length === 0) return

      this.$loading.show()
      return Promise.all([
        this.$ui.setData(this.keywords.toString(), 'posMain.vip.queryPop.queryKeyword')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '查询会员')
        })
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
    },

    /**
     * 回调：会员列表项被点击
     */
    onClickItem (item) {
      this.$loading.show()
      return Promise.all([
        this.$ui.setData(item.vip_id.toString(), 'posMain.vip.queryPop.selectedItem.recordId')
      ])
        .then(() => {
          return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '会员列表')
        })
        .then(() => {
          this.selected = item.vip_id
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
    onClickOk () {
      this.$loading.show()
      return this.$ui.runMolecules(this.unit.top_menu_id, this.unit.menu_id, 'button', '确定')
        .catch(error => {
          this.$message.error(error)
        })
        .finally(() => {
          this.$loading.hide()
        })
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
.UnitMainVipQuery {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.unit-main-vip-query-search {
  display: flex;
  align-items: center;
  .FormInput {
    flex-grow: 0;
    flex-shrink: 0;
    width: 241px;
    border-color: #707070;
  }
  .Btn {
    flex-grow: 0;
    flex-shrink: 0;
    padding: 6px 23px;
    margin-left: 8px;
  }
}
.unit-main-vip-query-data {
  margin-top: 8px;
}
.unit-main-vip-query-bd {
  padding: 8px;
}
.unit-main-vip-query-ft {
  margin-top: 1px; // hack
  border-top: 1px solid #dddde2;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
