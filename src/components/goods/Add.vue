<template>
  <div class="add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/goods' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <!-- 提示信息 -->
        <el-col style="margin-bottom: 25px">
          <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
        </el-col>
        <!-- 步骤条 -->
        <el-col style="margin-bottom: 25px">
          <el-steps :active="active - 0" align-center finish-status="success"	>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
        <!-- tab标签页 -->
        <el-col>
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top" >
            <el-tabs v-model="active" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
              <!-- 基本信息 -->
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                  <el-cascader 
                    expandTrigger="hover"
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateChildren"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>
              </el-tab-pane>
              <!-- 商品参数 -->
              <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id" >
                  <el-checkbox-group v-model="item.attr_vals" >
                    <el-checkbox v-for="val,i in item.attr_vals" :key="i"  :label="val" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <!-- 商品属性 -->
              <el-tab-pane label="商品属性" name="2">
                <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name" prop="goods_name">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <!-- 商品图片 -->
              <el-tab-pane label="商品图片" name="3">
                <!-- action表示图片要上传到的后台API地址 -->
                <el-upload
                  action="http://127.0.0.1:8888/api/private/v1/upload"  
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="headerObj"
                  :on-success="handleSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-tab-pane>
              <!-- 商品内容 -->
              <el-tab-pane label="商品内容" name="4">
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <el-button type="primary" style="margin-top: 25px" @click="add">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="imgVisible"
      width="50%">
      <img :src="previewVisible" alt="" class="imgWidth">
    </el-dialog>
  </div>
</template>

<script>
import {request} from '../../network/request'
import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      // 保存tab的name
      active: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品内容
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      // 商品分类数据
      cateList: [],
      cateChildren: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
      },
      // 商品参数
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片URL
      previewVisible: '',
      imgVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      const {data:res} = await request({
        url: 'categories',
        method: 'get'
      })
      if(res.meta.status !== 200) return this.$message.console.error("获取数据失败~");
      this.cateList = res.data
    },
    handleChange() {
      // 表单动态绑定
      console.log('ok',this.addForm.goods_cat)
      if(this.addForm.goods_cat.length !== 3) { 
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      // activeName即将进入的标签name, oldActiveName当前即将离开的标签name
      // console.log(activeName, oldActiveName)
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    
    async tabClicked() {
      console.log(this.active)
      // 获取商品参数（many）  active = 1
      if (this.active === '1') {
        const {data:res} = await request({
          url: `categories/${this.cateId}/attributes`,
          method: 'get',
          params: {
            sel: 'many'
          }
        })
        if(res.meta.status !== 200 ) return this.$message.error('获取商品参数失败~')
        res.data.forEach(item => {
         item.attr_vals = item.attr_vals.length === 0 ? []:item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      }
      // 获取商品属性（only）active = 2
      if (this.active === '2') {
        const {data:res} = await request({
          url: `categories/${this.cateId}/attributes`,
          method: 'get',
          params: {
            sel: 'only'
          }
        })
        if(res.meta.status !== 200 ) return this.$message.error('获取商品参数失败~')
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewVisible = file.response.data.url
      this.imgVisible = true
    },
    // 处理移除图片操作
    handleRemove(file) {
      // 1.获取要删除图片的临时数据
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到对应图片的索引值
      const i = this.addForm.pics.findIndex(x => {
        x.pic ===filePath
      })
      // 3.splice方法移除图片
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      const picInfo = {pic: response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 把good_cat数据转换成字符串，但是级联选择器只能绑定good_cat为数组
        // 采用深拷贝 lodash
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理attrs数组
          //  manyTableData: [], onlyTableData: [],
        // many
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // only
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起添加商品请求
        const {data:res} = await request({
          url: 'goods',
          method: 'post',
          data: form
        })
        console.log(res)
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功~')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-step__title {
  font-size: 13px;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.imgWidth {
  width: 100%;
}


.ql-editor {
  min-height: 300px;
}
</style>