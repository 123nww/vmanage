<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt @click="imgClick"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">注销</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--  切换菜单 -->
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 菜单体 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="(subitem,index) in item.children"
              :key="subitem.id"
              @click="saveLinkActive('/'+subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  setLocalStore,
  removeLocalStore,
  getLocalStore,
} from 'config/global.js'
import { getMenuList } from 'network/index.js'
export default {
  name: 'Home',
  data() {
    return {
      //菜单数据
      menuList: [],
      //二级icons
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      //菜单是否展开
      isCollapse: false,
      //活跃的路径
      activepath: '',
    }
  },
  created() {
    // 获取菜单
    this.getMenuList()
    //当前活跃的菜单处于高亮
    this.activepath = getLocalStore('activepath')
  },
  methods: {
    //注销
    logoutClick() {
      removeLocalStore('token')
      removeLocalStore('activepath')
      this.$router.push('/login')
    },
    //菜单数据
    async getMenuList() {
      const menumList = await getMenuList()
      console.log(menumList)
      if (menumList.meta.status === 200) {
        this.menuList = menumList.data
      } else {
        this.$message.error(menumList.meta.msg)
      }
    },
    //切换菜单
    toggleClick() {
      this.isCollapse = !this.isCollapse
    },
    //保存活跃的路径
    saveLinkActive(activePath) {
      setLocalStore('activepath', activePath)
      this.activepath = activePath
    },
    //点击图片回到主页
    imgClick(){
      this.$router.push('/home')
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-container {
  background-color: #373d41;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  line-height: 24px;
  font-size:15px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>
