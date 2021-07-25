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
      <el-button type="primary">添加角色</el-button>
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
                  ><el-tag  closable @close="deleteTag(scope.row, item1.id)">{{ item1.authName }}</el-tag>
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
                      ><el-tag closable type="success"  @close="deleteTag(scope.row, item2.id)">{{ item2.authName }}</el-tag>
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
                        :class="{ tagborder: index === 0 ? false : true }">{{ item3.authName }}
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
              <el-button type="primary" icon="el-icon-edit" size="small"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="small"
                >删除</el-button
              >
              <el-button type="warning" icon="el-icon-s-tools" size="small"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加角色对话框 -->
    <!-- 编辑对话框 -->
    <!-- 删除对话框 -->
    <!-- 分配权限对话框 -->
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Roles",
  data() {
    return {
      rolesData: [],
      isTag: true
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
    async deleteTag(role, right) {
      const tag = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(role,right)
        if (tag !== "confirm") {
          return this.$message.info('已取消删除~')
        }
        const {data:res} = await request({
          url: `roles/${role.id}/rights/${right}`,
          method: 'delete'
        })
        console.log(res)
        if (res.meta.status !==200) {
          return this.$message.error('删除失败~')
        }
        role.children = res.data
        this.$message.success('删除成功~')
    },

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