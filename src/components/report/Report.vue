<template>
  <div class="report">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入图表库
import echarts from 'echarts'
import { request } from '../../network/request';
// js工具库
import _ from 'lodash'

export default {
  name: 'Report',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 数据请求
    const {data:res} = await request({
      url: 'reports/type/1',
      method: 'get'
    })
    console.log(res)
    if(res.meta.status !== 200) return this.$message.console.error('获取数据失败~');

    // 4.指定图表的配置项和数据
      // 合并数据
    const result = _.merge(res.data, this.options)


    // 5.展示数据
    myChart.setOption(result);
  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>