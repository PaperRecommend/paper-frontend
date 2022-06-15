<template>
  <div :class="cardClass" @mouseenter="shadow" @mouseleave="normal">
    <div class="title">
      <span class="el-icon-data-analysis type-icon"></span>
      <span>Top Authors</span>
    </div>
    <div class="graph" v-if="rankData == null">
      Sorry, Currently Unavailable!
    </div>
    <div class="card" v-if="rankData != null" v-loading="loading">
      <div class="card-item" v-for="(item,index) in rankData">
        <a class="card-link" @click="jumpToProfile('author',item.id)">{{index+1}}.&nbsp;&nbsp;<span
          class="item-name":class="tabIndex==2?'':'item-name-2'">{{item.name}}</span></a>
        <span class="item-heat">Activity: {{item.heat}}</span>
      </div>

    </div>
  </div>
</template>

<script>
    import {jump2Profile} from "../utils/profileInfo";
    export default {
        name: "RankCard",

        props: {
            rankData: Array,
        },

        data() {
            return{
                loading: false,
                cardClass:"normal-card"
            }
        },
        methods: {
            shadow(){
                this.cardClass="shadow-card"
            },
            normal(){
                this.cardClass="normal-card"
            },
            jumpToProfile(tabItem, id) {
                jump2Profile(this.$router, tabItem, id);

            },

        }
    }
</script>

<style scoped>
  /* .card{
    background-color: azure;
    opacity: 0.7;
    border-radius: 4px;
    color: #4e4376;
    height: 350px;
    overflow: hidden;
  } */
  .normal-card{
    background-color: azure;
    opacity: 0.7;
    border-radius: 4px;
    color: #4e4376;
    height: 350px;
    overflow: hidden;
  }
  .shadow-card{
    background-color: azure;
    opacity: 0.7;
    border-radius: 4px;
    color: #4e4376;
    height: 350px;
    overflow: hidden;
    box-shadow: 8px 8px 14px 0 rgba(253, 253, 253, 0.5)
    /* overflow: auto; */
  }

  .title{
    font-size: large;
    font-weight: bold;
    padding-top: 5px;
    padding-left: 20px;
    text-align: left;
  }

  .type-icon {
    font-size: large;
    font-weight: bold;
  }
  .graph{
    width:95%;
    height: 90%;
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
  .graph-error{
    padding-top: 100px;
  }
  .card{
    height: 90%;
    width: 92%;
    /*margin-top: 7px;*/
  }
  .card-item {
    height: 10%;
    width: 100%;
    padding-left: 10px;
    /*color: white;*/
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
  }
  .card-item a {
    height: 100%;
    display: flex;
    width: 75%;
    align-items: center;
  }
  /*.item-name:hover {*/
  /*  cursor: pointer;*/
  /*  text-decoration: underline;*/
  /*}*/
  .item-heat {
    width: 31%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    text-align: right;
  }
</style>
