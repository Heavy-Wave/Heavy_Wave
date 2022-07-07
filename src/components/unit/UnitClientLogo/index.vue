<template>
  <div class="UnitClientLogo" v-if="model !== null">

    <div class="unit-client-logo-img" v-if="model.logo !== null">
      <img :src="`${$sys.mediaBaseUrl}${model.logo}`" />
    </div>

    <div class="unit-client-logo-qr" v-if="model.qrCode !== null">
      <qr-code :value="model.qrCode" :width="86" :margin="1" />
    </div>

  </div>
</template>

<script>
import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitClientLogo',
  mixins: [
    unitMixin,
    unitListenRefreshMixin
  ],
  data () {
    return {
      model: null
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', 'logo')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case 'logo':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitClientLogo {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.unit-client-logo-img {
  margin-left: 3px;
  flex-grow: 1;
  flex-shrink: 1;
  width: 1px;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
.unit-client-logo-qr {
  margin-left: 7px;
  flex-grow: 0;
  flex-shrink: 0;
  width: 86px;
  height: 86px;
  padding: 0;
  border: 1px solid #000000;
  border-radius: 2px;
  background-color: #ffffff;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
