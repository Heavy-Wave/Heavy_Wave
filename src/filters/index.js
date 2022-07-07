import numbro from 'numbro'
import moment from 'moment'

export default {
  install (Vue, options) {
    Vue.filter('decimal', (value, digits = 2, forceDigits = false) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return numbro(value).format({
          thousandSeparated: false,
          mantissa: digits,
          optionalMantissa: false,
          trimMantissa: !forceDigits
        })
      }
    })

    Vue.filter('integer', (value) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return numbro(value).format({
          thousandSeparated: false,
          trimMantissa: true,
          mantissa: 0
        })
      }
    })

    Vue.filter('datetime', (value, format = 'YYYY/MM/DD HH:mm:ss') => {
      if (value) {
        return moment(value).format(format)
      }
      return ''
    })

    Vue.filter('date', (value, format = 'YYYY/MM/DD') => {
      if (value) {
        return moment(value).format(format)
      }
      return ''
    })

    Vue.filter('time', (value, format = 'HH:MM') => {
      if (value) {
        return moment(value).format(format)
      }
      return ''
    })

    Vue.filter('bool', value => {
      switch (value) {
        case true: return '是'
        case false: return '否'
        case null: return '无'
        default: return ''
      }
    })

    Vue.filter('wordWrap', (value, chars) => {
      const parts = []

      for (let i = 0; i <= value.length; i += chars) {
        parts.push(value.substring(i, i + chars))
      }

      return parts.join('\n')
    })
  }
}
