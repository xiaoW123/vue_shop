<template>
  <div class="home">
    <el-container class="home-container">
      <!-- Header -->
      <el-header>
        <div>
          <img src="~assets/img/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="homeClick">退出</el-button>
      </el-header>

      <el-container>
        <!-- 侧边导航栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse= "isCollapse"
            :collapse-transition = "false"
            router
            :default-active="isPath">

            <!-- default-active="/users"> -->

            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="submenuIcon[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

                <!-- 二级菜单 -->
                <el-menu-item 
                  v-for="val in item.children"
                   :index="'/' + val.path" 
                  :key="val.id"
                  @click="saveNavState('/' + val.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{val.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>

          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { request } from '../network/request'

export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      submenuIcon: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-lock_fill',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      isPath: ''
    }
  },
  created() {
    this.getMenuList(),
    this.isPath = window.sessionStorage.getItem('path')
  },
  methods: {
    homeClick() {
      window.sessionStorage.clear(); //删除 token
      this.$router.push("/login");
    },
    getMenuList() {
      request({
        method: 'get',
        url: 'menus'
      }).then(result => {
        if(result.data.meta.status !== 200) return this.$message.error('数据请求失败！');
        const {data: res} = result
        this.menulist = res.data
        console.log(this.menulist)
      })
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(str) {
      window.sessionStorage.setItem('path', str)
      this.isPath = str
    }
  }
  
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .toggle-button {
    box-sizing: border-box;
    width: 100%;
    height: 20px;
    text-align: center;
    color: #fff;
    line-height: 20px;
    font-size: 10px;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}


</style>