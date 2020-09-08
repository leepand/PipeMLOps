<template>
    <el-row class="dynamic-manage">
        <el-col :span="24">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="listLoading">
                <el-table-column prop="time":formatter="formatTime" label="操作时间" min-width="13%">
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="10%">
                </el-table-column>
                <el-table-column prop="operationObject" label="操作对象" min-width="15%">
                </el-table-column>
                <el-table-column prop="user_name" label="操作人" min-width="15%">
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="47%">
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :page-count="total" style="float:right;">
            </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
    import { getProjectDynamicList } from '../../api/api'
    import moment from "moment"
    export default {
        data() {
            return {
                moment:moment,
                tableData: [],
                total: 0,
                page: 1,
                listLoading: false,
            }
        },
        methods: {
            // row[column.property] 能读取到该行该列的数据。代码中实现了时间格式的转换
            formatTime2(row, column) {
                const date = new Date(row[column.property])
                return date.getFullYear() + '年' +
                    date.getMonth() + '月' +
                    date.getDate() + '日 ' +
                    date.getHours() + ':' +
                    date.getMinutes()
            },
            formatTime:function(row, column) { //日期格式化
                var date = row[column.property];  
                if (date == undefined) {  
                    return "";  
                }  
                return moment(date).format("YYYY-MM-DD HH:mm:ss");  
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getProjectDynamic()
            },
            // 获取项目动态
            getProjectDynamic() {
                this.listLoading = true;
                let self = this;
                let params = {
                    project_id: Number(this.$route.params.project_id),
                    page: self.page
                };
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                getProjectDynamicList(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    self.listLoading = false;
                    setTimeout(() => {
                        self.listLoading = false;
                    }, 20);
                    console.log(data)
                    if (code === '999999') {
                        self.total = data.total;
                        self.tableData = data.data
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                }).catch(e => this.listLoading = false)
            },
        },
        mounted() {
            this.getProjectDynamic();

        }
    }
</script>

<style lang="scss" scoped>
    .dynamic-manage {
        margin: 35px;
    }
</style>
