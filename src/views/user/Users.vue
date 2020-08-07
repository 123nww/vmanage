<template>
  <div id="user">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="isAddDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updataDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteDialog(scope.row.id)"
            ></el-button>
            <!-- 文字显示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="handleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
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

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="isAddDialog" width="30%" @close="addDialogClose">
      <el-form :model="addUser" :rules="addUserRules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="vaildData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="isUpdataDialog" width="30%" @close="updateDialogClose">
      <el-form :model="updateUser" :rules="updateUserRules" ref="updateruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateUser.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdataDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatevaildData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="isHandleDialog" width="50%" @close="handleDialogClose">
      <div>
        <p>当前用户: {{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>
          分配角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rightList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isHandleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlevaildData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  updateUser,
  addUser,
  queryByIdUser,
  updateById,
  deleteUser,
  getRoleList,
  handleUserRight,
} from 'network/index'
export default {
  name: 'User',
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 分页参数
      params: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      //用户总数
      total: 0,
      //用户体
      users: [],
      userInfo: {},
      //是否打开对话框1,添加2,修改用户3.分配角色
      isAddDialog: false,
      isUpdataDialog: false,
      isHandleDialog: false,
      rightList: [],
      selectedRoleId: '',
      //添加用户体
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //更新用户
      updateUser: {},
      //定义添加规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      updateUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const queryInfo = await getUserList(this.params)
      console.log(queryInfo)
      if (queryInfo.meta.status === 200) {
        this.total = queryInfo.data.total
        this.users = queryInfo.data.users
      } else {
        this.$message.error(queryInfo.meta.msg)
      }
    },
    //分页的数量变化
    handleSizeChange(val) {
      this.params.pagesize = val
      this.getUserList()
    },
    //分页的当前页的变化
    handleCurrentChange(val) {
      this.params.pagenum = val
      this.getUserList()
    },
    //用户状态变更
    async stateChange(row) {
      console.log(row)
      //users/:uId/state/:type
      const updateStr = await updateUser(row.id, row.mg_state)
      if (updateStr.meta.status === 200) {
        this.$message.success('更新用户状态成功! ')
      } else {
        row.mg_state = !row.mg_state
        this.$message.error('更新用户状态失败' + updateStr.meta.msg)
      }
    },
    //关闭对话框,重置表单数据
    addDialogClose() {
      this.$refs.ruleForm.resetFields()
    },
    //校验表单数据
    vaildData() {
      this.$refs.ruleForm.validate(async (vaild) => {
        if (!vaild) return
        const result = await addUser(this.addUser)
        if (result.meta.status === 201) {
          this.$message.success('添加用户成功! ')
          this.isAddDialog = false
          this.getUserList()
        } else {
          this.$message.error('添加用户失败' + result.meta.msg)
        }
      })
    },
    async updataDialog(id) {
      this.isUpdataDialog = true
      const result = await queryByIdUser(id)
      if (result.meta.status === 200) {
        this.updateUser = result.data
      } else {
        this.$message.error('修改用户失败,' + result.meta.msg)
      }
    },
    updateDialogClose() {
      this.$refs.updateruleForm.resetFields()
    },
    updatevaildData() {
      this.$refs.updateruleForm.validate(async (vaild) => {
        if (!vaild) return
        const update = {
          email: this.updateUser.email,
          mobile: this.updateUser.mobile,
        }
        const result = await updateById(this.updateUser.id, update)
        if (result.meta.status === 200) {
          this.$message.success('修改用户成功! ')
          this.isUpdataDialog = false
          this.getUserList()
        } else {
          this.$message.error('修改用户失败' + result.meta.msg)
        }
      })
    },
    async deleteDialog(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const result = await deleteUser(id)
      //console.log(result)
      if (result.meta.status === 200) {
        this.$message.success('删除用户成功! ')
        this.getUserList()
      } else {
        this.$message.error('删除用户失败' + result.meta.msg)
      }
    },
    async handleDialog(user) {
      this.userInfo = user
      const result = await getRoleList()
      if (result.meta.status !== 200) {
        this.$message.error('获取角色列表失败' + result.meta.msg)
      }
      this.rightList = result.data
      this.isHandleDialog = true
    },

    handleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    },

    async handlevaildData() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择分配的角色')
      }
      const obj = {
        rid: this.selectedRoleId,
      }
      const result = await handleUserRight(this.userInfo.id, obj)
      if (result.meta.status !== 200) {
        this.$message.error('分配用户角色失败' + result.meta.msg)
      }
      this.$message.success('分配用户角色成功! ')
      this.getUserList()
      this.isHandleDialog = false
    },
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
