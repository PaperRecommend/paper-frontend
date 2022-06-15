<template>
  <el-container class="main">
    <el-header id="header" style="height: 35vh;min-height: 270px; padding:0;">
      <MyHeader></MyHeader>
    </el-header>
    <el-row :gutter="20" style="margin:3% 2%;">
      <el-col :span="3">
        <div style="width: 100%;">&nbsp;</div>
      </el-col>
      <el-col :span="18">
        <div class="no-result-hint" v-if="!has_result">No recommendation!</div>
        <!--            搜索结果的条目-->&nbsp;
        <div class="result-card" v-loading="loading">
          <essay-search-result-card v-for="(result, index) in recommendations"
                                    v-bind:key="index"
                                    v-bind:id="result.id"
                                    v-bind:title="result.title"
                                    v-bind:authors="result.authors"
                                    v-bind:conference="result.venue"
                                    v-bind:year="result.year.toString()"
                                    v-bind:times="result.n_citation.toString()"
                                    v-bind:fields="result.fos"
                                    v-bind:publisher="result.publisher"
                                    v-bind:essayLink="result.doi"
                                    v-bind:isCollect="result.isCollect"
          >
          </essay-search-result-card>
        </div>
      </el-col>

      <el-col :span="2">
        <div style="width: 100%;margin-top: 20px;">
          <el-button icon="el-icon-refresh" size="small" @click="changeRecommend" :loading="changeLoading">换一批
          </el-button>
        </div>
      </el-col>
      <el-col :span="1">
        <div style="width: 100%;">&nbsp;</div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
    import essaySearchResultCard from "../components/EssaySearchResultCard"

    // import pagination from "../components/Pagination"
    import {getRequest} from "../utils/request.js";
    import bus from "../utils/bus"
    import {Message} from "element-ui"
    import {getToken} from "../utils/auth";
    import MyHeader from "../components/Header";

    export default {
        name: "Recommend",
        components: {
            MyHeader,

            'essay-search-result-card': essaySearchResultCard,
            // 'my-pagination': pagination,

        },
        data() {
            return {
                loading: false,
                has_result: false,
                recommendations: null,
                page_size: 15,
                current_page: 0,
                search_page_number: 100,
                searchCon: Object,
                changeLoading: false


            }
        },
        mounted() {
            //获得推荐
            this.loading = true;
            this.getRecommendation();
            this.loading = false;
        },
        methods: {
            getRecommendation() {
                let uid = getToken("UID");
                let size=15
                getRequest("/api/recommend/paper-recommend/mixed?uid=" + uid+"&size="+size)
                    .then(res => {

                        let collection = new Set(JSON.parse(localStorage.getItem("Collection")))
                        res.data.forEach(item => {
                            item["isCollect"] = collection.has(item.id)
                        });
                        this.has_result=true;
                        this.recommendations = res.data;

                    });
            },
            changeRecommend() {
                let uid = getToken("UID");
                let size=15;
                this.changeLoading = true;
                getRequest("/api/recommend/paper-recommend/mixed?uid=" + uid+"&size="+size)
                    .then(res => {

                        let collection = new Set(JSON.parse(localStorage.getItem("Collection")))
                        res.data.forEach(item => {
                            item["isCollect"] = collection.has(item.id)
                        });
                        this.has_result=true;
                        this.recommendations = res.data;
                        this.changeLoading = false;
                    });
            }
        }
    }
</script>

<style scoped>
  .main {
    color: white;
    height: 100%;
    overflow: auto;
  }

  #header {
    position: relative;

    background-image: url("../assets/mainpage/2.jpg");
    background-size: 100% 100%;
  }

  .page-pagination {
    display: block;
    text-align: right;
  }
  .result-card{
    width: 100%;
    /*height: 100%;*/
  }

  .change-button {
    width: 80%;
  }

</style>
