<template>
  <div class="main">
    <div class="frame">
      <div class="from-content">
        <h1>密码登录</h1>
        <div class="from">
          <div class="from-list">
            <input type="text" v-model="username" placeholder="用户名" >

          </div>
          <div class="from-list">
            <form>
            <input type="password" id="password" autocomplete="off" v-model="password" placeholder="密码" data-text="密码长度为6-20。">
            </form>
          </div>

          <div class="from-list validation">
            <input type="text" id="valid-input" v-model="inputCode" placeholder="验证码">
            <input type="button" id="validation" @click="createCode()" title="点击更换验证码" v-model="checkCode">
          </div>

          <p class="tip">
            <span>还没有账号？</span>
            <a @click="toRegister()">立即注册</a>
            <a href="" class="tip-right">忘记密码</a>
          </p>
          <p class="error-message">&nbsp;</p>
          <div class="submit-btn">
            <button id="login" @click="login">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {getRequest, postNormalRequest} from "../utils/request"
    import {Message} from "element-ui"
    import {setToken,getToken} from "../utils/auth";

    export default {
        name: "Login",
        data() {
            return {
                inputCode: "",
                checkCode: "",
                email: "",
                username:"",
                password: ""
            }
        },
        mounted() {
            this.createCode();
        },
        methods: {
            createCode() {
                let code = "";
                let codeLength = 4;//验证码的长度
                let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
                    'Z'];//随机数
                for (let i = 0; i < codeLength; i++) {//循环操作
                    let index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
                    code += random[index];//根据索引取得随机数加到code上
                }

                this.checkCode = code;//把code值赋给验证码

            },
            validations() {

                //取得输入的验证码并转化为大写
                if (this.inputCode.length <= 0) { //若输入的验证码长度为0
                    Message.error("请输入验证码！")
                    return false

                } else if (this.inputCode.toUpperCase() != this.checkCode) { //若输入的验证码与产生的验证码不一致时
                    Message.error("验证码输入错误!")
                    // alert("验证码输入错误!"); //则弹出验证码输入错误
                    return false
                }
                return true
            },
            checkEmail() {
                if (this.email == "") {
                    Message.error("邮箱不能为空")
                    // alert("邮箱不能为空");
                    return false;
                }
                const re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (re.test(this.email)) {
                    return true;
                } else {
                    Message.error("请输入有效的邮箱");
                    // alert("请输入有效的邮箱")
                }
                return true;
            },
            checkPassword() {
                if (this.password == "") {
                    Message.error("密码不能为空")
                    // alert("密码不能为空")
                    return false;
                }
                return true;
            },
            toRegister() {
                this.$router.push("/register");
            },
            login() {

                if (this.checkPassword() && this.validations()) {
                    let user = {
                        name: this.username,
                        password: this.password
                    }
                    postNormalRequest("/user/login",user).then(res=>{

                        if(res.data.success){
                            this.$router.push("/mainpage");
                            Message.success("登录成功");
                            setToken('PAPER-BACKEND',res.data.message);
                            getRequest("/user/uid?"+"username="+this.username).then(res=>{

                                setToken('UID',res.data)

                            })

                        }else{
                            Message.error("登录错误,请检查邮箱和密码");
                        }
                    });

                }
            }

        }
    }
</script>

<style scoped>
  .main {
    /* //position: relative;
    //color: white; */
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/mainpage/2.jpg");
    background-size: 100% 100%;
  }

  .frame {
    height: 420px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.3);;


    /*background-color: white;*/
    /*opacity: 100%;*/


  }

  button {
    outline: none;
    border: none;
  }

  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
  }

  input {
    /*color: #353030;*/
    color: white;
    box-shadow: none !important;
    outline: 0 !important;
    /*border: 0.2px solid white;*/
    background-color: rgba(255, 255, 255, 0.3);
    -webkit-appearance: none;

  }

  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #f3f3f3;
    opacity: 0.6;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #f3f3f3;
    opacity: 0.6;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #f3f3f3;
    opacity: 0.6;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #f3f3f3;
    opacity: 0.6;
  }

  .from-content {
    width: 100%;
    box-sizing: border-box;
    padding: 40px 40px 48px;
    /*background-color: #FFF;*/
    position: relative;
    border-radius: 6px;
    text-align: left;
  }

  .from-content h1 {
    font-size: 16px;
    /*color: #353030;*/
    color: white;
    font-weight: 600;

    margin: 0 0 40px;
  }

  .from-content .from {
    margin-top: 10px;
  }

  .from-content .from.hide .submit-btn {
    margin-top: 60px;
  }

  .from-content .from-list {
    margin-top: 24px;
  }

  .from-content .from-list input {

    /*border: 0.1px solid gray;*/
    width: 100%;
    margin: 0;
    padding: 0 0 0 6px;
    height: 40px;
    border: 1px solid #aeaeae;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 16px;

  }

  .from-content .validation #valid-input {
    width: 70%;
    float: left;
  }

  .from-content .validation #validation {

    width: 28%;
    float: right;

    font-family: Arial, 宋体;
    font-style: italic;
    color: rgb(20, 104, 109);
    border: 0;
    line-height: 40px;
    letter-spacing: 6px;
    font-size: 20px;
    font-weight: bolder;
    text-align: center;
  }

  .from-content .validation #validation:hover {
    cursor: pointer;
  }


  .from-content .from-list input:focus {
    border: 1px solid gray;
  }

  .from-content .from-list input::-webkit-input-placeholder {
    font-size: 14px;
  }

  .from-content .from-list input::-moz-placeholder {
    font-size: 14px;
  }

  .from-content .from-list input::-ms-input-placeholder {
    font-size: 14px;
  }

  .from-content .tip {
    font-size: 12px;
    line-height: 25px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .from-content .tip span {
    vertical-align: middle;
    cursor: default;
  }

  .from-content .tip span.iconfont {
    color: #CCC;
  }

  .from-content .tip span.iconfont:hover {
    color: rgb(20, 104, 109);
  }

  .from-content .tip a {
    color: rgb(20, 104, 109);
    vertical-align: middle;
  }

  .from-content .tip .tip-right {
    float: right;
    color: white;
  }

  .from-content .tip .tip-right:hover {
    color: rgb(20, 104, 109);
  }

  .from-content .tip.signup-tip,
  .from-content .tip.signin-tip {
    text-align: center;
    margin-top: 20px;
  }

  .from-content .tip.signin-tip {
    display: none;
  }

  .from-content .error-message {
    font-size: 12px;
    color: rgb(20, 104, 109);
    text-align: center;
    margin-top: 16px;
    opacity: 0;
  }

  .from-content .submit-btn {
    margin-top: 10px;
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .from-content .submit-btn button {
    background-color: rgb(20, 104, 109);
    color: #FFF;
    font-size: 16px;
    height: 44px;
    line-height: 44px;
    width: 60%;
    display: block;
    border-radius: 22px;
  }

  .from-content .submit-btn button:hover {
    background-color: rgb(22, 118, 123);
    cursor: pointer;
  }

  .from-content .forgot-btn {
    margin-top: 160px;
  }

</style>
