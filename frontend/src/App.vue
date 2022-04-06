<template>
  <div id="app">
    <UserInfoHeader v-show="userShow"></UserInfoHeader>
    <router-view/>
  </div>
</template>

<script>
    import UserInfoHeader from "./components/UserInfoHeader";
    export default {
        name: 'App',
        components: {UserInfoHeader},
        data() {
            return {
                userShow:false
            }
        },

        watch:{
            $route(to,from){
                if(to.path=="/register"||to.path=="/login"){
                    this.userShow=false;
                }else{
                    this.userShow=true;
                }
            }
        },
    }
</script>

<style>
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
