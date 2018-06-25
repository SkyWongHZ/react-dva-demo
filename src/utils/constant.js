import moment from 'moment'
let constant = {
  // 水资源信息服务
  realTime: {
    pageNo: 1,
    pageSize: 10,
  },
  analysis: {
    pageNo: 1,
    pageSize: 5,
  },
  siteManagement: {
    pageIndex: 1,
    pageSize: 10,
  },
  logManagement: {
    pageIndex: 1,
    pageSize: 10,
    beginDate: +moment().subtract(1, 'M').hour(0).minute(0).second(0).millisecond(0),
    endDate: +moment().add(1, 'd').hour(0).minute(0).second(0).millisecond(0),
  },
  // 地下水管理
  // 监测井管理
  monitoringWellManagement: {
    pageIndex: 1,
    pageSize: 10,
  },
  reportAccount: {
    pageIndex: 1,
    pageSize: 10,
  },

  // 水功能区管理
  waterFunctionAreaManagement: {
    pageIndex: 1,
    pageSize: 10,
  },
  // 水质评价分析
  waterAnalysis: {
    pageIndex: 1,
    pageSize: 10,
  },
  // 入河排污口管理
  // 基础信息管理
  pollutionManagement: {
    pageIndex: 1,
    pageSize: 10,
  },

};
if(screen.width < 1920) {
    constant = {
      realTime: {
        pageNo: 1,
        pageSize: 5,
      },
      analysis: {
        pageNo: 1,
        pageSize: 3,
      },
      siteManagement: {
        pageIndex: 1,
        pageSize: 5,
      },
      logManagement: {
        pageIndex: 1,
        pageSize: 5,
        beginDate: +moment().subtract(1, 'M').hour(0).minute(0).second(0).millisecond(0),
        endDate: +moment().hour(0).minute(0).second(0).millisecond(0),
      },

      monitoringWellManagement: {
        pageIndex: 1,
        pageSize: 5,
      },
      reportAccount: {
        pageIndex: 1,
        pageSize: 5,
      },

      // 水功能区管理
      waterFunctionAreaManagement: {
        pageIndex: 1,
        pageSize: 5,
      },
      // 水质评价分析
      waterAnalysis: {
        pageIndex: 1,
        pageSize: 5,
      },

      // 入河排污口管理
      // 基础信息管理
      pollutionManagement: {
        pageIndex: 1,
        pageSize: 5,
      }
    }
}

export default constant
