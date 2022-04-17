<template>
  <div :class="cardClass" @mouseenter="shadow" @mouseleave="normal">
    <div class="item" v-for="(item, index) in statistics">
      <span :class= "item.icon" class="item-icon"></span>
      <span class="item-title">{{item.type}}</span>
      <span class="item-number">{{Math.round(item.value*10)/10}}</span>
    </div>
  </div>
</template>

<script>
    export default {
      name: "basic-statistic-card",

      props: {
        statistics: Array,
      },

      data() {
        return{
          cardClass:"normal-card"
        }
      },

      methods: {
        shadow(){
          this.cardClass="shadow-card"
        },
        normal(){
          this.cardClass="normal-card"
        }
      },
    }
</script>

<style scoped>
  /*::-webkit-scrollbar {*/
  /*  width: 0;*/
  /*}*/

  /*::-webkit-scrollbar-track {*/
  /*  background: transparent;*/
  /*}*/

  /*::-webkit-scrollbar-thumb {*/
  /*  border-radius:10px;*/
  /*  background: #b4bccc;*/
  /*}*/

  .normal-card{
    background-color: azure;
    box-sizing: border-box;
    opacity: 0.7;
    border-radius: 4px;
    color: #4e4376;
    height: 350px;
    overflow: hidden;
    padding :3% 3% 0 0;
    text-align: left;
    margin-top: -11px;
    /*display: flex;*/

  }
  .shadow-card{
    background-color: azure;
    box-sizing: border-box;
    opacity: 0.7;
    border-radius: 4px;
    color: #4e4376;
    height: 350px;
    overflow: hidden;
    box-shadow: 8px 8px 14px 0 rgba(253, 253, 253, 0.5);
    padding :3% 3% 0 0;
    text-align: left;
    margin-top: -11px;
    /* overflow: auto; */
  }


  .item {
    /*border: solid pink;*/
    padding: 4% 5% ;
    width: 100%;
    /*height: 20%;*/
  }

  .item-icon {
    /*border: solid pink;*/
    font-size: x-large;
    padding-right: 5%;
    /*width: 20%;*/
  }

  .item-title {
    font-size: x-large;
    padding-right: 5%;
  }

  .item-number {
    color: #20a0ff;
    font-style: italic;
    font-weight: bold;
    font-size: x-large;

  }

</style>
