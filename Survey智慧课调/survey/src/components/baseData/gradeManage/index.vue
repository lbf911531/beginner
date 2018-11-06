<!-- 年级管理页面 -->
<template>
  <div class="gradeManage">
        <div class="optionDiv">
			<el-input v-model="search" placeholder="请输入查询条件"></el-input>

			<el-button type="warning" plain @click="deleteAll">删除</el-button>
			<el-button type="success" plain @click="openDialogToAdd">新增</el-button>
	    </div>
	    <div class="tableDiv">
			<el-table  ref="multipleTable" :data="gradeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="320px">
  
               <el-table-column type="selection" label="编号" width="55" align="center">
               </el-table-column>
               <el-table-column label="名称" prop="name" align="center">
               </el-table-column>
               <el-table-column  prop="descriptioin"  label="简介" align="center">
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
			    <el-form-item label="年级名称" :label-width="formLabelWidth">
			        <el-input v-model="form.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="年级简介" :label-width="formLabelWidth">
			        <el-input v-model="form.descriptioin" autocomplete="off" type="textarea"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			        <el-button @click="formVisible = false">取 消</el-button>
			        <el-button type="success" @click="verifySaveGrade">保 存</el-button>
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
       form: {
       	  schoolId: 3,
       },
       formLabelWidth: "80px",
       formVisible: false,
       dialogTitle: "新增年级信息",
    }
  },
  computed: {
       ...mapGetters(['grades']),
       gradeList() {
       	    const that = this;
			return this.grades.filter(function(item){
				if(item.name){
					return item.name.indexOf(that.search) !== -1;
				}
				else return false;
			})
       }
  },
  created() {
        this.findGradesInfo()
          .then(function(data){
          })
          .catch(function(error){
             console.log(error);
        })
  },
  methods: {
  	   ...mapActions(['findGradesInfo','saveGradesInfo','deleteGradeById','editGradeInfo','deleteGradeByChecked']),
  	   // 添加数据
  	   openDialogToAdd() {
	  	   	  this.form = {
	  	   	  	 schoolId: 3,
	  	   	  }
	  	   	  this.formVisible = true;
  	   },
  	   verifySaveGrade() {
  	   	  	const that = this;
            this.saveGradesInfo(this.form)
               .then(function(param){
                    if(param.status == 200) {
                    	if(that.form.id){
                    		that.$notify({
	      			           	title: '成功',
	      			           	message: '编辑年级信息成功',
	      			           	type: 'success'
			        	    });
                    	}
                    	else{
	             	     	that.$notify({
	      			           	title: '成功',
	      			           	message: '添加年级信息成功',
	      			           	type: 'success'
				        	});
             	        }
			        	that.findGradesInfo();
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
  	   	   	   schoolId: 3,
  	   	   	   id: row.id,
  	   	   	   name: row.name,
  	   	   	   descriptioin: row.descriptioin
  	   	   };
  	   	   this.dialogTitle = "编辑年级信息";
  		   this.formVisible = true;
  	   },
  	   //删除单条数据
       handleDelete(index,row) {
       	    const that = this;
	    	this.deleteGradeById({id: row.id})
	    	  .then(function(param){
	    	  	    if(param.status == 200) {
             	     	that.$notify({
      			           	title: '成功',
      			           	message: '删除成功',
      			           	type: 'success'
			        	});
			        	that.findGradesInfo();
             		}
             		else{
             			that.$notify.error({
      			           	title: '失败',
      			           	message: '删除失败'
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
        	this.deleteGradeByChecked(obj)
        	 .then(function(param){
                 if(param.status == 200) {
                 	    that.$notify({
      			           title: '成功',
      			           message: '勾选的数据删除成功',
      			           type: 'success'
				        });
    				    that.findGradesInfo();
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
    .optionDiv .el-input{
		width: 200px;
	}
	.optionDiv button{
		float: right;
		margin-right:10px;
	}
</style>