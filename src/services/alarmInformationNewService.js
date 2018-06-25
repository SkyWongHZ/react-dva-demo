import request from '../utils/request';
import api from "../utils/interface";

/* export function query() {
  return request('/wl/overview/alarmMessage/selectAlarmMessage');
} */

export async function selectAlarmMessage(params) {
    return request({ url:'/wl/overview/alarmMessage/selectAlarmMessage', method: 'GET', params });
}
