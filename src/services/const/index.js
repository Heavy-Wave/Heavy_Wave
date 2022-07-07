export default {
  install (Vue, options) {
    Vue.prototype.$const = this
  },

  PAY: {
    OP_TYPE: { // 操作类型
      PAY: '01', // 支付
      REFUND: '02' // 退款
    }
  },

  RETAIL_STATS: {
    TYPE: {
      ALL: 1, // 全部
      SALES: 2, // 销售
      RETURN: 3 // 退货
    },
    DIMENSION: {
      PAYMENT_METHOD: 1, // 支付方式
      PRODUCT_CATEGORY: 2, // 商品分类
      PRODUCT: 3, // 商品
      STAFF: 4, // 收银员
      TIME_SPAN: 5 // 时段
    }
  },

  ACCOUNTING: {
    INOROUT: { // 收支类型
      IN: 1, // 收入
      OUT: 2 // 支出
    }
  },

  SYSTEM: {
    LOGIN_STATUS: { // 登录状态
      GUEST: 0, // 未登录
      LOGGED_IN: 1, // 已登录
      HUNG_UP: 2 // 已挂起
    },
    CONNECT_ID: { // 登录模式
      LOCAL: '01', // 本地
      REMOTE: '02' // 远程
    }
  },

  NET_STATUS: {
    CODE: {
      NORMAL: 1, // 正常
      ERROR_LOCAL: -2, // 网络错误：本地
      ERROR_ROUTER: -3, // 网络错误：店内路由
      ERROR_INTERNET: -4, // 网络错误：互联网
      ERROR_SERVER: -5, // 网络错误：云主机
      ERROR_PAY: -6 // 网络错误：支付服务
    }
  },

  UI: {
    UNIT: {
      DEFAULT_FLG: { // 是否默认
        YES: 1, // 默认
        NO: 2 // 非默认
      }
    },
    ELEMENT: {
      AUTO_FLG: { // 是否自动执行
        YES: 1, // 自动
        NO: 2 // 不自动
      }
    }
  }
}
