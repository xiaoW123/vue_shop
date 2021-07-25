<template>
  <div class="rights">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <template>
        <el-table :data="rightsData" style="width: 100%" stripe border>
          <el-table-column type="index" label="#" >
          </el-table-column>
          <el-table-column prop="authName" label="权限名称">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column prop="level" label="权限等级" class="cz_button">
            <template v-slot="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Rights",
  data() {
    return {
      rightsData: [],
    };
  },
  created() {
    this.getRightsData();
  },
  methods: {
    getRightsData() {
      request({
        url: "rights/list",
        method: "get",
      })
        .then((result) => {
          this.rightsData = result.data.data;
          console.log(this.rightsData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}

.el-table-column {
  width: 25%;
}

.el-button--small {
  line-height: 43px!important;
}
</style>