const path = require('path')

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  productionSourceMap: true,

  runtimeCompiler: true,

  publicPath: '',

  assetsDir: 'assets',

  transpileDependencies: ['flatpickr'],

  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/scss/common.scss";'
      }
    }
  },

  chainWebpack (config) {
    config.resolve.alias
      .set('text-roller', path.join(process.cwd(), 'vendor', 'text-roller.js'))

    config.plugin('html')
      .tap(args => {
        args[0].title = 'Postime'
        return args
      })
  }
})
