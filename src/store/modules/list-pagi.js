const MUTATION_TYPE_LIST_PAGI_SET_TOTAL = 'listPagi/setTotal'
const MUTATION_TYPE_LIST_PAGI_SET_CURRENT_PAGE = 'listPagi/setCurrentPage'
const MUTATION_TYPE_LIST_PAGI_SET_PER_PAGE = 'listPagi/setPerPage'

export default {
  state: {
    total: 0,
    currentPage: 1,
    perPage: 8
  },
  getters: {
    listPagiCurrentPage (state) {
      return state.currentPage
    },
    listPagiPerPage (state) {
      return state.perPage
    },
    listPagiTotalPages (state) {
      return Math.ceil(state.total / state.perPage)
    },
    listPagiCanGoPrev (state) {
      return state.total > 0 && state.currentPage > 1
    },
    listPagiCanGoNext (state) {
      return state.total > 0 && state.currentPage < Math.ceil(state.total / state.perPage)
    }
  },
  actions: {
    listPagiSetTotal (context, payload) {
      context.commit(MUTATION_TYPE_LIST_PAGI_SET_TOTAL, payload)
      return Promise.resolve()
    },
    listPagiSetCurrentPage (context, payload) {
      context.commit(MUTATION_TYPE_LIST_PAGI_SET_CURRENT_PAGE, payload)
      return Promise.resolve()
    },
    listPagiSetPerPage (context, payload) {
      context.commit(MUTATION_TYPE_LIST_PAGI_SET_PER_PAGE, payload)
      return Promise.resolve()
    }
  },
  mutations: {
    [MUTATION_TYPE_LIST_PAGI_SET_TOTAL] (state, payload) {
      state.total = payload
    },
    [MUTATION_TYPE_LIST_PAGI_SET_CURRENT_PAGE] (state, payload) {
      state.currentPage = payload
    },
    [MUTATION_TYPE_LIST_PAGI_SET_PER_PAGE] (state, payload) {
      state.perPage = payload
    }
  }
}
