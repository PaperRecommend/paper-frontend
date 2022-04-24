<template>
  <div class="recommend-page">
    <el-col :span="8">
      <div style="width: 100%">&nbsp;</div>
    </el-col>
    <el-col :span="16">
      <div class="papers">
        <div class="paper-frame">
          <div class="paper"></div>
        </div>
        <div class="paper-frame">
          <div class="paper"></div>
        </div>
        <div class="paper-frame">
          <div class="paper"></div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
    export default {
        name: "RecommendPage"
    }
</script>

<style scoped>
  .recommend-page {
    height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .papers{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  }

  .paper-frame {
    width: 70%;
    height: 30vh;
    transform: skewX(-15deg);
    border: 1px solid red;
  }

  .paper {
    transform: skewX(15deg);
  }
</style>
