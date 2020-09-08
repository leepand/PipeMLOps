<template>
    <div class="main-a">
        <el-row :span="24">
            <el-col :span="6" class='inline'>
                <el-card class="box-card" shadow="always">
                    <!--<div slot="header"></div>-->
                    <h2>{{type}}</h2>
                    <div>项目类型</div>
                </el-card>
            </el-col>
            <el-col :span="6" class='inline'>
                <el-card class="box-card" shadow="always">
                    <!--<div slot="header"></div>-->
                    <h2>{{version}}</h2>
                    <div>版本</div>
                </el-card>
            </el-col>
             <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <!--<div slot="header"></div>-->
                    <h2>{{moment(updateDate).format("YYYY-MM-DD HH:mm:ss")}}</h2>
                    <div>最近更新时间</div>
                </el-card>
            </el-col>           
        </el-row>
        
        <el-row :span="24">
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <router-link :to="{name: '服务列表'}" style='text-decoration: none;color: #000000;'><h2>{{apiCount}}个模型</h2></router-link>
                    <div>模型服务数量</div>
                </el-card>
            </el-col>
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <h2>{{statusCount}}条状态码</h2>
                    <div>通用状态码</div>
                </el-card>
            </el-col>
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <router-link :to="{name: '项目动态'}" style='text-decoration: none;color: #000000;'><h2>{{dynamicCount}}条动态</h2></router-link>
                    <div>项目三天内动态</div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <router-link :to="{name: '成员管理'}" style='text-decoration: none;color: #000000;'><h2><img src="../../../assets/member.png" class="member">{{memberCount}}人</h2></router-link>
                    <div>项目组成员</div>
                </el-card>
            </el-col>
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <router-link :to="{name: '实验列表'}" style='text-decoration: none;color: #000000;'><h2>{{abceseCount}}组在线实验</h2></router-link>
                    <div>线上实验报告</div>
                </el-card>
            </el-col>
        </el-row>
               
        <el-row :span="24">
            <el-col :span="6" class='inline'>
                <el-card class="box-card">
                    <h2>{{moment(createDate).format("YYYY-MM-DD HH:mm:ss")}}</h2>
                    <div>创建时间</div>
                </el-card>
            </el-col>
        </el-row>
        
    
        
    </div>
</template>

<script>
    import { getProjectDetail } from '../../../api/api'
    import moment from "moment"
    export default {
        data() {
            return {
                moment:moment,
                type: '',
                version: '',
                updateDate: '',
                apiCount: 0,
                statusCount: 0,
                dynamicCount: 0,
                memberCount: 0,
                createDate: '',
            }
        },
        methods: {
            getProjectInfo() {
                var self = this;
                let params = { project_id: this.$route.params.project_id};
                let headers = {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    };
                getProjectDetail(headers, params).then(_data => {
                   let { msg, code, data } = _data;
                    console.log(data.dynamicCount,"_data")
                   self.listLoading = false;
                        if (code === '999999') {
                            self.type = data.proj_type;
                            self.version = data.version;
                            self.updateDate = data.LastUpdateTime;
                            self.apiCount = data.apiCount;
                            self.dynamicCount = data.dynamicCount;
                            self.memberCount = data.memberCount;
                            self.createDate = data.createTime;
                            self.abceseCount = data.abceseCount;
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
        mounted() {
            this.getProjectInfo()
        }
    }
</script>


<style lang="scss" scoped>
    //@import url("//unpkg.com/element-ui@2.7.2/lib/theme-chalk/index.css");
    .box-card {
        width: 100%;
        height: 100%;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }
    .member {
        width: 7%;
    }
    .main-a {
        margin: 35px;
        margin-top: 10px;
    }
    .inline {
        margin: 10px;
        margin-left: 0px;
        margin-right: 20px;
    }
</style>
