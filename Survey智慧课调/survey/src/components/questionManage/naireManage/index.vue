<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
        <div class="optionDiv">
    	 <el-input v-model="search" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
    	 <el-button type="warning" @click="deleteAll">批量删除</el-button>
    	 <el-button type="success" @click="openDialogToAdd">添加</el-button>
        </div>
        <div class="tableDiv">
			<el-table  ref="multipleTable" :data="naireList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="320px">
  
               <el-table-column type="selection" label="编号" width="55" align="center">
               </el-table-column>
               <el-table-column  prop="name" label="问卷名称" align="center">
               </el-table-column>
               <el-table-column  prop="description"  label="文件描述" align="center">
               </el-table-column>

               <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
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
			    <el-form-item label="问卷名称" :label-width="formLabelWidth">
			        <el-input v-model="form.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="问卷描述" :label-width="formLabelWidth">
			        <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
			    </el-form-item>
			    <el-form-item label="题目列表" :label-width="formLabelWidth">
			        <el-button @click="questionDialogView = true" style="width: 200px;">点击选择</el-button>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="formVisible = false" type="info">取 消</el-button>
			</div>
	    </el-dialog>

	    <el-dialog title="选择题目" :visible.sync="questionDialogView">  
	    	<el-form :model="form">
	    		 <el-transfer v-model="form.questionIds" :data="questionsList" :titles="['待选题目','已选题目']"></el-transfer>
	        </el-form>
	    	<div slot="footer" class="dialog-footer">
			    <el-button @click="questionDialogView = false">取 消</el-button>
			    <el-button type="success" @click="verifySaveNaire">保 存</el-button>
			</div>
	    </el-dialog>

	    <el-dialog title="预览问卷" :visible.sync="preToView" class="limitHeigh">  
	    	<div v-for="item in this.preViewQues">
		    	<el-card shadow="hover">
				  <div slot="header" class="clearfix">
				    <span>{{item.questionType}}:{{item.name}}</span>
				  </div>
				  <div v-for="(minitem,minindex) in item.options" :key="minitem.id">
				      {{minitem.label}}:{{minitem.name}} 
				  </div>
				</el-card>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="preToView = false">取 消</el-button>
			</div>
	    </el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
export default {
  data(){
    return {
        search: "",
        multipleSelection: [],
        quesNaires: {},
        form: {},
        preViewQues: [],
        formLabelWidth: "80px",
        formVisible: false,
        questionDialogView: false,
        preToView: false,
        dialogTitle: "创建问卷",
    }
  },
  computed: {
        ...mapGetters(['naires','questions']),
        naireList() {
       	    const that = this;
			return this.naires.filter(function(item){
				if(item.name){
					return item.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
        },
        questionsList() {
            const that = this;
            let temp = [];
            this.questions.forEach(function(item){
                  temp.push({
                     key: item.id,
                     label: "["+item.questionType+"]:"+item.name
                  }); 
            });
            return temp;
        }
  },
  created() {
        this.findAllNaire()
          .then(function(){})
          .catch(function(error){
          	   console.log(error);
          });
        this.findAllQues()
          .then(function(){})
          .catch(function(error){
          	   console.log(error);
          });
  },
  methods: {
       ...mapActions(['findAllNaire','findAllQues','updateNaireInfo','deleteNaireById','deleteNaireByChecked','findQuestionNaireById']),
       openDialogToAdd() {
           this.dialogTitle = "创建问卷";
       	   this.form = {},
       	   this.formVisible = true;
       },
       verifySaveNaire() {
       	   const that = this;
       	   let finalData = {
       	   	  id: this.form.id ? this.form.id : "",
       	   	  name: this.form.name,
       	   	  description: this.form.description,
       	   	  questionIds: this.form.questionIds.join(",")
       	   }
       	   this.updateNaireInfo(finalData)
       	     .then(function(param){
                    if(param.status == 200) {
                    	if(that.form.id){
                    		that.$message({
	      			           	title: '成功',
	      			           	message: '编辑问卷成功',
	      			           	type: 'success'
			        	    });
                    	}
                    	else{
                    		that.$message({
	      			           	title: '成功',
	      			           	message: '添加问卷成功',
	      			           	type: 'success'
			        	    });
                    	}
			        	that.findAllNaire();
             		}
             		else{
             			that.$message.error({
      			           	title: '失败',
      			           	message: '失败了！！'
			        	});
             		}
             		that.questionDialogView = false;
             		that.formVisible = false;
       	     })
       	     .catch(function(error){
				that.$message.error({
      			    title: '失败',
      			    message: '失败了'
			    });
       	     });
       },
       // 预览
       handlePreView(index,row) {
       	  const that = this;
       	  this.findQuestionNaireById({id:row.id})
       	    .then(function(param){
       	    	param.questionVMs.forEach(function(item){
       	    		if(item.questionType.indexOf("单选") !== -1){
       	    			that.preViewQues.unshift(item);
       	    		}
       	    		else{
       	    			that.preViewQues.push(item);
       	    		}
       	    	})
       	    })
       	    .catch(function(error){
       	    	console.log(error);
       	    });
       	  this.preToView = true;
       },
       // 编辑
       handleEdit(index,row) {
       	  const that = this;
          this.dialogTitle = "编辑问卷";
          this.findQuestionNaireById({id:row.id})
             .then(function(param){
                 that.quesNaires = param;  
                 let temp = [];
                 that.quesNaires.questionVMs.forEach(function(item){
                      temp.push(item.id);
                 });
                 that.form = {
		       	  	  id: that.quesNaires.id,
		       	  	  name: that.quesNaires.name,
		       	  	  description: that.quesNaires.description,
		       	  	  questionIds: temp
       	  		 }     
             })
             .catch(function(error){
             	 console.log(error);
             });
       	  
       	  this.formVisible = true;
       },
       // 删除一条数据
       handleDelete(index,row) {
       	    const that = this;
	    	this.deleteNaireById({id: row.id})
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
       // 删除勾选的数据
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
        	this.deleteNaireByChecked(obj)
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
<style>
    .limitHeigh .el-dialog__header{
    	border-bottom: 1px solid #333;
    }
	.limitHeigh .el-dialog__body{
        height: 320px;
    	overflow-y: scroll;
    }
</style>
<style scoped>
    .optionDiv .el-input{
    	 width: 200px;
    }
    .optionDiv button{
    	float: right;
    	margin-right: 20px;
    }
    .el-card{
    	margin-bottom: 10px;
    }
</style>