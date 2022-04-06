<template>
  <div id="user-info-header">
    <el-dropdown trigger="click">
      <div class="user">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>

        <i class="el-icon-caret-bottom downicon"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="margin-left: 20px">
        <el-dropdown-item key="1" icon="el-icon-user">个人中心</el-dropdown-item>
        <el-dropdown-item key="2" icon="el-icon-star-off">论文收藏</el-dropdown-item>

      </el-dropdown-menu>

    </el-dropdown>
  </div>
</template>

<script>
    export default {
        name: "UserInfoHeader"
    }
</script>

<style scoped>
  #user-info-header {
    position: fixed;
    height: 50px;
    width: 100px;

    /*background-color: rgba(255,255,255,0);*/
    top: 20px;
    right: 20px;
    z-index: 1000;
  }

  .user {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user:hover{
    cursor: pointer;
  }

  .downicon {
    display: block;
    margin-left: 5px;
    color: white;
  }
</style>
