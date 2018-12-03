<template>
  <el-container>
    <el-header><i class="el-icon-arrow-left" @click="back"></i><span>请输入为解决原因</span></el-header>
    <el-main>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="您不用客气，给机器人提意见，字数限制200，么么哒~~"
        :maxlength="200"
        v-model="reason">
      </el-input>
      <div class="forReason">请填写解决原因</div>
      <el-button type="primary" size="small" @click="reasonSubmit">提交</el-button>
    </el-main>
    <div class="faild">提交失败</div>
  </el-container>
</template>

<script>
  import $ from 'jquery';
  export default {
    data() {
      return {
        reason: ''
      }
    },
    mounted(){
      /*console.log(this.$route.params.rltId);*/
    },
    methods: {
      back() {
        const self=this;
        self.$router.push("/chat",function () {
          self.$route.params.suc=""
        })
      },
      tranF(){ //提交失败
        $(".faild").css("opacity","1");
        window.setTimeout(function () {
          $(".faild").css("opacity","0");
        },2000)
      },
      tranR(){ //原因
        $(".forReason").css("opacity","1");
        window.setTimeout(function () {
          $(".forReason").css("opacity","0");
        },2000)
      },
      reasonSubmit() {
        const self = this,
          rltId= self.$route.params.rltId;
        if (self.reason == "") {
          console.log(1);
        self.tranR()
        } else {
          const data = {
            rltId: rltId,
            reason: self.reason
          };
          self.textarea = ""
          self.axios({
            method: "post",
            url: "http://47.92.93.152:8001/feedback/uslvsubmit",
            data: self.qs.stringify(data)
          }).then(function (res) {
            console.log(data, res);
            if (res.data.rc == 0) {
              self.$router.push({name:"chat",params:{success1:"1"}},function () {
                self.$route.params.suc="成功"
              })
            }else {
              self.tranF()
            }
          })
        }
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

  .el-button {
    position: absolute;
    top: 1.3rem;
    right: .23rem;
    z-index: 666;
  }
  .faild{
    transition: all ease 1s;
    color: red;
    font-size: .2rem;
    position: absolute;
    top: .6rem;
    left: 1.5rem;
    opacity: 0;
  }
  .forReason{
    transition: all ease 1s;
    color: red;
    font-size: .16rem;
    opacity: 0;
  }
</style>
