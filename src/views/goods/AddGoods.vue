<template>
  <div id="add-goods">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" show-icon type="info" :closable="false" center></el-alert>

      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addGoodsForm"
        label-width="100px"
        label-position="top"
      >
        <el-steps :active="activeName - 0" finish-status="success" :space="200" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeLeave"
          @tab-click="tabsClick"
        >
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
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- <span>选择商品分类：</span> -->
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="categoriesList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
                ref="cascaderref"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in manyList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2,index2) in item.attr_vals"
                  :key="index2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in onlyList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :limit="3"
              :headers="headers"
              multiple
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,最多三张图片</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="preViewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, paramList,addGoods } from 'network/index'
import { getLocalStore } from 'config/global.js'
import _ from 'lodash'
export default {
  name: 'AddGoods',
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
      },
      categoriesList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true,
      },
      manyList: [],
      onlyList: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: getLocalStore('token'),
      },
      preViewPath: '',
      dialogVisible: false,
    }
  },
  created() {
    this.getCategoryList()
  },
  computed: {
    catId() {
      const catId = this.addForm.goods_cat
      if (catId.length === 3) {
        return catId[2]
      }
    },
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
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
    },
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabsClick() {
      if (this.activeName === '1') {
        const result = await paramList(this.catId, 'many')
        if (result.meta.status !== 200) {
          return this.$message.error('获取参数列表失败,' + result.meta.msg)
        }
        console.log(result)
        result.data.forEach((item) => {
          console.log(item)
          if (item.attr_write === 'list') {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          }
          if (item.attr_write === 'manual') {
            item.attr_vals = []
          }
        })
        console.log(this.manyList)
        this.manyList = result.data
      }
      if (this.activeName === '2') {
        const result = await paramList(this.catId, 'only')
        if (result.meta.status !== 200) {
          return this.$message.error('获取参数列表失败,' + result.meta.msg)
        }
        console.log(result)
        this.onlyList = result.data
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((x) => (x.pic = filePath))
      this.addForm.pics.splice(i, 1)
    },
    handlePreview(file) {
      console.log(file)
      this.preViewPath = file.response.data.url
      this.dialogVisible = true
    },
    onSuccess(response) {
      console.log(response)
      if (response.meta.status !== 200) {
        return this.$message.error('上传图片失败,' + response.meta.msg)
      }
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
      this.$message.success('上传图片成功! ')
    },
    async addGoodsClick() {
      console.log(this.addForm)
      this.$refs.addGoodsForm.validate(async (vaild) => {
        if (!vaild) {
          return this.$message.error('请填写表单必填项')
        }

        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        
        this.manyList.forEach(item => {
          const obj = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(obj)
        })

        this.onlyList.forEach(item => {
          const obj ={
             attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
           this.addForm.attrs.push(obj)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        const result = await addGoods(form)
        if(result.meta.status !== 201){
          return this.$message.error('添加商品失败,'+ result.meta.msg)
        }
        this.$message.success('添加商品成功! ')
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style scoped>
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}

.el-button {
  margin-top: 15px;
}
</style>
