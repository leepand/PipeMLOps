<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>


		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="模型服务" width="120" sortable>
			</el-table-column>
      <el-table-column prop="profess" label="学院" width="140" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="年级" width="90" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="电话" width="150" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="170" sortable>
			</el-table-column>
			<el-table-column prop="group" label="组别" width="140" sortable>
			</el-table-column>
			<el-table-column prop="pub_date" label="提交时间" min-width="170" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click.native="handleDetails(scope.$index, scope.row)">详情</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
            </el-table-column>
		</el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

		<!--详情界面-->
		<el-dialog title="详情" :visible.sync="detailFormVisible" :close-on-click-modal="false">
			<el-form :model="detailForm" label-width="80px" :rules="detailFormRules" ref="detailForm">
        <el-form-item label="姓名" prop="name">
							<el-input v-model="detailForm.name" auto-complete="off"></el-input>
						</el-form-item>
				<el-row>
            <el-col :span="12">
  						<el-form-item label="学院">
							<el-input v-model="detailForm.profess"></el-input>
						</el-form-item>
  					</el-col>
  					<el-col :span="12">
  						<el-form-item label="年级">
							<el-input v-model="detailForm.grade"></el-input>
						</el-form-item>
  					</el-col>
				</el-row>
				<el-row>
  					<el-col :span="12">
  						<el-form-item label="电话">
							<el-input v-model="detailForm.phone"></el-input>
						</el-form-item>
  					</el-col>
  					<el-col :span="12">
  						<el-form-item label="邮箱">
							<el-input v-model="detailForm.email"></el-input>
						</el-form-item>
  					</el-col>
				</el-row>
				<el-row>
  					<el-col :span="12">
  						<el-form-item label="组别">
							<el-input v-model="detailForm.group"></el-input>
						</el-form-item>
  					</el-col>
  					<el-col :span="12">
  						<el-form-item label="日期">
  							<el-date-picker type="datetime" placeholder="日期" v-model="detailForm.pub_date"></el-date-picker>
						</el-form-item>
  					</el-col>
				</el-row>
				<el-form-item label="能力期待">
					<el-input type="textarea" v-model="detailForm.power"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailFormVisible = false">返回</el-button>
			</div>
		</el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from '../../common/js/util'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      users: [],
      page_size: 20,
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      detailFormVisible: false, //详情界面是否显示
      editLoading: false,
      detailFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
        
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
    // 新增界面数据
      addForm: {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      },
      //详情界面数据
      detailForm: {
        id: 0,
        name: "",
        profess: "",
        grade: 0,
        phone: 0,
        email: "",
        group: "",
        pub_data: "",
        power: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then(res => {
        this.total = res.data.total;
        this.page_size = res.data.page_size;
        this.users = res.data.infos;
        this.listLoading = false;
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;
            let { msg, code } = res.data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: "warning"
              });
            } else {
              this.$message({
                message: msg,
                type: "success"
              });
            }
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示详情界面
    handleDetails: function(index, row) {
        
      this.detailFormVisible = true;
      this.detailForm = Object.assign({}, row);
        console.log('query',this.detailForm)
    },
    selsChange: function(sels) {
        console.log('query2')
      this.sels = sels;
    },
      
     // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      }
    },
      
        // 新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            // NProgress.start();
            let para = Object.assign({}, this.addForm)
            para.birth = (!para.birth || para.birth === '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            addUser(para).then((res) => {
              this.addLoading = false
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
      
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中用户吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { ids: ids };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;
            let { msg, code } = res.data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: "warning"
              });
            } else {
              this.$message({
                message: msg,
                type: "success"
              });
            }
            this.getUsers();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>

</style>
