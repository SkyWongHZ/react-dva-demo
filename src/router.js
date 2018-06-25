import React from 'react';
import {Router, Route, IndexRoute} from 'dva/router';
import App from './components/PublicComponents/layout/App';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

//驾驶舱
import Page from './routes/DispatchingSystem/Cockpit/index';
// import AlarmDetails from './routes/AlarmDetails/AlarmDetails';

// //水资源信息服务
// import AlarmInformation from './routes/EmergencyDispatch/AlarmInformation/DispatchCenter';
// import EventManagement from './routes/EmergencyDispatch/EventManagement/EventManagement';
// import SuperviseHandling from './routes/EmergencyDispatch/SuperviseHandling/DispatchCenter';

// //应急资源
// import ContingencyPlan from './routes/EmergencyResource/ContingencyPlan/EmergencyPlanning';
// import EmergencyKnowledge from './routes/EmergencyResource/EmergencyKnowledge/EmergencyKnowledge';
// import Materials from './routes/EmergencyResource/Materials/Materials';
// import Specialist from './routes/EmergencyResource/Specialist/Specialist';

// 报警管理
import AlarmInformation from './routes/ResourcedDistribution/AlarmInformation/AlarmInformation';
import AlarmStatistics from './routes/ResourcedDistribution/AlarmStatistics/AlarmStatistics';
import AlarmInformationNew from './routes/ResourcedDistribution/AlarmInformation/AlarmInformationNew';


// 设备反控
import Countercharge from './routes/Countercharge/Countercharge/Countercharge';
import CounterchargeEdit from './routes/Countercharge/CounterchargeEdit/CounterchargeEdit';

//资源配置
import MonitoringType from './routes/ResourcedDistribution/MonitoringType/MonitoringType';
import FactorManagement from './routes/ResourcedDistribution/FactorManagement/FactorManagement';
import MonitoringSite from './routes/ResourcedDistribution/MonitoringSite/MonitoringSite';
import DeviceManagement from './routes/ResourcedDistribution/DeviceManagement/DeviceManagement';
import InstrumentManagement from './routes/ResourcedDistribution/InstrumentManagement/InstrumentManagement';
import Configuration from './routes/ResourcedDistribution/Configuration/Configuration';
import FlowChartManagement from './routes/ResourcedDistribution/FlowChartManagement/FlowChartManagement';
import FlowChartManagementEdit from './routes/ResourcedDistribution/FlowChartManagementEdit/FlowChartManagementEdit';
// import Telemetry from './routes/ResourcedDistribution/Telemetry/Telemetry';

// // 系统管理
// import UserManagement from './routes/SystemManagement/UserManagement/UserManagement';
// import AuthorityManagement from './routes/SystemManagement/AuthorityManagement/AuthorityManagement';
// import RoleManagement from './routes/SystemManagement/RoleManagement/RoleManagement';
// 系统管理
import UserManagement from './routes/SystemManagement/UserManagement/UserManagement';
import AuthorityManagement from './routes/SystemManagement/AuthorityManagement/AuthorityManagement';
import RoleManagement from './routes/SystemManagement/RoleManagement/RoleManagement';


// 用户服务
import Clientele from './routes/CustomerService/Clientele/Clientele';
// import Configuration from './routes/CustomerService/Configuration/Configuration';
import Customer from './routes/CustomerService/Customer/Customer';
import MaintainRemind from './routes/CustomerService/MaintainRemind/MaintainRemind';
import VisitRecord from './routes/ResourcedDistribution/VisitRecord/VisitRecord';
import MaintenanceRecord from './routes/ResourcedDistribution/MaintenanceRecord/MaintenanceRecord';

// import Test from './routes/test';

function RouterConfig ({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        {/* 应急调度 */}
        {/* <Route path="alarmInformation" component={AlarmInformation} breadcrumbName="应急调度/报警信息"/>
        <Route path="eventManagement" component={EventManagement}  breadcrumbName="应急调度/事件管理"/>
        <Route path="superviseHandling" component={SuperviseHandling} breadcrumbName="应急调度/督促处理"/> */}

        {/* 应急资源 */}
        {/* <Route path="contingencyPlan" component={ContingencyPlan} breadcrumbName="应急资源/应急预案" />
        <Route path="emergencyKnowledge" component={EmergencyKnowledge} breadcrumbName="应急资源/应急知识管理" />
        <Route path="materials" component={Materials} breadcrumbName="应急资源/应急物资" />
        <Route path="specialist" component={Specialist} breadcrumbName="应急资源/应急专家" /> */}

        {/* 报警管理 */}
        <Route path="alarmInformation" component={AlarmInformation} breadcrumbName="报警管理/报警信息" />
        <Route path="alarmStatistics" component={AlarmStatistics} breadcrumbName="报警管理/报警统计" />
        <Route path="alarmInformationNew" component={AlarmInformationNew} breadcrumbName="报警管理/报警统计dva版本" />
        

        {/*资源配置  */}
        <Route path="monitoringType" component={MonitoringType} breadcrumbName="资源配置/监测类型管理" />
        <Route path="factorManagement" component={FactorManagement} breadcrumbName="资源配置/监测因子管理" />
        <Route path="monitoringSite" component={MonitoringSite} breadcrumbName="资源配置/项目管理"/>
        {/* <Route path="configuration" component={Configuration} breadcrumbName="资源配置/组态管理"/> */}
        <Route path="flowChartManagement" component={FlowChartManagement} breadcrumbName="资源配置/组态管理"/>
        <Route path="flowChartManagementEdit" component={FlowChartManagementEdit} breadcrumbName="资源配置/组态管理"/>
        <Route path="DeviceManagement" component={DeviceManagement} breadcrumbName="资源配置/ 设备管理" />
        <Route path="InstrumentManagement" component={InstrumentManagement} breadcrumbName="资源配置/仪器管理" />
        
        {/* 用户服务 */}
        <Route path="clientele" component={Clientele} breadcrumbName="用户服务/客户通知" />
        <Route path="customer" component={Customer} breadcrumbName="用户服务/客户档案" />
        <Route path="maintainRemind" component={MaintainRemind} breadcrumbName="用户服务/维养提醒" />
        {<Route path="visitRecord" component={VisitRecord} breadcrumbName="用户服务/回访记录" />}
        {<Route path="maintenanceRecord" component={MaintenanceRecord} breadcrumbName="用户服务/维养记录" />}
      

        {/* 系统配置 */}
        <Route path="UserManagement" component={UserManagement} breadcrumbName="系统管理/用户管理" />
        <Route path="RoleManagement" component={RoleManagement} breadcrumbName="系统管理/角色管理" />
        <Route path="AuthorityManagement" component={AuthorityManagement} breadcrumbName="系统管理/权限管理" /> */}

      

        
        <Route path="AuthorityManagement" component={AuthorityManagement} breadcrumbName="系统管理/权限管理" />

        {/* 设备反控 */}
        <Route path="countercharge" component={Countercharge} breadcrumbName="系统管理/设备反控" />
        <Route path="counterchargeEdit" component={CounterchargeEdit} breadcrumbName="系统管理/设备反控" />
      </Route>
      {/* 驾驶舱 */}
      <Route path="cockpit" component={Page} breadcrumbName="驾驶舱"/>
      {/* <Route path="alarmDetails" component={AlarmDetails} breadcrumbName="报警详情"/> */}
      
     
     
    </Router>
  );
}

export default RouterConfig;
