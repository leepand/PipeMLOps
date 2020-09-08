<template>
    <section>
        <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px">
            <div><span style="font-size: 20px;"><strong>{{apiName}}-{{apiVersion}}</strong></span></div>
            <br>
            <div><span style="font-size: 15px;"><strong>Status: </strong><span :style="methodClass()">{{status}}</span></span></div>
            <el-divider></el-divider>
            <div><span style="font-size: 15px;"><strong>Description: </strong>{{description}}</span></div>
            <div><span style="font-size: 15px;"><strong>Storage: </strong>{{modelStorage}}</span></div>
            <div><span style="font-size: 15px;"><strong>Create_at: </strong>{{moment(updateTime).format("YYYY-MM-DD HH:mm:ss")}}</span></div>
            <div><span style="font-size: 15px;"><strong>Testing: </strong>{{servingIP}}/redoc</span></div>
        </div>

        <el-collapse v-model="activeNames">

            

            <el-collapse-item title="Model Setup" name="3">
                <el-table :data="modelOptions" highlight-current-row style="width: 100%;" v-loading="listLoadingResponse">
                    <el-table-column type="index" label="#" min-width="10%" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="属性名" min-width="15%" sortable>
                    </el-table-column>
                     <el-table-column prop="description" label="属性描述" min-width="15%" sortable>
                    </el-table-column>
                    <el-table-column prop="type" label="属性类型" min-width="10%" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="default" label="缺省值" min-width="20%" sortable>
                    </el-table-column>

                    <el-table-column label="详情" min-width="10%" sortable>
                        <template slot-scope="scope">
                            <el-button size="small" @click="lookResponseInfo(scope.$index)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
            <el-dialog title="参数详情" :visible.sync="responseInfoVisible" :close-on-click-modal="false">
                <div v-model="modelOptions" style="font-size: 15px">
                    <el-row :gutter="20" style="margin: 10px">
                        <div>
                            <el-col :span="7">属性名</el-col>
                            <el-col :span="7">属性描述</el-col>
                            <el-col :span="7">属性类型</el-col>
                            <el-col :span="3">必含?</el-col>
                        </div>
                        <div style="margin-top: 30px">
                            <el-col :span="7">模型属性名称-可多个</el-col>
                            <el-col :span="7">属性的描述-该属性作用</el-col>
                            <el-col :span="7">属性缺省值-如模型文件目录</el-col>
                            <el-col :span="3">
                                <img v-show="!modelOptions.minLength" src="../../../../assets/icon-yes.svg"/>
                                <img v-show="modelOptions.minLength" src="../../../../assets/icon-no.svg"/>
                            </el-col>
                        </div>
                        <div style="margin-top: 70px"><el-col>说明:</el-col></div>
                        <div style="margin-top: 100px"><el-col v-show="modelOptions.description">{{modelOptions.description}}</el-col>
                            <el-col v-show="!modelOptions.description">模型安装/更新时启用(需要在线更新模型必须指定模型版本-version)</el-col>
                        </div>
                    </el-row>
                </div>
            </el-dialog>

            <el-collapse-item title="Model Commands" name="1">
                <el-table :data="Schema" highlight-current-row style="width: 100%;" v-loading="listLoadingHead">
                    <el-table-column type="index" label="#" min-width="10%" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="接口名称" min-width="15%" sortable show-overflow-tooltip>
                    
                    </el-table-column>
                    <el-table-column prop="description" label="接口描述" min-width="15%" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="Input Schema" min-width="30%" sortable >
                         <template slot-scope="scope">
                              <div v-for="(item, index) in Schema[scope.$index].inputs" :key="index">
                                  <span><strong>第{{index+1}}个参数:</strong></span><br>
                                  <span>param: {{item.name}}</span><br>
                                  <span>type: {{item.type}}</span><br>
                                  <span>description: {{item.description}}</span><br>
                                  <span>default: {{item.default}}</span><br>
                                  
                              </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="Output Schema" min-width="30%" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                              <div v-for="(item, index) in Schema[scope.$index].outputs" :key="index">
                                  <span>param: {{item.name}}</span><br>
                                  <span>type: {{item.type}}</span><br>
                                  <span>description: {{item.description}}</span><br>
                                  <span>default: {{item.default}}</span>
                  
                              </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
           <!-- <el-collapse-item title="服务运行日志" name="4">
                <template>
                    <el-card class="box-card">
                       <pre class="code">{{mockJsonData}}</pre>
                        <div v-show="!mockData&&!mockJsonData" class="raw">暂无数据</div>
                 </el-card>
                </template>
            </el-collapse-item>-->
        </el-collapse>
    </section>
</template>

