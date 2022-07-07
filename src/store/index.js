import Vue from 'vue'
import Vuex from 'vuex'

import modalStatModule from './modules/modal-stat'
import listPagiModule from './modules/list-pagi'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    modalStat: modalStatModule,
    listPagi: listPagiModule
  },
  strict: true,
  plugins: []
})
