<!-- 全部课调统计页面 -->
<template>
  <div class="allSurvey">
    <div class="optionDiv">
        <el-select v-model="value" placeholder="全部年级">
            <el-option label="全部" value="全部" key=""></el-option>
        </el-select>
         <el-select v-model="value" placeholder="全部班级">
            <el-option label="全部" value="全部" key=""></el-option>
        </el-select>
         <el-select v-model="value" placeholder="全部课程">
            <el-option label="全部" value="全部" key=""></el-option>
        </el-select>
         <el-select v-model="value" placeholder="全部问卷">
            <el-option label="全部" value="全部" key=""></el-option>
        </el-select>
    	<el-input v-model="search" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
    	<el-button type="warning" @click="deleteAll">批量删除</el-button>
    </div>
    <div class="tableDiv">
			<el-table  ref="multipleTable" :data="surveyMsgList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="360px">
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
               <el-table-column  prop="user.name"  label="讲师" align="center"  width="100">
               </el-table-column>
               <el-table-column  prop="surveydate"  label="课调时间" align="center"  width="200">
               </el-table-column>
               <el-table-column  prop="average"  label="平均分" align="center"  width="50">
               </el-table-column>

               <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
				    	 <el-button size="mini" type="success"
				          @click="" @click="">预览</el-button>
				        <el-button size="mini" type="info">下载</el-button>
				        <el-button size="mini" type="danger"
				          @click="">分析</el-button>
				    </template>
               </el-table-column>
            </el-table> 
	</div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      value: "",
      search: ""
    }
  },
  created() {
	  this.findAllSurveyMsg();
  },
  computed: {
  	  ...mapGetters(['surveymsg','deleteSurveyMsgByChecked']),
  	  surveyMsgList() {
       	    const that = this;
			return this.surveymsg.filter(function(item){
				if(item.user.name){
					return item.user.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
	    },   
  },
  methods: {
  	  ...mapActions(['findAllSurveyMsg']),
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
	    	this.deleteSurveyMsgByChecked(obj)
	    	 .then(function(param){
	             if(param.status == 200) {
	             	    that.$notify({
	  			           title: '成功',
	  			           message: '勾选的数据删除成功',
	  			           type: 'success'
				        });
					    that.findAllNaire();
	              }
	             else{
	             	    that.$notify.error({
	    			   		title: '失败',
	    			    	message: '勾选的数据删除失败'
	        			});
	              }
	    	 })
	    	 .catch(function(error){
	    	 	console.log(error);
	    	 });
	  	},
  }
}
</script>
<style scoped>
    .optionDiv .el-select{
    	 width: 140px;
    }
    .optionDiv .el-input{
    	 width: 200px;
    }
    .optionDiv button{
    	float: right;
    	margin-right: 20px;
    }
</style>