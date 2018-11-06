<!-- 课调管理页面 -->
<template>
  <div class="sManage">
        <div class="optionDiv">
	    	 <el-input v-model="search" placeholder="请输入讲师名字" suffix-icon="el-icon-search"></el-input>
	    	 <el-button type="info" plain @click="deleteAll">批量删除</el-button>
	    	 <el-button type="success" plain @click="openDialogToAdd">添加</el-button>
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
               <el-table-column  prop="user.name"  label="讲师" align="center"  width="150">
               </el-table-column>
               <el-table-column  prop="surveydate"  label="课调时间" align="center"  width="200">
               </el-table-column>

               <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
				    	 <el-button @click="openStatus(scope.$index,scope.row) " style="display: none"></el-button>
				    	 <el-button size="mini" type="success"
				          @click="" icon="el-icon-view" title="预览" @click="handlePreView(scope.$index, scope.row)">预览</el-button>
				        <el-button size="mini" type="info"
				          @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" title="编辑">编辑</el-button>
				        <el-button size="mini" type="danger"
				          @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" title="删除">删除</el-button>
				    </template>
               </el-table-column>
            </el-table> 
	    </div>
	    <el-dialog :title="dialogTitle" :visible.sync="formVisible">
			<el-form :model="form">
			    <el-form-item label="年级" :label-width="formLabelWidth">
			        <el-select placeholder="请选择年级" v-model="gradeValue" @change="filtrateClazz">
				        <el-option v-for="itemone in grades" :label="itemone.name" :value="itemone.name" :key="itemone.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="班级" :label-width="formLabelWidth">
			        <el-select v-model="form.clazzId" placeholder="请选择班级" :disabled="notAble">
				        <el-option v-for="itemtwo in finalClazz" :label="itemtwo.name" :value="itemtwo.id" :key="itemtwo.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="课程" :label-width="formLabelWidth">
			        <el-select v-model="form.courseId" placeholder="请选择课程">
				        <el-option v-for="itemthree in courses" :label="itemthree.name" :value="itemthree.id" :key="itemthree.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="问卷" :label-width="formLabelWidth">
			        <el-select v-model="form.questionnaireId" placeholder="请选择问卷">
				        <el-option v-for="itemfour in naires" :label="itemfour.name" :value="itemfour.id" :key="itemfour.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="讲师" :label-width="formLabelWidth">
			        <el-select v-model="form.userId" placeholder="请选择讲师">
				        <el-option v-for="itemfive in teachers" :label="itemfive.name" :value="itemfive.id" :key="itemfive.id"></el-option>
				    </el-select>
			    </el-form-item>
			    <el-form-item label="开启" :label-width="formLabelWidth">
			    	    <el-checkbox-group v-model="form.status">
			    	    	 <el-checkbox label="创建完成后开启课调" name="status"></el-checkbox>
			    	    </el-checkbox-group>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="formVisible = false" type="info">取 消</el-button>
			    <el-button @click="satifyToAddSurveyMsg" type="success">保 存</el-button>
			</div>
	    </el-dialog>

	    <el-dialog title="课调问卷" :visible.sync="preVisible" center width="70%" class="preStyle">
	    	<div>
	    		<ul>
	    			<li>班级:{{thisPreVisibleMsg.clazzVM?thisPreVisibleMsg.clazzVM.name:""}}</li>
	    			<li>讲师:{{thisPreVisibleMsg.user?thisPreVisibleMsg.user.name:""}}</li>
	    			<li>时间:{{thisPreVisibleMsg.surveydate?thisPreVisibleMsg.surveydate.split(" ")[0]:""}}</li>
	    			<li>课程:{{thisPreVisibleMsg.course?thisPreVisibleMsg.course.name:""}}</li>
	    		</ul>
	    		<div v-for="item in preQues" :key="item.id">
	    			<el-card class="box-card">
						<div slot="header" class="clearfix">
						    <span>[{{item.questionType}}]:{{item.name}}</span>
						</div>
						<div v-for="key in item.options" :key="key.id" class="text item">
						     {{key.label}} . {{key.name}}
						</div>
					</el-card>
	    		</div>
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
	      gradeValue: "",
	      form: {},
	      finalClazz: [],
	      thisPreVisibleMsg: {},
	      preQues: [],
	      dialogTitle: "添加课调信息",
	      notAble: true,
	      formVisible: false,
	      preVisible: false,
	      formLabelWidth: "80px",
	    }
	},
	created() {
	  	this.findAllSurveyMsg();
	  	this.findClazzInfo();
	  	this.findCourseInfo();
	  	this.findGradesInfo();
	  	this.findTeacherInfo();
	  	this.findAllNaire();
	},
    computed: {
	    ...mapGetters(['surveymsg','naires','teachers','clazzs','grades','courses']),
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
	  	...mapActions(['findAllSurveyMsg','deleteSurveyMsgById','deleteSurveyMsgByChecked','updateSurveyMsgInfo','findAllNaire','findGradesInfo','findTeacherInfo','findCourseInfo','findClazzInfo','findThisStatus']),
	  	openDialogToAdd() {
	  		this.dialogTitle = "添加课调信息";
	  		this.form = {};
	  		this.gradeValue = null;
	  		this.notAble = true;
	  		this.formVisible = true;
	  	},
	  	filtrateClazz() {
	  		 const that = this;
	  		 this.notAble = false;
	  		 this.finalClazz.length = 0;
	  		 this.clazzs.forEach(function(item){
                  if(item.grade && item.grade.name == that.gradeValue){
                  	   that.finalClazz.push(item);
                  }
	  		 });
	  	},
	  	satifyToAddSurveyMsg() {
	  		const that = this;
            this.updateSurveyMsgInfo(this.form)
               .then(function(param){
                    if(param.status == 200) {
                    	if(that.form.id){
                    		that.$message({
                    			showClose: true,
	      			           	title: '成功',
	      			           	message: '编辑课调信息成功',
	      			           	type: 'success'
			        	    });
                    	}
                    	else{
	             	     	that.$message({
	             	     		showClose: true,
	      			           	title: '成功',
	      			           	message: '添加课调信息成功',
	      			           	type: 'success'
				        	});
				        	if(that.form.status) {
				        	    setTimeout(function(){
                                   $('tr:last td:last button:first').trigger('click');
				        	    },500);
				        	}
             	        }
			        	that.findAllSurveyMsg();
                 	}
                 	else{
             			that.$message.error({
             				showClose: true,
      			           	title: '失败',
      			           	message: '抱歉，失败了！'
			        	});
                 	}
                 	that.formVisible = false;
               })
               .catch(function(error){
               	    that.$message.error({
               	    	showClose: true,
      			        title: '失败',
      			        message: '抱歉，失败了'
			        });
				    that.formVisible = false;
				    console.log(error);
            });
	  	},
	  	//预览
	  	handlePreView(index,row) {
	  		const that = this;
	  		this.thisPreVisibleMsg.length = 0;
	  		this.preQues.length = 0;
	  		this.preVisible = true;
            this.thisPreVisibleMsg = row;
            this.preQues = row.qnVM?row.qnVM.questionVMs:[];
	  	},
	  	//修改
	  	handleEdit(index,row) {
	  		this.dialogTitle = "编辑课调信息"
	  		this.formVisible = true;
	  		this.gradeValue = row.clazzVM.grade.name;
	  		this.notAble = false;
	  		this.form = {
	  			id: row.id,
	  			status: row.status,
	  			courseId: row.course.id,
	  			clazzId: row.clazzVM.id,
	  			userId: row.user.id,
	  			questionnaireId: row.qnVM.id
	  		}
	  	},
	  	//删除
	  	handleDelete(index,row) {
       	    const that = this;
	    	this.deleteSurveyMsgById({id: row.id})
	    	    .then(function(param){
	    	  	    if(param.status == 200) {
             	     	that.$message({
      			           	title: '成功',
      			           	message: '删除成功',
      			           	type: 'success'
			        	});
			        	that.findAllNaire();
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
        openStatus(index,row) {
        	const that = this;
        	this.findThisStatus({id:row.id})
        	    .then(function(param){
        	    	if(param.status == 200) {
             	     	that.$message({
      			           	title: '成功',
      			           	message: '成功开启课调',
      			           	type: 'success'
			        	});
			        	that.findAllNaire();
             		}
             		else{
             			that.$message.error({
      			           	title: '失败',
      			           	message: '课调开启失败'
			        	});
             		}
        	});
        }
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