<template>
  <div class="ViewLoginPartModalSearch">

    <modal :value="visible" @show="onModalShow">

      <template slot="header">帐号检索</template>

      <div class="form-search">
        <form-input
          v-model="keywords"
          type="text"
          placeholder="输入员工编号或员工名"
        />
      </div>

      <div class="form-data">
        <table-wrapper>
          <thead>
            <tr>
              <th width="30%">员工编号</th>
              <th width="70%">员工名</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in filteredItems">
              <tr :class="{ 'active': selected === item.staff_id }" :key="item.staff_id" @click="onClickItem(item)">
                <td>{{ item.staff_id }}</td>
                <td>{{ item.staff_name }}</td>
              </tr>
            </template>
          </tbody>
        </table-wrapper>
      </div>

      <template slot="footer">
        <div class="form-actions">
          <btn secondary @click="onClickClose">返回</btn>
          <btn primary @click="onClickOk">确定</btn>
        </div>
      </template>

    </modal>

  </div>
</template>

<script>
export default {
  name: 'ViewLoginPartModalSearch',
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: null
    },
    staffList: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      keywords: '',

      selected: null
    }
  },
  computed: {
    filteredItems () {
      return this.staffList.filter(el => this.keywords.trim() === '' || el.staff_id.startsWith(this.keywords.trim()) || el.staff_name.includes(this.keywords.trim()))
    }
  },
  methods: {
    /**
     * 回调：模态被显示
     */
    onModalShow () {
      this.keywords = ''
      if (this.value !== null) {
        this.selected = this.value.toString()
      }
    },

    /**
     * 回调：员工列表项被点击
     */
    onClickItem (item) {
      this.selected = item.staff_id
    },

    /**
     * 回调：确定按钮被点击
     */
    onClickOk () {
      this.$emit('input', this.selected)
      this.$emit('update:visible', false)
    },

    /**
     * 回调：关闭按钮被点击
     */
    onClickClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.ViewLoginPartModalSearch {
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  .modal-outer {
    width: 400px;
  }
  .modal-bd {
    height: 50vh;
    padding: 12px;
  }
  .form-search {
  }
  .form-data {
    margin-top: 14px;
  }
  .form-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .Btn {
      width: 120px;
      padding-top: 10px;
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 22px;
      & + .Btn {
        margin-left: 14px;
      }
    }
  }
}
</style>
