<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 警告 -->
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            :closable="false"
            show-icon
          >
          </el-alert>
        </el-col>
        <el-col>
          <p>
            选择商品分类:
            <el-cascader
              v-model="selectParams"
              :options="cateList"
              expandTrigger="hover"
              :props="cateValue"
              @change="handleChange"
            ></el-cascader>
          </p>
        </el-col>
        <el-col>
          <!-- 页签区域 -->
          <template>
            <el-tabs
              v-model="activeName"
              type="border-card"
              @tab-click="handleTabClick"
            >
              <el-tab-pane label="动态参数" name="many">
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="isDisabled"
                  class="button-bottom"
                  @click="ParamsVisible = true"
                  >添加参数</el-button
                >
                <template >
                  <el-table
                    :data="manyTableData"
                    border
                    type="expand"
                    stripe
                    style="width: 100%"
                  >
                    <!-- 扩展功能 -->
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <!-- 标签 -->
                        <el-tag v-for="item,index in scope.row.attr_vals" :key="index" closable @close="handeClose(index, scope.row)">{{item}}</el-tag>
                        <!-- 新增标签 -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" prop="date" label="#">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="参数名称">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="min"
                       @click="modClick(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="min"
                        @click="delParams(scope.row)">删除</el-button
                      >
                      </template>
                      
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>

              <el-tab-pane label="静态属性" name="only">
                <el-button
                  class="button-bottom"
                  type="primary"
                  size="mini"
                  :disabled="isDisabled"
                  @click="ParamsVisible = true">添加属性</el-button
                >
                <template>
                  <el-table :data="onlyTableData" border type="expand" stripe>
                    <!-- 扩展功能 -->
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <!-- 标签 -->
                        <el-tag v-for="item,index in scope.row.attr_vals" :key="index" closable @close="handeClose(index, scope.row)">{{item}}</el-tag>
                        <!-- 新增标签 -->
                        <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" prop="date" label="#">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="属性名称">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="min"
                        @click="modClick(scope.row)">编辑</el-button
                      >
                      <el-button type="danger" icon="el-icon-delete" size="min"
                       @click="delParams(scope.row)">删除</el-button
                      >
                      </template>
                      
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加对话框 -->
      <el-dialog :title="'添加' + titleText" :visible.sync="ParamsVisible" width="50%" @close="dialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
     <el-dialog :title="'编辑' + titleText" :visible.sync="modVisible" width="50%" >
      <el-form :model="modForm" :rules="modFormRules" ref="modFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="modForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modVisible = false">取 消</el-button>
        <el-button type="primary" @click="modParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Params",
  data() {
    return {
      // 保存数据
      cateList: [],
      // 级联选择器关联数据
      cateValue: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选择器选中的数据双向绑定
      selectParams: [],
      // 默认显示选项片的数据双向绑定
      activeName: "many",
      // 参数数据
      manyTableData: [],
      onlyTableData: [],
      // 添加对话框
      ParamsVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对话框
      modVisible: false,
      modForm: {
        attr_name: ''
      },
      modFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 参数标签
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisabled() {
      if (this.selectParams.length !== 3) return true;
      return false;
    },
    cateId() {
      if (this.selectParams.length === 3) {
        return this.selectParams[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      const { data: res } = await request({
        url: "categories",
        method: "get",
      });
      if (res.meta.status !== 200)
        return this.$message.erroe("获取数据失败哦~");
      this.cateList = res.data;
    },
    // 获取参数请求
    async getParamsData() {
      if (this.selectParams.length !== 3) {
        this.selectParams = []
        this.manyTableData=[]
        this.onlyTableData= []
        return
      }
      const { data: res } = await request({
        url: `categories/${this.cateId}/attributes`,
        method: "get",
        params: {
          sel: this.activeName,
        },
      });
      
      if (res.meta.status !== 200) return this.$message.error("获取参数失败~");
        // 分割标签字符串
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 给每个参数配置属性
        item.inputVisible = false
        item.inputValue = ''
      });
      console.log(res.data)
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 级联选择器的数据双向绑定
    handleChange() {
      this.getParamsData();
    },
    // 选项卡的数据双向绑定
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加对话提交
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await request({
          url: `categories/${this.cateId}/attributes`,
          method: 'post',
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败~')
        this.$message.success('添加成功~')
        this.ParamsVisible = false
        this.getParamsData()
      })
    },
    // 获取编辑数据
    modClick(data) {
      this.modVisible = true
      this.modForm = data
      console.log(data)
      console.log(this.modForm)
    },
    // 编辑并提交 
    modParams() {
      this.$refs.modFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await request({
          url: `categories/${this.cateId}/attributes/${this.modForm.attr_id}`,
          method: 'put',
          data: {
            attr_name: this.modForm.attr_name,
            attr_sel: this.activeName
          }
        })
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error('修改失败~')
        this.$message.success('修改成功~')
        this.modForm = {}
        this.getCateList()
        this.modVisible = false
      })
    },
    // 删除
    async delParams(data) {
      const del = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(del)
      if(del !== 'confirm') return this.$message.info('取消删除~')
      request({
        url: `categories/${this.cateId}/attributes/${data.attr_id}`,
        method: 'delete',
      }).then(() => {
        this.getParamsData()
        this.$message.success('删除成功~')
      })
    },
    // 新标签失去焦点或按下了Enter触发
    async handleInputConfirm(data) {
      // 如果输入的是空格或没有输入
      if (data.inputValue.trim().length === 0) {
        data.inputValue = ''
        data.inputVisible = false
        return
      }
      // 添加的数据提交到数据库
      data.attr_vals.push(data.inputValue.trim())
      data.inputValue = ''
      data.inputVisible = false
      const {data:res} = await request({
        url: `categories/${this.cateId}/attributes/${data.attr_id}`,
        method: 'put',
        data: {
          attr_name: data.attr_name,
          attr_sel: data.attr_sel,
          attr_vals: data.attr_vals.join(','),
        }
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('添加失败~')
      this.$message.success('添加成功~')
    },
    showInput(data) {
      data.inputVisible = true
      // 自动获取焦点
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    async handeClose(i, data) {
      const {data:res} = await request({
        url: `categories/${this.cateId}/attributes/${data.attr_id}`,
        method: 'put',
        data: {
          attr_name: data.attr_name,
          attr_sel: data.attr_sel,
          attr_vals: data.attr_vals.splice(i, 1)
        }
      })
       if (res.meta.status !== 200) return this.$message.error('删除失败~')
        this.$message.success('删除成功~')
    }
  },
};
</script>

<style lang="less" scoped>
.button-bottom {
  margin-bottom: 15px;
}

.el-tag {
  margin-right: 15px;
  margin-bottom: 15px;
}

.input-new-tag {
  width: 120px;
}
</style>