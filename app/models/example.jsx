import { login } from '../services/example'

export default {
  namespace: 'example',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
  effects: {
    *login({ payload: { query } }, { call, put }) {  // eslint-disable-line
      yield login(query)
      yield put({ type: 'setCurrentUser' })
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
    setCurrentUser(state, action) {
      return { ...state, ...action.payload }
    },
  },

}
