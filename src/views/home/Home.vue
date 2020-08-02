<template>
  <div id="home">
    <el-button type="info" @click="logoutClick">注销</el-button>
  </div>
</template>

<script>
import { removeLocalStore } from 'config/global.js'
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    logoutClick() {
      removeLocalStore('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
</style>
