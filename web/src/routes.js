const NotFound = () => import('./views/common/404.vue');
const Login = () => import('./views/common/Login.vue');

const personalCenter =() => import ('./views/personalCenter/index.vue');

const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');
const DataCenter = () => import('./views/DataCenter.vue');

const Rd = () => import('./views/Rd.vue');
const Workspace = () => import('./views/Workspace.vue');
const strategylist = () => import('./views/Strategylist.vue');
const StrategyInfo = () => import('./views/Strategy.vue');

const ProjectTitle = () => import('./views/project/projectTitle/ProjectTitle.vue');
const TaskCenter = () => import('./views/project/tasks/ScheduledJobs.vue');
const modelService = () => import('./views/project/modelServing/modelService.vue');
const detail2 = () => import('./views/project/modelServing/updateApi/ApiForm.vue');
const ApiInfo2 = () => import('./views/project/modelServing/updateApi/serviceDetails.vue');

const ProjectMember = () => import('./views/project/ProjectMember.vue');
const ProjectDynamic = () => import('./views/project/ProjectDynamic.vue');

//model service
const API = () => import('./views/project/api/API.vue');
const ApiList = () => import('./views/project/api/ApiList.vue');
const ApiListGroup = () => import('./views/project/api/ApiListGroup.vue');
const FestTest = () => import('./views/project/api/FestTest.vue');
const addApi = () => import('./views/project/api/Addapi.vue');
const detail = () => import('./views/project/api/updateApi/ApiForm.vue');
const ApiInfo = () => import('./views/project/api/updateApi/ApiInfo.vue');
const modelLogs = () => import('./views/project/api/updateApi/ModelLogs.vue');
const UpdateApi = () => import('./views/project/api/updateApi/UpdateApi.vue');
const ApiDynamic = () => import('./views/project/api/updateApi/ApiDynamic.vue');
const TestReport = () => import('./views/project/automation/TestReport.vue');
const ModelRunLogs = () => import('./views/project/api/updateApi/ModelRunLogs.vue');
// A/B testing
const AutomationTest = () => import('./views/project/abtest/AutomationTest.vue');
const CaseList = () => import('./views/project/abtest/CaseList.vue');
const CaseListGroup = () => import('./views/project/abtest/CaseListGroup.vue');
const CaseApiList = () => import('./views/project/abtest/CaseApiList.vue');
const AddCaseApi = () => import('./views/project/abtest/AddCaseApi.vue');
const abCaseDetails = () => import('./views/project/abtest/abCaseDetails.vue');

