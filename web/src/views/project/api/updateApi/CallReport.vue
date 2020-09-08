<template>
    <section>
        <el-button class="return-list" @click="back"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>服务详情</el-button>
        
        <el-button class="number-pass" style="background-color: #43CD80;" @click="statDiffMethod">分类<br/>统计
        </el-button>
        <el-button class="number-fail" style="background-color: #DC143C;" @click="handleDel()">删除<br/>数据库</el-button>
        <div class="number-total">
            <div style="font-size: 30px;padding-top: 15px">{{total_call}}</div>
            <div style="padding-top: 10px">Total Calls</div>
        </div>
        <el-row class="callreport-manage">
            <el-col :span="24">
                <el-table :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
                    <el-table-column prop="method" label="请求方式" min-width="20%" sortable>
                        <template slot-scope="scope">
                            <span :style="methodClass(scope.row)">{{scope.row.method==='POST'?'POST':'GET'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="kwargs" :formatter="formatterKwargs"label="函数" min-width="20%" sortable>
                         <!--<template slot-scope="scope">
                            <span>{{scope.row.kwargs==='{}'?scope.row.name:'/'+JSON.parse(scope.row.kwargs).command_name}}</span>
                        </template>-->
                    </el-table-column>
                    <el-table-column prop="elapsed" label="耗时" min-width="25%" sortable>
                    </el-table-column>
                    <el-table-column prop="startedAt":formatter="formatTime" label="开始时间" min-width="25%" sortable>
                    </el-table-column>
                    <el-table-column label="详情" min-width="15%" sortable fixed="right">
                        <template slot-scope="scope">
                            <el-button size="small" @click="lookResponseInfo(tableData[scope.$index].context)">查看</el-button>
                        </template>
                    </el-table-column>

                  
                </el-table>
                <!--工具条-->
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :page-count="total" style="float:right;">
                </el-pagination>
            </el-col>
        
            <el-dialog title="请求详情" :visible.sync="responseInfoVisible" :close-on-click-modal="false">
                <!--<div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px">
                    <div><span style="font-size: 15px;"><strong>url: </strong><strong>{{call_details.url}}</strong></span></div>
                    <br>
            
                    <div><span style="font-size: 15px;"><strong>args: </strong>{{call_details.args}}</span></div>
                    <div><span style="font-size: 15px;"><strong>form: </strong>{{call_details.form}}</span></div>
                    <div><span style="font-size: 15px;"><strong>body: </strong>{{call_details.body}}</span></div>
                    <div><span style="font-size: 15px;"><strong>headers: </strong>{{call_details.headers}}</span></div>
                    <div><span style="font-size: 15px;"><strong>IP: </strong>{{call_details.ip}}</span></div>
                </div>-->
                
                <div class="card-content" style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px">
                    <pre>{{call_details}}</pre>
                </div>
            </el-dialog>
        </el-row>
        
       <el-dialog title="Calls Dashboard" :visible.sync="callStatVisible" :close-on-click-modal="false"  @open="getProjectMember()" max-height="1600">
            <el-row :gutter="10" >
                <el-col :span="24" divided>
                    <!--<p style="color:#999">Dashboard</p>-->
                    <el-table :data="statCallData" highlight-current-row v-loading="apiListLoading"
                              style="width: 100%;" :show-header="true" max-height="600" @selection-change="selsChange">
                        <!--<el-table-column type="selection" width="55">
                        </el-table-column>-->
                        <el-table-column prop="method" label="服务类型" ><!--min-width="15%"-->
                            <template slot-scope="scope">
                                <span :style="methodClass(scope.row)">{{scope.row.method==='POST'?'POST':'GET'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="functionDict":formatter="formatterFunc" label="服务端点">
                         <!--<template slot-scope="scope">
                            <span>{{scope.row.functionDict==='{}'?scope.row.name:'/'+JSON.parse(scope.row.functionDict).command_name}}</span>
                        </template>-->
                        </el-table-column>
                         <el-table-column prop="count" label="count" sortable>
                        </el-table-column>
                         <el-table-column prop="avgElapsed" :render-header="renderHeader" label="平均耗时" >
                        </el-table-column>
                        <el-table-column prop="maxElapsed" :render-header="renderHeader" label="最大耗时" >
                        </el-table-column>
                        <el-table-column prop="minElapsed" :render-header="renderHeader" label="最小耗时" >
                        </el-table-column>
                        
                    </el-table>
                </el-col>
                
                
            </el-row>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="callStatVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { test } from '../../../../api/api'
    import $ from 'jquery'
    import moment from "moment"
    export default {
        name: "call-report",
        data(){
            return {
                pageCount:1,
                page: 1,
                responseInfoVisible: false,
                callStatVisible: false,
                total_call:0,
                call_details:{},
                func_json:{},
                pass: "",
                fail: "",
                not_run: "",
                error: "",
                total: "",
                listLoading: false,
                resultFilter: [
                    {text: 'ERROR', value: 'ERROR'},
                    {text: 'FAIL', value: 'FAIL'},
                    {text: 'NotRun', value: 'NotRun'},
                    {text: 'PASS', value: 'PASS'},
                ],
                tableData: [],
                statCallData:[]
            }
        },
        methods: {
            back(){
                this.$router.go(-1); // 返回上一层
            },
            formatterKwargs(row, column) {
                let command = JSON.parse(row.kwargs).command_name;
                //console.log(command,typeof command)
                if (row.kwargs==="{}"){
                    return row.name;
                }else if(typeof command==="undefined"){
                    return '/'+JSON.parse(row.kwargs).filename;
                }else{
                    return '/'+JSON.parse(row.kwargs).command_name;
                }
               
            },
            formatterFunc(row, column) {
                let command = JSON.parse(row.functionDict).command_name;
                //console.log(command,typeof command)
                if (row.functionDict==="{}"){
                    return row.name;
                }else if(typeof command==="undefined"){
                    return '/'+JSON.parse(row.functionDict).filename;
                }else{
                    return '/'+JSON.parse(row.functionDict).command_name;
                }
               
            },
            renderHeader(h, {column}) {
                let header = column.label.split(' ');
                return [h('p', [
                    h('p', {}, header[0]),
                    h('span', {}, header[1])
                ])];
            }, // 文本分别添加到p,span标签中
            // 调用统计信息
            statDiffMethod() {
                this.callStatVisible = true;
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除所有请求数据吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    $.ajax({
                        type: "post",
                        url: test+"/api/serving/del_calls_db",
                        async: true,
                        data: JSON.stringify({
                                project_id: Number(this.$route.params.project_id),
                                api_id: Number(this.$route.params.api_id) }),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            if (data.code === '999999') {
                                self.$message({
                                    message: '删除成功',
                                    center: true,
                                    type: 'success'
                                })
                            } else {
                                self.$message.error({
                                    message: data.msg,
                                    center: true,
                                })
                            }
                            self.getTestResult();
                        },
                    })

                }).catch(() => {
                });
            },
            
            lookResponseInfo(index) {
                this.responseInfoVisible = true;
                console.log(index,typeof index)
                //this.responseInfo = this.response[index]
                this.call_details=JSON.parse(index)
            },
            formatTime:function(row, column) { //日期格式化
                var date = row[column.property];  
                if (date == undefined) {  
                    return "";  
                }  
                return moment.unix(date).format("YYYY-MM-DD HH:mm:ss");  
            },
            methodClass(row) {
                
                if (row.method === 'POST') {
                    //console.log(row.method,"postmethodclass")
                    return "padding: 2px 4px;color: #fff;background-color: #2758E4;"
                } else {
                    //console.log(row.method,"getmethodclass")
                    return "padding: 2px 4px;color: #fff;background-color: #4BB74B;"
                }
              },
            tableRowStyle(row) {
                
                if (row.result === 'ERROR' || row.result === 'FAIL') {
                    return "background-color: #DC143C;"
                } else if(row.result === 'TimeOut'){
                    return "background-color: #FFE4C4;"
                }
              },
            filterHandler(value, row, column) {
                return row.result === value;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getTestResult()
            },
            getTestResult() {
                this.listLoading = true;
                let self = this;
                $.ajax({
                    type: "get",
                    url: test + "/api/api/call_report",
                    async: true,
                    data: { page: self.page,
                           project_id: this.$route.params.project_id,
                           api_id: Number(this.$route.params.api_id)},
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: function(data) {
                        self.listLoading = false;
                        if (data.code === '999999') {
                            self.total = data.data.total;
                            self.total_call= data.data.total_call;
                            //self.pass = data.data.pass;
                            //self.fail = data.data.fail;
                            //self.not_run = data.data.NotRun;
                            //self.error = data.data.error;
                            console.log(data.data.data,"data")
                            self.statCallData = data.data.stat
                            self.tableData = data.data.data
                            
                        }
                        else {
                            self.$message.error({
                                message: data.msg,
                                center: true,
                            })
                        }
                    },
                })
            },
        },
        mounted() {
            this.getTestResult();
        }
    }
</script>

<style scoped>
    .number-pass {
        border-radius: 25px;
        position: absolute;
        height: 100px;
        box-sizing: border-box;
        color: #fff;
        font-size: 20px;
        word-break:break-all;
        word-wrap:break-word;
        text-align: center;
        width: 100px;
        top: -70px;
        right: 350px;
    }
    .break-word{
        word-break:break-all;
        word-wrap:break-word;
    }
    .number-fail {
        border-radius: 25px;
        border: 1px solid #C4C4C4;
        position: absolute;
        height: 100px;
        box-sizing: border-box;
        color: #fff;
        font-size: 20px;
        text-align: center;
        width: 100px;
        top: -70px;
        right: 240px;
    }
    .number-error {
        border-radius: 25px;
        position: absolute;
        height: 100px;
        box-sizing: border-box;
        color: #fff;
        font-size: 25px;
        text-align: center;
        width: 100px;
        top: -70px;
        right: 130px;
    }
    .number-total {
        border-radius: 25px;
        border: 1px solid #C4C4C4;
        position: absolute;
        height: 100px;
        box-sizing: border-box;
        /*color: #fff;*/
        font-size: 20px;
        text-align: center;
        width: 200px;
        top: -70px;
        right: 20px;
    }
    .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
          width: 90px;
          color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
          margin-right: 0;
          margin-bottom: 0;
          width: 50%;
      }
    .return-list {
        margin-top: 0px;
        margin-bottom: 10px;
        border-radius: 25px;
    }
    .callreport-manage {
        margin: 35px;
    }
     .HttpStatus {
        border-radius: 25px;
        padding: 10px;
        box-sizing: border-box;
        color: #fff;
        font-size: 15px;
        background-color: #409eff;
        text-align: center;
        margin-right: 10px;
    }
    .el-table .cell {
white-space: pre-line;
}
</style>