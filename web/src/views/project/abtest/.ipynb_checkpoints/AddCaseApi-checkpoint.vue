<template>
    <section>
        <router-link :to="{ name: '用例接口列表', params: {project_id: this.$route.params.project_id,case_id: this.$route.params.case_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>返回列表</el-button>
        </router-link>
        <router-link :to="{ name: '用例接口列表', params: {project_id: this.$route.params.project_id,case_id: this.$route.params.case_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list" style="float: right">取消</el-button>
        </router-link>
        <el-button class="return-list" type="primary" style="float: right; margin-right: 15px" @click.native="addApi">保存</el-button>
        <el-form :model="form" ref="form" :rules="FormRules">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px">
                <el-form-item label="实验用例:" label-width="83px" prop="name">
                    <el-input v-model.trim="form.name" placeholder="实验用例名称" auto-complete></el-input>
                </el-form-item>
                <el-form-item label="实验描述:" label-width="83px" prop="description">
                    <el-input v-model.trim="form.description" placeholder="实验详情" auto-complete></el-input>
                </el-form-item>
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item label="实验类型:" label-width="83px">
                            <el-select v-model="form.appType"  placeholder="请求方式" @change="checkRequest">
                                <el-option v-for="(item,index) in request" :key="index+''" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span='20'>
                        <el-form-item prop="altlist">
                            <el-input v-model.trim="form.altlist" placeholder="模型列表" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            
        </el-form>
    </section>