const callReport = () => import('./views/project/api/updateApi/CallReport.vue');
/*const globalHost = () => import('./views/project/global/Globalhost.vue');
const API = () => import('./views/project/api/API.vue');
const ApiList = () => import('./views/project/api/ApiList.vue');
const ApiListGroup = () => import('./views/project/api/ApiListGroup.vue');
const FestTest = () => import('./views/project/api/FestTest.vue');
const addApi = () => import('./views/project/api/Addapi.vue');
const detail = () => import('./views/project/api/updateApi/ApiForm.vue');
const ApiInfo = () => import('./views/project/api/updateApi/ApiInfo.vue');
const testApi = () => import('./views/project/api/updateApi/TestApi.vue');
const UpdateApi = () => import('./views/project/api/updateApi/UpdateApi.vue');
const ApiDynamic = () => import('./views/project/api/updateApi/ApiDynamic.vue');
const AutomationTest = () => import('./views/project/automation/AutomationTest.vue');
const CaseList = () => import('./views/project/automation/CaseList.vue');
const CaseListGroup = () => import('./views/project/automation/CaseListGroup.vue');
const CaseApiList = () => import('./views/project/automation/CaseApiList.vue');
const AddCaseApi = () => import('./views/project/automation/AddCaseApi.vue');
const UpdateCaseApi = () => import('./views/project/automation/UpdateCaseApi.vue');
const TestReport = () => import('./views/project/automation/TestReport.vue');
const ProjectMember = () => import('./views/project/ProjectMember.vue');
const ProjectDynamic = () => import('./views/project/ProjectDynamic.vue');
const ProjectTitle = () => import('./views/project/projectTitle/ProjectTitle.vue');
const ProjectReport = () => import('./views/project/ProjectReport.vue');
const register = () => import('./views/register.vue')*/

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        projectHidden: true
    },
       /* {
        path: '/register',
        component: register,
        name: '',
        hidden: true,
        projectHidden: true
    },*/
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true,
        projectHidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls:'el-icon-setting',
        projectHidden: true,
        leaf: true,
        children: [
            { path: '/strategyList', component: strategylist, iconCls:'el-icon-setting', name: '操盘中心'},
            // { path: '/robot', component: robot, iconCls:'fa fa-id-card-o', name: '消息机器人', meta: { keepAlive: false }},
            ]
    },
    /*{
        path: '/',
        component: Home,
        name: '',
        iconCls:'fa fa-address-card',
        projectHidden: true,
        leaf: true,
        children: [
        { path: '/about', component: About, iconCls:'fa fa-address-card', name: '关于我们'},
            ]
    },*/
    {
        path: '/',
        component: Home,
        name: '',
        iconCls:'fa fa-cart-plus',
        projectHidden: true,
        leaf: true,
        children: [
        { path: '/datacenter', component: DataCenter, iconCls:'fa fa-cart-plus', name: '数据中心'},
            ]
    },
    
    {
        path: '/',
        component: Home,
        name: '',
        iconCls:'fa fa-edit',
        projectHidden: true,
        leaf: true,
        children: [
        { path: '/r&d', component: Rd, iconCls:'fa fa-address-card', name: '记录黑名单'},
            ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls:'fa fa-star-o',
        projectHidden: true,
        leaf: true,
        children: [
        { path: '/r&d', component: Rd, iconCls:'fa fa-address-card', name: '我的自选股'},
            ]
    },
    /*{
        path: '/',
        component: Home,
        name: '',
        iconCls:'fa fa-address-card',
        projectHidden: true,
        leaf: true,
        children: [
        { path: '/workspace', component: Workspace, iconCls:'fa fa-address-card', name: '建模空间1'},
            ]
    },*/
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        projectHidden: true,
        leaf: true,
        children: [
            { path: '/personalCenter/myinfo', component: personalCenter,name: '个人中心'},
        ]
    },
    {
        path: '*',
        hidden: true,
        projectHidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/strategy/strategy=:strategy_id',
        component: StrategyInfo,
        name: '项目',
        hidden: true,
        children: [
            {   path: '/ProjectTitle/strategy=:strategy_id', component: ProjectTitle, name: '项目概况', leaf: true},
            {   path: '/Tasks/strategy=:strategy_id', component: TaskCenter, name: '任务中心', leaf: true},
            {   path: '/api/strategy=:strategy_id',
                    component: API,
                    name: '模型服务',
                    leaf: true,
                    child: true,
                    children: [
                        {   path: '/apiList/strategy=:strategy_id', component: ApiList, name: '服务列表'},
                        {   path: '/apiList/strategy=:strategy_id/first=:firstGroup', component: ApiListGroup, name: '分组服务列表'},
                        {   path: '/fastTest/strategy=:strategy_id', component: FestTest, name: '快速测试'},
                        {   path: '/addApi/strategy=:strategy_id', component: addApi, name: '新增接口'},
                        {   path: '/testReport/strategy=:strategy_id', component: TestReport, name: '测试报告'},
                        {   path: '/detail/strategy=:strategy_id/api=:api_id',
                            component: detail,
                            name: '接口',
                            children: [
                                { path: '/apiInfo/strategy=:strategy_id/api=:api_id', component: ApiInfo, name: '基础信息'},
                                { path: '/modelLogs/strategy=:strategy_id/api=:api_id', component: modelLogs, name: '模型列表'},
                                { path: '/apiDynamic/strategy=:strategy_id/api=:api_id', component: ApiDynamic, name: '历史'},
                                
                            ]
                        },
                        { path: '/apiLogs/strategy=:strategy_id/api=:api_id', component: ModelRunLogs, name: '查看日志'},
                        //{ path: '/updateApi/project=:project_id/api=:api_id', component: UpdateApi, name: '修改'},
                        { path: '/callReport/strategy=:strategy_id/api=:api_id', component: callReport, name: '调用详情'},
                    ]
            },
            
            {   path: '/automationTest/strategy=:project_id',
                    component: AutomationTest,
                    name: '线上实验',
                    leaf: true,
                    child: true,
                    children: [
                        {   path: '/caseList/strategy=:strategy_id', component: CaseList, name: '实验列表'},
                        {   path: '/caseList/strategy=:strategy_id/first=:firstGroup', component: CaseListGroup, name: '分组实验列表'},
                        {   path: '/caseApiList/strategy=:strategy_id/case=:case_id', component: CaseApiList, name: '用例接口列表'},
                        {   path: '/addCaseApi/strategy=:strategy_id/case=:case_id', component: AddCaseApi, name: '添加新接口'},
                        {   path: '/abCaseDetails/strategy=:strategy_id/case=:case_id/api=:api_id', component: abCaseDetails, name: '查看实验详情'},
                        //{   path: '/testReport/project=:project_id', component: TestReport, name: '测试报告'},
                    ]
            },
            {   path: '/projectMember/strategy=:strategy_id', component: ProjectMember, name: '成员管理', leaf: true},
            {   path: '/projectDynamic/strategy=:strategy_id', component: ProjectDynamic, name: '项目动态', leaf: true},
            {   path: '/workspace/strategy=:strategy_id', component: Workspace, name: '建模空间', leaf: true},
            /*{   path: '/api/project=:project_id',
                    component: API,
                    name: 'API接口',
                    leaf: true,
                    child: true,
                    children: [
                        {   path: '/apiList/project=:project_id', component: ApiList, name: '接口列表'},
                        {   path: '/apiList/project=:project_id/first=:firstGroup', component: ApiListGroup, name: '分组接口列表'},
                        {   path: '/fastTest/project=:project_id', component: FestTest, name: '快速测试'},
                        {   path: '/addApi/project=:project_id', component: addApi, name: '新增接口'},
                        {   path: '/detail/project=:project_id/api=:api_id',
                            component: detail,
                            name: '接口',
                            children: [
                                { path: '/apiInfo/project=:project_id/api=:api_id', component: ApiInfo, name: '基础信息'},
                                { path: '/testApi/project=:project_id/api=:api_id', component: testApi, name: '测试'},
                                { path: '/apiDynamic/project=:project_id/api=:api_id', component: ApiDynamic, name: '历史'},
                            ]
                        },
                        { path: '/updateApi/project=:project_id/api=:api_id', component: UpdateApi, name: '修改'},
                    ]},
            {   path: '/automationTest/project=:project_id',
                    component: AutomationTest,
                    name: '自动化测试',
                    leaf: true,
                    child: true,
                    children: [
                        {   path: '/caseList/project=:project_id', component: CaseList, name: '用例列表'},
                        {   path: '/caseList/project=:project_id/first=:firstGroup', component: CaseListGroup, name: '分组用例列表'},
                        {   path: '/caseApiList/project=:project_id/case=:case_id', component: CaseApiList, name: '用例接口列表'},
                        {   path: '/addCaseApi/project=:project_id/case=:case_id', component: AddCaseApi, name: '添加新接口'},
                        {   path: '/updateCaseApi/project=:project_id/case=:case_id/api=:api_id', component: UpdateCaseApi, name: '修改接口'},
                        {   path: '/testReport/project=:project_id', component: TestReport, name: '测试报告'},
                    ]
            },
            {   path: '/projectMember/project=:project_id', component: ProjectMember, name: '成员管理', leaf: true},
            {   path: '/projectDynamic/project=:project_id', component: ProjectDynamic, name: '项目动态', leaf: true},
            {   path: '/projectReport/project=:project_id', component: ProjectReport, name: '自动化测试报告', leaf: true},*/
            ]
    },
];

export default routes;