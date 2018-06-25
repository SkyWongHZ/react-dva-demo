import dva from 'dva';
import './less/index.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva();

// 2. Pluginsss
app.use(createLoading({namespace: 'loading', effects: true}));

// 3. Model
app.model(require('./models/cockpit'));
app.model(require('./models/alarmInformationNew'));
// app.model(require('./models/InformationService/remoteMonitoring'))
// app.model(require('./models/InformationService/statisticAnalysis'))
// app.model(require('./models/InformationService/siteManager'))
// app.model(require('./models/InformationService/logManagement'))
// app.model(require('./models/GroundwaterManagement/monitoringWellManagement'))
// app.model(require('./models/GroundwaterManagement/reportAccount'))
// app.model(require('./models/PollutionManagement/pollutionManagement'))
// app.model(require('./models/PollutionManagement/basicInformation'))
// app.model(require('./models/PollutionManagement/monitoringInformation'))
// app.model(require('./models/PollutionManagement/unitInformation'))
// app.model(require('./models/WaterFunctionAreaManagement/basicInformationManagement'))
// app.model(require('./models/WaterFunctionAreaManagement/waterAnalysis'))
// app.model(require('./models/ResourcesScheduling/waterQuality'))

// app.model(require('./models/AppModel'));
// app.model(require('./models/ProjectInfoMaintainModel'));
// app.model(require('./models/WeeklyFormModel'));
// app.model(require('./models/LoginModel'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
