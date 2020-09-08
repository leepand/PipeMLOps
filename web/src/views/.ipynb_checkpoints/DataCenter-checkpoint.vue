<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称" @keyup.enter.native="getDataList"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDataList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                <el-date-picker v-model="chocetime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions1"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="project" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" min-width="5%">
            </el-table-column>
            <el-table-column prop="name" label="股票名称" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-icon name="name"></el-icon>
                    <router-link v-if="scope.row.status" :to="{ name: '项目概况', params: {project_id: scope.row.id}}" style="cursor:pointer;color: #0000FF;text-decoration:underline">
                        {{ scope.row.name }}
                    </router-link>
                    {{ !scope.row.status?scope.row.name:""}}
                </template>
            </el-table-column>
            <el-table-column prop="code" label="股票代码" sortable>
            </el-table-column>
            <el-table-column prop="date" label="日期"  sortable>
            </el-table-column>
            <el-table-column prop="amount" label="成交额" sortable>
            </el-table-column>
            <el-table-column prop="changepercent" label="涨跌幅" sortable>
            </el-table-column>
            <el-table-column prop="turnoverratio" label="换手率" sortable>
            </el-table-column>
            <el-table-column prop="kdjj" label="kdjj" sortable>
            </el-table-column>
            <el-table-column prop="cci" label="cci" sortable>
            </el-table-column>
            <el-table-column prop="rsi_6" label="rsi_6" sortable>
            </el-table-column>

        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :page-count="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width: 75%; left: 12.5%">
            <el-form :model="editForm" label-width="80px"  :rules="editFormRules" ref="editForm">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="类型" prop='type'>
                            <el-select v-model="editForm.type" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本号" prop='version'>
                            <el-input v-model="editForm.version" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="描述" prop='description'>
                    <el-input type="textarea" :rows="6" v-model="editForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" style="width: 75%; left: 12.5%">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model.trim="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="类型" prop='type'>
                            <el-select v-model="addForm.type" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本号" prop='version'>
                            <el-input v-model.trim="addForm.version" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-form-item label="描述" prop='description'>
                    <el-input type="textarea" :rows="6" v-model="addForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    //import NProgress from 'nprogress'
    import util from '../common/js/util'
    import moment from 'moment'
    import { getData, delProject, disableProject, enableProject,
        updateProject, addProject} from '../api/api';
    // import ElRow from "element-ui/packages/row/src/row";
    export default {
        // components: {ElRow},
        data() {
            return {
                chocetime:'',
                filters: {
                    name: ''
                },
                project: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                options: [{ label: "推荐领域", value: "RECOM"}, { label: "精准营销", value: "DM"}],
                editFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    version: [
                        { required: true, message: '请输入版本号', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    description: [
                        { required: false, message: '请输入描述', trigger: 'blur' },
                        { max: 1024, message: '不能超过1024个字符', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    version: '',
                    type: '',
                    description: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    version: [
                        { required: true, message: '请输入版本号', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    description: [
                        { required: false, message: '请输入版本号', trigger: 'blur' },
                        { max: 1024, message: '不能超过1024个字符', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    version: '',
                    type: '',
                    description: ''
                }

            }
        },
        methods: {
            // row[column.property] 能读取到该行该列的数据。代码中实现了时间格式的转换
            formatTime2(row, column) {
                const date = new Date(row[column.property])
                return date.getFullYear() + '-' +
                    date.getMonth() + '-' +
                    date.getDate() + ' ' +
                    date.getHours() + ':' +
                    date.getMinutes() + ':'+
                    date.getSeconds()
            },
            toFixed:function(row, column){
                var vol = row[column.property];  
                return vol.toFixed(2)
            },
            formatTime:function(row, column) { //日期格式化
                var date = row[column.property];  
                if (date == undefined) {  
                    return "";  
                }  
                return moment(date).format("YYYY-MM-DD HH:mm:ss");  
            },
            // 获取项目列表
            getDataList() {
                this.listLoading = true;
                let self = this;
                let params = { page: self.page, name: self.filters.name};
                //let headers = {Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))};
                console.log(params,"params")
                let headers = {user_key:JSON.parse(sessionStorage.getItem('name'))};
                getData(headers, params).then((res) => {
                    self.listLoading = false;
                    let { msg, code, data } = res;
                    if (code === '999999') {
                        self.total = data.total;
                        self.project = data.data
                        console.log(self.project,"self.project")
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    let params = {ids: [row.id, ],user_key:JSON.parse(sessionStorage.getItem('name'))};
                    let header = {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    };
                    delProject(header, params).then(_data => {
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
                        self.getProjectList()
                    });
                })
            },
            // 改变项目状态
            handleChangeStatus: function(index, row) {
                let self = this;
                this.listLoading = true;
                //let headers = {user_key:JSON.parse(sessionStorage.getItem('name'))};
                let params = { project_id: row.id,user_key:JSON.parse(sessionStorage.getItem('name'))};
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                if (row.status) {
                    disableProject(headers, params).then(_data => {
                        let { msg, code, data } = _data;
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
                    enableProject(headers, params).then(_data => {
                        let { msg, code, data } = _data;
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
                this.getDataList()
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
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.editLoading = true;
                            //NProgress.start();
                            let params = {
                                project_id: self.editForm.id,
                                name: self.editForm.name,
                                type: self.editForm.type,
                                version: self.editForm.version,
                                description: self.editForm.description,
                                user_key:JSON.parse(sessionStorage.getItem('name'))
                            };
                            let header = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            updateProject(header, params).then(_data => {
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
                                    self.getProjectList()
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
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let self = this;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.addLoading = true;
                            //NProgress.start();
                            let params = JSON.stringify({
                                name: self.addForm.name,
                                type: self.addForm.type,
                                version: self.addForm.version,
                                description: self.addForm.description,
                                user:JSON.parse(sessionStorage.getItem('name'))
                            });
                            let header = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            addProject(header, params).then(_data => {
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
                                    self.getProjectList()
                                } else if (code === '999997') {
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
                                    self.getProjectList()
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
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    let params = {ids: ids,user_key:JSON.parse(sessionStorage.getItem('name'))};
                    let header = {
                        "Content-Type": "application/json",
                        Authorization: 'Token ' + JSON.parse(sessionStorage.getItem('token'))
                    };
                    delProject(header, params).then(_data => {
                        let {msg, code, data} = _data;
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
                        self.getProjectList()
                    });
                })
            }
        },
        mounted() {
            this.getDataList();
            /*var token = sessionStorage.getItem("token");
            var user = sessionStorage.getItem("name");
            if (token && user) {
                user = JSON.parse(user);
                this.sysUserName = user || "";
            } else {
                sessionStorage.removeItem("token");
                this.$router.push("/login");
            }*/
        }
    }

</script>

<style>

</style>
