<template>
    <section>
        <router-link :to="{ name: '服务列表', params: {project_id: this.$route.params.project_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>服务列表</el-button>
        </router-link>
        <router-link :to="{ name: '服务列表', params: {project_id: this.$route.params.project_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list" style="float: right">取消</el-button>
        </router-link>
        <el-button class="return-list" type="primary" style="float: right; margin-right: 15px" @click.native="addApiInfo">保存</el-button>
        <el-form :model="form" ref="form" :rules="FormRules">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px">
                <el-form-item label="服务分组:" label-width="83px" prop="apiGroupLevelFirst_id">
                    <el-select v-model="form.apiGroupLevelFirst_id" placeholder="请选择分组">
                        <el-option v-for="(item,index) in group" :key="index+''" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    
                </el-form-item>
                <el-row :gutter="10">
                    <el-col :span='8'>
                        <el-form-item label="服务名称:" label-width="83px" prop="name">
                            <el-input v-model.trim="form.name" placeholder="名称" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='4'>
                        <el-form-item label="服务版本:" label-width="83px" prop="version">
                            <el-input v-model.trim="form.version" placeholder="版本" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="10">
                        <el-form-item label="状态:" label-width="72px">
                            <el-select v-model="form.status" placeholder="接口状态">
                                <el-option v-for="(item,index) in status" :key="index+''" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                
                <el-row :gutter="10">
                    <el-col :span='8'>
                        <el-form-item label="主文件名:" label-width="83px" prop="mainFile">
                            <el-input v-model.trim="form.mainFile" placeholder="模型主程序文件名" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                       <el-form-item label="模型目录:" label-width="83px" prop="mainFilePath">
                            <el-input v-model.trim="form.mainFilePath" placeholder="模型主程序所在目录" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                      <el-col :span="4">
                        <el-form-item label="服务端口:" label-width="83px" prop="servicePort">
                            <el-input v-model.trim="form.servicePort" placeholder="服务端口" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                
                
                
                <el-row :gutter="10">
                  
                    <el-col :span="10">
                        <el-form-item label="模型效果:" label-width="83px" prop="metrics">
                            <el-input v-model.trim="form.metrics" placeholder="模型效果" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="服务描述:" label-width="83px" prop="description">
                            <el-input v-model.trim="form.description" placeholder="服务描述" auto-complete></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            
        </el-form>
    </section>