<script>
    import { test } from '../../../../api/api'
    import $ from 'jquery'
    import moment from 'moment'
    export default {
        data() {
            return {
                moment:moment,
                activeNames: ['1', '2', '3', '4'],
                id: "",
                httpType: "CPU",
                requestType: "",
                addr: "",
                apiName: "",
                updateTime: "",
                head: [],
                Schema:[],
                modelStorage:"",
                description:"",
                status:"",
                apiVersion:"",
                modelOptions:[],
                servingIP:"",
                ParameterTyep: true,
                parameterType: "",
                parameter: [],
                parameterRaw: "",
                response: [],
                mockCode: "",
                mockData: "",
                mockJsonData: "",
                httpCode: [{value: '200', label: '200'},
                    {value: '404', label: '404'},
                    {value: '400', label: '400'},
                    {value: '500', label: '500'},
                    {value: '502', label: '502'},
                    {value: '302', label: '302'}],
                resultShow: true,
                status: true,
                listLoadingHead: false,
                listLoadingParameter: false,
                listLoadingResponse: false,
                parameterInfoVisible: false,
                parameterInfo: [],
                responseInfoVisible: false,
                responseInfo: [],
            }
        },
        methods: {
            methodClass() {
                if(this.status==="Running"){
                    return "padding: 2px 4px;border-radius: 25px;color: #fff;background-color: #67C23A;"
                }else{
                    return "padding: 2px 4px;border-radius: 25px;color: #fff;background-color: #FF5722;"
                }
              console.log("wooe",this.status)  
            },
            getApiInfo() {
                let self = this;
                self.listLoadingHead = true;
                self.listLoadingParameter = true;
                self.listLoadingResponse = true;
                let param = {project_id: self.$route.params.project_id, api_id: self.$route.params.api_id};
                $.ajax({
                    type: "get",
                    //url: test+"/api/api/api_info",
                    url: test+"/api/serving/service_details",
                    async: true,
                    data: param,
                    headers: {
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: function(data) {
                        self.listLoadingHead = false;
                        self.listLoadingParameter = false;
                        self.listLoadingResponse = false;
                        if (data.code === '999999') {
                            console.log(data.meta.options)
                            //self.id = data.id;
                            //self.httpType = data.httpType;
                            //self.requestType = data.requestType;
                            //self.addr = data.apiAddress;
                            self.modelOptions = data.meta.options;
                            self.description = data.publish_info.description;
                            self.status = data.status;
                            self.apiName = data.publish_info.name;
                            self.apiVersion = data.publish_info.version;
                            self.updateTime = data.publish_info.LastUpdateTime;
                            self.modelStorage = data.publish_info.remote_path;
                            self.Schema=data.meta.commands;
                            self.servingIP = data.publish_info.servingIP;
                            //self.status = data.status;
                            //self.head = data.headers;
                            //self.parameterType = data.requestParameterType;
                            //self.parameter = data.requestParameter;
                            //try {
                            //    self.parameterRaw = data.requestParameterRaw.data;
                            //} catch (e){

                            //}
                            //self.response = data.response;
                            //self.mockCode = data.mockCode;
                            //self.mockData = data.data;
                             self.mockJsonData =data.log_str;
                            //if (data.data) {
                            //    self.mockJsonData = JSON.parse(data.data)
                            //}
                        }
                        else {
                            self.$message.error({
                                message: data.msg,
                                center: true,
                            })
                        }
                    },
                });
            },
            formatChange() {
            },
            changFormat() {
                let demo = document.getElementsByTagName('pre')[0];
                console.log(demo)
                hljs.highlightBlock(demo);
                this.resultShow = !this.resultShow
            },
            lookParameterInfo(index) {
                this.parameterInfoVisible = true;
                this.parameterInfo = this.parameter[index]
            },
            lookResponseInfo(index) {
                this.responseInfoVisible = true;
                console.log(index)
                this.responseInfo = this.response[index]
            },
            parameterTypeChange() {
                if (this.parameterType === 'form-data') {
                    this.ParameterTyep = true
                } else {
                    this.ParameterTyep = false
                }
            }
        },
        watch: {
            parameterType() {
                this.parameterTypeChange()
            }
        },
        mounted() {
            this.getApiInfo();
            this.formatChange()
        }
    }
</script>

<style lang="scss" scoped>
    /*.el-card {
    background-color: black;
  } */
    .httpStyle {
        border-radius: 5px;
        padding-top: 20px;
        padding-right: 10px;
        padding-left: 10px;
        height: 74px;
        box-sizing: border-box;
        color: #fff;
        font-size: 160%;
        background-color: #409eff;
        text-align: center;
    }
    .apiInfo {
        padding-left: 25px;
        padding-right: 6px;
        font-size: 25px;
        padding-top: 7px
    }
    .statusIcon {
        padding-left: 25px;
        padding-right: 6px;
        padding-top: 7px;
        font-size: 30px;
    }
    .apiDate {
        margin-top: 18px;
        font-size: 20px;
    }
    .parameter-a {
        display: block;
    }
    .parameter-b {
        display: none;
    }
    .raw {
        border: 1px solid #e6e6e6;
        margin-bottom: 10px;
        padding:15px;
        text-align: center;
        z-index: 10000;
    }
</style>

