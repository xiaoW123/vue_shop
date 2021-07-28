<template>
  <div class="cate">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button class="cate-button" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        show-index
        index-text="#"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        border
        show-row-hover
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
            class="el-icon-success"
          >
          </i>
          <i v-else style="color: red" class="el-icon-error"> </i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateListLength">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Cate",
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总条数
      cateListLength: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          // 使用模板语法
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await request({
        url: "categories",
        method: "get",
        params: this.querInfo,
      });
      console.log(res.data);
      if (res.meta.status !== 200) return this.$message.error("获取商品分类失败~");
      this.cateList = res.data.result;
      this.cateListLength = res.data.total;
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList();
    },
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList();
    }
  },
};
</script>

<style lang="less" scoped>
.cate-button {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>