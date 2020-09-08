<template>
    <section>
        <div style="padding-left: 50px;width: 96%">
            <el-table :data="models" v-loading="listLoading" :row-style="tableRowStyle" style="width: 100%"  class="el-table2">
                
                <el-table-column prop="sub_model_name" label="模型名称"  align="center" width="150" fixed show-overflow-tooltip >
                </el-table-column>
            <el-table-column label="个性化参数" align="left">
                <el-table-column :label="item" v-for="(item, index) in header"  :key="item"  align="center"  :render-header="labelHead">
                    <template slot-scope="scope">
                        {{ scope.row[item] }} 
                    </template>
                </el-table-column>
            </el-table-column>
                <el-table-column prop="best_loss" label="best_loss"  show-overflow-tooltip  width="90">
                </el-table-column>
                <el-table-column prop="best_acc" label="best_acc"  show-overflow-tooltip width="90">
                </el-table-column>
                <el-table-column prop="best_precision" label="best_precision"  show-overflow-tooltip width="120">
                </el-table-column>
                <el-table-column prop="best_F1" label="best_F1"   show-overflow-tooltip width="90" >
                </el-table-column>
                <el-table-column prop="best_step" label="best_step"  show-overflow-tooltip width="90">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                        <el-button type="danger" size="small" @click="delHistory(scope.$index, scope.row)">删除</el-button>
                    </template>
            </el-table-column>

                
            </el-table>
        </div>
        <el-row :gutter="20" class="topmargin">
            <div id="LossLineChart" :style="{height: '400px',width:'1200px'}"></div>
        </el-row>
        <el-row :gutter="20" class="topmargin">
            <div id="AccLineChart" :style="{height: '400px',width:'1200px'}"></div>
        </el-row>
        <el-row :gutter="20" class="topmargin">
            <div id="RecallLineChart" :style="{height: '400px',width:'1200px'}"></div>
        </el-row>
        <el-row :gutter="20" class="topmargin">
            <div id="PrecisionLineChart" :style="{height: '400px',width:'1200px'}"></div>
        </el-row>
        <el-row :gutter="20" class="topmargin">
            <div id="F1LineChart" :style="{height: '400px',width:'1200px'}"></div>
        </el-row>

    </section>
