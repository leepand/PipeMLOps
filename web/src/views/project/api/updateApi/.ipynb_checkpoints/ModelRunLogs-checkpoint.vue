<template>
    <section>
        <router-link :to="{ name: '基础信息', params: {project_id: this.$route.params.project_id,api_id:this.$route.params.api_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>模型详情</el-button>
        </router-link>
        <router-link :to="{ name: '基础信息', params: {project_id: this.$route.params.project_id,api_id:this.$route.params.api_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list" style="float: right">取消</el-button>
        </router-link>


<template>
    <el-card class="box-card">
        <pre class="code">{{RunLogStr}}</pre>
        <div v-show="!RunLogStr" class="raw">暂无数据，请前去部署模型！</div>
    </el-card>
</template>

    </section>
</template>
<script>
    import { test } from '../../../../api/api'
    import $ from 'jquery'
    export default {
        data() {
            return {
                RunLogStr: "",
                listLoading: false,
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getApiLogs()
            },
            // 获取项目动态
            getApiLogs() {
                this.listLoading = true;
                let self = this;
                let param = {project_id: self.$route.params.project_id, api_id: self.$route.params.api_id};
                $.ajax({
                    type: "get",
                    url: test+"/api/serving/service_logs",
                    async: true,
                    data: param,
                    headers: {
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    },
                    timeout: 5000,
                    success: function(data) {
                        self.listLoading = false;
                        console.log(data.log_strs)
                        if (data.code === '999999') {
                            self.RunLogStr =data.log_str;
                           
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
            this.getApiLogs();

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
