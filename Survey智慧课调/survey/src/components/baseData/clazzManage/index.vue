<!-- 班级管理页面 -->
<template>
  <div class="clazzManage">
    <div class="optionDiv">
    	<el-select v-model="value" placeholder="请选择">
    		<el-option label="" value="" key="">
		    </el-option>
		    <el-option v-for="(item,index) in this.clazzs"
		      :label="item.name" :value="item.name" :key="item.index">
		    </el-option>
        </el-select>
		<el-input v-model="search" placeholder="请输入查询条件"></el-input>

		<el-button type="warning" plain @click="deleteAll">删除</el-button>
		<el-button type="success" plain @click="openDialogToAdd">新增</el-button>
	</div>
	<div class="tableDiv">
		<el-table  ref="multipleTable" :data="clazzList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="320px">
  
            <el-table-column type="selection" label="编号" width="55" align="center">
            </el-table-column>
            <el-table-column prop="name" label="班级名称" align="center">
            </el-table-column>
            <el-table-column  prop="description"  label="班级简介" align="center">
            </el-table-column>
            <el-table-column  prop="charge.name"  label="班主任" align="center">
            </el-table-column>

            <el-table-column label="操作" align="center">
				    <template slot-scope="scope">
				        <el-button size="mini" type="info"
				          @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" circle title="编辑"></el-button>
				        <el-button size="mini" type="danger"
				          @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" circle title="删除"></el-button>
				    </template>
            </el-table-column>
        </el-table> 
	</div>

	<el-dialog :title="dialogTitle" :visible.sync="formVisible">
			  <el-form :model="form">
			    <el-form-item label="所属年级" :label-width="formLabelWidth">
				    <el-select v-model="form.gradeId" placeholder="请选择">
				        <el-option v-for="(item,index) in this.grades"
		                   :label="item.name" :value="item.id" :key="item.index">
		                </el-option>
				    </el-select>
				</el-form-item>
			    
			    <el-form-item label="班级名称" :label-width="formLabelWidth">
			        <el-input v-model="form.name" autocomplete="off"></el-input>
			    </el-form-item>

			    <el-form-item label="班主任" :label-width="formLabelWidth">
				    <el-select v-model="form.chargeId" placeholder="请选择">
				        <el-option v-for="(item,index) in this.teachers"
		                   :label="item.name" :value="item.id" :key="item.index">
		                </el-option>
				    </el-select>
				</el-form-item>

				 <el-form-item label="班级介绍" :label-width="formLabelWidth">
			        <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			        <el-button @click="formVisible = false">取 消</el-button>
			        <el-button type="success" @click="verifySaveClazz">保 存</el-button>
			  </div>
	</el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';

export default {
  data(){
	    return {
	    	value: "",
	        search: "",
	        multipleSelection: [],
	        form: {},
	        formLabelWidth: "80px",
	        formVisible: false,
	        dialogTitle: "新增班级信息",
	    }
  },
  computed: {
        ...mapGetters(['clazzs','grades','teachers']),
        clazzList() {
       	    const that = this;
			return this.clazzs.filter(function(item){
				if(item.name){
					return item.name.indexOf(that.value) !== -1 && item.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
        }
  },
  created() {
        this.findClazzInfo()
          .then(function(data){
          })
          .catch(function(error){
              console.log(error);
        });
        this.findGradesInfo()
          .then(function(data){})
          .catch(function(error){
              console.log(error);
          });
        this.findTeacherInfo()
          .then(function(data){})
          .catch(function(error){
          	  console.log(error);
          })
  },
   methods: {
  	   ...mapActions(['findClazzInfo','saveClazzInfo','deleteClazzById','deleteClazzByChecked','findGradesInfo','findTeacherInfo']),
  	   // 添加数据
  	   openDialogToAdd() {
  	   	      this.form = {},
	  	   	  this.formVisible = true;
  	   },
  	   verifySaveClazz() {
  	   	  	const that = this;
            this.saveClazzInfo(this.form)
               .then(function(param){
                    if(param.status == 200) {
                    	if(that.form.id){
                    		that.$notify({
	      			           	title: '成功',
	      			           	message: '修改课程信息成功',
	      			           	type: 'success'
			        	    });
                    	}
                    	else{
	             	     	that.$notify({
	      			           	title: '成功',
	      			           	message: '添加课程信息成功',
	      			           	type: 'success'
				        	});
             	        }
			        	that.findClazzInfo();
			        	that.formVisible = false;
                 	}
                 	else{
             			that.$notify.error({
      			           	title: '失败',
      			           	message: '抱歉，失败了！'
			        	});
			        	that.formVisible = false;
                 	}
               })
               .catch(function(error){
               	    that.$notify.error({
      			        title: '失败',
      			        message: '抱歉，失败了'
			        });
				    that.formVisible = false;
				    console.log(error);
               })
  	   },
  	   // 编辑数据
  	   handleEdit(index,row) {
  	   	   this.form = {
  	   	   	   id: row.id,
  	   	   	   name: row.name,
  	   	   	   chargeId: row.charge ? row.charge.id : "",
  	   	   	   gradeId: row.grade ? row.grade.id : "",
  	   	   	   description: row.description
  	   	   };
  	   	   this.dialogTitle = "编辑班级信息";
  		   this.formVisible = true;
  	   },
  	   //删除单条数据
       handleDelete(index,row) {
       	    const that = this;
	    	this.deleteClazzById({id: row.id})
	    	  .then(function(param){
	    	  	    if(param.data.stauts == 200) {
             	     	that.$notify({
      			           	title: '成功',
      			           	message: '删除成功',
      			           	type: 'success'
			        	});
			        	that.findClazzInfo();
             		}
             		else{
             			that.$notify.error({
      			           	title: '失败',
      			           	message: param.data.stauts+'删除失败'
			        	});
             		}
	    	  })
	    	  .catch(function(error) {
	    	  	    that.$notify.error({
  			           	title: '失败',
  			           	message: '删除失败'
			        });
	    	  });
       },
       //删除所有数据
         // 1.获取所欲勾选的数据
       handleSelectionChange(val) {
            this.multipleSelection = val;
       },
         // 2.删除
  	   deleteAll() {
  	   	    let temp = [],that = this,obj;
        	that.multipleSelection.forEach(function(item){
        		  temp.push(item.id);
        	});
        	obj = {
        		ids: String(temp)
        	};
        	this.deleteClazzByChecked(obj)
        	 .then(function(param){
                 if(param.data.stauts == 200) {
                 	    that.$notify({
      			           title: '成功',
      			           message: '勾选的数据删除成功',
      			           type: 'success'
				        });
    				    that.findClazzInfo();
                  }
                 else{
                 	    that.$notify.error({
        			   		title: '失败',
        			    	message: param.data.stauts+'勾选的数据删除失败'
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
    .optionDiv .el-input {
		width: 200px;
	}
	.optionDiv button {
		float: right;
		margin-right:10px;
	}
	.optionDiv .el-select {
		width: 120px;
	}
</style>