<template>
  <div class="main">
    <div class="frame">
      <div class="from-content">
        <h1>注册账户</h1>
        <div class="from">
          <!--          <div class="from-list">-->
          <!--            <input id="email" type="text" v-model="email" placeholder="请输入注册邮箱" data-text="请输入格式正确邮箱。" autocomplete="off">-->
          <!--          </div>-->
          <div class="from-list">
            <input id="username" type="text" v-model="username" placeholder="请输入用户名" autocomplete="off">
          </div>
          <div class="from-list">
            <form>
              <input id="password" type="password" v-model="password" placeholder="请输入登录密码" data-text="密码长度为6-20。"
                     autocomplete="off">
            </form>
          </div>
          <div class="from-list">
            <form>
              <input id="cofPassword" type="password" v-model="check_password" placeholder="请再次输入密码"
                     data-text="两次密码输入不相同。" autocomplete="off">
            </form>
          </div>

          <div class="submit-btn">
            <button id="register" @click="register()">注册</button>
          </div>
          <p class="tip signup-tip">
            <span>已有账号？</span>
            <a @click="toLogin()">立即登录</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {postNormalRequest} from "../utils/request"
    import {Message} from "element-ui"

    export default {
        name: "register",
        data() {
            return {
                // email:"",
                password: "",
                username: "",
                check_password: ""
            }
        },
        methods: {
            // checkEmail(){
            //     if(this.email==""){
            //         Message.error("邮箱不能为空");
            //         // alert("邮箱不能为空");
            //         return false;
            //     }
            //     const re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            //     if (re.test(this.email)) {
            //         return true;
            //     } else {
            //         Message.error("请输入有效的邮箱");
            //         // alert("请输入有效的邮箱")
            //     }
            //     return true;
            // },
            checkPassword() {
                if (this.password == "") {
                    Message.error("密码不能为空");
                    // alert("密码不能为空")
                    return false;
                }
                if (this.password != this.check_password) {
                    Message.error("两次密码输入不同");
                    return false;
                }


                return true;
            },
            checkUsername() {
                if (this.username == "") {
                    Message.error("用户名不能为空");
                    // alert("密码不能为空")
                    return false;
                }
                return true;
            },
            register() {
                if (this.checkPassword() && this.checkUsername()) {
                    let user = {

                        name: this.username,
                        password: this.password
                    }
                    console.log(user)
                    postNormalRequest("/user/register", user).then(res => {
                        console.log(res.data)
                        // if(res.data.UserInfo!=null&&res.data.UserInfo.id!=null){
                        //     this.userInfo = res.data.UserInfo;
                        //     this.$router.push("/mainpage");
                        //     Message.success("注册成功");
                        // }else{
                        //     Message.error("注册错误,请检查邮箱和密码");
                        // }
                        this.$router.push("/login");
                    });
                }

            },
            toLogin() {
                this.$router.push("/login")
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
    height: 440px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.3);

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

    border: 1px solid #aeaeae;
    width: 100%;
    margin: 0;
    padding: 0 0 0 6px;
    height: 40px;
    /*border: 1px solid #e2e2e2;*/
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

  /*.from-content .tip .tip-right {*/
  /*  float: right;*/
  /*  color: white;*/
  /*}*/

  /*.from-content .tip .tip-right:hover {*/
  /*  color: #6dd070;*/
  /*}*/

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
    margin-top: 40px;
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .from-content .submit-btn button {
    background-color: rgb(20, 104, 109);
    color: #FFF;
    font-size: 16px;
    height: 44px;
    width: 80%;
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
