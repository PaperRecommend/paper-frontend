<template>
  <div>
    <HeaderBar></HeaderBar>
    <div id="overlay">
      <div id="o-content" class="content" style="margin-top: 30px;">
        <h1 class="title" @click="gotoMainpage">
          PSARS
        </h1>
        <search @paperSearch="commonSearch" :searchContent="searchCon.con"></search>
      </div>
    </div>
  </div>
</template>

<script>
    import HeaderBar from "../components/HeaderBar";
    import search from "../components/Search"
    import bus from "../utils/bus"
    export default {
        name: "my-header",
        components: {
            HeaderBar,
            "search": search,
        },
        data() {
            return {
                searchCon: Object
            }
        },

        beforeDestroy() {
            bus.$emit("fuzzySearch", this.searchCon);
        },

        methods: {
            commonSearch(value) {
                this.searchCon = value;
                this.$router.push("result");
            },
            gotoMainpage() {
                this.$router.push("mainpage");
            }
        }
    }
</script>

<style scoped>
  #overlay {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(79, 79, 79, 0.10);
  }

  .title {
    font-size: 50px;
    margin: 0 0 8px 0;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .content {
    color: #d7d7d7;
  }
</style>
