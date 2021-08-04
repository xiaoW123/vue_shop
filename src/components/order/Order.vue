<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row>
        <el-col>
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getOrderList"
            style="width: 40%; margin-bottom: 25px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <template>
        <el-table stripe border :data="orderList" style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="order_number" label="订单编号" width="280">
          </el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="150">
          </el-table-column>
          <el-table-column prop="pay_status" label="是否付款">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === '1'" type="success"
                >已付款</el-tag
              >
              <el-tag v-else type="danger">未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"> </el-table-column>
          <el-table-column prop="create_time" label="下单时间" width="200">
            <template slot-scope="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改地址"
                placement="top"
                :enterable="false"
              >
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showBox"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="物流信息"
                placement="top"
                :enterable="false"
              >
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-location-outline"
                  @click="showProgressBox"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 15px"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addForm.address1"
              :options="citydata"
              @change="handleChange"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in kuaidi"
          :key="index"
          :timestamp="item.time"
        >
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request} from "../../network/request";
import citydata from "./citydata";

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addForm: {
        address1: [],
        address2: "",
      },
      addFormRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      citydata: citydata,
      progressVisible: false,
      kuaidi: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await request({
        url: "orders",
        method: "get",
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) this.$message.error("获取数据失败~");
      this.orderList = res.data.goods;
      this.total = res.data.total;
      // console.log(this.queryInfo.query)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showBox() {
      this.addressVisible = true;
    },
    handleChange() {
      console.log(this.addForm.address1);
    },
    showProgressBox() {
      this.progressVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>