<template>
  <div class="header-bar">

    <div class="system-icon">
      <i class="iconfont icon-logo" @click="gotoMainPage()"></i>
    </div>

    <div class="paper-statistic">
      <el-dropdown trigger="click" @command="enterDetail">
        <div class="dropdown-top">
          <span>Analysis</span>
          <i class="el-icon-caret-bottom" style="margin-left: 3px;color: white;"></i>
        </div>

        <el-dropdown-menu slot="dropdown" style="margin-left: 0px;margin-top: -15px;">
          <el-dropdown-item key="1" icon="el-icon-data-analysis" command="0">Author</el-dropdown-item>
          <el-dropdown-item key="2" icon="el-icon-data-analysis" command="1">Field</el-dropdown-item>
          <el-dropdown-item key="3" icon="el-icon-data-analysis" command="2">Conference</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="paper-recommend">
      <span @click="gotoRecommend()">Recommendation</span>
    </div>



    <div id="user-info-header">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user">
          <el-avatar :src="avatar"></el-avatar>s

<!--          <i class="el-icon-caret-bottom downicon"></i>-->
        </div>
        <el-dropdown-menu slot="dropdown" style="margin-left: 10px">
          <el-dropdown-item key="1" icon="el-icon-user" command="0">个人中心</el-dropdown-item>
          <el-dropdown-item key="2" icon="el-icon-star-off" command="1">论文收藏</el-dropdown-item>

        </el-dropdown-menu>

      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import avatar from "../assets/avatar.jpg"
    export default {
        name: "HeaderBar",
        data(){
            return{
                avatar:avatar,
                tab_list: ['author', 'field','conference'],
            }
        },
        methods:{
            gotoMainPage(){
                this.$router.push({path: "/mainpage"});
            },
            enterDetail(command) {
                let index=parseInt(command)
                this.$router.push({path: "/sort?type=" + this.tab_list[index].toLowerCase()})
            },
            handleCommand(command){
                let index=parseInt(command)
                switch(index){
                    case 0:
                        break;
                    case 1:
                        this.$router.push({path: "/collection"})
                }

            },
            gotoRecommend(){
                this.$router.push({path: "/recommend"});
            }
        }
    }
</script>

<style scoped>
  .header-bar {
    position: absolute;
    height: 80px;

    z-index: 1000;
    display: flex;
    align-items: center;

    font-family: "Microsoft YaHei UI";

  }

  .system-icon {
    height: 80px;
    width: 100px;
  }

  .system-icon i {
    font-size: 35px;
    font-weight: bold;
    color: white;
    line-height: 80px;
  }
  .system-icon i:hover{
    cursor: pointer;
  }

  .paper-statistic {

    line-height: 80px;
    /*height: 80px;*/
    width: 100px;

  }
  .dropdown-top{
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 80px;
    color: white;
  }
  .dropdown-top:hover{
    cursor: pointer;
    text-decoration: underline;
  }

  .paper-recommend {
    color: white;
    line-height: 80px;
    height: 80px;
    width: 100px;
    font-size: 14px;
    margin-left: 20px;
  }
  .paper-recommend span:hover{
    cursor: pointer;
    text-decoration: underline;
  }

  #user-info-header {
    position: absolute;
    height: 80px;
    width: 100px;

    /*background-color: rgba(255,255,255,0);*/
    /*top: 20px;*/
    top: 20px;
    left: 90vw;
    z-index: 1000;
  }

  .user {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user:hover {
    cursor: pointer;
  }

  .downicon {
    display: block;
    margin-left: 5px;
    color: white;
  }
</style>
