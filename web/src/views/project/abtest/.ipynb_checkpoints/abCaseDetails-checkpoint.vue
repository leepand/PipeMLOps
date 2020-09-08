<template>
    <section>
        <!--<router-link :to="{ name: '实验列表', params: {project_id: this.$route.params.project_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>实验列表</el-button>
        </router-link><i class="el-icon-plus" style="margin-right: 5px;margin-left:10px"></i>-->
        <el-button class="return-list" @click="back"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>实验用例列表</el-button>
        <el-button type="primary"   @click.native="pauseExp" style="margin-left:10px">{{is_paused===false?'暂停实验':'开始实验'}}</el-button>
        <el-button type="primary" :style="{ display: stopVisible }" @click="stopExp">停止实验</el-button>
        <!--<router-link :to="{ name: '添加新接口'}" style='text-decoration: none;color: #000000;'>
            <el-button type="primary" style="margin-left:10px">编辑实验描述</el-button>
        </router-link>-->
        <el-button type="primary" @click.native="handleEdit('index',{description:'description'})">编辑实验描述</el-button>
        <el-button type="primary" @click.native="resetWinner" style="margin-left:10px"><div>重选获胜组</div></el-button>
        <el-button type="primary" @click="resetExp" style="margin-left:10px"><div>重设实验</div></el-button>
        <el-select v-model="abkpi"  placeholder="请选择KPI指标" style="float: right">
            <el-option v-for="(item,index) in KPIs" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        
        <!--<el-button class="return-list" @click="back"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>实验用例列表</el-button>-->

        <br>
        
        <el-row :gutter="20" class="topmargin">
            
            <el-col :span="12">
                <span style="padding-left: 40px;color:#999">实验描述:&nbsp;{{description}}</span>
                <div>
                <!--<span style="padding-left: 40px;color:#999">状态:&nbsp;{{is_archived===false?'否':'已回收'}}</span>
                <span style="padding-left: 40px;color:#999">状态:&nbsp;{{is_paused===false?'否':'已暂停'}}</span>-->
                <span style="padding-left: 40px;color:#999">实验状态:&nbsp;<span style="padding: 2px;font-size: 8px;color: #fff;background-color: #FF6600;">{{is_paused===false && is_archived===false?'进行中':'已经暂停或停止'}}</span></span>
               </div>

                <div id="myChart" :style="{height: '400px',width:'1000px'}"></div>
            </el-col>
            <el-col :span="7">
                <div id="singleTestChart" :style="{height: '400px'}"></div>
            </el-col>
        </el-row>
        <p style="padding-left: 50px;color:#999">*注<strong>:&nbsp;</strong>天/月/年</p>
        <el-row>
            <el-col :span="4">
                <el-select v-model="time" placeholder="请选择时间周期" style="padding-left: 50px;padding-bottom: 10px">
                    <el-option v-for="item in options" :key="item.period" :label="item.label" :value="item.period">
                    </el-option>
                </el-select>
            </el-col>
           
        </el-row>
        <div style="padding-left: 50px;width: 96%">
            <el-table :data="tableData" v-loading="listLoading" :row-style="tableRowStyle">
                
                <el-table-column type="index" label="#" width="100">
                </el-table-column>
                <el-table-column prop="name" label="实验用例名称" min-width="29" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="font-size: 16px">{{scope.row.name}}</span>&nbsp;<span class="abcontrol" v-if="scope.row.is_control">{{scope.row.app_type===false?'':'控制组'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="data" label="转化情况" min-width="29%" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.completed_count}} / {{scope.row.participant_count}}
                    </template>
                </el-table-column>
                <el-table-column prop="conversion_rate" label="转化率" min-width="20%" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.conversion_rate.toFixed(2)}} &plusmn; {{scope.row.conversion_rate.toFixed(1)}}%
                    </template>
                    
                </el-table-column>
                <el-table-column prop="confidence_level" label="置信度" min-width="12%" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.confidence_level === 'N/A'">—</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="15%">
                    <template slot-scope="scope">
                        <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
                        <el-button v-if="!scope.row.is_winner" type="success" size="small" @click="handleSetWinner(scope.$index,scope.row)">use this</el-button>
                        <span class="abwinner" v-if="scope.row.is_winner">{{scope.row.is_winner===None?'':'Winner!'}}</span>
                        <!--<el-button v-if="!scope.row.status" type="info" size="small"  @click="handleChangeStatus(scope.$index,scope.row)">winner</el-button>-->
                    </template>
            </el-table-column>

                
            </el-table>
        </div>
        <div style="margin-top: 5%"></div>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width: 75%; left: 12.5%">
            <el-form :model="editForm" label-width="80px"  :rules="editFormRules" ref="editForm">
                <el-form-item label="实验描述" prop='description'>
                    <el-input type="textarea" :rows="6" v-model="editForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import echarts from 'echarts'
    import { test, getTestResultList, getTestTenTime, getTestTenResult,absetWinner} from '../../../api/api'
    import $ from 'jquery'
    export default {
        data () {
            return {
                filters: {
                    name: ''
                },
                tableData: [],
                listLoading: false,
                time: "",
                elapsedTime: "",
                host: "",
                description:"",
                abkpi: "",
                KPIs:[],
                options: [{"period":"day","label":"今天"},
                          {"period":"month","label":"近一个月"},
                          {"period":"year","label":"近一年"}],
                pass: "",
                fail: "",
                error: "",
                is_archived:false,
                is_paused:false,
                
                abChartName:[],
                abChartX:[],
                abChartY:[],
                stopVisible:"",
                editLoading: false,
                editFormVisible:false,
                editFormRules: {
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
            }
        },
        mounted(){
            //this.getTenTestTime();
            //this.getLatelyTenTestResult();
            this.getTestResult();
            //this.drawLine();
            //this.getAbKPIs();
        },
        methods: {
            back(){
                this.$router.go(-1); // 返回上一层
            },
            stopExp() {
                //let ids = this.sels.map(item => item.id);
                let self = this;
                
                this.$confirm('确认提交操作吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.stopVisible="none";
                    //NProgress.start();
                    
                    let param = JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            case_id: Number(this.$route.params.case_id),
                            api_id: Number(this.$route.params.api_id),
                        });
                    
                    $.ajax({
                        type: "post",
                        url: test+"/api/automation/stopExp",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            if (data.code === '999999') {
                               
                                self.$message({
                                    message: data.msg,
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
                            
                            self.getTestResult()
                            
                        },
                    })
                }).catch(() => {

                });
            },
            
            pauseExp() {
                //let ids = this.sels.map(item => item.id);
                let self = this;
                
                this.$confirm('确认提交操作吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    
                    let param = JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            case_id: Number(this.$route.params.case_id),
                            api_id: Number(this.$route.params.api_id),
                        });
                    
                    $.ajax({
                        type: "post",
                        url: test+"/api/automation/pauseExp",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            if (data.code === '999999') {
                               
                                self.$message({
                                    message: data.msg,
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
                            
                            self.getTestResult()
                            
                        },
                    })
                }).catch(() => {

                });
            },
            
            //显示编辑界面
            handleEdit: function (index, row) {
                //console.log(row,this.description,"ddddd")
                this.editFormVisible = true;
                let desc = this.description;
                //this.editForm = Object.assign({}, row);
                this.editForm = Object.assign({}, {description:desc});
            },
            editSubmit() {
                //let ids = this.sels.map(item => item.id);
                let self = this;
                this.$confirm('确认提交描述吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.editLoading = true;
                    //NProgress.start();
                    let param = JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            case_id: Number(this.$route.params.case_id),
                            api_id: Number(this.$route.params.api_id),
                            abkpi: this.abkpi.toString(),
                            description: self.editForm.description
                        });
                    console.log(param,"abnameabname")
                    $.ajax({
                        type: "post",
                        url: test+"/api/automation/editDesc",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            self.editLoading = false;
                            if (data.code === '999999') {
                                self.$message({
                                    message: '修改实验描述成功',
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
                            self.editFormVisible = false;
                            self.getTestResult()
                        },
                    })
                }).catch(() => {

                });
            },
            resetExp() {
                //let ids = this.sels.map(item => item.id);
                let self = this;
                this.$confirm('确认重置实验吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    let param = JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            case_id: Number(this.$route.params.case_id),
                            api_id: Number(this.$route.params.api_id),
                        });
                    console.log(param,"abnameabname")
                    $.ajax({
                        type: "post",
                        url: test+"/api/automation/resetExp",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            //self.searchApiListVisible = false;
                            if (data.code === '999999') {
                                self.$message({
                                    message: '重置成功',
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
                            self.getTestResult()
                        },
                    })
                }).catch(() => {

                });
            },
            resetWinner() {
                //let ids = this.sels.map(item => item.id);
                let self = this;
                this.$confirm('确认重置胜利组吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    let param = JSON.stringify({
                            project_id: Number(this.$route.params.project_id),
                            case_id: Number(this.$route.params.case_id),
                            api_id: Number(this.$route.params.api_id),
                        });
                    console.log(param,"abnameabname")
                    $.ajax({
                        type: "post",
                        url: test+"/api/automation/resetWinner",
                        async: true,
                        data:param,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                        },
                        timeout: 5000,
                        success: function(data) {
                            //self.searchApiListVisible = false;
                            if (data.code === '999999') {
                                self.$message({
                                    message: '重置成功',
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
                            self.getTestResult()
                        },
                    })
                }).catch(() => {

                });
            },
            // 设置胜出模型
            handleSetWinner: function(index, row) {
                let self = this;
                this.listLoading = true;
                let params = {
                    project_id: this.$route.params.project_id,
                    altname: row.name.toString(),
                    api_id: this.$route.params.api_id,
                    case_id: this.$route.params.case_id,
                    user_key:JSON.parse(sessionStorage.getItem('name'))
                };
                console.log(params,"setwinner")
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                if (row.is_winner) {
                    absetWinner(headers, params).then(_data => {
                        let {msg, code, data} = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '取消胜出设置',
                                center: true,
                                type: 'success'
                            });
                            row.is_winner = !row.is_winner;
                            self.getTestResult();
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                    });
                } else {
                    absetWinner(headers, params).then(_data => {
                        let {msg, code, data} = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '设置胜出模型',
                                center: true,
                                type: 'success'
                            });
                            row.is_winner = !row.is_winner;
                            self.getTestResult();
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
            
            getTestResult() {
                this.listLoading = true;
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id,
                    api_id: this.$route.params.api_id,
                    case_id: this.$route.params.case_id,
                    abkpi: this.abkpi.toString(),
                    time: this.time.toString()
                };
                console.log(params,"paramsparamsparamsparams")
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getTestResultList(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                        if (code === '999999') {
                            self.tableData = data.alternatives
                            self.description = data.description
                            self.is_archived=data.is_archived
                            self.is_paused = data.is_paused
                            self.KPIs = data.kpis;
                            self.abChartY=[];
                            
                            if (data.alternatives[0].data.length>6){
                                data.alternatives.forEach((item) => {
                                    self.abChartName.push(item.name);
                                    let YData=[];
                                    self.abChartX=[];
                                    let lenofData = item.data.length;
                                    for(var i = lenofData-7; i < lenofData; i++) {
                                        let rate=0.00;
                                        let itemXY= [];
                                        itemXY = item.data[i];
                                        //console.log(itemXY,item.data,i,"itemXY")
                                        self.abChartX.push(itemXY.date);
                                        rate = Number(itemXY.conversions / itemXY.participants).toFixed(5)*100;
                                        if (isNaN(rate)) rate = 0.00;
                                        YData.push(rate);
                                        
                                    }
                                    self.abChartY.push({name: item.name,
                                                        type: "line",
                                                        data: YData});
                                });
                                
                            }else{
                                data.alternatives.forEach((item) => {
                                    self.abChartName.push(item.name);
                                    let YData=[];
                                    self.abChartX=[];
                                    item.data.forEach((itemXY) => {
                                        let rate=0.00;
                                        self.abChartX.push(itemXY.date);
                                        rate = Number(itemXY.conversions / itemXY.participants).toFixed(5)*100;
                                        if (isNaN(rate)) rate = 0.00;
                                        YData.push(rate);
                                    });
                                    self.abChartY.push({name: item.name,
                                                        type: "line",
                                                        data: YData});
                                });
                            }
                            
                         
                            console.log(data.alternatives,self.abChartY,"dd");
                            self.drawLine(); //new add
                            
                            //self.singleTestDraw();
                            if (data.is_archived){
                                self.stopVisible="none";
                            }else{
                                self.stopVisible="";
                            }
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                })
            },
            drawLine(){
                let myChart = echarts.init(document.getElementById('myChart'));
                // 绘制图表
                console.log("abchart")
                let option = {
                    title: {
                        text: 'Conversion Rate',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data:this.abChartName
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.abChartX,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '转化率',
                            scale: true,
                            //interval: 10,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                    ],
                    series: this.abChartY
                };
                myChart.setOption(option);
            },
            
            singleTestDraw(){
                let myChart = echarts.init(document.getElementById('singleTestChart'));
                // 绘制图表
                let option = {
                    title : {
                        text: '比例图',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    series : [
                        {
                            // name: '姓名',
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            data: [
                                //{value:this.error, name:'ERROR'},
                                //{value:this.fail, name:'FAIL'},
                                //{value:this.pass, name:'PASS'},
                                 {value:'90', name:'ERROR'},
                                 {value:'5', name:'FAIL'},
                                 {value:'5', name:'PASS'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
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
            getTenTestTime(){
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getTestTenTime(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    if (code === '999999') {
                        self.options = data;
                        if (data.length) {
                            self.time = data[0].startTime;
                            self.elapsedTime = data[0].elapsedTime;
                            self.host = data[0].host;
                            
                            self.getTestResult();
                        }
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            },
            changeHost(){
                for (let i=0;i<this.options.length;i++){
                    if (this.options[i]['startTime'] === this.time){
                        this.host = this.options[i].host;
                        this.elapsedTime = this.options[i].elapsedTime;
                    }
                }
            },
            getLatelyTenTestResult(){
                let self = this;
                let params = {
                    project_id: this.$route.params.project_id
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getTestTenResult(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    if (code === '999999') {
                        console.log(data);
                        data.forEach((item) => {
                            self.latelyTenPass.push(item.pass*100);
                            self.latelyTenFail.push(item.fail*100);
                            self.latelyTenError.push(item.error*100)
                        });
                        //self.drawLine()
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                })
            }
        },
        watch: {
            time(){
                this.getTestResult();
                this.changeHost();
                this.drawLine();
            },
            abkpi(){
                this.getTestResult();
                this.changeHost();
                this.drawLine();
            },
        }
    }
</script>

<style scoped>
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
    .abwinner {
        border-radius: 25px;
        padding: 10px;
        box-sizing: border-box;
        color: #fff;
        font-size: 15px;
        background-color: #409eff;
        text-align: center;
        margin-right: 10px;
    }
    .abcontrol {
        
        padding: 2px;
        font-size: 8px;
        color: #fff;
        background-color: #FF9900;
    }
    .topmargin {margin-top: 1cm};
    .absuccess {
        color: #fff;
        background-color: #00FF00;
    };
</style>