</template>
<script>
    import echarts from 'echarts'
    import { test } from '../../../../api/api'
    import $ from 'jquery'
    export default {
        data() {
            return {
                models:[],
                header:[],
                model_params: {},
                legend_loss:[],
                x_value_loss:[],
                series_loss:[],
                format: false,
            }
        },
        methods: {
            labelHead(h,{column,index}){
                let l = column.label.length
                let f = 16 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
                column.minWidth = f*l //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
                //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
                //console.log("header")
                return h('span',{class:'table-head',style:{width:'100%'}},[column.label])
            },
            checkRequest(){
                let request = this.form.request4;
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
            drawLine(title,chart_id,x,y,lengend,y_name){
                let LossLineChart = echarts.init(document.getElementById(chart_id));
                // 绘制图表
                let option = {
                    title: {
                        text: title,
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
                        data: lengend
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name:'Epoch',
                            data: x,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: y_name,
                            scale: true,
                            //interval: 10,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    series: y
                };
                LossLineChart.setOption(option);
            },
            getModelInfo() {
                let self = this;
                let param = {project_id: self.$route.params.project_id,
                             api_id: self.$route.params.api_id};
                $.ajax({
                    type: "get",
                    url: test+"/api/experiment/models",
                    async: true,
                    data: param,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: (data) => {

                        if (data.code === '999999') {
                            self.models = data.data.data
                            self.header = data.data.table_head
                            self.model_params = data.data.model_params
                            self.legend_loss= data.data.get_loss_chart_data.legend_loss
                            self.x_value_loss= data.data.get_loss_chart_data.x_value_loss
                            self.series_loss = data.data.get_loss_chart_data.series_loss
                            
                            var legend_acc = [];
                            var series_acc = [];
                            legend_acc = data.data.get_acc_chart_data.legend_acc
                            series_acc = data.data.get_acc_chart_data.series_acc
                            
                            var legend_recall = [];
                            var series_recall = [];                            
                            legend_recall = data.data.get_recall_chart_data.legend_recall
                            series_recall = data.data.get_recall_chart_data.series_recall
                            
                            var legend_precision = [];
                            var series_precision = [];                            
                            legend_precision = data.data.get_precision_chart_data.legend_precision
                            series_precision = data.data.get_precision_chart_data.series_precision  
                            
                            var legend_F1 = [];
                            var series_F1 = [];                            
                            legend_F1 = data.data.get_F1_chart_data.legend_F1
                            series_F1 = data.data.get_F1_chart_data.series_F1  
                            

                            self.drawLine("Loss 曲线图","LossLineChart",self.x_value_loss,self.series_loss,self.legend_loss,"loss_value");
                            self.drawLine("Accuracy 曲线图","AccLineChart",self.x_value_loss,series_acc,legend_acc,"acc_value");
                            if(series_recall[0].data.length>0){
                                self.drawLine("Recall 曲线图","RecallLineChart",self.x_value_loss,series_recall,legend_recall,"recall_value");
                            }  
                            if(series_precision[0].data.length>0){
                                self.drawLine("Precision 曲线图","PrecisionLineChart",
                                              self.x_value_loss,series_precision,legend_precision,"precision_value");
                            }
                            if(series_F1[0].data.length>0){
                                self.drawLine("F1 曲线图","F1LineChart",self.x_value_loss,series_F1,legend_F1,"F1_value");
                            }     
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
            delHistory(index,row) {
                this.$confirm('确认提交操作吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                let self = this;
                let param = JSON.stringify({
                    project_id: Number(self.$route.params.project_id),
                    api_id: Number(self.$route.params.api_id),
                    model_id: Number(row.sub_model_id)
                });
                $.ajax({
                    type: "POST",
                    url: test+"/api/experiment/del_history",
                    async: true,
                    data: param,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: (data) => {
                        if (data.code === '999999') {
                            this.getModelInfo();
                            self.$message.success({
                                message: "删除成功！",
                                center: true,
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
            },
            toggleHeadSelection(rows) {
                rows.forEach(row => {
                    this.$refs.multipleHeadTable.toggleRowSelection(row, true);
                });
            },
            toggleParameterSelection(rows) {
                rows.forEach(row => {
                    this.$refs.multipleParameterTable.toggleRowSelection(row, true);
                });
            },
            selsChangeHead: function (sels) {
                this.headers = sels
            },
            selsChangeParameter: function (sels) {
                this.parameters = sels
            },
            Test: function() {
                let host = this.form.addr;
                if (host.indexOf("http://") ===0){
                    this.form.addr = host.slice(7)
                }
                if (host.indexOf("https://") ===0){
                    this.form.addr = host.slice(8)
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loadingSend = true;
                        let self = this;
                        let _parameter = new Object();
                        let headers = new Object();
                        self.form.statusCode = '';
                        self.form.resultData = '';
                        self.form.resultHead = '';
                        console.log(self.form.head)
                        for (let i = 0; i < self.form.head.length; i++) {
                            var a = self.form.head[i]["name"];
                            if (a) {
                                headers[a] = self.form.head[i]["value"]
                            }
                        }
                        console.log(headers)
                        let url = self.form.Http4 + "://" + self.form.url + host;
                        let _type = self.radio;
                        if (_type === 'form-data') {
                            if (self.radioType) {
                                for (let i = 0; i < self.parameters.length; i++) {
                                    var a = self.parameters[i]["name"];
                                    if (a) {
                                        _parameter[a] = self.parameters[i]["value"];
                                    }
                                }
                                _parameter = JSON.stringify(_parameter)
                            } else {
                                _parameter = self.form.parameter
                            }
                        } else {
                            // POST(url, self.form.parameterRaw, headers)
                            _parameter = self.form.parameterRaw;
                        }
                        if (self.form.parameterRaw && _type === "raw") {
                            if (!self.isJsonString(self.form.parameterRaw)) {
                                self.$message({
                                    message: '源数据格式错误',
                                    center: true,
                                    type: 'error'
                                })
                            } else {
                                $.ajax({
                                    type: self.form.request4,
                                    url: url,
                                    async: true,
                                    data: _parameter,
                                    headers: headers,
                                    timeout: 5000,
                                    success: function (data, status, jqXHR) {
                                        self.loadingSend = false;
                                        self.form.statusCode = jqXHR.status;
                                        self.form.resultData = data;
                                        self.form.resultHead = jqXHR.getAllResponseHeaders()
                                        self.AddHistroy(jqXHR.status)
                                    },
                                    error: function (jqXHR, error, errorThrown) {
                                        self.loadingSend = false;
                                        self.form.statusCode = jqXHR.status;
                                        self.form.resultData = jqXHR.responseJSON;
                                        self.form.resultHead = jqXHR.getAllResponseHeaders()
                                    }
                                })
                            }
                        } else {
                            $.ajax({
                                type: self.form.request4,
                                url: url,
                                async: true,
                                data: _parameter,
                                headers: headers,
                                timeout: 5000,
                                success: function (data, status, jqXHR) {
                                    self.loadingSend = false;
                                    self.form.statusCode = jqXHR.status;
                                    self.form.resultData = data;
                                    self.form.resultHead = jqXHR.getAllResponseHeaders()
                                    self.AddHistroy(jqXHR.status)
                                },
                                error: function (jqXHR, error, errorThrown) {
                                    self.loadingSend = false;
                                    self.form.statusCode = jqXHR.status;
                                    self.form.resultData = jqXHR.responseJSON;
                                    self.form.resultHead = jqXHR.getAllResponseHeaders()
                                }
                            })
                        }
                    }
                })
            },
            neatenFormat() {
                let demo = document.getElementsByTagName('pre')[0];
                console.log(demo)
                hljs.highlightBlock(demo);
                this.format = !this.format
            },
            addHead() {
                let headers = {name: "", value: ""};
                this.form.head.push(headers);
                let rows = [this.form.head[this.form.head.length-1]];
                this.toggleHeadSelection(rows)
            },
            delHead(index) {
                if (this.form.head.length !== 1) {
                    this.form.head.splice(index, 1)
                }
            },
            addParameter() {
                let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
                this.form.parameter.push(headers);
                let rows = [this.form.parameter[this.form.parameter.length-1]];
                this.toggleParameterSelection(rows)
            },
            delParameter(index) {
                if (this.form.parameter.length !== 1) {
                    this.form.parameter.splice(index, 1)
                }
            },
            addResponse() {
                let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
                this.form.response.push(headers)
            },
            delResponse(index) {
                if (this.form.response.length !== 1) {
                    this.form.response.splice(index, 1)
                }
            },
            changeParameterType() {
                if (this.radio === 'form-data') {
                    this.ParameterTyep = true
                } else {
                    this.ParameterTyep = false
                }
            },
            showBody() {
                this.resultShow = true
            },
            showHeader() {
                this.resultShow = false
            },
            handleChange(val) {
            },
            onSubmit() {
                console.log('submit!');
            },
        },
        watch: {
            radio() {
                this.changeParameterType()
            }
        },
        mounted() {
            this.getModelInfo();
            //this.getHost();
            //this.getHistory()
        }
    }
</script>

<style lang="scss" scoped>
    .table-head{
    font-size:14px!important;//设置固定的字体大小
  }
    
     .el-table2 .cell, .el-table th div{
    padding:0!important;
  }
  .el-table2 tr td .cell{
    padding:5px 2px !important;
  }
  .el-table2 .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
    padding-left:0 !important;
  }
    
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
    .HOST {
        position: absolute;
        right: 30px;
        top: 0px;
    }
    .raw {
        border: 1px solid #e6e6e6;
        margin-bottom: 10px;
        padding:15px;
        text-align: center
    }
</style>
<style lang="scss">
    .topmargin {margin-top: 1cm};
    .selectInput{
        input{
            border-right: 0px;
            border-radius: 4px 0px 0px 4px;
        }
    }
</style>
