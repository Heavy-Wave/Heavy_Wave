const MUTATION_TYPE_LOADING_SHOW = 'loading/show'
const MUTATION_TYPE_LOADING_HIDE = 'loading/hide'

export default {
  state: {
    counter: 0,
    marks: []
  },
  getters: {
    loadingShown (state) {
      return state.counter > 0
    },
    loadingMark (state) {
      return state.marks.length > 0 ? state.marks[0] : null
    }
  },
  actions: {
    showLoading (context, payload) {
      context.commit(MUTATION_TYPE_LOADING_SHOW, payload)
    },
    hideLoading (context, payload) {
      context.commit(MUTATION_TYPE_LOADING_HIDE, payload)
    }
  },
  mutations: {
    [MUTATION_TYPE_LOADING_SHOW] (state, payload) {
      state.counter++
      if ('mark' in payload && typeof payload.mark === 'string') {
        state.marks.unshift(payload.mark)
      }
    },
    [MUTATION_TYPE_LOADING_HIDE] (state, payload) {
      state.counter--
      if ('mark' in payload && typeof payload.mark === 'string') {
        state.marks.splice(state.marks.indexOf(payload.mark), 1)
      } else {
        state.marks.shift()
      }
    }
  }
}
