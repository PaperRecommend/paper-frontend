<template>
  <el-container class="main">
    <el-header class="oasis-header">
      <HeaderBar></HeaderBar>
    </el-header>
    <el-main>
      <el-row :gutter="13">

        <el-col :span="17">
          <div class="basic-info">
            <basic-intro-card :intro="basicIntro"></basic-intro-card>
          </div>
        </el-col>
        <el-col :span="1"><div style="width: 100%;">&nbsp;</div></el-col>
        <el-col :span="7">
          <div class="basic-info">
            <basic-statistic-card :statistics="basicStatistic"></basic-statistic-card>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="13">
        <el-col :span="16">
          <div class="paper-title">Papers:</div>
          <essay-search-result-card v-for="(paper, index) in papers"
                                    v-bind:key="index"
                                    v-bind:id="paper.id"
                                    v-bind:title="paper.title"
                                    v-bind:authors="paper.authors"
                                    v-bind:conference="paper.venue"
                                    v-bind:year="paper.year.toString()"
                                    v-bind:times="paper.n_citation.toString()"
                                    v-bind:fields="paper.fos"
                                    v-bind:publisher="paper.publisher"
                                    v-bind:essayLink="paper.doi"
          >
          </essay-search-result-card>
        </el-col>

        <el-col :span="1">
          <div style="width: 100%;">&nbsp;</div>
        </el-col>

        <el-col :span="7">
          <div class="grid-content">
            <graph-card :graphInfo="graphInfos"></graph-card>
          </div>

          <div class="grid-content" style="margin-top: 25px;">
            <rank-card :rankData="rankData"></rank-card>
          </div>
        </el-col>

        <!--
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[1]"></graph-card>
        </div></el-col>
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[2]"></graph-card>
        </div></el-col>
        -->
      </el-row>
      <!--

      <el-row :gutter="15">
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[0]"></graph-card>
        </div></el-col>
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[1]"></graph-card>
        </div></el-col>
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[2]"></graph-card>
        </div></el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[3]"></graph-card>
        </div></el-col>
        <el-col :span="8"><div class="grid-content">
          <graph-card :graphInfo="graphInfos[4]"></graph-card>
        </div></el-col>
        <el-col :span="8"><div class="grid-content">
          <WordCard :data="wordData"></WordCard>
        </div></el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12"><div class="grid-content">
          <top-ranking-card :topRankingContent="topRankingContent[0]"></top-ranking-card>
        </div></el-col>
        <el-col :span="12"><div class="grid-content">
          <top-ranking-card :topRankingContent="topRankingContent[1]"></top-ranking-card>
        </div></el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="24"><div class="grid-content">
          <top-ranking-card :topRankingContent="topRankingContent[2]"
                            :pdfLink="true"></top-ranking-card>
        </div></el-col>
      </el-row>
      -->
    </el-main>
  </el-container>
</template>

