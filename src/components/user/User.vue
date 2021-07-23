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
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {request} from '../../network/request'

export default {
  name: "User",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  created() {
    this.grtUserList()
  },
  methods: {
    grtUserList() {
      request({
        url: 'users',
        method: 'get',
        params: this.queryInfo
      }).then((result) => {
        // console.log(result)
        if (result.data.meta.status !== 200) return this.$message.error('获取信息失败！');
        const {data: res} = result.data
        this.userlist = res.users
        this.total = res.total
        // console.log(this.userlist, this.total)
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>