<template>
  <div id="goods-category">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- 添加分类 -->
        <el-col :span="4">
          <el-button type="primary" @click="addCateInfo">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表 -->
      <tree-table
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="danger" v-else="scope.row.cat_level === 2" size="mini">三级</el-tag>
        </template>
        <template slot="opera" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="updataDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteDialog(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="isAddCate" width="50%" @close="addDialogClose">
      <el-form :model="addCate" :rules="addCateRules" ref="addCateForm" label-width="90px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类名称: ">
          <el-cascader
            v-model="cascadervalue"
            :options="parentcateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select
            ref="cascaderref"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddCate = false">取 消</el-button>
        <el-button type="primary" @click="addvaildData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类名称对话框 -->
    <el-dialog title="修改分类" :visible.sync="isUpdateCate" width="50%" @close="updateDialogClose">
      <el-form :model="updateCate" :rules="updateCateRules" ref="updateCateForm" label-width="90px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="updateCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdateCate = false">取 消</el-button>
        <el-button type="primary" @click="updatevaildData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  addCategory,
  queryByIdCate,
  updateCate,
  deleteCate,
} from 'network/index'
export default {
  name: 'GoodsCategory',
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //分类列表
      categoriesList: [],
      //总条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opera',
        },
      ],
      isAddCate: false,
      //分类体
      addCate: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      //定义添加规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
      },
      //二级分类列表
      parentcateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      cascadervalue: [],
      isUpdateCate: false,
      updateCate: {
        cat_name: '',
      },
      updateCateRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
      },
      cat_id: '',
    }
  },
  components: {
    getCategoryList,
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const result = await getCategoryList(this.querInfo)
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败,' + result.meta.msg)
      }
      this.categoriesList = result.data.result
      this.total = result.data.total
    },
    //分页的数量变化
    handleSizeChange(val) {
      this.querInfo.pagesize = val
      this.getCategoryList()
    },
    //分页的当前页的变化
    handleCurrentChange(val) {
      this.querInfo.pagenum = val
      this.getCategoryList()
    },

    addCateInfo() {
      this.getParentCateList()
      this.isAddCate = true
    },
    addDialogClose() {
      this.$refs.addCateForm.resetFields()
      this.cascadervalue = []
      this.addCate.cat_pid = 0
      this.addCate.cat_level = 0
    },
    async addvaildData() {
      this.$refs.addCateForm.validate(async (vaild) => {
        if (!vaild) return
        console.log(this.addCate)
        const result = await addCategory(this.addCate)
        if (result.meta.status !== 201) {
          return this.$message.error('添加分类失败' + result.meta.msg)
        }
        this.$message.success('添加分类成功')
        this.isAddCate = false
        this.getCategoryList()
      })
    },
    //获取父类数据
    async getParentCateList() {
      const obj = {
        type: 2,
      }
      const result = await getCategoryList(obj)
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取父类失败' + result.meta.msg)
      }
      this.parentcateList = result.data
    },
    handleChange() {
      console.log(this.cascadervalue)
      const length = this.cascadervalue.length
      if (length > 0) {
        this.addCate.cat_pid = this.cascadervalue[length - 1]
        this.addCate.cat_level = length
      } else {
        this.addCate.cat_pid = 0
        this.addCate.cat_level = 0
      }
    },
    async updataDialog(id) {
      const result = await queryByIdCate(id)
      if (result.meta.status !== 200) {
        return this.$message.error('ID获取分类失败' + result.meta.msg)
      }
      this.updateCate.cat_name = result.data.cat_name
      this.cat_id = result.data.cat_id
      this.isUpdateCate = true
    },
    updateDialogClose() {
      this.$refs.updateCateForm.resetFields()
    },
    updatevaildData() {
      this.$refs.updateCateForm.validate(async (vaild) => {
        if (!vaild) return
        const result = await updateCate(this.cat_id, this.updateCate)
        if (result.meta.status !== 200) {
          return this.$message.error('修改分类失败' + result.meta.msg)
        }
        this.$message.success('修改分类成功')
        this.isUpdateCate = false
        this.getCategoryList()
      })
    },
    async deleteDialog(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const result = await deleteCate(id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除分类失败' + result.meta.msg)
      }
      this.$message.success('删除分类成功')
      this.getCategoryList()
    },
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
