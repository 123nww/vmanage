<template>
  <div id="order">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90px"></el-table-column>
        <el-table-column label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.is_send === '是'">已发货</el-tag>
            <el-tag type="danger" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">{{scope.row.create_time | showDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updataDialog()"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="locationDialog(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="isUpdataDialog" width="50%" @close="updateDialogClose">
      <el-form
        :model="updateAddress"
        :rules="updateAddressRules"
        ref="updateruleForm"
        label-width="90px"
      >
        <el-form-item label="省市/区" prop="address1">
          <el-cascader
            v-model="updateAddress.address1"
            :options="citydata"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="updateAddress.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdataDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatevaildData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度 -->
    <el-dialog title="物流进度" :visible.sync="progressDialog" width="50%" >
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getkuaidiInfo } from 'network/index'
import { formatDate } from '@/common/untils.js'
import citydata from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      params: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      isUpdataDialog: false,
      updateAddress: {},
      updateAddressRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      cascaderValue: [],
      cascaderProps: { expandTrigger: 'hover' },
      citydata,
      progressDialog: false,
      progressInfo: [],
      reverse: false,
    }
  },
  filters: {
    showDate(value) {
      //将时间戳转换成date对象
      const date = new Date(value * 1000)
      //将date进行格式化
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const result = await getOrderList(this.params)
      if (result.meta.status !== 200) {
        return this.$message.error('获取订单数据失败,' + result.meta.msg)
      }
      this.orderList = result.data.goods
      this.total = result.data.total
      console.log(result.data)
    },
    //分页的数量变化
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getOrderList()
    },
    //分页的当前页的变化
    handleCurrentChange(val) {
      this.params.pagenum = val
      this.getOrderList()
    },
    updataDialog() {
      this.isUpdataDialog = true
    },
    updatevaildData() {},
    updateDialogClose() {
      this.$refs.updateruleForm.resetFields()
    },
    handleChange() {
      console.log(this.updateAddress)
    },
    async locationDialog(id) {
      // const result = await getkuaidiInfo(id)
      const result = await getkuaidiInfo('1106975712662')
      if (result.meta.status !== 200) {
        return this.$message.error('获取物流进度失败,' + result.meta.msg)
      }
      console.log(result)
      this.progressInfo = result.data
      this.progressDialog = true
    },
    progressvaildData() {},
  },
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
