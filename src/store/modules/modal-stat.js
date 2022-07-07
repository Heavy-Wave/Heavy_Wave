const MUTATION_TYPE_MODAL_SHOW = 'modal/show'
const MUTATION_TYPE_MODAL_HIDE = 'modal/hide'

export default {
  state: {
    shown: []
  },
  getters: {
    modalShown (state) {
      return state.shown
    }
  },
  actions: {
    modalShow (context, payload) {
      context.commit(MUTATION_TYPE_MODAL_SHOW, payload)
      return Promise.resolve()
    },
    modalHide (context, payload) {
      context.commit(MUTATION_TYPE_MODAL_HIDE, payload)
      return Promise.resolve()
    }
  },
  mutations: {
    [MUTATION_TYPE_MODAL_SHOW] (state, payload) {
      if (!state.shown.includes(payload)) {
        state.shown.push(payload)
      }
    },
    [MUTATION_TYPE_MODAL_HIDE] (state, payload) {
      if (state.shown.includes(payload)) {
        state.shown.splice(state.shown.indexOf(payload), 1)
      }
    }
  }
}
