<template>
    <el-container class="main">
      <el-header id="header" style="height: 35vh;min-height: 270px; padding:0;">
        <HeaderBar></HeaderBar>
        <div id="overlay">
          <div id="o-content">
            <h1 class="title" @click="gotoMainpage">
              PSARS
            </h1>
            <search @paperSearch="commonSearch" :searchContent="search_content" :type="search_type"></search>
          </div>
        </div>
      </el-header>
        <el-row :gutter="20" style="margin:3% 2%;" id="content">
<!--          左边筛选栏-->
          <el-col :span="6" id="options">
            <div style="height:100px;">
              <side-bar
                v-bind:authorSummary = "summary_author"
                v-bind:publisherSummary="summary_publisher"
                v-bind:conferenceSummary="summary_conference"
                v-bind:termSummary="summary_term"
                @advancedSearch="handleAdvancedSearch"
                @searchWithin="processAdvancedSearch">

              </side-bar>
            </div>
          </el-col>
<!--          搜索结果条目-->
          <el-col :span="18">
            <div class="no-result-hint" v-if="!has_result">No result!</div>
<!--            搜索结果的条目-->
            <div class="result-card" v-loading="loading">
              <essay-search-result-card v-for="(result, index) in search_result"
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
                                        v-bind:keyword="search_query"
                                        v-bind:advanced_keywords="advanced_keywords">
              </essay-search-result-card>
            </div>
<!--            分页器-->
            <div class="page-pagination"
                 v-if="search_result != null && search_result.length > 0">
              <my-pagination :search_page_number="search_page_number"
                             :current_page="current_page"
                             :page_size="page_size"
                             @page-change="getNextPage">
              </my-pagination>
            </div>
          </el-col>
        </el-row>
    </el-container>
</template>

<script>
  import essaySearchResultCard from "../components/EssaySearchResultCard"
  import sideBar from "../components/SideBar"
  import search from "../components/Search"
  import pagination from "../components/Pagination"
  import {getRequest} from "../utils/request.js"
  import bus from "../utils/bus"
  import HeaderBar from "../components/HeaderBar";


