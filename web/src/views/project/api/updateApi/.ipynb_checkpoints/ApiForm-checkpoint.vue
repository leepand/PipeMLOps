<template>
    <section>
        <router-link :to="{ name: '服务列表', params: {project_id: this.$route.params.project_id}}" style='text-decoration: none;color: aliceblue;'>
            <el-button class="return-list"><i class="el-icon-d-arrow-left" style="margin-right: 5px"></i>服务列表</el-button>
        </router-link>
        <el-radio-group v-model="radio" style="margin-left: 50px">
            <router-link @click.native="showNavi('基础信息')" :to="{ name: '基础信息', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;'>
                <el-radio-button label="基础信息">
                    <div style="width: 80px">基础信息</div>
                </el-radio-button>
            </router-link>
            <router-link @click.native="showNavi('模型列表')" :to="{ name: '模型列表', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;margin-left:10px;'>
                <el-radio-button label="模型列表">
                    <div style="width: 80px;margin-left:10px;">模型列表</div>
                </el-radio-button>
            </router-link>
            <router-link @click.native="showNavi('历史')" :to="{ name: '历史', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;margin-left:10px;'>
                <el-radio-button label="历史">
                    <div style="width: 80px;margin-left:10px;">历史</div>
                </el-radio-button>
            </router-link>
            <!--<router-link @click.native="showNavi('修改')" :to="{ name: '修改', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;margin-left:10px;'>
                <el-radio-button label="修改">
                    <div style="width: 80px;margin-left:10px;">修改</div>
                </el-radio-button>
            </router-link>-->
            <router-link @click.native="showNavi('调用详情')" :to="{ name: '调用详情', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;margin-left:10px;'>
                <el-radio-button label="调用详情">
                    <div style="width: 80px;margin-left:10px;">调用详情</div>
                </el-radio-button>
            </router-link>

            <router-link @click.native="showNavi('查看日志')" :to="{ name: '查看日志', params: { project_id: this.$route.params.project_id, api_id: this.$route.params.api_id}}" style='text-decoration:none;margin-left:10px;'>
                <el-radio-button label="查看日志">
                    <div style="width: 80px;margin-left:10px;">查看日志</div>
                </el-radio-button>
            </router-link>

            <el-radio-button label="删除" @click.native="handleDel">
                <div style="width: 80px;">删除</div>
            </el-radio-button>
        </el-radio-group>
        <div style="margin-left: 10px;margin-right: 20px">
            <router-view></router-view>
        </div>
    </section>
</template>

<script>
    import { test } from '../../../../api/api'
    import $ from 'jquery'
    export default {
        name: "api-form",
        data() {
            return {
                radio: "",
            }
        },
        methods: {
            handleDel: function () {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    let self = this;
                    $.ajax({
                        type: "post",
                        url: test+"/api/api/del_api",
                        async: true,
                        data: JSON.stringify({ project_id: Number(this.$route.params.project_id), ids: [this.$route.params.api_id] }),
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
                                });
                                self.$router.push({ name: '接口列表', params: { project_id: self.$route.params.project_id}});
                            } else {
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
            showNavi(title) {
                this.radio = title
            }
        },
        mounted() {
            this.radio = this.$route.name
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