// 数据汇集
const realTime = '/realTime/';
// 统计分析
const analysis = '/analysis/';
// 遥测站管理
const siteManagement = '/siteManagement/';
// 日志管理
const logManagement = '/logManagement/';

// 监测井管理
const wellManagement = '/wellManagement/';

// 入河排污口管理
// 基础信息管理
const pollutionManagement = '/into/sewage/';

// 水功能区管理
// 基础信息管理
const areaManagement = '/areaManagement/';
export default {
  // 水资源信息服务
  //数据汇集
  realTime: {
    getRealTimeInfo: realTime + 'getRealTimeInfo',
    getDetailInfo: realTime + 'getDetailInfo',
    getPageList: realTime + 'getPageList',
    getMessageInfo: realTime + 'getMessageInfo',
    saveMessageInfo: realTime + 'saveMessageInfo',
    sendMessage: realTime + 'sendMessage',
    getRecentWater: realTime + 'getRecentWater',
  },
  //统计分析
  analysis: {
    getAllCompany: analysis + 'getAllCompany',
    getPageList: analysis + 'getPageList',
    getDetailInfo: analysis + 'getDetailInfo',
    exportAnalysis: '/analysis/export',
  },
  //遥测站管理
  siteManagement: {
    getSiteList: siteManagement + 'getSiteList',
    exportList: siteManagement + 'exportList',
    deleteSite: siteManagement + 'deleteSite',
    addOrUpdateSite: siteManagement + 'addOrUpdateSite'
  },
  //日志管理
  logManagement: {
    getLogList: logManagement + 'getLogList',
    exportLogList: logManagement + 'exportLogList'
  },

  // 地下水管理
  // 监测井管理
  wellManagement: {
    addOrUpdateWell: wellManagement + 'addOrUpdateWell',
    getWellList: wellManagement + 'getWellList',
    getChangeList: wellManagement + 'getChangeList',
    exportWellList: wellManagement + 'exportWellList',
  },
  reportAccount: {
    getReportList: '/monitorStandingBook/getReportList',
    addOrUpdateReportInfo: '/monitorStandingBook/addOrUpdateReportInfo',
    getReportDetail: '/monitorStandingBook/getReportDetail',
    downloadReportMould: '/monitorStandingBook/downloadReportMould',
    exportReport: '/monitorStandingBook/exportReport',
    calculatorReportDetail: '/monitorStandingBook/calculatorReportDetail',
    importReport: '/xcwrm/monitorStandingBook/importReport',
  },

  // 入河排污口管理
  // 基础信息管理
  pollutionManagement: {
    basicInformation: {
      saveOrUpdate: pollutionManagement + 'one/saveOrUpdate',
      getResults: pollutionManagement + 'normal/getResults',
      exportExcel: pollutionManagement + 'normal/exportExcel',
      getEmissionTypeTypes: pollutionManagement + 'normal/getEmissionTypeTypes',
      getIntoRiverTypeTypes: pollutionManagement + 'normal/getIntoRiverTypeTypes',
      getStateTypes: pollutionManagement + 'normal/getStateTypes',
      getFunctionAreaCode: pollutionManagement + 'getFunctionAreaCode',
      exportAll: pollutionManagement + 'exportAll/baseInfo',
    },
    monitoringInformation: {
      saveOrUpdate: pollutionManagement + 'monitor/saveOrUpdate',
      getResults: pollutionManagement + 'monitor/getResults',
      exportExcel: pollutionManagement + 'monitor/exportExcel',
      getOutletResults: pollutionManagement + 'normal/getOutletResults',
      exportAll: pollutionManagement + 'exportAll/monitorInfo',
    },
    unitInformation: {
      saveOrUpdate: pollutionManagement + 'two/saveOrUpdate',
      getResults: pollutionManagement + 'unloadCompany/getResults',
      exportExcel: pollutionManagement + 'unloadCompany/exportExcel',
      getIndustryTypes: pollutionManagement + 'unloadCompany/getIndustryTypes',
      getIsKeySourceTypes: pollutionManagement + 'unloadCompany/getIsKeySourceTypes',
      exportAll: pollutionManagement + 'exportAll/companyInfo',
    }
  },

  // 水功能区管理
  // 基础信息管理
  areaManagement: {
    deleteAreas: areaManagement + 'deleteAreas',
    addOrUpdateArea: areaManagement + 'addOrUpdateArea',
    getAreaList: areaManagement + 'getAreaList',
    getAreaChangeList: areaManagement + 'getAreaChangeList',
    exportAreaList: areaManagement + 'exportAreaList',
    getPartitionList: areaManagement + 'getPartitionList'
  },

  // 水质评价分析
  waterAnalysis: {
    getPollutantRate: '/qualityMap/getPollutantRate', //主要污染物分布
    getWaterQualified: '/qualityMap/getWaterQualified', //各类功能区水质达标情况,
    getQualityEvaluate: '/qualityMap/getQualityEvaluate', //水质整体评价
    nowWaterQualityTargetType: '/water/quality/nowWaterQualityTargetType', //水质评价分析-现状水质类型接口,
    getQualityResults: '/water/quality/getQualityResults', //水质评价分析-分页查询
    update: '/water/quality/update', //水质评价分析-编辑
    getFactorList: '/monitorFactor/getFactorList', //查询监测因子列表
    downloadTemplate: '/water/quality/downloadTemplate',
    downloadWaterQuality: '/water/quality/downloadWaterQuality',
    uploadTemplate: '/water/quality/uploadTemplate',
  }
}
