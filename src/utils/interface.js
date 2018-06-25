// 西安项目接口数据
const overview = '/wl/overview';

export default {
  
  //数据汇集
  // overview: {
  //   getRealTimeInfo: realTime + 'getRealTimeInfo',
  //   getDetailInfo: realTime + 'getDetailInfo',
  //   getPageList: realTime + 'getPageList',
  //   getMessageInfo: realTime + 'getMessageInfo',
  //   saveMessageInfo: realTime + 'saveMessageInfo',
  //   sendMessage: realTime + 'sendMessage',
  //   getRecentWater: realTime + 'getRecentWater',
  // },
  //运行排名
  runRank: {
    getRankData: `${overview}/runRank/getRank`,
  },
  MonitorAlarm: {
    getSiteDetail: `${overview}/detail/getSiteDetail`,
    getChartInfo: `${overview}/detail/getChartInfo`,
    getCumulative: `${overview}/detail/getCumulative`,
    getLine: `${overview}/detail/getLine`,
  },
  //维养记录
  maintenanceRecord: {
    getMainRecordData: `${overview}/main/getMaintainRecord`,
    getMainRecordDetail: `${overview}/main/selectMaintainRecordById`,
    getSitCode: `${overview}/appuserservice/selectAllSiteName`,

  },

  //回访记录
  visitRecord: {
    getVisitRecordData: `/wl/service/visit/selectBysiteName`,
    getSiteId: `${overview}/appuserservice/selectAllSiteIdAndName`, 
    addVisitRecord: `/wl/service/visit/addOrUpdate`,

  },

  //客户档案
  customerFile: {
    getProvince: `/wl/userService/getProvince`,
    getUserList: `/wl/userService/getUserList`,
  },

  //客户通知
  customerNote: {
    getAlarmType: `/wl/inform/getAlarmType`,
    getList: `/wl/inform/getList`,
  },

  //维保提醒
  maintainRemind: {
    getMaintainRemindData: `/wl/maintain/plan/getPlan`,
    getUserTree: ` /wl/inform/getUserList`,
    sendMessage: ` /wl/phone/sendMessage`,
    finishPlan: `/wl/maintain/plan/finishPlan`,
  }
  /* 报警信息 */
  
}
