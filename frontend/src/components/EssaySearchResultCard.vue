<template>
  <div class="result">
    <div class="title">
      <a v-bind:href="['https://doi.org/'+essayLink]" target="_blank"
         v-track="{triggerType:'click',currentUrl: $route.path,paperId:id,paperTitle:title}">
        <template>
          <span v-html="brightenKeyword(title)"></span>
        </template>
      </a>
      <div class="collect">
        <i class="icon-collect iconfont icon-heart" v-if="!isCollect" @click="collect()"></i>
        <i class="icon-cancel-collect iconfont icon-heart-2" v-else @click="collect()"></i>
      </div>
    </div>
    <div class="content">
      <div id="author"><span class="sub-title">Authors: </span>
        <template v-for="(author, index) in authors">
        <span class="profile-entity"
              v-html="brightenKeyword(author.name)"
              @click="jumpToProfile('author', author.id)"></span>
          <span>; </span>
        </template>
      </div>
      <div><span class="sub-title">Conference: </span>
        <template>
          <span class="profile-entity"
                v-html="brightenKeyword(conference.raw)"
                @click="jumpToProfile('conference', conference.id)"></span>
        </template>
      </div>
      <div><span class="sub-title">Year: </span>{{year}} | Conference Paper
      </div>
      <div><span class="sub-title">Publisher: </span>
        <template>
           <span class="profile-entity"
                 v-html="brightenKeyword(publisher)"></span>
          <!--          <span class="profile-entity"-->
          <!--                v-html="brightenKeyword(affiliation.affiliationName)"-->
          <!--                @click="jumpToProfile('affiliation', affiliation.id)" ></span>-->
          <!--          <span>; </span>-->
        </template>
      </div>
      <div><span class="sub-title">Cited by: </span>Papers ({{times}})
      </div>
      <div><span class="sub-title sub-title-terms"
                 @click="toggleShowAllTerms">Fields:</span>
        <template v-for="(field, index) in fields">
          <span class="profile-entity"
                v-html="brightenKeyword(field.name)"
                @click="jumpToProfile('field', field.name)"></span>
          <span>; </span>
        </template>
      </div>
    </div>

  </div>

</template>

<script>
    import {jump2Profile} from "../utils/profileInfo";
    import {postRequest} from "../utils/request";
    import {getToken} from "../utils/auth";
    import {Message} from "element-ui"

    export default {
        name: "essay-search-result-card",
        props: {
            id: Number,
            title: String,
            authors: Array,
            conference: Object,
            year: String,
            times: String,
            essayLink: String,
            fields: Array,
            publisher: String,
            isCollect: {
                type: Boolean,
                default: false
            },
            keyword: String,
            advanced_keywords: Array,
        },


        data() {
            return {
                showAllTerms: false,

                hasAddedKeyword: false,

            };
        },

        methods: {
            toggleShowAllTerms() {
                this.showAllTerms = !this.showAllTerms;
            },

            brightenKeyword(val) {
                var result = [];
                let keyword_list=[];
                let advanced_keyword_list=[];
                if (this.keyword != null) {
                    keyword_list=this.keyword.split("%20");
                }
                if(this.advanced_keywords!=null&&this.advanced_keywords!=[]){
                    advanced_keyword_list=this.advanced_keywords
                }
                result = this.brightenKeywordList(val, keyword_list);
                result = this.brightenKeywordList(result, advanced_keyword_list);
                return result;
            },

            brightenKeywordList(val, keywords_list) {
                var result = val;

                keywords_list.forEach(keyword => {
                    const Reg = new RegExp(keyword, 'gi');
                    if (result) {
                        result = result.replace(Reg, '<span style="font-style:oblique;font-weight: bolder;' +
                            ' color: white">' + keyword + '</span>');
                    }
                });
                return result;
            },

            jumpToProfile(type, id) {
                jump2Profile(this.$router, type, id);
            },
            collect(){
                console.log(getToken("UID"));
                this.isCollect=!this.isCollect;
                let params={
                    uid: parseInt(getToken("UID")),
                    paperId: this.id,
                    // paperTitle: this.title
                }
                console.log(params)
                if(this.isCollect){
                    postRequest("/user/collection?uid="+params.uid+"&paperId="+params.paperId).then(res=>{
                        if(res.data.success){
                            Message.success("收藏成功")

                        }else{
                            Message.error("收藏失败")
                            this.isCollect=!this.isCollect;
                        }
                    })
                }else {
                    postRequest("/user/cancel-collection?uid="+params.uid+"&paperId="+params.paperId).then(res=>{
                        if(res.data.success){
                            Message.success("成功取消收藏")

                        }else{
                            Message.error("取消收藏收藏失败")
                            this.isCollect=!this.isCollect;
                        }
                    })

                }
            }
        },
    }
</script>

<style scoped>
  .result {
    font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
    color: #faffff;
    text-align: left;
    margin: 0 3% 3% 3%;
  }

  .highlighted {
    /*background-color: rgba(255,255,255,0.5);*/
    color: white;

  }

  .title {
    font-size: large;
    font-weight: normal;
    margin-bottom: 1%;
  }

  .sub-title {
    font-weight: bold;
  }

  .sub-title-terms {
    cursor: pointer;

  }

  .sub-title-terms:hover {
    text-decoration: underline;
  }

  a {
    color: #faffff;
    text-decoration: transparent;
  }

  a:hover {
    text-decoration: underline;
  }

  .content {
    color: #d7d7d7;
  }

  .collect{
    position: relative;
    /*float: right;*/
    /*margin-top: -90px;*/
    /*margin-right: 30px;*/
    display: inline-block;
    margin-left: 5px;
    margin-top: 2px;
  }
  .icon-collect{
    font-size: 15px;
  }
  .icon-cancel-collect{
    color: #ff0f51;
    font-size: 15px;
  }

  /*.profile-entity:hover {*/
  /*  cursor: pointer;*/
  /*  text-decoration: underline;*/
  /*}*/
</style>
