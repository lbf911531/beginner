<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
        <div class="optionDiv">
	    	 <el-input v-model="search" placeholder="请输入讲师名字" suffix-icon="el-icon-search"></el-input>
	    	 <el-button type="info" plain @click="deleteAll">批量删除</el-button>
        </div>
        <div class="tableDiv">
			<el-table  ref="multipleTable" :data="surveyCheckedList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="360px">
               <el-table-column type="selection" width="55" align="center">
               </el-table-column>
               <el-table-column  prop="clazzVM.grade.name" label="年级" align="center" width="100">
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
               <el-table-column  prop="status"  label="状态" align="center"  width="100">
               </el-table-column>

               <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
				    	<div v-if="scope.row.status == '未审核'">
				        	<el-button size="mini" type="info"
				       		 @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit">审核</el-button>
				        </div>
				        <div v-else>
				        	<el-button size="mini" type="info"
				       		icon="el-icon-edit" :disabled="true">审核</el-button>
				        </div>
				    </template>
               </el-table-column>
            </el-table> 
	    </div>

	    <el-dialog title="课调问卷" :visible.sync="preVisible" center width="70%" class="preStyle">
	    	<div>
	    		<ul>
	    			<li>班级:{{thisPreVisibleMsg.clazzVM?thisPreVisibleMsg.clazzVM.name:""}}</li>
	    			<li>讲师:{{thisPreVisibleMsg.user?thisPreVisibleMsg.user.name:""}}</li>
	    			<li>时间:{{thisPreVisibleMsg.surveydate?thisPreVisibleMsg.surveydate.split(" ")[0]:""}}</li>
	    			<li>课程:{{thisPreVisibleMsg.course?thisPreVisibleMsg.course.name:""}}</li>
	    		</ul>	
	    	</div>
	    	<div>
	    		<el-table ref="singleTable" :data="questionVMs">
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="题目内容" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="200">
				    <template slot-scope="scope">
				        <el-button size="mini" type="info"
				          @click="handldReWrite(scope.$index, scope.row)" class="el-icon-edit"></el-button>
				        <el-button size="mini" type="danger"
				          @click="handleOver(scope.$index, scope.row)" class="el-icon-close"></el-button>
				    </template>
               </el-table-column>
  				</el-table>
	    	</div>
	    	<div slot="footer" class="dialog-footer">
   				<el-button @click="notPassCheck(thisPreVisibleMsg.id)">审核不通过</el-button>
   				<el-button @click="canPassCheck(thisPreVisibleMsg.id)" type="primary">审核通过</el-button>
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
	       preVisible: false,
	       thisPreVisibleMsg: {},
	       questionVMs: [],
	       multipleSelection: []
	    }
    },
    created() {
	  	this.findAllCheckInfo();
	},
	computed: {
	    ...mapGetters(['checkedmsg']),
	    surveyCheckedList() {
       	    const that = this;
			return this.checkedmsg.filter(function(item){
				if(item.user.name){
					return item.user.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
	    }
    },
    methods: {
    	...mapActions(['findAllCheckInfo','CanOrNotPassCheck','batchDeleteCheckedSurcey']),
    	handleEdit(index,row) {
    		console.log(row.id);
    		this.preVisible = true;
    		this.thisPreVisibleMsg.length = 0;
    		this.thisPreVisibleMsg = row;
    		if(row.qnVM.questionVMs && row.qnVM){
                this.questionVMs = row.qnVM.questionVMs;
    		}
    	},
    	handleSelectionChange(val) {},	    
    	handldReWrite(index,row) {},
    	handleOver(index,row) {},
    	notPassCheck(id) {
    		const that = this;
            let obj = {
            	id: id,
            	status: 0
            };
            this.CanOrNotPassCheck(obj)
                .then(function(param){
                    if(param.status === 200){
                        that.$message({
             	     		showClose: true,
      			           	title: '成功',
      			           	message: '操作成功，本课调未通过审核',
      			           	type: 'success'
				        });
                    }
                    else{
                    	that.$message.error({
             	     		showClose: true,
      			           	title: '成功',
      			           	message: '操作失败',
				        });
                    }
                    this.findAllCheckInfo();
                })
                .catch(function(error){
                	that.$message.error({
         	     		showClose: true,
  			           	title: '成功',
  			           	message: '操作失败',
				    });
                });
    	},
    	canPassCheck(id) {
 			let obj = {
            	id: id,
            	status: 1
            };
            this.CanOrNotPassCheck(obj)
                .then(function(param){
                    if(param.status === 200){
                        that.$message({
             	     		showClose: true,
      			           	title: '成功',
      			           	message: '操作成功，课调通过审核',
      			           	type: 'success'
				        });
                    }
                    else{
                    	that.$message.error({
             	     		showClose: true,
      			           	title: '成功',
      			           	message: '操作失败',
				        });
                    }
                    this.findAllCheckInfo();
                })
                .catch(function(error){
                	that.$message.error({
         	     		showClose: true,
  			           	title: '成功',
  			           	message: '操作失败',
				    });
                });
    	},
    	handleSelectionChange(val) {
	  	 	 this.multipleSelection = val;
	  	},
	  	deleteAll() {
		   	let temp = [],that = this,obj;
	    	that.multipleSelection.forEach(function(item){
	    		  temp.push(item.id);
	    	});
	    	obj = {
	    		ids: String(temp)
	    	};
	    	this.batchDeleteCheckedSurcey(obj)
	    	 .then(function(param){
	                if(param.status == 200) {
	             	    that.$notify({
	  			           title: '成功',
	  			           message: '勾选的数据删除成功',
	  			           type: 'success'
				        });
	                }
	                else{
	             	    that.$notify.error({
	    			   		title: '失败',
	    			    	message: '勾选的数据删除失败'
	        			});
	                }
	              that.findAllCheckInfo();
	    	 })
	    	 .catch(function(error){
	    	 	console.log(error);
	    	 });
	  	},
    }
}
</script>
<style scoped>
    .optionDiv .el-input{
    	 width: 240px;
    }
    .optionDiv button{
    	float: right;
    	margin-right: 20px;
    }
    .preStyle ul,
    .preStyle li{
    	margin: 0;
    	padding: 0;
    	list-style: none;
    }
    .preStyle li{
    	width: 25%;
    	height: 40px;
    	float: left;
    	box-sizing: border-box;
    	border: 1px solid #333;
    	text-align: center;
    	line-height: 40px;
    	font-weight: 700;
    }
    .preStyle ul::after{
    	content: "";
        clear: both;
        display: block;
    }
</style>