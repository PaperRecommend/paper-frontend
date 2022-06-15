<template>
  <el-container class="main">
    <el-header class="oasis-header">
      <HeaderBar></HeaderBar>
    </el-header>
    <el-main class="container-main">
      <el-row :gutter="13">

        <el-col :span="17">
          <div class="basic-info">
            <basic-intro-card :intro="basicIntro"></basic-intro-card>
          </div>
        </el-col>
        <el-col :span="1">
          <div style="width: 100%;">&nbsp;</div>
        </el-col>
        <el-col :span="7">
          <div class="basic-info">
            <basic-statistic-card :statistics="basicStatistic"></basic-statistic-card>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
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
                                    v-bind:isCollect="paper.isCollect"
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
            <pie-chart-card :chartData="pieChartData"></pie-chart-card>
          </div>
          <div class="grid-content" style="margin-top: 25px;">
            <NodeCard :nodes="nodeInfo.nodes"
                      :links="nodeInfo.links"
                      type="author"></NodeCard>
          </div>
        </el-col>


      </el-row>

    </el-main>
  </el-container>
</template>

<script>
    import BasicIntroCard from "../components/BasicIntroCard.vue";
    import BasicStatisticCard from "../components/BasicStatisticCard.vue";
    import GraphCard from "../components/GraphCard.vue";
    // import TopRankingCard from "../components/TopRankingCard.vue";
    import NodeCard from "../components/NodeCard"
    import PieChartCard from "../components/PieChartCard"

    import {getRequest} from "../utils/request"
    import {getTrendInfo, getPapersForProfile, getPieChartData} from "../utils/profileInfo"
    import essaySearchResultCard from "../components/EssaySearchResultCard"
    import HeaderBar from "../components/HeaderBar";

    export default {
        name: "authorProfile",
        components: {
            HeaderBar,
            // TopRankingCard,
            GraphCard,
            BasicStatisticCard,
            BasicIntroCard,
            NodeCard,
            'basic-intro-card': BasicIntroCard,
            'Basic-statistic-card': BasicStatisticCard,
            'graph-card': GraphCard,
            // 'top-ranking-card': TopRankingCard,
            'pie-chart-card': PieChartCard,
            'essay-search-result-card': essaySearchResultCard,
        },
        created(){
            this.loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255,255,255, 0.7)'
            });
        },

        mounted() {
            this.id = this.$route.query.id;
            // this.loading=true;

            this.getBasicInfo();




            // this.authorloading = false;
            // getTrendInfo(this.graphInfos, this.id);
            // this.getTopRankingInfo();
            // this.getNodeInfo();
            // getPieChartData(this.pieChartData, this.id);
        },

        data() {
            return {
                activenessIcon: "el-icon-star-off",
                documentIcon: "el-icon-document",

                id: "37085783283",

                basicStatistic: [],
                basicIntro: {
                    name: "",
                    introduction: "",
                    details: [],
                },

                // topRankingContent: [
                //     {
                //         type: "Papers",
                //         startIndex: 1,
                //         items: [],
                //     },
                // ],

                graphInfos: {
                    type: "Papers",
                    chartData: {
                        columns: ['Year', 'Papers'],
                        rows: []
                    },
                },

                nodeInfo: {
                    nodes: [],
                    links: []
                },

                pieChartData: {
                    columns: ['Fields', 'Proportion'],
                    rows: [],
                },
                papers: [],
                loading:null

            }
        },

        methods: {
            getBasicInfo() {
                getRequest("/api/author/detail?id=" + this.id)
                    .then(res => {
                        this.basicIntro.name = res.data.name;
                        // this.basicIntro.introduction = res.data.bioParagraphs;
                        this.basicIntro.details.push({
                            type: "Affiliation",
                            value: res.data.org,
                        });

                        this.basicStatistic.push(
                            // {
                            //   icon: this.activenessIcon,
                            //   type: "Activeness",
                            //   value: res.data.activeness
                            // },
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
                            {
                                icon: this.documentIcon,
                                type: "H-index",
                                value: res.data.h_index
                            },
                            {
                                icon: this.documentIcon,
                                type: "CitedRate",
                                value: res.data.cited_rate.toFixed(1)
                            },
                        );

                        let collection = new Set(JSON.parse(localStorage.getItem("Collection")))
                        res.data.paperDetail.forEach(item => {
                            item["isCollect"] = collection.has(item.id)
                        })
                        this.papers = res.data.paperDetail;
                        this.getNodeInfo(res.data.id, res.data.name, res.data.coauthors)
                        getPieChartData(res.data.fields, this.pieChartData)
                        // console.log(this.pieChartData)

                        this.getTrendInfo(res.data.years);
                        this.loading.close();

                    });
            },

            getTopRankingInfo() {
                getPapersForProfile(this.topRankingContent[0], this.id);
            },

            getNodeInfo(centerId, centerName, coauthors) {
                let nodes = []
                let links = []
                let center = {
                    id: centerId,
                    name: centerName
                }
                if (coauthors.length > 15) {
                    coauthors.sort(function (a, b) {
                        return b.count - a.count
                    })
                    coauthors = coauthors.slice(0, 15)
                }
                // nodes.push(center)
                coauthors.forEach((item) => {
                    let node = {
                        id: item.id,
                        name: item.name,
                        count: item.count,
                        symbolSize: 13
                    }
                    nodes.push(node)
                    let link = {
                        begin: centerId,
                        end: item.id,
                        value: item.count
                    }
                    links.push(link)
                  })
                nodes[nodes.findIndex(n => n.id == centerId)].symbolSize = 16
                this.nodeInfo.links = links;
                this.nodeInfo.nodes = nodes;


            },

            getTrendInfo(data) {
                for (let year in data) {
                    this.graphInfos.chartData.rows.push({
                        "Year": year,
                        "Papers": parseInt(data[year])
                    })
                }
                // console.log(this.graphInfos.chartData);

            }
        },
    }
</script>

<style scoped>
  .main {
    color: white;
    /*height: 100%;*/
    overflow: auto;


  }

  .container-main {
    padding: auto auto;
  }

  .oasis-header {
    padding: 0;
    height: 80px;
    width: 100%;
    margin-top: -10px;
    /*background-color: #20a0ff;*/
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
    margin: 1%;

  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .paper-title {
    text-align: left;
    font-size: 22px;
    font-weight: bold;
    padding-left: 32px;
    margin-bottom: 30px;
    font-style: italic;
    font-family: "Gloucester MT Extra Condensed", "Harlow Solid Italic";
  }

</style>
