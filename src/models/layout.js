
export default {
  namespace: 'layout',
  state: {


  },
  effects: {
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },
};
