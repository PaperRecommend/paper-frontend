<template>
  <div class="rank">
    <div class="rank-title">——— &nbsp;&nbsp;Rankings&nbsp;&nbsp; ———</div>
    <div class="cards">

      <div class="card"
           v-loading="tab_loading[0]"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.1)"
           v-for="(tabItem,tabIndex) in tab_list">
        <div class="card-title">Top&nbsp; {{tabItem[0].toUpperCase()+tabItem.slice(1)}}</div>
        <div class="card-content">
          <div class="card-item" v-for="(item,index) in topRanking[tabItem]">
            <a class="card-link" @click="jumpToProfile(tabItem,item.id)">{{index+1}}.&nbsp;&nbsp;<span
              class="item-name" >{{tabIndex==2?item.raw:item.name}}</span></a>
            <span class="item-heat">Activity: {{item.heat}}</span>
          </div>

        </div>

      </div>


    </div>
    <div class="view-more">
      <el-button class="card-more" @click="enterDetail(0)">view more</el-button>
      <el-button class="card-more" @click="enterDetail(1)">view more</el-button>
      <el-button class="card-more" @click="enterDetail(2)">view more</el-button>
    </div>

  </div>
</template>

<script>
    import {getNormalRequest} from "../utils/request";
    import {jump2Profile} from "../utils/profileInfo";

    export default {
        name: "Rank",
        data() {
            return {
                tab_list: ['author', 'field','conference'],
                tab_loading: [false, false, false],
                topRanking: {
                    author: [],
                    conference: [],
                    field: []
                }

            }
        },
        mounted() {
            // console.log(this.topRanking[this.tab_list[0]])
            this.tab_loading = [true, true, true];

            this.enterCard(0);
            this.enterCard(1);
            this.enterCard(2);


        },
        methods: {
            //卡片内渲染
            enterCard(index) {
                if (localStorage.hasOwnProperty(this.tab_list[index])) {
                    this.topRanking[this.tab_list[index]] = JSON.parse(localStorage.getItem(this.tab_list[index]))
                } else {
                    getNormalRequest("/api/" + this.tab_list[index] + "/list")
                        .then(res => {

                            this.topRanking[this.tab_list[index]] = res.data
                            localStorage.setItem(this.tab_list[index], JSON.stringify(this.topRanking[this.tab_list[index]]))

                        })

                }
                this.tab_loading[index] = false


            },
            //进入详细页面
            enterDetail(index) {
                this.$router.push({path: "/sort?type=" + this.tab_list[index].toLowerCase()})
            },
            jumpToProfile(tabItem, id) {
                jump2Profile(this.$router, tabItem, id);

            },


        },
    }
</script>

<style scoped>

  .rank {
    height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  }

  .rank-title {
    height: 18vh;
    width: 100%;
    font-size: 2em;
    color: #fff;
    font-weight: bold;
    /* font-style: italic; */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    line-height: 18vh;
    justify-content: center;
  }

  .cards {
    height: 70vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .card {
    height: 68vh;
    width: 26%;

  }

  .card-title {

    height: 7vh;
    line-height: 7vh;
    border: 0.5px solid rgb(94, 200, 221);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    font-size: 1.3em;
    color: #fff;
    font-weight: bold;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .card-content {
    height: 61vh;
    border: 0.5px solid rgb(94, 200, 221);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: rgba(204, 204, 204, 0.2);
    padding: 15px 15px;
    box-sizing: border-box;
  }

  .card-item {
    height: 10%;
    /*background-color: #6dd070;*/
    width: 100%;
    /*border-bottom: 0.5px solid white;*/
    color: white;
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

  .item-name-2:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .item-name {
    width: 85%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .item-name:hover{
    cursor: pointer;
    text-decoration: underline;
  }

  .item-heat {
    width: 31%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: right;
    /*text-align: right;*/
  }

  .view-more {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .card-more {
    background-color: rgba(255, 255, 255, 0.0);
    color: rgb(208, 208, 208);
    border: 0.5px solid rgba(0, 0, 0, 0.2);
  }
  .card-more:hover{
    background-color: rgba(255, 255, 255, 0.1);
  }

</style>
