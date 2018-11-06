<!-- 课调监控页面 -->
<template>
    <div class="sMonitor">
        <div class="optionDiv">
	    	<el-input v-model="search" placeholder="请输入讲师名字" suffix-icon="el-icon-search"></el-input>
        </div>
        <div class="tableDiv">
			<el-table  ref="multipleTable" :data="surveyMonitorsList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="360px">
               <el-table-column type="selection" width="55" align="center">
               </el-table-column>
               <el-table-column  prop="clazzVM.name"  label="班级" align="center"  width="100">
               </el-table-column>
               <el-table-column  prop="course.name"  label="课程" align="center"  width="100">
               </el-table-column>
               <el-table-column  prop="qnVM.name"  label="问卷" align="center"  width="150">
               </el-table-column>
               <el-table-column  prop="user.name"  label="讲师" align="center"  width="150">
               </el-table-column>
               <el-table-column  prop="surveydate"  label="课调时间" align="center"  width="200">
               </el-table-column>
               <el-table-column  prop="code" label="课调编号" align="center" width="100">
               </el-table-column>
               <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
				    	 <div v-if="scope.row.status == '开启'" class="containBtn">
				    	 	<el-button size="mini" type="success"
				           		@click="handleOpen(scope.$index, scope.row)" :disabled="true">开启</el-button>
				    	 </div>
				    	 <div v-else class="containBtn">
				    	 	<el-button size="mini" type="success"
				           		@click="handleOpen(scope.$index, scope.row)">开启</el-button>
				    	 </div>
				        <el-button size="mini" type="info"
				          @click="handleCheck(scope.$index, scope.row)">查看进度</el-button>
				        <el-button size="mini" type="danger"
				          @click="handleOver(scope.$index, scope.row)"> 结束</el-button>
				    </template>
               </el-table-column>
            </el-table> 
	    </div>

	    <el-dialog title="课调进度" :visible.sync="formVisible" class="progressStyle">
	    	<el-progress type="circle" :percentage="80"></el-progress>
	    	<div slot="footer" class="dialog-footer">
   				<el-button @click="formVisible = false">取 消</el-button>
			</div>
	    </el-dialog>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
          search: "",
	      formVisible: false,
	      formLabelWidth: "80px",
    }
  },
    created() {
	  	this.findAllMonitors();
	},
	computed: {
	    ...mapGetters(['monitors']),
	    surveyMonitorsList() {
       	    const that = this;
			return this.monitors.filter(function(item){
				if(item.user.name){
					return item.user.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
	    },   
    },
    methods: {
	  	...mapActions(['findAllMonitors','closeCurrentMonitor','findThisStatus']),	
	  	//开启
	  	handleOpen(index,row) {
	  		const that = this;
            this.findThisStatus({id:row.id})
                .then(function(param){
                	if(param.status == 200) {
             	     	that.$message({
      			           	title: '成功',
      			           	message: '成功开启课调',
      			           	type: 'success'
			        	});
			        	that.findAllMonitors();
             		}
             		else{
             			that.$message.error({
      			           	title: '失败',
      			           	message: '课调开启失败'
			        	});
             		}
                })
	  	},
	  	//查看进度
	  	handleCheck(index,row) {
	  		console.log(row.id);
	  		this.formVisible = true;
	  	},
	  	//结束
	  	handleOver(index,row) {
       	    const that = this;
       	    this.closeCurrentMonitor({id:row.id})
       	        .then(function(param){
                    if(param.status == 200) {
             	     	that.$message({
      			           	title: '成功',
      			           	message: '成功结束',
      			           	type: 'success'
			        	});
			        	that.findAllMonitors();
             		}
             		else{
             			that.$message.error({
      			           	title: '失败',
      			           	message: '操作失败'
			        	});
             		}
       	        })
       	        .catch(function(error){
       	        	that.$message.error({
      			        title: '失败',
      			        message: '失败了'
			        });
       	        })
        },
        handleSelectionChange(val) {
	  	 	this.multipleSelection = val;
	  	},
	}
}
</script>
<style scoped>
    .optionDiv .el-input{
    	 width: 200px;
    }
    .optionDiv button{
    	float: right;
    	margin-right: 20px;
    }
    .progressStyle {
    	text-align: center;
    }
    .progressStyle .el-dialog{
    	width: 400px;
    }
    .containBtn {
    	display: inline-block;
    }
</style>