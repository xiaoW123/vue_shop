<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="grtUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="grtUserList()"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <!-- 序号 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 姓名 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <!-- 邮箱 -->
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <!-- 电话 -->
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!-- 角色 -->
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态 -->
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="usreStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip content="角色编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="删除角色" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="userRuleForm"
          :rules="userRules"
          ref="userRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userRuleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userRuleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userRuleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userRuleForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="aditDialogVisible" width="50%" @close="aditDialogClosed">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="aditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="aditDialogClick()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "User",
  data() {
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱信息"));
    };
    // 自定义定义手机校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机信息"));
    };
    return { 
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示个数
        pagesize: 2,
      },
      // 保存用户信息
      userlist: [],
      total: 0,
      // 添加用户对话框
      dialogVisible: false,
      // 编辑用户对话框
      aditDialogVisible: false,
      // 添加用户数据
      userRuleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 校验规则
      userRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 编辑时保存的用户信息
      editForm: {},
      // 编辑用户 的表单校验规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.grtUserList();
  },
  methods: {
    // 数据请求 ，获取用户信息
    grtUserList() {
      request({
        url: "users",
        method: "get",
        params: this.queryInfo,
      })
        .then((result) => {
          const { data: res } = result.data;
          this.userlist = res.users;
          this.total = res.total;
          console.log( this.userlist)
        })
        .catch(() => {
          this.$message.error("获取信息失败！");
        });
    },

    // 更改当前当前页数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.grtUserList();
    },

    //  更改当前每页显示数量
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.grtUserList();
    },

    // 更改状态信息,并 put同步到 后台Mysql
    usreStateChanged(userInfo) {
      request({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: "put",
      })
        .then((res) => {
          this.$message.success("更改状态成功~");
        })
        .catch((err) => {
          this.$message.error("更改状态失败~");
        });
    },

    // 关闭表单时,内容重置
    addDialogClosed() {
      this.$refs.userRuleForm.resetFields();
    },

    // 对添加用户表单进行校验提交
    addUser() {
      this.$refs.userRuleForm.validate((valid) => {
        // 发起网络请求,添加用户
        request({
          url: "users",
          method: "post",
          data: this.userRuleForm,
        })
          .then((res) => {
            this.$message.success("添加成功~");
            // 关闭表单
            this.dialogVisible = false;
            // 刷新页面
            this.grtUserList();
          })
          .catch((err) => {
            this.$message.error("添加失败~");
          });
      });
    },

    // 通过作用域插槽,获取编辑时的用户的信息
    showEditDialog(data) {
      this.aditDialogVisible = true;
      request({
        url: `users/${data}`,
        method: "get",
      }).then((res) => {
        this.editForm = res.data.data;
        // console.log(this.editForm);
      });
    },
    // 编辑对话框的重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑用户，点击你确认时
    aditDialogClick() {
      this.$refs.editFormRef.validate((valid) => {
        request({
          method: 'put',
          url: `users/${this.editForm.id}`,
          // data: this.editForm
          data:{
            mobile: this.editForm.mobile,
            email: this.editForm.email,  
          }
        }).then(res=> {
          console.log(res)
          this.editForm = res.data.data
          this.aditDialogVisible = false
          this.grtUserList();
          this.$message.success('编辑成功~')
        }).catch(err => {
          this.$message.error('编辑失败~')
        })
      })
    }
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 15px;
}
</style>