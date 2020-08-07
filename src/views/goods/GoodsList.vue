<template>
  <div id="goods-list">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGoodsList()">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goods" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="70px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">{{scope.row.add_time | showDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updataDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteDialog(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 修改商品对话框 -->
    <el-dialog title="修改商品" :visible.sync="isUpdataDialog" width="50%" @close="updateDialogClose">
      <el-form
        :model="updateGood"
        :rules="updateGoodsRules"
        ref="updateruleForm"
        label-width="80px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="updateGood.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="updateGood.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="updateGood.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdataDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatevaildData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  deleteGood,
  queryGoodsById,
  updateGoods,
} from 'network/index'
import { formatDate } from '@/common/untils.js'
export default {
  name: 'GoodsList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      goods: [],
      total: 0,
      isUpdataDialog: false,
      updateGood: {},
      updateGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  filters: {
    showDate(value) {
      //将时间戳转换成date对象
      const date = new Date(value * 1000)
      //将date进行格式化
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    async getGoodsList() {
      const result = await getGoodsList(this.queryInfo)
      if (result.meta.status !== 200) {
        this.$message.error('获取商品列表失败' + result.meta.msg)
      }
      console.log(result)
      this.goods = result.data.goods
      this.total = result.data.total
      //this.$message.success('获取商品列表成功! ')
    },
    //分页的数量变化
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    //分页的当前页的变化
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    async deleteDialog(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      //console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const result = await deleteGood(id)
      if (result.meta.status !== 200) {
        this.$message.error('删除商品失败' + result.meta.msg)
        return
      }
      this.$message.success('删除商品成功! ')
      this.getGoodsList()
    },
    addGoodsPage() {
      this.$router.push('/goods/add')
    },
    updateDialogClose() {
      this.$refs.updateruleForm.resetFields()
    },
    async updatevaildData() {
      this.$refs.updateruleForm.validate(async (vaild) => {
        if (!vaild) return
        const goodsId = this.updateGood.goods_id
        const obj = {
          goods_name: this.updateGood.goods_name,
          goods_price: this.updateGood.goods_price,
          goods_number: this.updateGood.goods_number,
          goods_weight: this.updateGood.goods_weight,
        }
        const result = await updateGoods(goodsId, obj)
        if (result.meta.status !== 200) {
          return this.$message.error('修改商品信息失败,' + result.meta.msg)
        }
        this.$message.success('修改商品信息成功! ')
      })
    },
    async updataDialog(id) {
      const result = await queryGoodsById(id)
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品信息失败,' + result.meta.msg)
      }
      this.updateGood = result.data
      this.isUpdataDialog = true
    },
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin: 15px 0;
}
</style>
