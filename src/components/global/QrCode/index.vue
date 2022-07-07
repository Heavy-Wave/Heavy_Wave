<template>
  <img :src="src" :width="width" :height="width" />
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'QrCode',
  props: {
    value: {
      type: String,
      required: true
    },
    errorCorrectionLevel: {
      type: String,
      required: false,
      default: 'L'
    },
    width: {
      type: Number,
      required: false,
      default: 100
    },
    margin: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data () {
    return {
      src: null
    }
  },
  watch: {
    value () {
      this.generate()
    },
    errorCorrectionLevel () {
      this.generate()
    },
    width () {
      this.generate()
    },
    margin () {
      this.generate()
    }
  },
  mounted () {
    this.generate()
  },
  methods: {
    generate () {
      if (this.value.length === 0) return

      return new Promise((resolve, reject) => {
        QRCode.toDataURL(this.value, {
          errorCorrectionLevel: this.errorCorrectionLevel,
          width: this.width,
          margin: this.margin,
          scale: 2
        }, (error, url) => {
          if (error) {
            reject(error)
            return
          }
          resolve(url)
        })
      })
        .then(url => {
          this.src = url
        })
    }
  }
}
</script>

<style lang="scss">
</style>
