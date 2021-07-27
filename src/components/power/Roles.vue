<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addVisible = true">添加角色</el-button>
      <template>
        <el-table :data="rolesData" style="width: 100%" stripe border>
          <el-table-column type="expand">
            <!-- 扩展功能 -->
            <template v-slot="scope">
              <el-row
                v-for="(item1, index) in scope.row.children"
                :key="item1.id"
                :class="{ tagborder: index === 0 ? false : true }"
                class="jz"
              >
                <!-- 一级权限 -->
                <el-col :span="5"
                  ><el-tag closable @close="deleteTag(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, index) in item1.children"
                    :key="item2.id"
                    :class="{ tagborder: index === 0 ? false : true }"
                  >
                    <el-col :span="6" class="el-col-margin"
                      ><el-tag
                        closable
                        type="success"
                        @close="deleteTag(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>

                    <el-col :span="18">
                      <el-tag
                        closable
                        class="el-col-marginleft el-col-margin"
                        type="warning"
                        v-for="(item3, index) in item2.children"
                        :key="item3.id"
                        @close="deleteTag(scope.row, item3.id)"
                        :class="{ tagborder: index === 0 ? false : true }"
                        >{{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column prop="" label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="modVisibleButton2(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="delUser(scope.row)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="small"
                @click="showSetRightDiglog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addVisible"
      width="50%"
      @close="addVisibleButton1"
    >
      <el-form
        :model="rolesRuleForm"
        :rules="rolesRules"
        ref="rolesRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisibleButton1">取 消</el-button>
        <el-button type="primary" @click="addVisibleButton2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="modVisible"
      width="50%"
      @close="modVisibleButton1"
    >
      <el-form
        :model="modRolesRuleForm"
        :rules="rolesRules"
        ref="modRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="modRolesRuleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="modRolesRuleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modVisibleButton1">取 消</el-button>
        <el-button type="primary" @click="modVisibleButton3">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRightVisible"
      width="50%"
      @close="setRigDialogClosed"
    >
      <el-tree ref="treeRef" :data="rightList" :props="defaultProps" :default-checked-keys="defKeys" show-checkbox default-expand-all node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Roles",
  data() {
    return {
      rolesData: [],
      isTag: true,
      // 记录角色对话框状态
      addVisible: false,
      modVisible: false,
      
      // 添加角色数据
      rolesRuleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色校验
      rolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑角色数据
      modRolesRuleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 记录分配权限对话框
      showSetRightVisible: false,
      rightList: [],
      defaultProps: {
         children: 'children',
          label: 'authName'
      },
      defKeys: [],
      roleId: ''
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    getRolesData() {
      request({
        url: `roles`,
        method: "get",
      }).then((res) => {
        this.rolesData = res.data.data;
      });
    },
    // 删除权限标签
    async deleteTag(role, right) {
      const tag = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(role, right);
      if (tag !== "confirm") {
        return this.$message.info("已取消删除~");
      }
      const { data: res } = await request({
        url: `roles/${role.id}/rights/${right}`,
        method: "delete",
      });
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败~");
      }
      role.children = res.data;
      this.$message.success("删除成功~");
    },
    // 关闭角色对话框，并重置内容
    addVisibleButton1() {
      this.addVisible = false;
      this.$refs.rolesRuleFormRef.resetFields();
    },
    // 表单校验并提交
    addVisibleButton2() {
      this.$refs.rolesRuleFormRef.validate((valid) => {
        if (!valid) return;
        request({
          url: "roles",
          method: "post",
          data: this.rolesRuleForm,
        })
          .then(() => {
            this.addVisible = false;
            this.$message.success("已添加角色~");
            this.getRolesData();
          })
          .catch(() => {
            this.$message.error("添加失败~");
          });
      });
    },
    // 编辑角色，表单内容重置
    modVisibleButton1() {
      this.modVisible = false;
      this.$refs.modRuleFormRef.resetFields();
    },
    // 点击编辑获取该行数据
    modVisibleButton2(data) {
      this.modVisible = true;
      request({
        url: `roles/${data.id}`,
        method: "get",
      }).then((res) => {
        this.modRolesRuleForm = res.data.data;
      });
    },
    // 点击编辑确定提交
    modVisibleButton3() {
      this.modVisible = false;
      this.$refs.modRuleFormRef.validate((valid) => {
        if (!valid) return;
        request({
          url: `roles/${this.modRolesRuleForm.roleId}`,
          method: "put",
          data: {
            roleName: this.modRolesRuleForm.roleName,
            roleDesc: this.modRolesRuleForm.roleDesc,
          },
        })
          .then((res) => {
            this.modRolesRuleForm = res.data.data;
            this.$message.success("修改成功~");
            this.getRolesData();
          })
          .catch(() => {
            this.$message.error("修改失败~");
          });
      });
    },
    // 删除角色
    async delUser(data) {
      const del = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      console.log(del);
      if (del !== "confirm") return this.$message.info("取消删除!");
      console.log(data.id);
      request({
        url: `roles/${data.id}`,
        method: "delete",
      })
        .then(() => {
          this.$message.success("删除成功!");
          this.getRolesData();
        })
        .catch(() => {
          this.$message.error("删除失败!");
        });
      // .then(() => {
      //     this.$message.success('删除成功!')
      // }).catch(() => {
      //     this.$message.info('已取消删除')
      // });
    },
    // 分配权限
    async showSetRightDiglog(role) {
      this.roleId = role.id
      const {data:res} = await request({
        url: 'rights/tree',
        method: 'get'
      })
      if(res.meta.status !== 200 ) return this.$message.error('获取数据失败~')
      this.rightList = res.data
      console.log(this.rightList)
      this.getLeafKets(role, this.defKeys)
      this.showSetRightVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保持到 defKeys 数组中
    getLeafKets(node, arr) {
      // 判断当前 node 节点是否包含 children属性
      // 不包含则为三级权限节点
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKets(item, arr)
      });
    },
    //  监听分配权限对话框的关闭
    setRigDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      console.log(idStr)
      const {data:res} = await request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: idStr
        }
      })
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('权限更新失败~')
      this.$message.success('权限更新成功~')
      this.getRolesData()
      this.showSetRightVisible = false
    }
  },

  
};
</script>

<style lang="less" scoped>
.el-table-column {
  width: 25%;
}

.el-button {
  margin-bottom: 20px;
}

.el-table .cell {
  line-height: 48px;
}

.tagborder {
  border-top: 1px solid #eee;
}

.jz {
  display: flex;
  align-items: center;
}

.el-col-margin {
  margin: 10px 0;
}

.el-col-marginleft {
  margin-right: 10px;
}
</style>