export default {
  name: 'SearchRes',
  components: {
      HeaderBar,
    'essay-search-result-card': essaySearchResultCard,
    'side-bar': sideBar,
    'search': search,
    'my-pagination': pagination,
  },

  created() {
    var _this = this;
    bus.$on("fuzzySearch", data => {
      _this.search_type = data.type;
      _this.search_query = data.con;
      _this.search_content = data.con;
      _this.search_query = _this.convertSpecialChar(_this.search_query);
    })
  },

  mounted() {
    this.getFuzzySearchResult();
  },

  beforeDestroy() {
    bus.$off("fuzzySearch");
  },

  data () {
    return {
      loading: true,

      search_query: "",
      search_content:"",
      search_type: "",

      search_within_query: "",
      search_within_type: "",
      search_within_arguments: "",//refinements=year:2012_2022&refinements=author:zrg&refinements=conference:acm...

      is_search_within: false,

      search_result: null,
      has_result: true,
      search_publisher: "",

      summary_term: [],
      summary_author: [],
      summary_conference: [],
      summary_publisher: [],

      current_page: 0,
      page_size: 10,
      search_page_number: 100,

      advanced_query: null,

      advanced_keywords: [],

    }
  },

  methods:{
    gotoMainpage(){
      this.$router.push({path: "/mainpage"});
    },

    commonSearch(val) {
      this.search_type = val.type;
      this.search_content=val.con;
      this.search_query = val.con;
      this.search_query = this.convertSpecialChar(this.search_query);
      this.getFuzzySearchResult();
    },

    handleAdvancedSearch(val) {
      this.search_within_type = val.type;
      this.search_within_query = val.con;
    },

    processAdvancedSearch(val) {
      this.advanced_query = val;

      this.is_search_within = true;
      this.search_within_arguments = "";
      this.advanced_keywords = [];

       var str_arguments = "";

      if(this.advanced_query.conference.length > 0) {
        this.advanced_query.conference.split(";").forEach(item => {
          if(item.length > 0) {
            str_arguments += "refinements=conference:" + item + ";";
            this.advanced_keywords.push(item);
          }
        });
      }
      if(this.advanced_query.term.length > 0) {
        this.advanced_query.term.split(";").forEach(item => {
          if(item.length > 0) {
            str_arguments += "refinements=term:" + item + ";";
            this.advanced_keywords.push(item);
          }
        });
      }
      if(this.advanced_query.author.length > 0) {
        this.advanced_query.author.split(";").forEach(item => {
          if(item.length > 0) {
            str_arguments += "refinements=author:" + item + ";";
            this.advanced_keywords.push(item);
          }
        });
      }
      if(this.advanced_query.year.length > 0) {
        this.advanced_query.year.split(";").forEach(item => {
          if(item.length > 0) {
            str_arguments += "refinements=year:" + item + ";";
            this.advanced_keywords.push(item.split("_")[0]);
            this.advanced_keywords.push(item.split("_")[1]);
          }
        });
      }
      if(this.advanced_query.publisher.length > 0){
        this.advanced_query.publisher.split(";").forEach(item => {
          if(item.length > 0) {
            str_arguments += "refinements=publisher:" + item + ";";
            this.advanced_keywords.push(item);
          }
        });
      }
      this.search_within_arguments = str_arguments.trim().split(";")
        .join("&").substring(0, str_arguments.length - 1);

      if(this.search_within_arguments.length == 0){
        this.getFuzzySearchResult();
      }
      else {
        this.getAdvancedSearchResult();
      }
    },

    //获得模糊匹配的结果
    getFuzzySearchResult(){
      this.loading = true;

      this.is_search_within = false;
      this.search_result = null;
      this.current_page = 0;

      this.advanced_keywords = [];

      getRequest("/api/query/paper/list?query=" + this.search_query + "&returnFacets=" + this.search_type)
        .then(res=>{
            console.log(res.data);
            let collection=new Set(JSON.parse(localStorage.getItem("Collection")))
            res.data.papers.forEach(item=>{
                item["isCollect"]=collection.has(item.id)
            })
          this.search_result = res.data.papers;
          this.search_page_number = res.data.itemCount;

          this.loading = false;

          if(this.search_result.length > 0) {
            this.getSummary();
            this.has_result = true;
          }
          else {
            this.has_result = false;
            this.summary_author = [];
            this.summary_publisher = [];
            this.summary_conference = [];
            this.summary_term = [];
          }
        });
    },


    // 获得左边筛选栏的摘要
    getSummary() {
      getRequest("/api/query/paper/summary").then(res=>{
        this.summary_term = this.getValidItemsForSideBar(res.data.term);
        this.summary_author = this.getValidItemsForSideBar(res.data.author);
        this.summary_conference = this.getValidItemsForSideBar(res.data.conference);
        this.summary_publisher = this.getValidItemsForSideBar(res.data.publisher);
      });
    },
    //进一步筛选
    getAdvancedSearchResult() {
      this.loading = true;

      this.is_search_within = true;
      this.current_page = 0;
      this.search_result = null;

      this.search_within_arguments = this.convertSpecialChar(this.search_within_arguments);

      getRequest("/api/query/paper/refine?" + this.search_within_arguments).then(res => {
        this.search_result = res.data.papers;
        this.search_page_number = res.data.itemCount;

        this.loading = false;

        if(this.search_result.length> 0) {
          this.has_result = true;
        }
        else {
          this.has_result = false;
        }
      });
    },

    getNextPage(updatedPage) {
      this.current_page = updatedPage;
      this.loading = true;
      this.search_result = null;
      if(!this.is_search_within) {
        getRequest("/api/query/paper/list?query=" + this.search_query +
          "&returnFacets=" + this.search_type +
          "&pageNum=" + this.current_page)
          .then(res => {
            this.search_result = res.data.papers;
            this.loading = false;
          })
      }
      else {
        getRequest("/api/query/paper/refine?" + this.search_within_arguments +
        "&pageNum=" + this.current_page).then(res => {
          this.search_result = res.data.papers;
          this.loading = false;
        });
      }
    },

    // 得到有效的可供筛选的内容
    getValidItemsForSideBar(items) {
      return items.filter(item => {
        return item.first.length > 0 && item.first != "NA"
          && item.first != " NA";
      });
    },

    // convert blank space to %20
    convertSpecialChar(input) {
      return input.split(" ").join("%20").split(",").join("%2C");
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main{
  color:white;
  height: 100%;
  overflow: auto
}

.title {
  font-size: 50px;
  margin: 0 0 8px 0;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 30px;
}

#header{
  position: relative;
  background-image: url("../assets/mainpage/2.jpg");
  background-size: cover;

}
#overlay{
  position: absolute;
  top: 0;
  display:flex;
  justify-content:center;
  align-items:center;
  height: 100%;
  width: 100%;
  background-color:rgba(79,79,79,0.10);
}

.result-card {
  display: block;

}

.page-pagination{
  display: block;
  text-align: right;
}
</style>
