<template>
    <!--列表-->
    <el-row class="member-manage">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <!--<el-form-item>
                    <el-input v-model.trim="filters.name" placeholder="名称" @keyup.enter.native="getGlobalHost"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getGlobalHost">查询</el-button>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="primary" style="margin-left:5px"  @click="addProjMem"><i class="el-icon-plus" style="margin-right: 5px;margin-left:10px"></i>新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        
     
        
        <el-dialog title="成员管理" :visible.sync="searchUserListVisible" :close-on-click-modal="false"  @open="getProjectMember()">
            
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-select v-model="value" multiple filterable remote reserve-keyword
                               style="display: block; user-select: none;"
                               @change="changeOption" 
                               placeholder="搜索用户或组"
                               :remote-method="remoteMethod"
                               :loading="loading">
                        <el-option v-for="item in options" 
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        <span style="float: left">{{ item.value }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>
                        <!--<span>{{item.value}}&#10;</span>
                        <span>{{item.email}}</span>-->
                        </el-option>
                    </el-select>
                </el-col >
                <!--<el-col :span="4" >
                    <div class="privOPS">
                    <el-button style="float:right;margin-left:0px;" :type="Info" @click.native="addMemSubmit" 
                               :loading="searchUser" 
                               :disabled="disabled">授权</el-button>
                    </div>
                </el-col>-->
            </el-row>
            <el-row :gutter="10" >
                <el-col :span="24" divided>
                    <p style="color:#999">已授权给{{prov_users_cnt}}位用户或用户组</p>
                    <el-table :data="searchUserList" highlight-current-row v-loading="apiListLoading"
                              style="width: 100%;" :show-header="false" max-height="400" @selection-change="selsChange">
                        <!--<el-table-column type="selection" width="55">
                        </el-table-column>-->
                        <el-table-column prop="user_name" label="登录名" min-width="35%" sortable>
                        </el-table-column>
                        <el-table-column prop="userEmail" label="email" min-width="65%" sortable>
                        </el-table-column>
                    </el-table>
                </el-col>
                
                
            </el-row>
            <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChangeApi" :page-size="20" :page-count="total" style="float:right;">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="searchUserListVisible = false">取消</el-button>
                <el-button :type="Info" @click.native="addMemSubmit" :loading="searchUser" :disabled="disabled">授权</el-button>
            </div>
        </el-dialog>

        <!--
        <p style="color:#999">*注<strong>: </strong>自动化测试结果会发送给所有项目成员</p>
        <div style="margin-bottom: 20px;font-size: 20px">
            <div>
                <div style="display: inline">测试报告发送账号： </div>
                <div v-if="!reportFrom" style="display: inline">未添加账号</div>
                <div v-if="reportFrom" style="display: inline">{{reportFrom}}</div>

                &nbsp;&nbsp;
                <i class="el-icon-edit" style="cursor:pointer;display: inline" @click="editFormVisible=true"></i>
                                &nbsp;&nbsp;
                <i v-if="reportFrom" class="el-icon-delete" style="cursor:pointer;display: inline" @click="DelEmail()"></i>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
		    <el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editForm">
                <el-form-item label="发送人邮箱:" prop="reportFrom">
                    <el-input v-model.trim="editForm.reportFrom" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名:" prop="mailUser">
                    <el-input v-model.trim="editForm.mailUser" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="口令:" prop="mailPass">
                    <el-input v-model.trim="editForm.mailPass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱服务器:" prop="mailSmtp">
                    <el-input v-model.trim="editForm.mailSmtp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
		</el-dialog>-->
        
        
        
        <el-col :span="24">
            <el-table :data="memberData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="user_name" label="姓名" min-width="30%" sortable>
                </el-table-column>
                <el-table-column prop="permissionType" label="权限" min-width="30%" sortable>
                </el-table-column>
                <el-table-column prop="wechat_key" label="微信号" min-width="15%" sortable>
                </el-table-column>
                <el-table-column prop="userEmail" label="邮箱地址" min-width="15%" sortable>
                </el-table-column>
                <el-table-column label="操作" min-width="10%">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">移除</el-button>
                    <!--<el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>-->
                </template>
            </el-table-column>
                
            </el-table>
            <!--工具条-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :page-count="total" style="float:right;">
            </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
    import { test, getProjectMemberList, getEmailConfigDetail, delEmailConfig, addEmailConfig, getAllUserList} from "../../api/api";
    import $ from 'jquery'
    export default {
        data() {
            return {
                disabled:true,
                Info:"info",
                prov_users_cnt:0,
                options: [],
                value: [],
                list: [],
                loading: false,
                states: [],
                searchUserListVisible: false,
                searchUserList:[],
                searchUser:false,
                sels: [],//列表选中列
                filters: {
                    name: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
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
                    host: '',
                    description: ''
                },
                
                memberData: [],
                total: 0,
                page: 1,
                listLoading: false,
                reportFrom: "",
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    reportFrom: [
                        { required: true, message: '请输入发送人', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ],
                    mailUser: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ],
                    mailPass: [
                        { required: true, message: '请输入口令', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ],
                    mailSmtp: [
                        { required: false, message: '请输入邮件服务器', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                },
            }
        },
        methods: {
            changeOption(){
                console.log(this.value,this.value.length)
                if(this.value.length<1){
                    this.disabled=true;
                    this.Info="info";
                }else{
                    this.disabled=false;
                    this.Info="primary";
                }
                
                let obj = {}
                obj = this.options.find(
                    item=>{
                        
                        return item.ProcessNode=this.value //筛选出对应数据
                    }
                )
               this.sels = this.value;
            },
            
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.options = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            },
    
        
            //删除项目成员
            handleDel: function (index, row) {
                this.$confirm('确认移除该成员吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    $.ajax({
                        type: "post",
                        url: test+"/api/member/delprojmem",
                        async: true,
                        data: JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            user_ids: [row.mem_user],
                            user_key:JSON.parse(sessionStorage.getItem('name')) }),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            if (data.code === '999999') {
                                //移除成员后更新搜索列表
                                self.getUserList();
                                self.$message({
                                    message: '移除成功',
                                    center: true,
                                    type: 'success'
                                })
                            } else {
                                self.$message.error({
                                    message: data.msg,
                                    center: true,
                                })
                            }
                            self.getProjectMember();
                        },
                    })

                }).catch(() => {
                });
            },
            // 添加现有用户作为项目成员
            addProjMem() {
                this.searchUserListVisible = true;
                this.getApiGroup();
                this.getUserList();
            },
            
            handleCurrentChange(val) {
                this.page = val;
                this.getProjectMember()
            },
            //获取所有成员列表
             getUserList() {
                this.listLoading = true;
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id,
                    page: self.page
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getAllUserList(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                    console.log(data.data)
                    if (code === '999999') {
                        self.total = data.total;
                        //self.memberData = data.data
                        //self.searchUserList = data.data;
                        self.states = data.data;
                        //this.prov_users_cnt = self.states.length;
                        this.list = data.data.map(item => {
                            console.log(item,"itemmmmmm")
                            return { value: `${item.login_name}`, label: `${item.login_name}`,email:item.email,uid:item.id};
                        });
                        console.log(self.states ,"self.states ")
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            //selsChange(sels){
            //    this.sels = sels;
            //},
            addMemSubmit() {
                let ids = this.sels.map(item => item);//item.id
                let self = this;
                this.$confirm('确认添加选中工程师吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    let param = JSON.stringify({
                        project_id: Number(this.$route.params.project_id),
                        user_ids: ids,
                        user_key:JSON.parse(sessionStorage.getItem('name')),
                    });
                    console.log("addMemSubmit",param)
                    $.ajax({
                        type: "post",
                        url: test+"/api/member/addprojmem",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            self.searchUserListVisible = false;
                            if (data.code === '999999') {
                                self.$message({
                                    message: '添加成功',
                                    center: true,
                                    type: 'success'
                                })
                            }
                            else {
                                self.$message.error({
                                    message: data.msg,
                                    center: true,
                                })
                            }
                            self.getProjectMember()
                        },
                    })
                }).catch(() => {
                    self.searchUserListVisible = false;
                });
            },
            // 获取成员列表
            getProjectMember() {
                this.listLoading = true;
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id,
                    page: self.page
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getProjectMemberList(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                    console.log(data.data)
                    if (code === '999999') {
                        self.total = data.total;
                        self.memberData = data.data
                        self.searchUserList= data.data
                        this.prov_users_cnt = data.data.length;
                        
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            getEmailConfig(){
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id,
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getEmailConfigDetail(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                    if (code === '999999') {
                        console.log(data);
                        if (data) {
                            self.reportFrom = data.reportFrom;
                            self.editForm = data
                        } else {
                            self.reportFrom = "";
                            self.editForm = {}
                        }
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                });
            },
            DelEmail(){
                let self = this;
                let params = {
                    project_id: Number(this.$route.params.project_id)
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                delEmailConfig(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                    if (code === '999999') {
                        self.$message.success({
                            message: "删除成功",
                            center: true,
                        });
                        self.getEmailConfig()
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            editSubmit: function () {
                let self = this;
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.editLoading = true;
                            //NProgress.start();
                            let params = {
                                project_id: Number(this.$route.params.project_id),
                                reportFrom: this.editForm.reportFrom,
                                mailUser: this.editForm.mailUser,
                                mailPass: this.editForm.mailPass,
                                mailSmtp: this.editForm.mailSmtp,
                            };
                            let headers = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            addEmailConfig(headers, params).then(_data => {
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
                                    self.getEmailConfig()
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
        },
        mounted() {
            this.getUserList();
           
            this.getProjectMember();
            this.getEmailConfig();

        },
    }
</script>

<style lang="scss" scoped>
    .member-manage {
        margin: 35px;
    }
</style>