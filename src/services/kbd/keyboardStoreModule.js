const MUTATION_TYPE_KEYBOARD_SHOW = 'keyboard/show'
const MUTATION_TYPE_KEYBOARD_HIDE = 'keyboard/hide'

export default {
  state: {
    current: null
  },
  getters: {
    keyboard (state) {
      return state.current
    }
  },
  actions: {
    showKeyboard (context, payload) {
      context.commit(MUTATION_TYPE_KEYBOARD_SHOW, payload)
    },
    hideKeyboard (context, payload) {
      context.commit(MUTATION_TYPE_KEYBOARD_HIDE, payload)
    }
  },
  mutations: {
    [MUTATION_TYPE_KEYBOARD_SHOW] (state, payload) {
      state.current = payload
    },
    [MUTATION_TYPE_KEYBOARD_HIDE] (state, payload) {
      state.current = null
    }
  }
}
