<template>
  <div id="app">

    <router-view :key="key"/>

  </div>
</template>

<script>
    // import UserInfoHeader from "./components/UserInfoHeader";
    import {getRequest} from "./utils/request";
    import {getToken} from "./utils/auth";


    export default {
        name: 'App',

        mounted(){



        },
        computed:{

            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            }
        },
        data() {
            return {
                // userShow:false
            }
        },

        watch:{
            $route(to,from){
                // if(to.path=="/register"||to.path=="/login"){
                //     this.userShow=false;
                // }else{
                //     this.userShow=true;
                // }
            }
        },
        methods:{

        }
    }
</script>

<style>
  @import "//at.alicdn.com/t/font_3333171_3rsxei99z8l.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
</style>
