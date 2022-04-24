<template>
  <el-container class="main">
    <el-header id="header" style="height: 35vh;min-height: 270px; padding:0;">
      <MyHeader></MyHeader>
    </el-header>

    <el-row class="main-content"
x>
      <!--      <el-col :span="5" v-if="sort_type == 'author'" class="field-filter-bar">-->
      <!--        &lt;!&ndash; <div class="field-filter" style="height: 500px;"></div> &ndash;&gt;-->
      <!--        <filter-bar :author_fields="author_fields" @filterField="searchByField"></filter-bar>-->
      <!--      </el-col>-->
      <el-col class="sort-table" :span="span_len" :offset="2" >
        <div class="sort-table-title">
          All {{ sort_type }}s
        </div>
        <sort-list :list_title="sort_title"
                   :table_data_prop="table_data"
                   v-loading="shouldLoad"
                   element-loading-background="rgba(0, 0, 0, 0.3)"
                   @getProfile="jumpToProfile">
        </sort-list>
      </el-col>
    </el-row>

    <el-row class="page-footer" v-if="not_field_filter&&!shouldLoad">
      <pagination :search_page_number="search_page_number"
                  :current_page="current_page"
                  :page_size="page_size"
                  @page-change="getNextPage">
      </pagination>
    </el-row>


  </el-container>
</template>

<script>

    import sort_list from "../components/SortList"
    import filter_bar from "../components/FilterBar"
    import pagination from "../components/Pagination"

    import {getRequest} from "../utils/request"
    import {jump2Profile} from "../utils/profileInfo";
    import bus from "../utils/bus"
    import MyHeader from "../components/Header";

    export default {
        name: "sort",

        components: {
            MyHeader,
            "sort-list": sort_list,
            "filter-bar": filter_bar,
            "pagination": pagination,

        },

        data() {
            return {
                sort_title: [],
                sort_type: "",
                table_data: [],
                field_affi_title: [["paperCount","Paper Count"],["citationCount","Citation Count"] , ["heat","Heat"]],
                conf_title: [["paperCount","Paper Count"],["citationCount","Citation Count"] , ["heat","Heat"]],
                author_title: [["paperCount","Paper Count"],["citationCount","Citation Count"] , ["heat","Heat"], ["h_index","H-index"], ["cited_rate","CitedRate"]],
                span_len: 22,
                // author_fields: ["Software Engineering", "Artificial Intelligence", "Computer Network"],
                author_fields: [],
                origin_data: [],
                field_summary: [],
                shouldLoad: true,
                not_field_filter: true,
                search_page_number: 20,
                current_page: 0,
                page_size: 20,

            }
        },

        mounted() {
            this.sort_type = this.$route.query.type;

            if (this.sort_type === "author") {
                this.sort_title = this.author_title;
                // this.span_len = 17;
            } else if (this.sort_type === "conference") {
                this.sort_title = this.conf_title;
            } else {
                this.sort_title = this.field_affi_title;
            }

            this.getList();

            // if (this.sort_type === "author") {
            //   this.getAuthorFieldSummary();
            // }
        },

        methods: {

            getList() {
                // /api/field/list
                console.log("curNum", this.current_page)
                var url = "/api/" + this.sort_type + "/list?pageNum=" + this.current_page + "&" + "pageSize=" + this.page_size;
                var _this = this;
                getRequest(url)
                    .then(res => {
                        // console.log(res);
                        _this.handleTableData(res.data);
                        _this.search_page_number = 100;
                        _this.shouldLoad = false;
                        _this.not_field_filter = true;

                    })
                    .catch(err => {
                        console.log(err);
                    })
            },

            // getFieldName(data) {
            //     var field = [];
            //
            //     data.forEach(item => {
            //         field.push(item.fieldName);
            //     });
            //
            //     return field;
            // },

            handleTableData(rawData) {
                if (this.sort_type === "author") {
                    rawData.forEach(element => {

                        element.cited_rate = Math.round(element.cited_rate * 100) / 100;
                        delete element.fields;
                        delete element.years;
                        delete element.org;
                        delete element.papers;
                        delete element.coauthors;
                    })
                } else {
                    var type = this.sort_type;
                    rawData.forEach(element => {
                        element.heat = Math.round(element.heat * 100) / 100;
                        if (type === "conference") {
                            element.name = element.raw;
                        } else {
                            element.name = element.name;
                        }
                    })
                }

                this.origin_data = rawData;
                this.table_data = rawData;
            },

            jumpToProfile(val) {
                jump2Profile(this.$router, this.sort_type, val.id);
            },

            searchByField(data) {
                var checkedField = data.checked;
                this.shouldLoad = true;

                // 如果没有checked的内容，返回全部
                if (checkedField.length == 0) {
                    this.getList();
                    return;
                }

                // 有checked
                // 1. 对空格进行转义
                // 2. 请求
                this.not_field_filter = false;
                var requestField = ""
                checkedField.forEach(item => {
                    item.replace(/\s+/g, "%20");
                    requestField += ("fieldName=" + item + "&");
                });

                var url = "/api/author/list/refine?" + requestField.substring(0, requestField.length - 1);
                var _this = this;
                getRequest(url)
                    .then(res => {
                        _this.handleTableData(res.data);
                        _this.shouldLoad = false;
                    })
                    .catch(err => {
                        console.log(err);
                    })

            },

            getNextPage(updatedPage) {
                var _this = this;
                _this.current_page = updatedPage;
                var url = "/api/" + _this.sort_type + "/list?pageNum=" + _this.current_page + "&pageSize=" + this.page_size;
                getRequest(url)
                    .then(res => {
                        _this.handleTableData(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },

        }
    }
</script>

<style>
  .main {
    color: white;
    height: 100%;
    overflow: auto
  }

  #header {
    position: relative;

    background-image: url("../assets/mainpage/2.jpg");
    background-size: 100% auto;
  }


  .main-content {
    font-size: 0;
  }

  /* .main-content > .field-filter {
    width: 100%;
    height: 500px;
    background: rosybrown;
  } */

  .main-content > .field-filter-bar {
    /* margin-top: 80px; */
    padding: 0 80px;
  }

  .sort-table {
    /* background: rgba(255, 255, 255, .3); */
    height: 100%;
    /* margin: 45px 180px; */
    padding-right: 100px;
  }

  .sort-table .sort-table-title {
    font-size: 30px;
    font-weight: bold;
    margin: 40px 0 30px 0;
  }

  /* .table-content .content-title {
    display: flex;
    justify-content: space-around;
    align-content: space-around;
  }

  .table-content .content-title .content-title-item {
    display: inline-block;
  } */

  .filter-input {
    width: 450px;
  }

  .el-input__inner {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2em 0 0 2em;
    border-right: 0;
    /* border-color: transparent; */
  }

  .el-input__inner:focus {
    border-color: rgba(255, 255, 255, 0.5);
  }

  .el-input-group__append, .el-input-group__prepend {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0 2em 2em 0;
  }

  .content > [class*=" el-icon-"], [class^=el-icon-] {
    color: black;
  }

  .page-footer {
    display: block;
    text-align: center;
    margin: 40px 0;
  }
</style>