</template>
<script>
    import { addApiDetail, getApiGroupList } from "../../../api/api";

    export default {
        data() {
            return {
                checkHeadList: [],
                checkParameterList: [],
                ParameterTyep: true,
                group: [],
                radio: "form-data",
                secondGroup: [],
                status: [{value: true, label: '启用'},
                    {value: false, label: '禁用'}],
                
                header4: "",
                addParameterFormVisible: false,
                addResponseFormVisible: false,
                radioType: "",
                result: true,
                activeNames: ['1', '2', '3', '4'],
                id: "",
                parameterRaw: "",
                request3: true,
                form: {
                    apiGroupLevelFirst_id: "",
                    name: '',
                    version:'',
                    status: true,
                    mainFile: '',
                    mainFilePath: '',
                    servicePort: 9001,
                    metrics: '',
                    description: '',
                    data: '',
                },
                FormRules: {
                    name : [{ required: true, message: '请输入名称', trigger: 'blur' },
                        { max: 50, message: '不能超过50个字', trigger: 'blur' }],
                    version: [{ required: true, message: '请输入服务版本', trigger: 'blur' }],
                    //apiAddress : [{ required: true, message: '请输入地址', trigger: 'blur' }],
                    mainFile:[{ required: true, message: '请输入主程序文件名', trigger: 'blur' }],
                    mainFilePath:[{ required: true, message: '请输入主程序文件所在目录', trigger: 'blur' }],
                    required : [{ type: 'boolean', required: true, message: '请选择状态', trigger: 'blur' }],
                    apiGroupLevelFirst_id : [{ type: 'number', required: true, message: '请选择分组', trigger: 'blur'}],
                },
                editForm: {
                    name: "",
                    value: "",
                    required: "",
                    restrict: "",
                    description: "",
                },
                // editLoading: false
            }
        },
        methods: {
            checkRequest(){
                let request = this.form.requestType;
                if (request==="GET" || request==="DELETE"){
                    this.request3=false
                } else {
                    this.request3=true
                }
            },
            isJsonString(str) {
                try {
                    if (typeof JSON.parse(str) === "object") {
                        return true;
                    }
                } catch(e) {
                }
                return false;
            },
            addApiInfo:function(){
                if (this.form.data&&this.form.mockCode) {
                    if (!this.isJsonString(this.form.data)) {
                        this.$message({
                            message: 'mock格式错误',
                            center: true,
                            type: 'error'
                        })
                    } else {
                        this.addApi()
                    }
                } else if(this.form.data||this.form.mockCode){
                    this.$message({
                        message: 'HTTP状态或mock为空',
                        center: true,
                        type: 'warning'
                    })
                } else {
                    this.addApi()
                }
            },
            addApi: function () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let self = this;
                        console.log(this.form.requestList);
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.form.parameterType = self.radio;
                            let _type = self.form.parameterType;
                            let _parameter = {};
                            if ( _type === 'form-data') {
                                if ( self.radioType === true) {
                                    _type = 'raw';
                                    self.form.requestList.forEach((item) => {
                                        if (item.name) {
                                            _parameter[item.name] = item.value
                                        }
                                    });
                                    _parameter = JSON.stringify(_parameter)
                                } else {
                                    _parameter = self.form.requestList;
                                }
                            } else {
                                _parameter = self.parameterRaw
                            }
                            console.log(_parameter)
                            let params = {
                                project_id: Number(self.$route.params.project_id),
                                apiGroupLevelFirst_id: Number(self.form.apiGroupLevelFirst_id),
                                name: self.form.name,
                                version: self.form.version,
                                mainFile: self.form.mainFile,
                                mainFilePath: self.form.mainFilePath,
                                status: self.form.status,
                                metrics: self.form.metrics,
                                servicePort: self.form.servicePort,
                                description: self.form.description,
                                user_key:JSON.parse(sessionStorage.getItem('name'))
                            };
                            let headers = {
                                "Content-Type": "application/json",
                                Authorization: 'Token ' + JSON.parse(sessionStorage.getItem('token'))

                            };
                            if (self.parameterRaw&&_type==="raw"){
                                if (!self.isJsonString(self.parameterRaw)) {
                                    self.$message({
                                        message: '源数据格式错误',
                                        center: true,
                                        type: 'error'
                                    })
                                } else {
                                    addApiDetail(headers, params).then(_data => {
                                        let {msg, code, data} = _data;
                                        if (code === '999999') {
                                            self.$router.push({name: '分组接口列表',
                                                params: {
                                                    project_id: self.$route.params.project_id,
                                                    firstGroup: self.form.apiGroupLevelFirst_id
                                                }
                                            });
                                            self.$message({
                                                message: '保存成功',
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
                                    })
                                }
                            } else {
                                addApiDetail(headers, params).then(_data => {
                                    let {msg, code, data} = _data;
                                    if (code === '999999') {
                                        self.$router.push({name: '分组服务列表',
                                            params: {
                                                project_id: self.$route.params.project_id,
                                                firstGroup: self.form.apiGroupLevelFirst_id
                                            }
                                        });
                                        self.$message({
                                            message: '保存成功',
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
                                })
                            }
                        })
                    }
                })
            },
            editParameterSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.form.requestList[this.id] = this.editForm;
                        this.addParameterFormVisible = false
                    }
                })
            },
            handleParameterEdit: function (index, row) {
                this.addParameterFormVisible = true;
                this.id = index;
                this.editForm = Object.assign({}, row);
            },
            editResponseSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.form.responseList[this.id] = this.editForm;
                        this.addResponseFormVisible = false
                    }
                })
            },
            handleResponseEdit: function (index, row) {
                this.addResponseFormVisible = true;
                this.id = index;
                this.editForm = Object.assign({}, row);
            },
            // 获取api分组
            getApiGroup() {
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getApiGroupList(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    if (code === '999999') {
                        self.group = data;
                        self.form.apiGroupLevelFirst_id = self.group[0].id
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            addHead() {
                let headers = {name: "", value: ""};
                this.form.headDict.push(headers)
            },
            delHead(index) {
                this.form.headDict.splice(index, 1);
                if (this.form.headDict.length === 0) {
                    this.form.headDict.push({name: "", value: ""})
                }
            },
            addParameter() {
                let headers = {name: "", value: "", _type:"String", required:true, restrict: "", description: ""};
                this.form.requestList.push(headers)
            },
            delParameter(index) {
                this.form.requestList.splice(index, 1);
                if (this.form.requestList.length === 0) {
                    this.form.requestList.push({name: "", value: "", _type:"String", required:true, restrict: "", description: ""})
                }
            },
            addResponse() {
                let headers = {name: "", value: "", _type:"String", required:true, description: ""};
                this.form.responseList.push(headers)
            },
            delResponse(index) {
                this.form.responseList.splice(index, 1);
                if (this.form.responseList.length === 0) {
                    this.form.responseList.push({name: "", value: "", _type:"String", required:true, description: ""})
                }
            },
            changeParameterType() {
                if (this.radio === 'form-data') {
                    this.ParameterTyep = true
                } else {
                    this.ParameterTyep = false
                }
            },
            showData() {
                this.result = true
            },
            showHead(){
                this.result = false
            },
            handleChange(val) {
            },
            onSubmit() {
                console.log('submit!');
            },
            fastAdd() {
                let form = this.$route.params.formData;
                let _type = this.$route.params._type;
                let _typeData = this.$route.params._typeData;
                if (form) {
                    this.form.requestList = [];
                    this.form.requestType = form.request4.toUpperCase();
                    this.form.httpType = form.Http4;
                    this.form.apiAddress = form.addr;
                    this.form.headDict = form.head;
                    this.form.parameterRaw = form.parameterRaw;
                    form.parameter.forEach((item) => {
                        item['_type'] = 'String';
                        item['required'] = true;
                        item['restrict'] = '';
                        item['description'] = '';
                        this.form.requestList.push(item)
                    });
                    // this.form.parameter = form.parameter;
                    this.form.mockCode = form.statusCode;
                    this.form.data = JSON.stringify(form.resultData)
                }
                if (_type) {
                    this.radio = _type
                }
                if (_typeData) {
                    this.radioType = _typeData
                }
            }
        },
        watch: {
            radio() {
                this.changeParameterType()
            },
        },
        mounted() {
            this.getApiGroup();
            this.fastAdd();
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
