<template>
  <div id="rights">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">二级</el-tag>
            <el-tag type="danger" v-else="scope.row.level === '3'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from 'network/index'
export default {
  name: 'Rights',
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: [],
    }
  },
  methods: {
    async getRightsList() {
      const result = await getRightsList('list')
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取权限列表失败,' + result.meta.msg)
      }

      this.rightsList = result.data
    },
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
