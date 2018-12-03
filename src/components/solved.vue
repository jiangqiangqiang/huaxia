<template>
  <el-container>
    <el-header><i class="el-icon-arrow-left" @click="back"></i><span>谢谢反馈</span></el-header>
    <el-main>您的肯定是机器人前进的动力，机器人会继续努力，为您提供更优质的服务，欢迎随时来找我哦</el-main>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      back() {
        this.$router.push("/chat")
      }
    }
  }
</script>

<style scoped>
  .el-container {
    /*  display: flex;
      flex-flow: column wrap;*/
    height: 100%;
  }

  .el-header {
    width: 100%;
    height: .3rem;
    font-size: .18rem;
    font-family: MicrosoftYaHei;
    /*color: rgba(131, 131, 131, 1);*/
    line-height: .6rem;
    text-align: center;
    background: #303133;
    color: #fff;
  }

  .el-icon-arrow-left {
    position: absolute;
    left: .1rem;
    top: .23rem;
  }

  .el-main {
    width: 100%;
    /*flex: 1;*/
    background: #F3F3F3;
    font-size: .18rem;
    overflow: auto;
    text-align: left;
    position: absolute;
    top: .6rem;
    bottom: 0;
    right: 0;
    left: 0;
    line-height: .3rem;
    padding-top: .1rem;
  }
</style>
