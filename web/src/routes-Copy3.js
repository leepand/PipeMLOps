

const Home = () => import('./views/Home.vue');
const projectList = () => import('./views/ProjectList.vue');
const ProjectInfo = () => import('./views/Project.vue');
const ProjectTitle = () => import('./views/project/projectTitle/ProjectTitle.vue');
const globalHost = () => import('./views/project/global/Globalhost.vue');


let routes =  [
    {
      path: '/login',
      component: () => import('./views/Login.vue'),
      name: '',
      hidden: true
    },
    {
      path: '/404',
      component: () => import('./views/404.vue'),
      name: '',
      hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        projectHidden: true,
        children: [
            { path: '/projectList', component: projectList, iconCls:'el-icon-bars', name: '项目列表'},
            // { path: '/robot', component: robot, iconCls:'fa fa-id-card-o', name: '消息机器人', meta: { keepAlive: false }},
            //{ path: '/about', component: About, iconCls:'fa fa-address-card', name: '关于我们'},
            ]
    },
    {
        path: '*',
        hidden: true,
        projectHidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/projects/project=:project_id',
        component: ProjectInfo,
        name: '项目',
        hidden: true,
        children: [
            {   path: '/ProjectTitle/project=:project_id', component: ProjectTitle, name: '项目概况', leaf: true},
            {   path: '/GlobalHost/project=:project_id', component: globalHost, name: 'Host配置', leaf: true},
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
    }

  ]
export default routes;
