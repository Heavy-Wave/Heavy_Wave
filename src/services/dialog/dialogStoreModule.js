const MUTATION_TYPE_DIALOG_OPEN = 'dialog/open'
const MUTATION_TYPE_DIALOG_CLOSE = 'dialog/close'

const generateId = function () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let value = ''
  for (let i = 0; i < 16; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return value
}

export default {
  state: {
    items: []
  },
  getters: {
    dialogItems (state) {
      return state.items
    }
  },
  actions: {
    dialogOpen (context, payload) {
      const id = generateId()

      context.commit(MUTATION_TYPE_DIALOG_OPEN, Object.assign({ _id: id }, payload))
    },

    dialogClose (context, payload) {
      context.commit(MUTATION_TYPE_DIALOG_CLOSE, payload)
    }
  },
  mutations: {
    [MUTATION_TYPE_DIALOG_OPEN] (state, payload) {
      state.items.push(payload)
    },

    [MUTATION_TYPE_DIALOG_CLOSE] (state, payload) {
      if (state.items.length <= 0) return

      if (typeof payload === 'object' && payload !== null && 'id' in payload && payload.id.length > 0) {
        const id = payload.id

        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i]._id === id) {
            state.items.splice(i, 1)
          }
        }
      } else {
        state.items.pop()
      }
    }
  }
}
