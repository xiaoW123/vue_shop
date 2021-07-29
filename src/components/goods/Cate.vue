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
          <el-button class="cate-button" type="primary" @click="openAddCate">添加分类</el-button>
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
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="modFenLei(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="openDel(scope.row.cat_id)">删除</el-button>
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

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCate"
      width="50%"
      @close="addClose"
      >
      <el-form :model="CateruleForm" :rules="Cateerules" ref="CateruleFormRes" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="CateruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectrfOptions2"
            :options="value"
            expandTrigger= "hover"
            :props="parentCateList"
            @change="handleChange"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCate = false">取 消</el-button>
        <el-button type="primary"  @click="addQdCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="modDialogVisible"
      width="50%">
      <el-form :model="modData" :rules="modRules" ref="modRuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="modData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modClick">确 定</el-button>
      </span>
    </el-dialog>
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
      // 记录添加分类对话框
      addCate: false,
      // 保存添加分类数据
      CateruleForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单验证
      Cateerules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      value: [],
      parentCateList: { 
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
      },
      selectrfOptions2: [],
      // 编辑对话框
      modDialogVisible: false,
      // 保存编辑对话框的数据
      modData:{
        cat_name: '',
        cat_id: ''
      },
      // 表单校验
      modRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      }
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
      if (res.meta.status !== 200) return this.$message.error("获取商品分类失败~");
      this.cateList = res.data.result;
      this.cateListLength = res.data.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList();
    },
    // 分页
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList();
    },
    // 添加分类
    async openAddCate() {
      const {data: res} = await request({
        url: 'categories',
        method: 'get',
        params: {
          type: 2
        }
      })
      console.log(res.data)
      this.value = res.data
      this.addCate = true

    },
    // 关闭添加分类对话框重置内容
    addClose() {
      this.$refs.CateruleFormRes.resetFields();
      this.selectrfOptions2 = []
      this.CateruleForm.cat_pid = 0
      this.CateruleForm.cat_level = 0
    },
    // 级联选择器当选中节点变化时触发
    handleChange() {
      console.log(this.selectrfOptions2)
      if (this.selectrfOptions2.length > 0) {
        this.CateruleForm.cat_pid = this.selectrfOptions2[this.selectrfOptions2.length - 1]
        this.CateruleForm.cat_level = this.selectrfOptions2.length
        return
      } else {
        this.CateruleForm.cat_pid = 0
        this.CateruleForm.cat_level = 0
      }
    },
    // 添加分类提交
    addQdCate() {
      console.log(this.CateruleForm)
      this.$refs.CateruleFormRes.validate(async valid => {
        if(!valid) return 
        const {data:res} = await request({
          url: 'categories',
          method: 'post',
          data: this.CateruleForm
        })
          console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败~')
         this.$message.success('添加成功~')
         this.getCateList()
         this.addCate = false
      })
      
    },
    // 获取编辑该行的数据
    modFenLei(data) {
      this.modDialogVisible = true
      this.modData.cat_name = data.cat_name
      this.modData.cat_id = data.cat_id
    },
    // 编辑对话框并提交
    modClick() {
      this.$refs.modRuleFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await request({
          url: `categories/${this.modData.cat_id}`,
          method: 'put',
          data: {
            cat_name: this.modData.cat_name
          }
        })
        if(res.meta.status !== 200) return this.$message.error('修改失败~')
        this.$message.success('修改成功~')
        this.modDialogVisible = false
        this.getCateList()
      })
    },
    async openDel(id) {
      const del = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(del !== "confirm") this.$message.info('已取消删除~')
      request({
        url: `categories/${id}`,
        method: 'delete'
      }).then(() => {
        this.$message.success('删除成功~')
        this.getCateList()
      })
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

.el-cascader {
  width: 100%;
}
</style>