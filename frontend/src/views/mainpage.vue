<template>
  <div class="main">

    <div id="search">
      <HeaderBar></HeaderBar>
      <div class="overlay">
        <div class="o-content">
          <h1 class="title">
            PSARS
          </h1>
          <div id="tips">
            —— ——GET THE PAPER YOU WANT—— ——
          </div>
          <div class="bar">
            <SearchBar @paperSearch="search"></SearchBar>
          </div>
        </div>
      </div>
    </div>
    <Rank></Rank>
<!--    <RecommendPage></RecommendPage>-->
  </div>

</template>

<script>
    import SearchBar from "../components/Search"
    import bus from "../utils/bus"
    import TopRankingCard from "../components/TopRankingCard.vue";
    import Rank from "../components/Rank";
    import {getRequest} from "../utils/request"
    import HeaderBar from "../components/HeaderBar";
    import {getToken} from "../utils/auth";
    // import RecommendPage from "./RecommendPage";

    export default {
        name: 'MainPage',
        components: {
            // RecommendPage,
            HeaderBar,
            SearchBar,
            'top-ranking-card': TopRankingCard,
            Rank
        },
        data() {
            return {
                nav_list: ["Ranking", "TODO1", "TODO2"],
                current: 0,
                pic_one: true,
                pic_two: false,
                pic_three: false,
                search_val: "",
                tab_list: ["Author", "Publisher", "Conference", "Field"],
                entity: "Author",
                table_current: -1,
                topRanking: {
                    type: "",
                    router_type: "",
                    startIndex: 1,
                    items: []
                },
                viewMore: "",
                loading: true
            }
        },
        created() {
            // this.enterTable(0)
        },
        beforeDestroy() {
            var val = this.search_val;
            bus.$emit("fuzzySearch", val);
            this.getCollection();
        },

        methods: {
            enter(index) {
                this.current = index;
                if (index == 0) {
                    this.pic_one = true;
                    this.pic_two = false;
                    this.pic_three = false;
                } else if (index == 1) {
                    this.pic_two = true;
                    this.pic_three = false;
                    this.pic_one = false;
                } else {
                    this.pic_three = true;
                    this.pic_one = false;
                    this.pic_two = false;
                }
            },

            detail(index) {
                if (index == 0) {
                    console.log("jump to rank");
                    this.$router.push({path: "/ranking"});
                } else if (index === 1) {
                    console.log("jump to trend");
                    this.$router.push({path: "/trend"});
                }
            },

            enterTable(index) {
                if (this.table_current == -1 || index != this.table_current) {
                    this.table_current = index;
                    this.entity = this.tab_list[index];
                    this.viewMore = "/sort?type=" + this.tab_list[index].toLowerCase()
                    //loading
                    this.loading = true;
                    this.topRanking.items = []
                    //getData
                    getRequest("/api/" + this.tab_list[index].toLowerCase() + "/list")
                        .then(res => {
                            let data = res.data.data
                            let curName = this.tab_list[index].toLowerCase() + "Name"
                            let curTop = []
                            for (const item of data) {
                                curTop.push({
                                    name: (index == 2 ? "[" + item.year + "] " : "") + Object.getOwnPropertyDescriptor(item, curName).value,
                                    id: item.id,
                                    values: [
                                        {
                                            type: "Activeness",
                                            value: item.activeness,
                                        },
                                    ]
                                })
                            }
                            this.topRanking.items = curTop.slice(0, 10)
                            this.topRanking.router_type = this.tab_list[index].toLowerCase()
                            this.loading = false
                        })
                }

            },
            toSort(index) {
                this.$router.push({path: "/sort?type=" + this.tab_list[index].toLowerCase()})
            },

            search(value) {
                // console.log("value: ", value);
                this.search_val = value;
                // this.$nextTick(function() {
                //   bus.$emit("fuzzySearch", value);
                // })
                this.$router.push("result");
            },
            getCollection(){
                let uid=getToken("UID")
                getRequest("/user/get-user-collection?uid="+uid).then(res=>{
                    if(res.data.success){
                        let collection=[]
                        res.data.forEach(item=>{
                            collection.push(item.id)
                        })
                        localStorage.setItem("Collection",JSON.stringify(collection))
                    }
                })

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* 开屏 */
  .main {
    /* //position: relative;
    //color: white; */
    color: white;
    height: 100%;
    overflow: auto
  }

  .title {
    font-size: 70px;
    margin: 0 0 3px 0;
  }

  #tips {
    margin-bottom: 50px;
  }

  .bar {
    display: flex;
    justify-content: center;
  }

  .search-bar {
    width: 35%;
  }

  #search {
    position: relative;
    height: 100vh;
    min-height: 410px;
    /* background-image: url("../assets/mainpage/test.png"); */
    background-image: url("../assets/mainpage/2.jpg");
    /*background-image: url("../assets/mainpage/index.jpg");*/
    background-size: 100% 100%;

  }

  .overlay {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(79, 79, 79, 0.10);
  }

  .o-content {
    width: 100%;
  }

  /* 图片 */
  .link-content {
    width: 850px;
    height: 580px;
    vertical-align: top;
    background: #76797C;
    font-size: 0;
  }

  .link-content > * {
    opacity: 0.3;
    transition: all 0.6s;
  }

  .link-content #content-item-one {
    display: inline-block;
    width: 50%;
    height: 50%;
    /* background: pink; */
  }

  .link-content #content-item-two {
    display: inline-block;
    width: 50%;
    height: 50%;
    /* background: yellow; */
  }

  .link-content #content-item-three {
    width: 100%;
    height: 50%;
    /* background: white; */
  }

  .imgActive {
    transition: all 1s;
    opacity: 1;
    cursor: pointer;
  }

  /* .img-item {
    max-width: 100%;
    max-height: 100%;
  } */

  .img-item {
    width: 100%;
    height: 100%;
  }

  /* 图片-tab */
  .tab-list .tab-list-item {
    display: flex;
    justify-content: flex-start;
    padding: 20px 50px;
    margin: 50px 0;
  }


  .tab-list .tab-list-item a {
    font-size: 40px;
    color: #76797C;
    font-weight: bold;
    font-style: italic;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .tab-list .active {
    /* padding-left: 60px; */
    border-left: 3px solid #ffffff;
    transition-property: padding;
    transition-duration: 0.5s;
  }

  .tab-list .active:hover {
    padding-left: 70px;
  }

  .tab-list .active a {
    color: #fff;
  }

  #show li {
    list-style-type: none;
  }

  /* 表格 */

  .table-title {
    font-size: 3em;
    color: #fff;
    font-weight: bold;
    /* font-style: italic; */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 25px 0;
  }

  .tab-list .table-item {
    display: flex;
    justify-content: flex-start;
    padding: 15px 30px;
    margin: 45px 0;
  }

  /* .table-left{
    border-right: #fff 10px;
  } */
  .table-tab {
    margin-left: 13%
  }


  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .content-item {
    height: 100%;
  }

  .content-img {
    object-fit: fill;
    height: 100%;
    width: 100%;
  }

  .table-title {
    position: relative;
  }

  #top-more {
    font-size: 20px;
    color: aliceblue;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .shadow-card {
    box-shadow: none !important;
  }

</style>
