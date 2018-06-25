import request from '../utils/request';
import api from "../utils/interface";
const { overview, runRank, MonitorAlarm, maintenanceRecord, visitRecord, customerFile, customerNote, maintainRemind } = api;

// async function getSiteList(params) {
//     return request({ url: overview.getSiteList, params });
// }
// async function exportList(params) {
//     return request({ url: overview.exportList, params, method: 'EXPORT' });
// }
// async function deleteSite(params) {
//     return request({ url: overview.deleteSite, data: params, method: 'POST' });
// }
// async function addOrUpdateSite(params) {
//     return request({ url: overview.addOrUpdateSite, method: 'POST', data: params });
// }

export async function getSiteDetail(params) {
    return request({ url: MonitorAlarm.getSiteDetail, method: 'GET', params });
}

export async function getChartInfo(params) {
    return request({ url: MonitorAlarm.getChartInfo, method: 'GET', params });
}

export async function getCumulative(params) {
    return request({ url: MonitorAlarm.getCumulative, method: 'GET', params });
}

export async function getLine(params) {
    return request({ url: MonitorAlarm.getLine, method: 'GET', params });
}

export async function getRankData(params) {
    return request({ url: runRank.getRankData, method: 'GET', params });
}

//维养记录
export async function getMainRecordData(params) {
    return request({ url: maintenanceRecord.getMainRecordData, method: 'GET', params });
}

export async function getMainRecordDetail(params) {
    return request({ url: maintenanceRecord.getMainRecordDetail, method: 'GET', params });
}

export async function getSiteCode() {
    return request({ url: maintenanceRecord.getSitCode, method: 'GET' });
}

//回访记录
export async function getVisitRecordData(params) {
    return request({ url: visitRecord.getVisitRecordData, method: 'GET', params });
}

export async function getSiteId(params) {
    return request({ url: visitRecord.getSiteId, method: 'GET' });
}

export async function addVisitRecord(params, headers) {
    return request({ url: visitRecord.addVisitRecord, method: 'POST', params, headers });
    
}

//客户档案
export async function getProvince() {
    return request({ url: customerFile.getProvince, method: 'GET' });
}

export async function getUserList(params) {
    return request({ url: customerFile.getUserList, method: 'GET', params });
}

//客户通知
export async function getAlarmType() {
    return request({ url: customerNote.getAlarmType, method: 'GET'});
}

export async function getNoteList(params) {
    return request({ url: customerNote.getList, method: 'GET', params });
}

//维保提醒
export async function getMaintainRemindData(params) {
    return request({ url: maintainRemind.getMaintainRemindData, method: 'GET', params });
}

export async function getUserTree(params) {
    return request({ url: maintainRemind.getUserTree, method: 'GET', params });
}

export async function sendMessage(params) {
    return request({ url: maintainRemind.sendMessage, method: 'GET', params });
}

export async function finishPlan(params) {
    return request({ url: maintainRemind.finishPlan, method: 'GET', params });
}