<template>
  <div id="roles">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- 添加角色 -->
        <el-col :span="4">
          <el-button type="primary" @click="isAddRole=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roles" border stripe>
        <el-table-column type="expand">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              :class="['vcenter',index === 0 ? 'bdtop' : '','bdbottom']"
              :key="item.id" 
              
            >
              <el-col :span="5">
                <el-tag closable size="medium" @close="removeRightById( scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2,key2) in item.children"
                  :class="[key2 === 0 ? '' : 'bdtop','vcenter']"
                  :key="item2.id" 
                >
                  <el-col :span="6">
                    <el-tag type="success" closable size="small" @close="removeRightById( scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      size="mini"
                      :key="item3.id"
                      @close="removeRightById( scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 使用插槽域获取行数据 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateRoleClick(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="handleRoleClick(scope.row)"
              size="small"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="isAddRole" width="30%" @close="addDialogClose">
      <el-form :model="addRole" :rules="addRoleRules" ref="ruleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc" maxlength="50" type="text" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddRole = false">取 消</el-button>
        <el-button type="primary" @click="vaildData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="isUpdataDialog" width="30%" @close="updateDialogClose">
      <el-form :model="updateRole" :rules="updateRoleRules" ref="updateruleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateRole.roleName" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="updateRole.roleDesc" maxlength="50" type="text" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdataDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatevaildData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="isHandleDialog" width="50%" @close="handleDialogClose">
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isHandleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlevaildData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  queryById,
  updateRole,
  deleteRole,
  getRightsList,
  handleRole,
  deleteRoleRights,
} from 'network/index'

export default {
  name: 'Roles',
  data() {
    return {
      isAddRole: false,
      isUpdataDialog: false,
      isHandleDialog: false,
      roles: [],
      addRole: {
        roleName: '',
        roleDesc: '',
      },
      updateRole: {},
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur',
          },
        ],
      },
      updateRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur',
          },
        ],
      },
      //默认节点
      defKeys: [],
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const result = await getRoleList()
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色列表失败,' + result.meta.msg)
      }
      this.roles = result.data
    },
    //添加
    vaildData() {
      this.$refs.ruleForm.validate(async (vaild) => {
        if (!vaild) {
          this.isAddRole = false
          return
        }
        const result = await addRole(this.addRole)
        if (result.meta.status === 201) {
          this.$message.success('添加角色成功')
          this.isAddRole = false
          this.getRoleList()
        } else {
          this.$message.error('添加角色失败' + result.meta.msg)
        }
      })
    },
    addDialogClose() {
      this.$refs.ruleForm.resetFields()
    },

    //修改
    async updateRoleClick(id) {
      const result = await queryById(id)
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取角色失败,' + result.meta.msg)
      }

      this.updateRole = result.data
      this.isUpdataDialog = true
    },

    updatevaildData() {
      this.$refs.updateruleForm.validate(async (vaild) => {
        if (!vaild) {
          this.isUpdataDialog = false
          return
        }
        const obj = {
          roleName: this.updateRole.roleName,
          roleDesc: this.updateRole.roleDesc,
        }
        const result = await updateRole(this.updateRole.roleId, obj)
        if (result.meta.status === 200) {
          this.$message.success('修改角色成功')
          this.isUpdataDialog = false
          this.getRoleList()
        } else {
          this.$message.error('修改角色失败' + result.meta.msg)
        }
      })
    },
    updateDialogClose() {
      this.$refs.updateruleForm.resetFields()
    },

    //删除
    async deleteRole(id) {
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
      const result = await deleteRole(id)
      console.log(result)
      if (result.meta.status === 200) {
        this.$message.success('删除角色成功')
        this.getRoleList()
      } else {
        this.$message.error('删除角色失败' + result.meta.msg)
      }
    },

    //分配权限
    handleDialogClose() {
      this.defKeys = []
    },

    async handlevaildData() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const obj = {
        rids: idStr,
      }
      const result = await handleRole(this.roleId, obj)
      if (result.meta.status !== 200) {
        return this.$message.error('角色授权失败' + result.meta.msg)
      }
      this.$message.success('角色授权成功')
      this.isHandleDialog = false
      this.getRoleList()
    },
    async handleRoleClick(row) {
      this.roleId = row.id
      const result = await getRightsList('tree')
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取Tree菜单失败' + result.meta.msg)
      }

      this.rightslist = result.data
      this.getLeafKeys(row, this.defKeys)
      this.isHandleDialog = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },

    async removeRightById(role, rightId) {
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

      const result = await deleteRoleRights(role.id, rightId)
      if (result.meta.status !== 200) {
        return this.$message.error('删除权限失败' + result.meta.msg)
      }

      this.$message.success('删除权限成功')
      if(result.data.length !== 0){
         role.children = result.data
      }else{
        this.getRoleList()
      }
     
    },
  },
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.el-table {
  margin-top: 15px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.back {
  background-color: red;
}

.vcenter {
  display: flex;
  align-items: center;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
