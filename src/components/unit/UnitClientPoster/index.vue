<template>
  <div class="UnitClientPoster" v-if="model !== null">

    <div class="unit-client-poster-anno">
      <div class="unit-client-poster-anno-inner" ref="anno">
        <div>{{ model.advertisement }}</div>
      </div>
    </div>

    <div class="unit-client-poster-player">
      <poster-player :value="resPaths" :duration="parseFloat(model.intervalTime)" />
    </div>

  </div>
</template>

<script>
import 'text-roller'

import unitMixin from '@/mixins/unit'
import unitListenRefreshMixin from '@/mixins/unit-listen-refresh'

export default {
  name: 'UnitClientPoster',
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
    resPaths () {
      if (this.model === null) return []

      return this.model.video.map(el => `${this.$sys.mediaBaseUrl}${el}`)
    }
  },
  watch: {
    model () {
      this.$nextTick(() => this.initMarquee())
    }
  },
  mounted () {
    Promise.all([
      this.load()
    ])
  },
  methods: {
    initMarquee () {
      if (!('anno' in this.$refs)) return

      const instance = new window.TextRoller(this.$refs.anno)
      instance.start()
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
      return this.$ui.getData(this.unit.top_menu_id, this.unit.menu_id, 'dataSource', '展示数据')
        .then(res => res[0])
        .then(({ msg, data }) => {
          this.model = data
        })
    },

    onBridgeRefresh ({ elementGroupType }) {
      switch (elementGroupType) {
        case '展示数据':
          return this.load()
      }
    }
  }
}
</script>

<style lang="scss">
.UnitClientPoster {
  height: 100%;
  background-color: #e7e7e7;
  position: relative;
}
.unit-client-poster-anno {
  padding: 10px 15px 10px 46px;
  background: rgba(0, 0, 0, .4) url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTEzLjAzNSA1LjE3MWgyLjIyNHEuNzQxIDAgLjc0MS43NzN0LS43NDEuNzczaC0yLjIyNHEtLjc0MSAwLS43NDEtLjc3M3QuNzQxLS43NzN6bS0uMTI4IDIuNjM3bC41MjQuNTQ3IDEuNTcyIDEuNjRhLjcuNyAwIDAxMCAxLjA5NC42MzkuNjM5IDAgMDEtMS4wNDggMGwtMS41NzItMS42NGEuNy43IDAgMDEwLTEuMDk0LjYzOS42MzkgMCAwMTEuMDQ4IDB6TTEyLjM4NCAyLjQ0TDEzLjk1Ni44YS42MzkuNjM5IDAgMDExLjA0OCAwIC43LjcgMCAwMTAgMS4wOTRsLTEuNTcyIDEuNjM5YS42MzkuNjM5IDAgMDEtMS4wNDggMCAuNy43IDAgMDEwLTEuMDkzek0xLjQ4MiAyLjg1NGgyLjk2NXExLjQ4MiAwIDEuNDgyIDEuNTQ3djMuODY2cTAgMS41NDctMS40ODIgMS41NDdIMS40ODJRMCA5LjgxNCAwIDguMjY3VjQuNDAxcTAtMS41NDcgMS40ODItMS41NDd6bTIuOTY1IDBMOS44NC4wNDFhLjM1Ny4zNTcgMCAwMS4zNjEuMDE3LjM5MS4zOTEgMCAwMS4xNzYuMzI5djExLjg5NGEuMzkxLjM5MSAwIDAxLS4xNzYuMzI5LjM1Ny4zNTcgMCAwMS0uMzYxLjAxN0w0LjQ0NyA5LjgxM3ptLTIuMjIzIDcuNzMzaDIuMjIzTDUuOTMgMTZIMy43MDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+') no-repeat 17px center / 16px 16px;
  border-radius: 21px;
  font-size: 16px;
  line-height: 22px;
  color: #ffffff;
  @include single-text-ellipsis;
  position: absolute;
  top: 25px;
  left: 14px;
  right: 14px;
  z-index: 1;
}
.unit-client-poster-anno-inner {
  overflow: hidden;
  position: relative;
  display: flex;
}
.unit-client-poster-player {
  .PosterPlayer {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
  }
}
</style>
