 <template>
	<div class="sort-list">
		<el-table :data="table_data" style="width: 100%;"
				  :default-sort = "{prop: 'paper_count', order: 'descending'}"
				  @row-click="clickItem">
			<el-table-column prop="name" label="name" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column v-for="(item, index) in list_title"
											 :key="index"
											 :prop="item"
											 :label="item">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	name: "SortList",

	props: ["list_title", "table_data_prop"],

	data() {
		return {
			table_data: this.table_data_prop
		}
	},

	watch: {
        "table_data_prop": function(val) {
            this.table_data = val;
        }
    },

	methods: {
		clickItem(row, event, column) {
			this.$emit("getProfile", {id: row.id});
		}
	}

}
</script>

<style>
/* .table-content .content-title {
  display: flex;
  justify-content: space-around;
  align-content: space-around;
}

.table-content .content-title .content-title-item {
  display: inline-block;
} */

.sort-list > .el-table {
	color: white;
}

.sort-list > .el-table, .el-table__expanded-cell {
	background: transparent;
}

.sort-list > .el-table th, .el-table tr {
	background: transparent;
}

/*.el-table tbody tr:hover > td {*/
/*	background-color: rgba(0, 0, 0, 0.0);*/
/*}*/
.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: rgba(0, 0, 0, 0.1) !important;
  cursor: pointer;
  /*background-color: rgba(0, 0, 0, 0.1);*/
}
.sort-list > .el-table thead {
	color: #ffffff;
}
</style>
