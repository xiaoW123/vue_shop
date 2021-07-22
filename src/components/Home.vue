<template>
  <div class="home">
    <el-button type="info" @click="homeClick">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    homeClick() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>