import axios from 'axios'

axios.defaults.withCredentials = false; //配置为true
let base = 'http://127.0.0.1:6002';
export const test = 'http://127.0.0.1:6002';

/*export const requestLogin = params => {
    return axios({
        method: 'POST',
        url: `${base}/login/userLogin`,
        auth: params
    })
    .then(res => res.data);
};*/

export const requestLogin = params => {
    return axios.post(`${base}/login/userLogin`, params).then(res => res.data);
};


export const setpwd = params => {
    return axios.post(`${base}/setpwd`, params);
};

export const getUserListPage = params => {
    return axios.get(`${base}/users/listpage`, { params: params });
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, { params: params });
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/bathremove`, { params: params });
};




// 获取项目
export const getData = (headers, params) => {
    return axios.get(`${base}/api/data/data_list`, { params: params, headers:headers}).then(res => res.data); 
};


// 获取项目
export const getStrategy = (headers, params) => {
    return axios.get(`${base}/api/strategy/strategy_list`, { params: params, headers:headers}).then(res => res.data); 
};


// 获取项目动态
export const getProjectDynamicList = (headers, params) => {
    return axios.get(`${base}/api/dynamic/dynamic`, { params: params, headers:headers}).then(res => res.data); };

// 获取项目详情
export const getProjectDetail = (headers, params) => {
    return axios.get(`${base}/api/title/project_info`, { params: params, headers:headers}).then(res => res.data); };

// 添加策略
export const addStrategy = (headers, params) => {
    return axios.post(`${base}/api/strategy/add_strategy`, params, {headers}).then(res => res.data); };

// 删除策略
export const delStrategy = (headers, params) => {
    return axios.post(`${base}/api/strategy/del_strategy`, params, {headers}).then(res => res.data); };

// 修改项目
export const updateStrategy = (headers, params) => {
    return axios.post(`${base}/api/strategy/update_strategy`, params, {headers}).then(res => res.data); };

// 禁用项目
export const disableStrategy = (headers, params) => {
    return axios.post(`${base}/api/strategy/disable_strategy`, params, {headers}).then(res => res.data); };
// 启用项目
export const enableStrategy = (headers, params) => {
    return axios.post(`${base}/api/strategy/enable_strategy`, params, {headers}).then(res => res.data); };

// 获取项目成员
export const getProjectMemberList = (headers, params) => {
    return axios.get(`${base}/api/member/project_member`, { params: params, headers:headers}).then(res => res.data); };

// 获取所有用户
export const getAllUserList = (headers, params) => {
    return axios.get(`${base}/api/member/alluserlist`, { params: params, headers:headers}).then(res => res.data); };


// 获取注册的模型服务列表
export const getModelService = (headers, params) => {
    return axios.get(`${base}/api/serving/service_total`, { params: params, headers:headers}).then(res => res.data); };

// 获取接口分组列表
export const getApiGroupList = (headers, params) => {
    return axios.get(`${base}/api/api/group`, { params: params, headers:headers}).then(res => res.data); };
// 添加接口分组
export const addApiGroup = (headers, params) => { return axios.post(`${base}/api/api/add_group`, params, {headers}).then(res => res.data); };
// 修改接口分组
export const updateApiGroup = (headers, params) => {
    return axios.post(`${base}/api/api/update_name_group`, params, {headers}).then(res => res.data); };
// 删除接口分组
export const delApiGroup = (headers, params) => {
    return axios.post(`${base}/api/api/del_group`, params, {headers}).then(res => res.data); };

// 添加接口
export const addApiDetail = (headers, params) => {
    return axios.post(`${base}/api/serving/add_service`, params, {headers}).then(res => res.data); };

//获取模型存储信息 API在workspace
export const getModelReposAPI = (headers, params) => {
    return axios.get(`${base}/api/serving/model_repos`, { params: params, headers:headers}).then(res => res.data); };

//模型部署操作
export const hostModel = (headers, params) => {
    return axios.post(`${base}/api/api/host_model`, params, {headers}).then(res => res.data); };

//新增实验
export const addCase = (headers, params) => {
    return axios.post(`${base}/api/automation/add_case`, params, {headers}).then(res => res.data); };
//修改实验
export const updateCase = (headers, params) => {
    return axios.post(`${base}/api/automation/update_case`, params, {headers}).then(res => res.data); };


export const getTestTenTime = (headers, params) => {
    return axios.post(`${base}/api/automation/update_case22`, params, {headers}).then(res => res.data); };

//修改实验
export const absetWinner = (headers, params) => {
    return axios.post(`${base}/api/automation/absetWinner`, params, {headers}).then(res => res.data); };



// 获取建模空间地址
export const getJupyterURL = (headers, params) => {
    return axios.get(`${base}/api/workspace/getjupyterurl`, { params: params, headers:headers}).then(res => res.data); };


// 获取自动化测试结果
export const getTestResultList = (headers, params) => {
    return axios.get(`${base}/api/report/auto_test_report`, { params: params, headers:headers}).then(res => res.data); };

export const getdrawPieChart = () => {
    return axios.get(`${base}/getdrawPieChart`);
};

export const getdrawLineChart = () => {
    return axios.get(`${base}/getdrawLineChart`);
};

// 添加基础任务信息
export const addBaseTaskJob = (headers, params) => {
    return axios.post(`${base}/api/tasks/add_base_task_job`, params, {headers}).then(res => res.data); };
// 更新基础任务信息
export const updateBaseTaskJob = (headers, params) => {
    return axios.post(`${base}/api/tasks/update_base_task_job`, params, {headers}).then(res => res.data); };


// 获取task列表
export const getTasks = (headers, params) => {
    return axios.get(`${base}/api/tasks/task_list`, { params: params, headers:headers}).then(res => res.data); };



// 获取接口分组列表 /api/api/group 暂时先用实验的分组信息
//export const getApiGroupList = (headers, params) => {
//    return axios.get(`${base}/api/automation/group`, { params: params, headers:headers}).then(res => res.data); };


//export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

/*export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }
*/