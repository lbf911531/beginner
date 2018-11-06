<!-- 题目管理页面 -->
<template>
  <div class="quesManage">
    <div class="optionDiv">
        <el-select v-model="value" placeholder="请选择题目类型">
            <el-option label="全部" value="全部" key=""></el-option>
            <el-option label="单选题" value="单选"></el-option>
            <el-option label="多选题" value="多选"></el-option>
            <el-option label="简答题" value="简答"></el-option>
        </el-select>
    	<el-input v-model="search" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
    	<el-button type="warning" @click="deleteAll">批量删除</el-button>
    	<el-button type="success" @click="openDialogToAdd">添加</el-button>
    </div>
    <div class="quesContent">
    	<div v-for="(item,index) in this.quesList">
    		<el-card shadow="hover">
				<div slot="header" class="clearfix">
                    <input type="checkbox" name="del" :value="item.id" v-model="delCheckedArr">
					<i class="el-icon-info"></i>
				    <span>序号{{index+1}} . {{item.name}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="handleDelOne(item)">
                        <i class="el-icon-delete"></i>
                    </el-button>
				    <el-button style="float: right; padding: 3px 0" type="text" @click="handleEdit(item)">
				    	<i class="el-icon-edit-outline"></i>
				    </el-button>
				</div>
				<div v-if="item.options.length > 0 && item.options.length !== undefined">
					<div v-for="(mit,mindex) in item.options" :key="mindex" :value="mit.id" class="text item">
					    {{mit.label}} : {{mit.name}}
					</div>
				</div>
				<div v-else>
					<el-input type="textarea"></el-input>
				</div>
			</el-card>
		</div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="formVisible">
		<el-form :model="form"> 
			<el-form-item label="题目名称" :label-width="formLabelWidth">
			    <el-input v-model="form.name" autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item label="题目类型" :label-width="formLabelWidth">
				<el-select v-model="form.questionType" placeholder="请选择" @change="changeAnsView">
			        <el-option value="单选">单选</el-option>
	                <el-option value="多选">多选</el-option>
	                <el-option value="简答">简答</el-option>
				</el-select>
			</el-form-item>
 
            <el-form-item label="所属课程" :label-width="formLabelWidth">
				<el-select v-model="form.gradeId" placeholder="请选择" disabled>
				    <el-option v-for="(item,index) in this.courses"
		                :label="item.name" :value="item.id" :key="item.index">
		            </el-option>
				</el-select>
			</el-form-item>

            <div v-if="isSelectView">
	            <el-form-item label="题目选项" :label-width="formLabelWidth">
					<el-table :data="form.options" border style="width: 100%" tooltip-effect="dark" stripe>
					    <el-table-column label="序号" align="center" type="index" width="80">
					    </el-table-column>
		   				<el-table-column prop="label" label="label" align="center" width="100">    
		    			</el-table-column>
		    			<el-table-column prop="questionId" label="选项" align="center" width="100">
                            <template slot-scope="scope">
                                 <el-input size="small" v-model="scope.row.name" v-if="isReEdit == true"></el-input>
                                 <span v-else>{{scope.row.name}}</span>
                            </template>
		                </el-table-column>
		                <el-table-column prop="score" label="分值" align="center" width="100">
		                </el-table-column>
		                <el-table-column label="操作" align="center">
		                	<template slot-scope="scope">
			                	<el-button size="mini" type="danger"
	         						@click="handleDelete(scope.$index, scope.row)">
	          					删除</el-button>
          				    </template>
		                </el-table-column>
				    </el-table>
                    <el-button size="mini" type="danger" @click="handleReEdit" class="rightBtn">
                        重编辑
                    </el-button>
			    </el-form-item>
			    <el-button class="el-icon-plus" type="info" @click="addAnswers"></el-button>
			</div>
		</el-form>
		<div slot="footer" class="dialog-footer">
	        <el-button @click="formVisible = false">取 消</el-button>
	        <el-button type="success" @click="verifySaveQues">保 存</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';

export default {
  data(){
    return {
        search: "",
        value: "全部",
        delCheckedArr: [],
        dialogTitle: "添加题目信息",
        formVisible: false,
        isReEdit: false,
        formLabelWidth: "80px",
        form: {
        	options:[{
        	   "id": "", 
        	   "questionId": "",
	           "label": "A",
	           "score": 5,
	           "name": "非常好"
	        },{
	           "id": "", 
        	   "questionId": "",
			   "label": "B",
	           "score": 4,
	           "name": "好"
	        }],
        },
        isSelectView: true,
        answers: [{
           "id": "", 
           "questionId": "",
           "label": "A",
           "score": 5,
           "name": "非常好"
        },{
           "id": "", 
           "questionId": "",
		   "label": "B",
           "score": 4,
           "name": "好"
        },{
           "id": "", 
           "questionId": "",
		   "label": "C",
           "score": 3,
           "name": "较好"
        },{
           "id": "", 
           "questionId": "",
		   "label": "D",
           "score": 2,
           "name": "一般"
        }],
    }
  },
  created() {
  	  this.findAllQues()
  	    .then(function(data){})
  	    .catch(function(error){
  	    	console.log(error);
  	    });
  	  this.findCourseInfo()
  	    .then(function(data){})
  	    .catch(function(error){
  	    	console.log(error);
  	    });
  },
  computed: {
  	  ...mapGetters(['questions','courses']),
  	  quesList() {
  	  	 const that = this;
  	  	 return this.questions.filter(function(item){
              if(item.name  && that.value != "全部"){
              	  return item.name.indexOf(that.search) !== -1 &&item.questionType.indexOf(that.value) !== -1;
              }
              else if (item.name && that.value == "全部") {
                  return item.name.indexOf(that.search) !== -1
              }
              else return false;
  	  	 });
  	  },
  },
  methods: {
  	  ...mapActions(['findAllQues','findCourseInfo','saveQuestionInfo','deleteQuestionByChecked','deleteOneQuestion']),
  	  openDialogToAdd() {
          this.dialogTitle = "添加题目信息";
  	  	  this.form = {
            questionType: "单选",
  	  	  	options:[{
  	  	  	   "id": "", 
        	   "questionId": "",
	           "label": "A",
	           "score": 5,
	           "name": "非常好"
		        },{
		       "id": "", 
        	   "questionId": "",
			   "label": "B",
	           "score": 4,
	           "name": "好"
		    }] 
  	  	  };
  	  	  this.formVisible = true;
  	  },
  	  verifySaveQues() {
  	  	   const that = this;
           var  tempobj = {
           	   	   id: this.form.id ? this.form.id : "",
           	   	   name: this.form.name,
           	   	   questionType: this.form.questionType,
           	   	   // gradeId: this.form.gradeId
           	    };
           if(this.form.questionType && this.form.questionType.indexOf("选") !== -1){
                   this.form.options.forEach(function(item,index){
                         tempobj["options["+index+"].id "]= item.id?item.id:"";
                         tempobj["options["+index+"].label"] = item.label;
                         tempobj["options["+index+"].score"] = item.score;
                         tempobj["options["+index+"].name"] = item.name;
                         tempobj["options["+index+"].questionId"] = item.questionId;
                   });
           }
           this.saveQuestionInfo(tempobj)
             .then(function(param){
                    if(param.status == 200) {
                    	if(that.form.id){
                    		that.$message({
	      			           	title: '成功',
	      			           	message: '修改题目信息成功',
	      			           	type: 'success'
			        	    });
                    	}
                    	else{
	             	     	that.$message({
	      			           	title: '成功',
	      			           	message: '添加题目信息成功',
	      			           	type: 'success'
				        	});
             	        }
			        	that.findAllQues();
			        	that.formVisible = false;
                 	}
                 	else{
             			that.$message.error({
      			           	title: '失败',
      			           	message: '抱歉，失败了！'
			        	});
			        	that.formVisible = false;
                 	}
               })
               .catch(function(error){
               	    that.$message.error({
      			        title: '失败',
      			        message: '抱歉，失败了'
			        });
				    that.formVisible = false;
				    console.log(error);
               })
  	  },
  	  changeAnsView() {
  	  	    if(this.form.questionType.indexOf('简答') !== -1){
  	  	  	    this.isSelectView = false;
  	  	    }
  	  	    else{
  	  	  	    this.isSelectView = true;
                this.form.options = [{
                           "id": "", 
                           "questionId": "",
                           "label": "A",
                           "score": 5,
                           "name": "非常好"
                            },{
                           "id": "", 
                           "questionId": "",
                           "label": "B",
                           "score": 4,
                           "name": "好"
                }] ;
            }
  	  },
  	  handleDelete(index,row) {
            if(this.form.options){
                let len = this.form.options.length - 1;
                this.form.options.splice(len,1);
            }
  	  },
  	  addAnswers() {
           if(this.form.options){
              let len = this.form.options.length;
              if(len<4){
                   this.form.options.push(this.answers[len]);
              }
           }
  	  },
      handleEdit(msg) {
      	   const that = this;
           this.dialogTitle = "修改题目"
      	   this.formVisible = true;
      	   this.form = {
      	   	    id:msg.id,
      	   	    name: msg.name,
      	   	    questionType:msg.questionType,
      	   	    gradeId: msg.gradeId
      	   }
           
      	   if(msg.options && msg.options.length == 0){ 
      	   	    this.isSelectView = false;
      	   }
      	   else{
      	   	    this.isSelectView = true; 
                this.form.options = JSON.parse(JSON.stringify(msg.options));
      	   }
      }, 
      deleteAll() {
            const that = this;
            let obj = {
                ids: String(this.delCheckedArr)
            };
            this.deleteQuestionByChecked(obj)
                .then(function(param){
                    if(param.status == 200) {
                        that.$notify({
                           title: '成功',
                           message: '勾选的数据删除成功',
                           type: 'success'
                        });
                        that.findAllQues();
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
      handleDelOne(msg) {
         const that = this;
         this.deleteOneQuestion({id: msg.id})
                .then(function(param){
                    if(param.status == 200) {
                        that.$message({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        that.findAllQues();
                    }
                    else{
                        that.$message.error({
                            title: '失败',
                            message: '删除失败'
                        });
                    }
                })
                .catch(function(error) {
                    that.$message.error({
                        title: '失败',
                        message: '删除失败'
                    });
                });
      },
      handleReEdit() {
         this.isReEdit = true;
      }
  }
}
</script>

<style>
	.optionDiv i.el-icon-search{
     	 font-size: 20px;
     	 color: #000;
     	 font-weight: 700;
    }
</style>
<style scoped>
    .optionDiv{
         border: 1px solid #333;
         border-top: none;
         padding:0 0 10px 20px;
    }
    .optionDiv .el-select{
         width: 150px;
    }
    .optionDiv .el-input{
     	 width: 200px;
     	 cursor: pointer;
    }
    .optionDiv .el-button{
    	 float: right;
    	 margin-right: 20px;
    }
    .quesContent{
    	 padding-top: 20px;
    	 height: 360px;
    	 overflow-y: scroll;
    }
    .quesContent .el-card{
    	margin: 20px 0;
    }
    .quesContent .el-card i{
    	 font-size: 24px;
    	 margin-right: 20px;
    }
    .text {
    	 font-size: 16px;
    }
	.item {
	     margin-bottom: 18px;
         margin-left: 20px;
	}
	.clearfix:before,
	.clearfix:after {
	     display: table;
	     content: "";
	}
    .clearfix:after {
         clear: both
    }
    button.el-icon-plus{
    	padding: 0;
    	font-size: 30px;
    	float: right;
    }
    .el-icon-delete{
        color: red;
    }
    .rightBtn{
        float: right;
        margin: 10px 0 0 0;
    }
</style>