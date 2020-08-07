<template>
  <div id="goods-params">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" show-icon type="warning" :closable="false"></el-alert>
      <!-- 商品分类 -->
      <el-row class="cascader-content">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="cascadervalue"
            :options="categoriesList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            ref="cascaderref"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="isAddDynamicParam = true"
          >添加参数</el-button>
          <el-table :data="manyInfo" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  size="mini"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="removeTag(scope.row,index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300px">
              <!-- 使用插槽域获取行数据 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="updateParamsClick(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="isAddDynamicParam = true"
          >添加属性</el-button>
          <el-table :data="onlyInfo" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- <el-tag closable size="mini" v-if="typeof(scope.row.attr_vals) === 'string'">{{scope.row.attr_vals}}</el-tag> -->
                <el-tag
                  closable
                  size="mini"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="removeTag(scope.row,index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="300px">
              <!-- 使用插槽域获取行数据 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="updateParamsClick(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsClick(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数对话框 -->
    <el-dialog
      :title="'添加'+ titlText "
      :visible.sync="isAddDynamicParam"
      width="50%"
      @close="addDynamicDialogClose"
    >
      <el-form
        :model="addDynamicParams"
        :rules="addDynamicParamsRules"
        ref="addDynamicForm"
        label-width="90px"
      >
        <el-form-item :label="titlText" prop="attr_name">
          <el-input v-model="addDynamicParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDynamicParam = false">取 消</el-button>
        <el-button type="primary" @click="addDynamicVaildData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+ titlText "
      :visible.sync="isUpdateParam"
      width="50%"
      @close="updateDialogClose"
    >
      <el-form
        :model="updateParams"
        :rules="updateParamsRules"
        ref="updateParamsForm"
        label-width="90px"
      >
        <el-form-item :label="titlText" prop="attr_name">
          <el-input v-model="updateParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdateParam = false">取 消</el-button>
        <el-button type="primary" @click="updateVaildData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  paramList,
  removeAttr,
  addParams,
  queryByIdParam,
  updateParams,
  deleteParams,
} from 'network/index'
export default {
  name: 'GoodsParams',
  data() {
    return {
      categoriesList: [],
      cascadervalue: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true,
      },
      activeName: 'many',
      onlyInfo: [],
      manyInfo: [],
      manyTag: [],
      onlyTag: [],
      isAddDynamicParam: false,
      addDynamicParams: {
        attr_name: '',
      },
      addDynamicParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
      isUpdateParam: false,
      updateParams: {
        attr_name: '',
        attr_id: '',
      },
      updateParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
      //文本框与按钮切换
      inputVisible: false,
      inputValue: '',
     
    }
  },
  computed: {
    isDisabled() {
      if (this.cascadervalue.length !== 3) {
        return true
      } else {
        return false
      }
    },
    catId() {
      if (this.cascadervalue.length === 3) {
        return this.cascadervalue[2]
      } else {
        return null
      }
    },
    titlText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const obj = {
        type: 3,
      }
      const result = await getCategoryList(obj)
      //console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败,' + result.meta.msg)
      }
      this.categoriesList = result.data
    },
    handleChange() {
      const length = this.cascadervalue.length
      if (length !== 3) {
        this.cascadervalue = []
        this.onlyInfo = []
        this.manyInfo = []
        return
      }
      this.getParams()
    },
    async getParams() {
      if (this.catId !== null) {
        const result = await paramList(this.catId, this.activeName)
        if (result.meta.status !== 200) {
          return this.$message.error('获取参数列表失败,' + result.meta.msg)
        }
        console.log(result.data)
        if (result.data.length !== 0) {
          result.data.forEach((item) => {
            if (item.attr_write === 'list') {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            }
            if (item.attr_write === 'manual') {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            }
            item.inputVisible = false
            item.inputValue = ''
          })
        }

        if (this.activeName === 'only') {
          this.onlyInfo = result.data
        } else {
          this.manyInfo = result.data
        }
      }
    },
    handleClick() {
      this.getParams()
    },
    async removeTag(row, i) {
      console.log(row)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      console.log(row.attr_vals)
      row.attr_vals.splice(i, 1)
      console.log(row.attr_vals)
      const obj = {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(','),
      }
      const result = await updateParams(this.catId, row.attr_id, obj)
      if (result.meta.status !== 200) {
        return this.$message.error('删除参数项失败,' + result.meta.msg)
      }
      this.$message.success('删除参数项成功! ')
      //this.getParams()
    },
    //添加动态参数
    addDynamicDialogClose() {
      this.$refs.addDynamicForm.resetFields()
    },
    async addDynamicVaildData() {
      this.$refs.addDynamicForm.validate(async (vaild) => {
        console.log(vaild)
        if (!vaild) return
        const obj = {
          attr_name: this.addDynamicParams.attr_name,
          attr_sel: this.activeName,
        }
        const result = await addParams(this.catId, obj)
        console.log(result)
        if (result.meta.status === 201) {
          this.$message.success('添加' + this.titlText + '成功')
          this.isAddDynamicParam = false
          this.getParams()
        } else {
          this.$message.error('添加' + this.titlText + '失败' + result.meta.msg)
        }
      })
    },
    addDynamic() {
      this.isAddDynamicParam = true
    },

    async updateParamsClick(row) {
      console.log(row)
      const obj = {
        attr_sel: this.activeName,
      }
      const result = await queryByIdParam(this.catId, row.attr_id, obj)
      if (result.meta.status !== 200) {
        return this.$message.error('获取参数失败,' + result.meta.msg)
      }
      this.updateParams.attr_name = result.data.attr_name
      this.updateParams.attr_id = result.data.attr_id
      this.isUpdateParam = true
    },
    updateDialogClose() {
      this.$refs.updateParamsForm.resetFields()
    },
    async updateVaildData() {
      this.$refs.updateParamsForm.validate(async (vaild) => {
        if (!vaild) return
        const obj = {
          attr_name: this.updateParams.attr_name,
          attr_sel: this.activeName,
        }
        const result = await updateParams(
          this.catId,
          this.updateParams.attr_id,
          obj
        )
        if (result.meta.status !== 200) {
          return this.$message.error('修改参数失败,' + result.meta.msg)
        }
        this.$message.success('修改参数成功! ')
        this.isUpdateParam = false
        this.getParams()
      })
    },
    async deleteParamsClick(row) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const result = await deleteParams(this.catId, row.attr_id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除参数失败,' + result.meta.msg)
      }
      this.$message.success('删除参数成功! ')
      this.getParams()
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }

      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      const obj = {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(','),
      }
      const result = await updateParams(this.catId, row.attr_id, obj)
      if (result.meta.status !== 200) {
        return this.$message.error('修改参数项失败,' + result.meta.msg)
      }
      this.$message.success('修改参数项成功! ')
      //this.getParams()
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.cascader-content {
  margin: 15px 0;
}
.el-table {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 70px;
}
</style>
