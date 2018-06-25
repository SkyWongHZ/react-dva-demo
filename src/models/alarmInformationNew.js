import request from '../utils/request';

export default {
  namespace: 'alarmInformationNew',
  state: {
    loading: false,
    url: "",
    data: {},
    price:'10元',
  },
 /*  reducers: {
    request(state, payload) {
      return {...state, ...payload};
    },
    response(state, payload) {
      return {...state, ...payload};
    }
  }, */
  reducers: {
    save(state, {payload}) {
        return { ...state, ...payload };
    },
  },
  effects: {
    *selectAlarmMessage({ payload }, { call, put }) {
        const data = yield call(selectAlarmMessage);
        console.log('data',data)
        debugger
      /*   const options=[{text:'全部',value:''}];
        for (let i = 0; i < data.ret.length; i++) {
            options.push({
                text: data.ret[i].name, value: data.ret[i].id
            });
        } */
        yield put({ type: 'save', payload: {...payload } });
    },
  }
};
