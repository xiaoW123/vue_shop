<template>
  <div class="list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model="queryinfo.query" @clear="getGoodsList"> 
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList" > </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible" 
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 表单 -->
      <template>
        <el-table :data="goodsTabData" style="margin-top: 15px" border stripe>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"  width="95px">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间"  width="160px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button type="primary" size="min" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="min" icon="el-icon-delete" @click="delList(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页器 -->
      <el-pagination
      background
      style="margin-top: 15px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request} from '../../network/request'

export default {
  name: "List",
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsTabData: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const {data:res} = await request({
        url: 'goods',
        meyhod: 'get',
         params: this.queryinfo
      })
      console.log(res)
      if(res.meta.status !== 200) this.$message.erroe('获取数据失败~')
      this.goodsTabData = res.data.goods
      this.total = res.data.total
    },
    // 每页数量
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页码
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除
    async delList(data) {
        const del = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(del)
        if(del !== "confirm") return this.$message.info('取消删除~')
        const {data:res} = await request({
          url: `goods/${data.goods_id}`,
          method: 'delete'
        })
        if(res.meta.status !== 200) return this.$message.error('删除失败~')
        this.$message.success('删除成功~')
        this.getGoodsList()
    },
    // 添加
    dialogVisible() {
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="less" scoped>
</style>