module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      polyfills: [
        'es.object.keys',
        'es.object.values',
        'es.object.entries',
        'es.string.pad-start',
        'es.string.pad-end',
        'es.array.find',
        'es.array.find-index',
        'es.array.every',
        'es.array.some',
        'es.array.includes'
      ]
    }]
  ]
}