</template>
<script>
    import { test } from '../../../api/api'
    import $ from 'jquery'
    export default {
        data() {
            return {
                request: [{value: 1, label: '内嵌'},
                    {value: 0, label: 'API调用'}],
                Http: [{value: 'HTTP', label: 'HTTP'},
                    {value: 'HTTPS', label: 'HTTPS'}],
                ParameterTyep: true,
                radio: "form-data",
                header4: "",

                radioType: "",
                result: true,
                activeNames: ['1', '2', '3'],
                id: "",
                searchApiVisible: false,
                ApiList: [],
                ApiResponse: [],
                apiResponseLoading: false,
                saveCorrelation: false,
                showCheck: false,
                sels: [],//列表选中列
                interrelateObjects: "",
                request3:true,
                form: {
                    name: '',
                    appType: '内嵌/API',
                    Http4: 'HTTP',
                    addr: '',
                    altlist:'',
                    head: [{name: "", value: "", interrelate:0,},
                        {name: "", value: "", interrelate:0,}],
                    parameterRaw: "",
                    parameter: [{name: "", value: "", interrelate:0,},
                        {name: "", value: "", interrelate:0}],
                    parameterType: "",
                    check: "no_check",
                    RegularParam: "",
                    checkHttp: "",
                    checkData: "",
                },
                FormRules: {
                    name : [{ required: true, message: '请输入实验用例名称', trigger: 'blur' }],
                    addr : [{ required: true, message: '请输入地址', trigger: 'blur' }],
                    altlist:[{ required: true, message: '请输入待测试的模型列表', trigger: 'blur' }],
                },
            }
        },
        methods: {
            checkRequest(){
                let request = this.form.request4;
                if (request==="GET" || request==="DELETE"){
                    this.request3=false
                } else {
                    this.request3=true
                }
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            selsChange(sels){
                this.sels = sels;
            },
            handleCorrelation(index, row) {
                let self = this;
                $.ajax({
                    type: "get",
                    url: test+"/api/automation/get_correlation_response",
                    async: true,
                    data: {project_id: this.$route.params.project_id,
                        case_id: this.$route.params.case_id,
                    },
                    headers: {
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: function(data) {
                        if (data.code === '999999') {
                            if (data.data.length) {
                                self.ApiList = [];
                                data.data.forEach((item) => {
                                    self.ApiList.push(item)
                                });
                                self.searchApiVisible = true;
                                // self.handleResponse(index);
                                self.interrelateObjects = row
                            } else {
                                self.$message.warning({
                                    message: '无前置接口',
                                    center: true,
                                });
                            }
                        }
                        else {
                            self.$message.error({
                                message: data.msg,
                                center: true,
                            });
                        }
                    },
                });
            },
            handleResponse(index) {
                this.ApiResponse = [];
                this.ApiList[index].response.forEach((item) =>{
                    this.ApiResponse.push(item)
                })
            },
            addInterrelateSubmit() {
                this.saveCorrelation = true;
                try {
                    this.interrelateObjects['value'] =  this.currentRow['tier'];
                } catch (e) {
                    this.$message.warning({
                        message: '未选中接口参数',
                        center: true,
                    });
                }
                this.interrelateObjects['interrelate'] = true;
                this.saveCorrelation = false;
                this.searchApiVisible = false;
            },
            
            //addApi: function () {
            //header 需要"Content-Type": "application/json"
            addApi(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let self = this;
                        let formatRaw = false;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.form.parameterType = self.radio;
                            let _type = self.form.parameterType;
                            let _parameter = {};
                            if ( _type === 'form-data') {
                                // if ( self.radioType === true) {
                                //     _type = 'raw';
                                //     self.form.parameter.forEach((item) => {
                                //         _parameter[item.name] = item.value
                                //     });
                                // } else {
                                //     _parameter = self.form.parameter;
                                // }
                                 if ( self.radioType === true) {
                                    formatRaw = true;
                                }
                                _parameter = self.form.parameter;

                            } else {
                                _parameter = self.form.parameterRaw
                            }
                            let param = JSON.stringify({
                                project_id: Number(self.$route.params.project_id),
                                automationTestCase_id: Number(self.$route.params.case_id),
                                name: self.form.name,
                                appType: self.form.appType,
                                description: self.form.description,
                                altlist: self.form.altlist
                            });
                            $.ajax({
                                type: "post",
                                url: test+"/api/automation/add_new_api",
                                async: true,
                                data: param,
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                                },
                                timeout: 5000,
                                success: function(data) {
                                    if (data.code === '999999') {
                                        self.$router.push({ name: '用例接口列表', params: { project_id: self.$route.params.project_id, case_id: self.$route.params.case_id}});
                                        self.$message({
                                            message: '保存成功',
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
                                },
                            })
                        }).catch(() => {

                });
                    }
                })
            },
            addHead() {
                let headers = {name: "", value: "", interrelate:0,};
                this.form.head.push(headers)
            },
            delHead(index) {
                this.form.head.splice(index, 1);
                if (this.form.head.length === 0) {
                    this.form.head.push({name: "", value: "", interrelate:0,})
                }
            },
            addParameter() {
                let headers = {name: "", value: "", interrelate:0,};
                this.form.parameter.push(headers)
            },
            delParameter(index) {
                this.form.parameter.splice(index, 1);
                if (this.form.parameter.length === 0) {
                    this.form.parameter.push({name: "", value: "", interrelate:0,})
                }
            },
            changeParameterType() {
                if (this.radio === 'form-data') {
                    this.ParameterTyep = true
                } else {
                    this.ParameterTyep = false
                }
            },
            handleChange(val) {
            },
        },
        watch: {
            radio() {
                this.changeParameterType()
            },
            form: {
                //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
                handler(curVal,oldVal){
                    if (curVal.check === 'no_check') {
                        this.showCheck = false
                    } else {
                        this.showCheck = true
                    }
                },
                deep:true
            },
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .return-list {
        margin-top: 0px;
        margin-bottom: 10px;
        border-radius: 25px;
    }
    .head-class {
        font-size: 17px
    }
    .parameter-a {
        display: block;
    }
    .parameter-b {
        display: none;
    }
    .selectInput {
        position: absolute;
        /*margin-left: 7px;*/
        padding-left: 9px;
        width: 180px;
        /*border-radius:0px;*/
        /*height: 38px;*/
        left: 1px;
        border-right: 0px;
    }
</style>
<style lang="scss">
    .selectInput{
        input{
            border-right: 0px;
            border-radius: 4px 0px 0px 4px;
        }
    }
</style>
