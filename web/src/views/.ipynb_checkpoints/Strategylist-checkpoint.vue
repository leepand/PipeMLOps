<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称" @keyup.enter.native="getStrategyList"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getStrategyList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="strategy_list" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" min-width="5%">
            </el-table-column>
            <el-table-column prop="name" label="策略名称" min-width="20%" sortable show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-icon name="name"></el-icon>
                    <router-link v-if="scope.row.status" :to="{ name: '项目概况', params: {project_id: scope.row.id}}" style="cursor:pointer;color: #0000FF;text-decoration:underline">
                        {{ scope.row.name }}
                    </router-link>
                    {{ !scope.row.status?scope.row.name:""}}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="策略编号" min-width="10%" sortable>
            </el-table-column>
            <el-table-column prop="version" label="策略版本" min-width="12%" sortable>
            </el-table-column>
            <el-table-column prop="strategy_type" label="策略类型" min-width="9%" sortable>
            </el-table-column>
            <el-table-column prop="LastUpdateTime":formatter="formatTime" label="最后修改时间" min-width="16%" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="9%" sortable>
                <template slot-scope="scope">
                    <img v-show="scope.row.status" src="../assets/icon-yes.svg"/>
                    <img v-show="!scope.row.status" src="../assets/icon-no.svg"/>
                </template>
            </el-table-column>


            <el-table-column label="操作" min-width="19%">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="info" size="small" @click="handleChangeStatus(scope.$index, scope.row)">{{scope.row.status===false?'启用':'禁用'}}</el-button>
                </template>
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
                <el-form-item label="策略名称" prop="name">
                    <el-input v-model.trim="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="策略类型" prop='type'>
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
                <el-form-item label="策略描述" prop='description'>
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
    import { getStrategy, delStrategy, disableStrategy, enableStrategy,
        updateStrategy, addStrategy} from '../api/api';
    // import ElRow from "element-ui/packages/row/src/row";
    export default {
        // components: {ElRow},
        data() {
            return {
                filters: {
                    name: ''
                },
                strategy_list: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                options: [{ label: "短线", value: "短线"}, { label: "长线", value: "长线"},{ label: "超短T", value: "超短T"}],
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
            formatTime3:function(row, column) { //日期格式化
                var date = row[column.property];  
                if (date == undefined) {  
                    return "";  
                }  
                console.log(date,"date")
                return moment(date).format("YYYY-MM-DD HH:mm:ss");  
            },
            formatTime:function(row, column) {
                let date = new Date(row[column.property])
                let Str=date.getFullYear() + '-' +
                    (date.getMonth() + 1) + '-' + 
                    date.getDate() + ' ' + 
                    date.getHours() + ':' + 
                    date.getMinutes() + ':' + 
                    date.getSeconds()
                return Str
                
            },
               
            // 获取策略列表
            getStrategyList() {
                this.listLoading = true;
                let self = this;
                let params = { page: self.page, name: self.filters.name};
                //let headers = {Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))};
                let headers = {user_key:JSON.parse(sessionStorage.getItem('name'))};
                getStrategy(headers, params).then((res) => {
                    self.listLoading = false;
                    let { msg, code, data } = res;
                    if (code === '999999') {
                        self.total = data.total;
                        self.strategy_list = data.data
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
                this.$confirm('确认删除该策略吗?', '提示', {
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
                    delStrategy(header, params).then(_data => {
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
                        self.getStrategyList()
                    });
                })
            },
            // 改变项目状态
            handleChangeStatus: function(index, row) {
                let self = this;
                this.listLoading = true;
                //let headers = {user_key:JSON.parse(sessionStorage.getItem('name'))};
                let params = { strategy_id: row.id,user_key:JSON.parse(sessionStorage.getItem('name'))};
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                if (row.status) {
                    disableStrategy(headers, params).then(_data => {
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
                    enableStrategy(headers, params).then(_data => {
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
                this.getStrategyList()
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
                                strategy_id: self.editForm.id,
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
                            updateStrategy(header, params).then(_data => {
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
                                    self.getStrategyList()
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
                            addStrategy(header, params).then(_data => {
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
                                    self.getStrategyList()
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
                                    self.getStrategyList()
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
                this.$confirm('确认删除选中策略吗？', '提示', {
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
                    delStrategy(header, params).then(_data => {
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
                        self.getStrategyList()
                    });
                })
            }
        },
        mounted() {
            this.getStrategyList();
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
