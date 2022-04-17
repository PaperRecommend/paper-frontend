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
        <!--            搜索结果的条目-->
        <div class="result-card" v-loading="loading">
          <essay-search-result-card v-for="(result, index) in collections"
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
        <!--            分页器-->
        <div class="page-pagination"
             v-if="collections != null && collections.length > 0">
          <my-pagination :search_page_number="search_page_number"
                         :current_page="current_page"
                         :page_size="page_size"
          >
          </my-pagination>
        </div>
      </el-col>
      <el-col :span="3">
        <div style="width: 100%;">&nbsp;</div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
    import essaySearchResultCard from "../components/EssaySearchResultCard"

    import pagination from "../components/Pagination"
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
            'my-pagination': pagination,

        },
        data() {
            return {
                loading: false,
                has_result: false,
                collections: null,
                page_size: 10,
                current_page: 0,
                search_page_number: 100,
                searchCon: Object


            }
        },
        mounted() {
            //获得推荐
            this.getRecommendation();

        },
        methods: {
            getRecommendation(){
                let uid=getToken("UID")
                getRequest("/api/recommend/paper-recommend/user_top?uid="+uid)
                    .then(res => {


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
  #header{
    position: relative;

    background-image: url("../assets/mainpage/2.jpg");
    background-size: 100% 100%;
  }

  .page-pagination {
    display: block;
    text-align: right;
  }

</style>
