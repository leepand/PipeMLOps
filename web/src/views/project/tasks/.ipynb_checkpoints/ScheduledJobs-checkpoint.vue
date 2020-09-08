<template>

    <div style="margin:35px">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model.trim="filters.name" placeholder="名称" @keyup.enter.native="getGlobalHost"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getBaseTaskJob">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native="getTimeTask"><div>设置定时任务</div></el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="project" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" min-width="5%">
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="15%" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="task_script" label="运行脚本" min-width="15%" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column  prop="unit" label="调度周期" min-width="15%" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-show="!scope.row.scheduled_name&&!scope.row.status">尚未设置调度</span>
                    <span v-show="scope.row.scheduled_name">{{scope.row.scheduled_name}}</span>
                </template>
            </el-table-column>
            <el-table-column  prop="task_type" label="启动方式" min-width="15%" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-show="!scope.row.scheduled_type&&!scope.row.status">尚未启动调度</span>
                    <span v-show="scope.row.scheduled_type==='timing'">定时</span>
                    <span v-show="scope.row.scheduled_type==='circulation'">循环</span>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="15%" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="10%" sortable>
                <template slot-scope="scope">
                    <img v-show="scope.row.status" src="../../../assets/icon-yes.svg"/>
                    <img v-show="!scope.row.status" src="../../../assets/icon-no.svg"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="15%">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" @click="getTimeTask(scope.$index, scope.row)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <!--<el-button type="info" size="small" @click="handleChangeStatus(scope.$index, scope.row)">{{scope.row.status===false?'启用':'禁用'}}</el-button>-->
                </template>
            </el-table-column>
        </el-table>


        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :page-count="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
            <el-form :model="editForm"  :rules="editFormRules" ref="editForm" label-width="80px">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model.trim="editForm.name" auto-complete="off"></el-input>  
                </el-form-item>
                <el-form-item label="所在路径" prop='task_path'>
                    <el-input v-model.trim="editForm.task_path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行脚本" prop='task_script'>
                    <el-input v-model.trim="editForm.task_script" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Host地址" prop='host'>
                    <el-input v-model.trim="editForm.host" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop='description'>
                    <el-input type="textarea" :rows="5" v-model="editForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增作业" :visible.sync="addFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>  
                </el-form-item>
                <el-form-item label="所在路径" prop='taskPath'>
                    <el-input v-model.trim="addForm.taskPath" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行脚本" prop='taskScript'>
                    <el-input v-model.trim="addForm.taskScript" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Host地址" prop='host'>
                    <el-input v-model.trim="addForm.host" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop='description'>
                    <el-input type="textarea" :rows="5" v-model="addForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

         <el-dialog title="定时任务" :visible.sync="taskVShow"  :close-on-click-modal="false" style="width: 70%; left: 15%">
            <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
                <el-form-item label="任务名称：" prop="name">
                    <el-input v-model.trim="form.name" placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="间隔：" prop="frequency" v-if="form.type === 'circulation'">
                    <el-row :span="24">
                        <el-col :span="14">
                            <el-input v-model.number="form.frequency" placeholder="间隔"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-select v-model="form.unit" placeholder="请选择">
                                <el-option v-for="item in unit" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="执行时间：" prop="timeArray" v-if="form.type === 'circulation'">
                    <el-date-picker  v-model="form.timeArray" type="datetimerange" :picker-options="pickerOptions2"
                                     range-separator="   至   " start-placeholder="开始日期" end-placeholder="结束日期" align="right" ></el-date-picker>
                </el-form-item>
                <el-form-item label="执行时间：" prop="time" v-if="form.type === 'timing'">
                    <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions1"></el-date-picker>
                </el-form-item>
                <el-form-item label="Tasks：" prop="Tasks">
                    <el-select v-model="form.Tasks"  placeholder="测试环境">
                        <el-option v-for="(item,index) in Tasks" :key="index+''" :label="item.name" :value="item.id">{{item.name}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="editLoading" @click.native="addTask">创建</el-button>
                    <el-button type="danger" :loading="delLoading" @click.native="delTask" :disabled="disDel">删除</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


    </div>
</template>

<script>
    //import NProgress from 'nprogress'
    import { test, getTasks, delHost, disableHost, enableHost,
    updateBaseTaskJob, addBaseTaskJob} from '../../../api/api'
     import moment from "moment"
    import $ from 'jquery'
    export default {
        data() {
            var checkIp = (rule, value, callback) => {
                if (!this.isValidIP(value)) {
                    return callback(new Error('IP地址格式错误'));
                } else {
                    return callback()
                }
            };
            return {
                sche_query:{"results":"1"},
                taskVShow: false,
                disDel: true,
                delLoading:false,
                form: {
                    name: "",
                    type: "circulation",
                    frequency: "",
                    unit: "m",
                    time: "",
                    timeArray: [],
                    Host: "",
                },
                formRules: {
                    name: [
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    frequency: [
                        { type: "number", required: true, message: '请输入时间间隔' },
                    ],
                    timeArray: [
                        { type: "array", required: true, message: '请选择执行时间' },
                    ],
                    time: [
                        { required: true, message: '请选择执行时间'},
                    ],
                    Host: [
                        { required: true, message: '请选择测试域名'},
                    ],
                    type: [
                        { required: true, message: '请选择任务类型', trigger: 'blur' },
                    ],
                },
                Host: [],
                Tasks:[],
                
                unit: [
                    {value: "m", label: "分"},
                    {value: "h", label: "时"},
                    {value: "d", label: "天"},
                    {value: "w", label: "周"},
                ],
                type: [ {value: "circulation", label: "循环"},
                    {value: "timing", label: "定时"},],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                pickerOptions2: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                
                filters: {
                    name: ''
                },
                project: [],
                sche_index:3,
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    task_path: [
                        { required: true, message: '请输入任务脚本所在路径', trigger: 'blur' },
                    ],
                    task_script: [
                        { required: true, message: '请输入需要执行的脚本', trigger: 'blur' },
                    ],
                    host: [
                        { required: true, message: '请输入host', trigger: 'blur' },
                    ],
                    description: [
                        { required: false, message: '请输入描述', trigger: 'blur' },
                        { max: 1024, message: '不能超过1024个字符', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    taskPath:'',
                    taskScript:'',
                    host: '',
                    description: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    taskPath: [
                        { required: true, message: '请输入任务脚本所在路径', trigger: 'blur' },
                    ],
                    taskScript: [
                        { required: true, message: '请输入需要执行的脚本', trigger: 'blur' },
                    ],
                    host: [
                        { required: true, message: '请输入host', trigger: 'blur' },
                        // { validator: checkIp, trigger: 'blur' }
                    ],
                    description: [
                        { required: false, message: '请输入描述', trigger: 'blur' },
                        { max: 1024, message: '不能超过1024个字符', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    taskPath:'',
                    taskScript:'',
                    host: 'Local',
                    description: ''
                }

            }
        },
        created(){
            //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
            this.form.Tasks = this.Tasks[0].id;
        },
        methods: {
            // IP格式验证
            isValidIP(ip) {
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var regPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$$/;

                return regPort.test(ip) || reg.test(ip);
            },
            getTimeTask: function (index, row){
                let self = this;
                self.Tasks=[];
                self.Tasks.push({"name":row.name,"id":row.id});
                self.form.Tasks= row.id;
                $.ajax({
                    type: "get",
                    url: test+"/api/tasks/get_time_task",
                    async: true,
                    data: {
                        project_id: self.$route.params.project_id,
                        task_id: Number(row.id),
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: (data) => {
                        if (data.code === '999999') {
                            console.log(data.data,"data.data_get")
                            try {
                                //self.form.type = "timing";
                                
                                //data.data.data.forEach((item) => {
                                    //if (item.status) {
                                        //self.Tasks.push(item)
                                    //}
                                //})
                                if (data.data){
                                    self.form.name = data.data.name;
                                self.form.type = data.data.type;
                                self.form.frequency = data.data.frequency;
                                if (self.form.type === 'timing') {
                                    self.form.unit = 'm'
                                } else {
                                    self.form.unit = data.data.unit;
                                }
                                self.form.time = data.data.startTime;
                                self.form.timeArray = [data.data.startTime, data.data.endTime];
                                self.form.Host = data.data.Host;
                                    self.disDel = false
                                }else{
                                    self.form.name = "";
                                self.form.type = "circulation";
                                self.form.frequency = "";
                                self.form.unit = "m";
                                self.form.time = "";
                                self.form.timeArray = [];
                                self.form.Host = "";
                                self.disDel = true
                                }
                               
                                
                                
                            } catch (e){
                                self.form.name = "";
                                self.form.type = "circulation";
                                self.form.frequency = "";
                                self.form.unit = "m";
                                self.form.time = "";
                                self.form.timeArray = [];
                                self.form.Host = "";
                                self.disDel = true
                            }
                            self.taskVShow = true
                            
                            //self.delLoading=true
                        }
                        else {
                            self.$message.error({
                                message: data.msg,
                                center: true,
                            })
                        }
                    },
                    error: function () {
                        self.taskVShow = true;
                        self.editLoading = false;
                        self.$message.error({
                            message: "失败",
                            center: true,
                        })
                    }
                })
            },
            //增加定时作业
            addTask(){
                let self = this;
                this.$refs.form.validate((valid) => {if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            console.log(self.form);
                            self.editLoading = true;
                            if(self.form.type === 'timing'){
                                self.form.unit="m";
                            }
                            let param = {
                                project_id: Number(self.$route.params.project_id),
                                task_id: Number(self.form.Tasks),//Number(self.form.Tasks),
                                name: self.form.name,
                                type: self.form.type,
                                frequency: Number(self.form.frequency),
                                unit: self.form.unit,
                                user_key:JSON.parse(sessionStorage.getItem('name'))
                            };
                            if (self.form.type === 'circulation') {
                                param['startTime'] = moment(self.form.timeArray[0]).format("YYYY-MM-DD HH:mm:ss");
                                param['endTime'] = moment(self.form.timeArray[1]).format("YYYY-MM-DD HH:mm:ss")
                            } else {
                                param['startTime'] = moment(self.form.time).format("YYYY-MM-DD HH:mm:ss");
                                param['endTime'] = moment(self.form.time).format("YYYY-MM-DD HH:mm:ss")
                            }
                            $.ajax({
                                type: "post",
                                url: test+"/api/tasks/add_time_task",
                                async: true,
                                data: JSON.stringify(param),
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                                },
                                timeout: 5000,
                                success: (data) => {
                                    if (data.code === '999999') {
                                        self.editLoading = false;
                                        self.taskVShow = false;
                                        self.getBaseTaskJob();
                                        self.$message({
                                            message: '添加成功',
                                            center: true,
                                            type: "success",
                                        })
                                    }
                                    else {
                                        self.editLoading = false;
                                        self.$message.error({
                                            message: data.msg,
                                            center: true,
                                        })
                                    }
                                },
                                error: function () {
                                    self.editLoading = false;
                                    self.$message.error({
                                        message: "失败",
                                        center: true,
                                    })
                                }
                            })
                        }
                    )}
                })
            },
            
            // 获取HOST列表
            getBaseTaskJob() {
                this.listLoading = true;
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id,
                    page: self.page,
                    name: self.filters.name
                };
                let headers = {
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getTasks(headers, params).then(_data => {
                    let { msg, code, data } = _data;
                    self.listLoading = false;
                    if (code === '999999') {
                        self.total = data.total;
                        self.project = data.data
                        self.project[self.sche_index].results = "data.data"
                        
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    let params = {
                        project_id: Number(this.$route.params.project_id),
                        ids: [row.id, ]
                    };
                    let headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    };
                    delHost(headers, params).then(_data => {
                        let { msg, code, data } = _data;
                        if (code === '999999') {
                            self.$message({
                                message: '删除成功',
                                center: true,
                                type: 'success'
                            })
                        } else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                        self.getGlobalHost()
                    });
                });
            },
            handleChangeStatus: function(index, row) {
                let self = this;
                this.listLoading = true;
                let params = {
                    project_id: Number(this.$route.params.project_id),
                    host_id: Number(row.id)
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                if (row.status) {
                    disableHost(headers, params).then(_data => {
                        let {msg, code, data} = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '禁用成功',
                                center: true,
                                type: 'success'
                            });
                            row.status = !row.status;
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                    });
                } else {
                    enableHost(headers, params).then(_data => {
                        let {msg, code, data} = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '启用成功',
                                center: true,
                                type: 'success'
                            });
                            row.status = !row.status;
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                    });
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getBaseTaskJob()
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                let self = this;
                let host = this.editForm.host.toLowerCase();
                if (host.indexOf("http://") ===0){
                    host = host.slice(7)
                }
                if (host.indexOf("https://") ===0){
                    host = host.slice(8)
                }
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.editLoading = true;
                            //NProgress.start();
                            let params = {
                                project_id: Number(this.$route.params.project_id),
                                id: Number(self.editForm.id),
                                name: self.editForm.name,
                                taskPath: self.editForm.task_path,
                                taskScript: self.editForm.task_script,
                                host: host,
                                description: self.editForm.description,
                                user_key:JSON.parse(sessionStorage.getItem('name'))
                            };
                            let headers = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            updateBaseTaskJob(headers, params).then(_data => {
                                let {msg, code, data} = _data;
                                self.editLoading = false;
                                if (code === '999999') {
                                    self.$message({
                                        message: '修改成功',
                                        center: true,
                                        type: 'success'
                                    });
                                    self.$refs['editForm'].resetFields();
                                    self.editFormVisible = false;
                                    self.getBaseTaskJob()
                                } else if (code === '999997'){
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                } else {
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                }
                            })
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                let host = this.addForm.host.toLowerCase();
                if (host.indexOf("http://") ===0){
                    host = host.slice(7)
                }
                if (host.indexOf("https://") ===0){
                    host = host.slice(8)
                }
                this.$refs.addForm.validate((valid) => {
                    console.log(valid);
                    if (valid) {
                        let self = this;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.addLoading = true;
                            //NProgress.start();
                            let params = {
                                project_id: Number(this.$route.params.project_id),
                                name: self.addForm.name,
                                host: host,
                                taskPath: self.addForm.taskPath,
                                taskScript: self.addForm.taskScript,
                                description: self.addForm.description,
                                user_key:JSON.parse(sessionStorage.getItem('name'))
                            };
                            let headers = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            addBaseTaskJob(headers, params).then(_data => {
                                let {msg, code, data} = _data;
                                self.addLoading = false;
                                if (code === '999999') {
                                    self.$message({
                                        message: '添加成功',
                                        center: true,
                                        type: 'success'
                                    });
                                    self.$refs['addForm'].resetFields();
                                    self.addFormVisible = false;
                                    self.getBaseTaskJob()
                                } else if (code === '999997'){
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                } else {
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    });
                                    self.$refs['addForm'].resetFields();
                                    self.addFormVisible = false;
                                    self.getBaseTaskJob()
                                }
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                let ids = this.sels.map(item => item.id);
                let self = this;
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.listLoading = true;
                    //NProgress.start();
                    let params = {
                        project_id: Number(this.$route.params.project_id),
                        ids: ids
                    };
                    let headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Token ' + JSON.parse(sessionStorage.getItem('token'))
                    };
                    delHost(headers, params).then(_data => {
                        let {msg, code, data} = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '删除成功',
                                center: true,
                                type: 'success'
                            })
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                        self.getBaseTaskJob()
                    })
                })
            }
        },
        mounted() {
            this.getBaseTaskJob();
            //this.getTimeTask();
        }
    }

</script>
<style lang="scss" scoped>
</style>
