import { getRankData, getChartInfo, getCumulative, getLine, getSiteDetail, getMainRecordData, getMainRecordDetail, getSiteCode, getVisitRecordData, getSiteId, addVisitRecord, getProvince, getUserList,getAlarmType,getNoteList,getMaintainRemindData,getUserTree,sendMessage,finishPlan } from '../services/cockpitService';
import config from '../config'

export default {
    namespace: 'cockpit',

    state: {
        sort: 1, //正反序
        rowCount: 10,
        params: {
            pageSize: config.pageSize,
            pageNo: 1,
            type: 1,
        },
        runRankData: [],
        mainRecordData: [],
        visitRecordData: [],
        maintainRemindData: [],
        userList: [],
        userTree: [],
        noteList: [],
        alarmType: [],
        province: [],
        selectLineOption: 0,
        detail: '',
        equipmentList: [1, 2, 3, 4],
        siteCode: [],
        siteId:[],
    },

    effects: {
        *getSiteCode({ payload }, { call, put }) {
            const data = yield call(getSiteCode);
            const options=[{text:'全部',value:''}];
            for (let i = 0; i < data.ret.length; i++) {
                options.push({
                    text: data.ret[i].name, value: data.ret[i].code
                });
            }
            yield put({ type: 'save', payload: {siteCode: options } });
        },
        *getRankData({ payload }, { call, put }) {
            const data = yield call(getRankData, payload);
            yield put({ type: 'save', payload: { params: payload, runRankData: data.ret.items, rowCount: data.ret.rowCount } });
        },
        //维养记录
        *getMainRecordData({ payload }, { call, put }) {
            const data = yield call(getMainRecordData, payload);
            yield put({ type: 'save', payload: { params: payload, mainRecordData: data.ret.items, rowCount: data.ret.rowCount  } });
        },
        *getMainRecordDetail({ payload }, { call, put }) {
            const data = yield call(getMainRecordDetail, payload);
            yield put({ type: 'save', payload: {detail: data.ret.detail } });
        },
        //回访记录
        *getVisitRecordData({ payload }, { call, put }) {
            const data = yield call(getVisitRecordData, payload);
            yield put({ type: 'save', payload: { params: payload, visitRecordData: data.ret.items, rowCount: data.ret.rowCount } });
        },
        *getSiteId({ payload }, { call, put }) {
            const data = yield call(getSiteId);
            const options=[{text:'全部',value:''}];
            for (let i = 0; i < data.ret.length; i++) {
                options.push({
                    text: data.ret[i].name, value: data.ret[i].id
                });
            }
            yield put({ type: 'save', payload: {siteId: options } });
        },
        *addVisitRecord({ payload }, { call, put }) {
            const data = yield call(addVisitRecord, payload.params, payload.headers);
        },

        //客户档案
        *getProvince({ payload }, { call, put }) {
            const data = yield call(getProvince);
            const options=[{text:'全部',value:''}];
            for (let i = 0; i < data.ret.length; i++) {
                options.push({
                    text: data.ret[i].name, value: data.ret[i].value
                });
            }
            yield put({ type: 'save', payload: {province: options } });
        },
        *getUserList({ payload }, { call, put }) {
            const data = yield call(getUserList, payload);
            yield put({ type: 'save', payload: { params: payload, userList: data.ret.items, rowCount: data.ret.rowCount } });
        },

        //客户通知
        *getAlarmType({ payload }, { call, put }) {
            const data = yield call(getAlarmType);
            const options=[{text:'全部',value:''}];
            for (let i = 0; i < data.ret.length; i++) {
                options.push({
                    text: data.ret[i].name, value: data.ret[i].id
                });
            }
            yield put({ type: 'save', payload: {alarmType: options } });
        },
        *getNoteList({ payload }, { call, put }) {
            const data = yield call(getNoteList, payload);
            yield put({ type: 'save', payload: { params: payload, noteList: data.ret.items, rowCount: data.ret.rowCount } });
        },

        //维保提醒
        *getMaintainRemindData({ payload }, { call, put }) {
            const data = yield call(getMaintainRemindData, payload);
            yield put({ type: 'save', payload: { params: payload, maintainRemindData: data.ret.items, rowCount: data.ret.rowCount } });
        },
        *getUserTree({ payload }, { call, put }) {
            const data = yield call(getUserTree, payload);
            yield put({ type: 'save', payload: { params: payload, userTree: data.ret, rowCount: data.ret.rowCount } });
        },
        *sendMessage({ payload }, { call, put }) {
            const data = yield call(sendMessage, payload);
        },
        *finishPlan({ payload }, { call, put }) {
            const data = yield call(finishPlan, payload);
        },

        *getMonitorAlarmData({ payload }, { call, put }) {
            console.log('payload', payload)
            const ChartInfo = yield call(getChartInfo, { deviceId: payload.deviceId });
            const Cumulative = yield call(getCumulative, { deviceId: payload.deviceId });
            const Line = yield call(getLine, { deviceId: payload.deviceId, isPC: true });
            // const SiteDetail = yield call(getSiteDetail, { id: payload.id });
            const SiteDetail = yield call(getSiteDetail, { id: payload.id });
            yield put({ type: 'save', payload: { ChartInfo: ChartInfo.ret, Cumulative: Cumulative.ret, Line: Line.ret, SiteDetail: SiteDetail.ret, selectLineOption: payload.index } });
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