<script>

    import BasicIntroCard from "../components/BasicIntroCard.vue";
    import BasicStatisticCard from "../components/BasicStatisticCard.vue";
    import GraphCard from "../components/GraphCard.vue";
    import TopRankingCard from "../components/TopRankingCard.vue";
    import WordCard from "../components/WordCard.vue";

    import {getRequest} from "../utils/request"
    import {getTrendInfo, getPapersForProfile} from "../utils/profileInfo"
    import essaySearchResultCard from "../components/EssaySearchResultCard"
    import HeaderBar from "../components/HeaderBar";
    import RankCard from "../components/RankCard";

    export default {
        name: "fieldProfile",
        components: {
            RankCard,
            HeaderBar,
            TopRankingCard,
            GraphCard,
            BasicStatisticCard,
            BasicIntroCard,
            WordCard,
            'basic-intro-card': BasicIntroCard,
            'Basic-statistic-card': BasicStatisticCard,
            'graph-card': GraphCard,
            'top-ranking-card': TopRankingCard,
            'essay-search-result-card': essaySearchResultCard,
        },

        mounted() {
            this.id = this.$route.query.id;
            console.log(this.id);
            this.getBasicInfo();
            // this.getTopRankingInfo();
            // getTrendInfo(this.graphInfos, this.id);
            // this.getWordCloud()
        },

        data() {
            return {
                activenessIcon: "el-icon-star-off",
                documentIcon: "el-icon-document",

                id: "5e8331bc982a43f4fd446b62",

                basicStatistic: [],
                basicIntro: {
                    name: "",
                    introduction: "",
                    details: [],
                },

                topRankingContent: [
                    {
                        type: "Authors",
                        router_type: "author",
                        startIndex: 1,
                        items: [],
                    },
                    {
                        type: "Affiliations",
                        router_type: "affiliation",
                        startIndex: 1,
                        items: [],
                    },
                    {
                        type: "Papers",
                        startIndex: 1,
                        items: [],
                    },
                ],

                graphInfos: {
                        type: "Papers",
                        chartData: {
                            columns: ['Year', 'Papers'],
                            rows: []
                        },
                    },
                papers:[],



                wordData: [],
                rankData: []
            }
        },

        methods: {
            getBasicInfo() {
                getRequest("/api/field/detail?id=" + this.id)
                    .then(res => {
                        console.log(res.data);
                        this.basicIntro.name = res.data.name;

                        this.basicStatistic.push(

                            {
                                icon: this.documentIcon,
                                type: "Papers",
                                value: res.data.paperCount
                            },
                            {
                                icon: this.documentIcon,
                                type: "Citation",
                                value: res.data.citationCount
                            },
                            {
                                icon: this.activenessIcon,
                                type: "Activity",
                                value: res.data.heat
                            },

                        );
                        this.rankData=res.data.authorDetail;
                        this.papers=res.data.paperDetail;
                        this.getTrendInfo(res.data.years)
                    });
            },
            getTrendInfo(data){
                for(let year in data){
                    this.graphInfos.chartData.rows.push({
                        "Year": parseInt(year),
                        "Papers": parseInt(data[year])
                    })
                }
                console.log(this.graphInfos.chartData.rows)
                // console.log(this.graphInfos.chartData);

            }

            // getTopRankingInfo() {
            //     getRequest("/api/author/list?refinement=field:" + this.id)
            //         .then(res => {
            //             res.data.forEach(item => {
            //                 this.topRankingContent[0].items.push({
            //                     name: item.authorName,
            //                     id: item.id,
            //                     values: [
            //                         {
            //                             type: "Activeness",
            //                             value: item.activeness,
            //                         },
            //                         {
            //                             type: "Papers",
            //                             value: item.paperCount,
            //                         },
            //                         {
            //                             type: "Citation",
            //                             value: item.citationCount,
            //                         },
            //                     ],
            //                 });
            //             });
            //         });
            //
            //     getRequest("/api/affiliation/list?refinement=field:" + this.id)
            //         .then(res => {
            //             res.data.forEach(item => {
            //                 this.topRankingContent[1].items.push({
            //                     name: item.affiliationName,
            //                     id: item.id,
            //                     values: [
            //                         {
            //                             type: "Activeness",
            //                             value: item.activeness,
            //                         },
            //                         {
            //                             type: "Papers",
            //                             value: item.paperCount,
            //                         },
            //                         {
            //                             type: "Citation",
            //                             value: item.citationCount,
            //                         },
            //                     ],
            //                 });
            //             });
            //         });
            //
            //     getPapersForProfile(this.topRankingContent[2], this.id);
            // },

            // getWordCloud() {
            //     getRequest("/api/graph/field/?id=" + this.id)
            //         .then(res => {
            //             this.wordData = res.data.nodes
            //         })
            // }
        },
    }
</script>

<style scoped>
  .main {
    color: white;
    /*height: 100%;*/
    overflow: auto
  }

  .oasis-header {
    padding: 0;
    height: 80px;
    width: 100%;
    margin-top: -10px;
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .basic-info, .grid-content {
    margin: 1% 1%;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .paper-title{
    text-align: left;
    font-size: 22px;
    font-weight: bold;
    padding-left: 32px;
    margin-bottom: 30px;
    font-style:italic;
    font-family: "Gloucester MT Extra Condensed","Harlow Solid Italic";
  }

</style>
