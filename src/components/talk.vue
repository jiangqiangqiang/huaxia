<template>
  <div style="width: 100%">
    <el-container>
      <!--<el-header ref="header">联通客服</el-header>-->
      <div style="display: none">
        <img :src="imageUrlL" alt="">
        <img :src="imageUrlR" alt="">
      </div>
      <el-main id="dialogue_main">
        <div style="width: 300px" ref="dialogue_box">
          <div class="talk-box first-talk" :class="{'talk-Left':true}" v-show="firstLineShow">
            <img src="../../static/images/20180904172542.jpg" alt="">
            <span> HI,我是华夏运维机器人小夏，很高兴为您服务，您可以问我，今天谁值班？</span>
            <div class="space"></div>
          </div>
          <div id="spanText" class="talk-box" v-for="(site,index) in textList"
               :class="{'talk-Left':site.isLeft,'talk-right':site.isRight}" :key="index">
            <img :src="site.imageUrl" alt="">
            <span v-html="site.text">{{site.text}}</span>
            <!--{{getHTML(site.text)}}-->
            <div class="space"></div>
          </div>
        </div>
      </el-main>
      <img src="../../static/images/chat11.gif" alt="" class="midChatPic" ref="midChatPic">
      <el-footer ref="footer" v-if="!voiceShow">
        <img src="../../static/images/voice1.png" alt="" class="voicePic" @touchstart="changeF">
        <input type="text" x-webkit-speech class="talk-input" v-model="textIn" @keyup.enter="getIn">
        <el-button type="success" ref="button" @click="getIn" size="small">发送</el-button>

      </el-footer>
      <el-footer v-if="voiceShow">
        <div class="edit" @touchstart="changeF">
          <img src="../../static/images/edit.png" width="100%" height="100%">
        </div>
        <i class=""></i>
        <div class="content" style="font-size: .16rem">
          <div class="dialogBox" id="dialogBox">
          </div>
          <div class="voice-remote" @touchstart.stop.prevent="start" @touchend.stop.prevent="translate">
            <span class="cover"></span>
            <span class="icon"></span>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import $ from 'jquery';
  import wx from 'weixin-js-sdk';

  const _this = wx;
  export default {
    data() {
      return {
        chars: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        textIn: "",
        textList: [],
        voiceShow: false,
        imageUrlL: "../../static/images/20180904172542.jpg",
        imageUrlR: "../../static/images/20180904172504.png",
        firstLineShow: false,
        localId: '',
        serverId: '',
        downLoadId: '',
        Soff: true,
        time: 0,
        timer: null,
        rltId: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      }
    },
    methods: {
      changeF() {
        this.voiceShow = !this.voiceShow;
      },
      num() {
        this.Cookies = Cookies;
        var res = "";
        for (var i = 0; i < 16; i++) {
          var id = Math.ceil(Math.random() * 25);
          res += this.chars[id];
        }
        this.Cookies.set('random', res);

      },
      getIn() {
        const self = this;
        var obj = {
          text: self.textIn,
          imageUrl: self.imageUrlR,
          isLeft: false,
          isRight: true
        };
        if (obj.text == "") {
          self.$message({
            message: '请输入您的问题',
            type: 'error',
            iconClass: "error",
            center: "true",
            showClose: "false",
          });
        } else {
          obj.text=obj.text.replace("网卡","王卡")
          self.textList.push(obj)
          const data = {
            userId: 111,
            text: self.textIn
          };
          self.textIn = ""
          self.axios({
            method: "post",
            url: "http://39.98.35.49:8003/chatmgr/chatmgr",
            data: self.qs.stringify(data)
          }).then(function (res) {
            console.log(data, res);
            if (res.data.rc == 0) {
              const obj = {
                text: res.data.result,
                isLeft: true,
                isRight: false,
                imageUrl: self.imageUrlL
              };

              var reg = /(\d+、)/g;
              obj.text = obj.text.replace(reg, function ($0, $1) {
                return ("<b" + "r/>" + $1)
              });
              var reg1 = /(\d+\.)/g;
              obj.text = obj.text.replace(reg1, function ($0, $1) {
                return ("<b" + "r/>" + $1)
              });
              obj.text = obj.text.replace(/(\[\d+\])/g, function ($0, $1) {
                return ("<b" + "r/>" + $1)
              });
              obj.text = obj.text.replace(/(\（\d+\）)/g, function ($0, $1) {
                return ("<b" + "r/>" + $1)
              });
              obj.text = obj.text.replace(/(\~\~)/g, function ($0, $1) {
                return ($1 + "<b" + "r/>")
              });
              obj.text = obj.text.replace("以上答案", "<b" + "r/>以上答案");
              obj.text = obj.text.replace("您还可能关注以下", "<b" + "r/><br/>您还可能关注以下");
              obj.text = obj.text.replace("请回复序号", "<b" + "r/><br/>请回复序号");
              obj.text = obj.text.replace(/\/\/\w+\.\w+\.\w+\/\w+\/solve\?\w+\=(\d+) /g, function ($0, $1) {
              });
              obj.text = obj.text.replace(/\/\/\w+\.\w+\.\w+\/\w+\/unsolve\?\w+\=(\d+) /g, function ($0, $1) {
                self.rltId = $1;
              });
              console.log(obj);
              self.textList.push(obj);
              self.$store.state.vuexs.text = self.textList;
            }
          })
        }
      },
      getConfig() {
        const self = this;
        const data = self.qs.stringify({url: location.href.split('#')[0]});
        console.log(data);
        self.axios({
          method: 'post',
          url: 'http://39.98.35.49:8084/?' + data,
          headers: {'Content-Type': 'application/json'},
          data: data  //向服务端提供授权url参数，并且不需要#后面的部分
        }).then((res) => {
          console.log(res, res.data.data);
          let list = res.data.data;
          _this.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: list.appId, // 必填，公众号的唯一标识
            timestamp: list.timestamp, // 必填，生成签名的时间戳
            nonceStr: list.noncestr, // 必填，生成签名的随机串
            signature: list.signature, // 必填，签名
            jsApiList: [
              'startRecord', //开始录音接口
              'stopRecord',// 停止录音接口
              'playVoice', //播放语音接口
              'pauseVoice',//暂停播放接口
              'stopVoice', //停止播放接口
              'uploadVoice',//上传语音接口
              'downloadVoice', //下载语音接口
              'onVoicePlayEnd', // 监听语音播放完毕api
              'translateVoice'
            ] // 必填，需要使用的JS接口列表
          });
          _this.ready(() => {
// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          })
          // 微信sdk错误返回问题
          _this.error((res) => {
            alert('出错了：' + res.errMsg)// 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      // 开始录音
      start(e) {
        this.$refs.midChatPic.style.display="block";
        let that = this;
        that.stop();
        that.time = 0;
        if (!localStorage.rainAllowRecord || localStorage.rainAllowRecord !== 'true') {
          _this.startRecord({
            success: function () {
              /*console.log('成功开始调起录音')*/
              $('.voice-remote').addClass('active');
              that.timer = setInterval(() => {
                that.time++
              }, 1000)
              that.vicoeEnd()
            },
            fail: function () {
              /* $('.voice-remote').addClass('active');*/
              /*console.log('开始录音失败')*/
            },
            cancel: function () {
              alert('用户拒绝授权录音')
            }
          })
        }
      },
      // 停止录音
      stop() {
        let that = this
        // clearInterval(that.timer)
        _this.stopRecord({
          success: function (res) {
            if (that.time < 0.5) {
              return
            }
            // alert('暂停成功')
            /*console.log(res, "停止成功");*/
            $('.voice-remote').removeClass('active');
            clearInterval(that.timer)
            that.localId = res.localId
            /*that.upVoice()*/
          },
          fail: function (error) {
            // alert('死啦停不了')
            /*console.log(error, "停止失败")*/
            $('.voice-remote').removeClass('active');
          }
        })
      },
      //取消录音判断
      isCancel(e) {
        this.cancel()
      },
      // 取消录音
      cancel() {
        _this.stopRecord({
          success: (res) => {
            /*console.log("取消录音成功");*/
          },
          fail: function (error) {
            console.log("取消录音失败");
          }
        })
      },
      // 60秒监听
      vicoeEnd() {
        let that = this
        _this.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            alert('60秒停止录音')
            that.localId = res.localId
            clearInterval(that.timer);
            $('.voice-remote').removeClass('active');
            /*that.upVoice()*/
          }
        })
      },
      // 合并
      merge() {
        let that = this
        this.axios({
          method: 'post',
          url: 'http://my.service.com/index.php/opcode/6002',
          headers: {'Content-Type': 'application/json'},
          data: {url: location.href.split('#')[0]}
        })
          .then((ser) => {
            console.log(ser)
            that.$refs.allRecord.src = ser.data
          })
          .catch((error) => {
            console.log(error)
          })
      },
      // // 播放
      // play () {
      //   let that = this
      //   console.log(that.localId)
      //   _this.playVoice({
      //     localId: that.localId // 需要播放的音频的本地ID，由stopRecord接口获得
      //   })
      // },
      // // 暂停
      // pausePlay () {
      //   let that = this
      //   _this.pauseVoice({
      //     localId: that.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      //   })
      // },
      // // 停止
      // stopPlay () {
      //   let that = this
      //   _this.stopVoice({
      //     localId: that.localId // 需要停止的音频的本地ID，由stopRecord接口获得
      //   })
      // },

      //结束录音并识别语音
      translate() {
        this.$refs.midChatPic.style.display="none";
        const that = this;
        _this.stopRecord({
          success: function (res) {
            /*console.log(res,"翻译前停止录音");*/
            that.localId = res.localId;
            $(".voice-remote").addClass("vrPause");
            _this.translateVoice({
              localId: that.localId,
              complete: function (res) {
                console.log(res, "调用翻译完成时");
                var text1=res.translateResult;
                text1=text1.replace("网卡","王卡");
                that.textIn = text1;
                that.getIn();
              }
            });
          },
          fail: function (res) {
            console.log(res, "调用停止失败");
            /*alert(JSON.stringify(res));*/
          }
        });
      },
      // 上传语音
      upVoice() {
        let that = this
        _this.uploadVoice({
          localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            var apiUrl = window.location.href
            /*alert('上传成功')*/
            that.serverId = res.serverId // 返回音频的服务器端ID
            that.axios({
              method: 'post',
              url: 'http://my.service.com/index.php/opcode/6002',
              headers: {'Content-Type': 'application/json'},
              data: {
                serverId: res.serverId,
                url: location.href.split('#')[0]
              }
            })
              .then((data) => {
                console.log(data)
                that.$refs.player.src = data.data
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
      }
      // 下载语音
      // downVoice () {
      //   let that = this
      //   _this.downloadVoice({
      //     serverId: that.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      //     isShowProgressTips: 1, // 默认为1，显示进度提示
      //     success: function (res) {
      //       alert('下载成功')
      //       that.downLoadId = res.localId // 返回音频的本地ID
      //       console.log(res)
      //       console.log(that.downLoadId)
      //     }
      //   })
      // },
      // 模拟上传语音
      // fake () {
      //   var apiUrl = window.location.href
      //   this.axios({
      //     method: 'post',
      //     url: 'api',
      //     headers: {'Content-Type': 'application/json'},
      //     data: {
      //       serverId: 'cplZxG7oYspQxopQIb9g_cUJ7Y69htn_ybzFiRZR_U3Vf8Bv4Nh6D6TBPWa5VmGs',
      //       url: apiUrl
      //     }
      //   })
      //     .then((res) => {
      //       console.log(res)
      //       this.$refs.player.src = res.data
      //     })
      //     .catch((error) => {
      //       console.log(error)
      //     })
      // }
    },
    beforeCreate() {
      /*this.textList=this.$store.state.vuexs.text;*/
    },
    created() {
      window.setTimeout(() => {
        this.firstLineShow = true;
      }, 1000)
    },
    mounted() {
      document.oncontextmenu = function (e) {
        // 阻止部分手机长按会产生弹出框的问题
        e.preventDefault();
      };
      this.num();

      // this.getIn();
      function mainHeight() {
        var CH = document.documentElement.clientHeight || document.body.clientHeight
        return (CH - 30 - 60);
      };
      this.$refs.dialogue_box.style.height = mainHeight() / 100 + "rem";
      /*this.textList=this.$store.state.vuexs.text;*/
      var dialogue_main = document.getElementById("dialogue_main")
      dialogue_main.scrollTop = dialogue_main.scrollHeight;
      this.$nextTick(function () {
        this.getConfig()
      });
      console.log(navigator.userAgent);
      if (/iPhone/g.test(navigator.userAgent)) {
        Array.prototype.slice.call(document.all).forEach(function (ele) {
          ele.style.userSelect = 'none';
        });
      }
    },
    updated() {
      this.$nextTick(function () {
        var dialogue_main = document.getElementById("dialogue_main")
        dialogue_main.scrollTop = dialogue_main.scrollHeight;
      });
      const self = this

      var $dialogue_main = $("#dialogue_main");
      $dialogue_main.children().eq(0).children().each(function (index, ele) {
        /* console.log($(ele).find("span").find("a"));*/
        var $a = $(ele).find("span").find("a");
        /* console.log($dialogue_main,"标签");*/
        $a.length === 2 ? $a.eq(0).on("click", function (e) {
          e.preventDefault();
          self.$router.push("/solved")
        }) : null;
        $a.length === 2 ? $a.eq(1).on("click", function (e) {
          e.preventDefault();
          self.$router.push({name: "unsolved", params: {rltId: self.rltId}})
        }) : null

      });
    },
    destroyed() {
      clearTimeout(this.timeout);
    },
    watch: {
      $route(to, from) {
        if (from.name == "unsolved" && this.$route.params.suc) {
          const obj = {
            text: "感谢您的反馈信息，我会继续努力学习的，谢谢您的支持",
            isLeft: true,
            isRight: false,
            imageUrl: this.imageUrlL
          };
          this.textList.push(obj)
        }
      }
    }
  }
</script>

<style scoped>
  body, html {
    margin: 0;
    padding: 0;
  }

  .el-header {
    width: 100%;
    height: .3rem !important;
    font-size: .16rem;
    font-family: MicrosoftYaHei;
    color: rgba(131, 131, 131, 1);
    position: fixed;
    left: 0;
    top: 0;
    line-height: .3rem;
    text-align: center;
    z-index: 666;
    background: #303133;
    color: #fff;
  }

  .el-main {
    padding: 0;
    width: 100%;
    margin-bottom: .6rem;
    background: #F3F3F3;
    justify-content: center;
    display: flex;
    overflow-y: auto;
    transition: all ease 1s;
    text-align: left;
  }

  .midChatPic {
    display: none;
    width: 1.4rem;
    position: absolute;
    top: 50%;
    border-radius: .18rem;
    opacity: .75;
    left: 50%;
    margin-left: -.7rem;
    margin-top: -.4rem;
  }

  .el-footer {
    text-align: center;
    position: fixed;
    height: .6rem;
    bottom: 0.16rem;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 888;
  }

  .el-footer .el-button {
    /* width: 13%;
     height: 30px;
     line-height: 30px;
     text-align: center;
     background: rgba(103,194,58,.8);
     border-radius: 8px;
     border: 1px solid transparent;
     outline: none;
     color: #fff;*/
  }

  th {
    font-size: .2rem;
    font-family: MicrosoftYaHei;
    color: rgba(48, 48, 48, 1);
    line-height: .18rem;
  }

  .see-dd {
    font-size: .2rem;
    font-family: MicrosoftYaHei;
    color: rgba(1, 143, 215, 1);
    line-height: .18rem;
    cursor: pointer;
  }

  .voicePic {
    height: .31rem;
  }

  .talk-input {
    width: 70%;
    height: .31rem;
    border-radius: .06rem;
    border: .01rem solid #ccc;
    box-sizing: border-box;
    padding: 0 .2rem;
    outline: none;
  }

  .talk-box {
    width: 100%;
    display: flex;
    margin: .2rem 0 0 0;
  }

  .talk-box img {
    width: .35rem;
    height: .35rem;
    margin: 0 .05rem;
    padding: 0;
  }

  .talk-box span {
    max-width: 2.4rem;
    box-sizing: border-box;
    padding: .1rem .2rem;
    border-radius: .06rem;
    margin: 0 .01rem;
    font-size: .14rem;
    word-wrap: break-word;
    line-height: .24rem;
  }

  .talk-box span a {
    text-decoration: none !important;
    color: red;
  }

  .talk-box .space {
    flex-grow: 1;
    /*width: .2rem;*/
  }

  .talk-Left {
    flex-direction: row;
    margin-left: -.35rem;
  }

  .talk-Left span {
    background: rgba(85, 148, 215, 1);
    color: rgba(255, 255, 255, 1);
  }

  .talk-right {
    flex-direction: row-reverse;
    margin-left: .35rem;

  }

  .talk-right span {
    background: rgba(255, 255, 255, 1);
    color: rgba(48, 48, 48, 1);
  }

  .voice-remote {
    border-radius: 50%;
    width: .6rem;
    height: .6rem;
    overflow: hidden;
    position: absolute;
    background: #f6f6f6;
    bottom: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    transition: all .2s;
    -webkit-transition: all .2s;
  }

  .edit {
    position: absolute;
    left: .2rem;
    bottom: .2rem;
    font-size: .2rem;
    color: #409EFF;
    width: .2rem;
    height: .2rem;
  }

  .voice-remote:active {
    width: .6rem;
    height: .6rem;
    bottom: 0;
    border: .1px solid #e7e7e7;
  }

  .voice-remote:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-image: linear-gradient(-90deg, transparent 50%, #1dc61c 50%);
  }

  .voice-remote:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    background-image: linear-gradient(-90deg, transparent 50%, #1dc61c 50%);
  }

  .voice-remote .cover {
    position: absolute;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    z-index: 4;
    top: 0;
    left: 0;
    background-image: linear-gradient(-90deg, transparent 50%, #f6f6f6 50%);
  }

  .voice-remote .icon {
    position: absolute;
    width: .6rem;
    height: .6rem;
    top: 0;
    left: 0;
    background: #f6f6f6 url(../../static/images/voice1.png) no-repeat center center;
    background-size: contain;
    border-radius: 50%;
    z-index: 5;
    /* user-select: none;
     -webkit-user-select: none;*/
  }

  .voice-remote .icon:active {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    background-size: 100%;
  }

  .voice-remote:active:before {
    -webkit-animation: scoll linear 30s;
    animation: scoll linear 30s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  .voice-remote:active:after {
    -webkit-animation: xscoll linear 60s;
    animation: xscoll linear 60s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  .voice-remote:active .cover {
    -webkit-animation: hide linear 60s;
    animation: hide linear 60s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  @-webkit-keyframes scoll {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(180deg);
    }
  }

  @keyframes scoll {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @-webkit-keyframes xscoll {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes xscoll {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes hide {
    0% {
      opacity: 1
    }

    49.9% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes hide {
    0% {
      opacity: 1
    }

    49.9% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 0;
    }
  }
</style>
