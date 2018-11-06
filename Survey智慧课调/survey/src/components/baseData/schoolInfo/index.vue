<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
    <!-- 	<scloolMsgTab :schoolInfo="schools" class="tableStyle"></scloolMsgTab> -->
    <table>
       <tr>
         <td>校园名称</td>
         <td @click="readyTochange1">
             <span v-if="isView1">{{schoolInfoObj.name}}</span>
             <input type="text" v-else="!isView1" v-model="schools.name"/> 
         </td>
       </tr>
       <tr>
         <td>校园介绍</td>
         <td @click="readyTochange2">
             <span  v-if="isView2">{{schoolInfoObj.description}}</span>
             <input type="text" v-else="!isView2" v-model="schools.description"/> 
         </td>
       </tr>
       <tr>
         <td>校园地址</td>
         <td @click="readyTochange3">
             <span  v-if="isView3">{{schoolInfoObj.address}}</span>
             <input type="text" v-else="!isView3" v-model="schools.address"/> 
         </td>
       </tr>
       <tr>
         <td>校园电话</td>
         <td @click="readyTochange4">
             <span  v-if="isView4">{{schoolInfoObj.telephone}}</span>
             <input type="text" v-else="!isView4" v-model="schools.telephone"/> 
         </td>
       </tr>
       <tr>
         <td>版权信息</td>
         <td @click="readyTochange5">
             <span  v-if="isView5">{{schoolInfoObj.copyright}}</span>
             <input type="text" v-else="!isView5" v-model="schools.copyright"/> 
         </td>
       </tr>
    </table>
    	<el-button type="info" @click="openDialog" class="saveBtn">修改校园信息</el-button>
        
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%"
         center>
	    	<span>您确认要保存该信息?</span>
	  		<span slot="footer" class="dialog-footer">
	    		<el-button @click="dialogVisible = false">取 消</el-button>
	    		<el-button type="primary" @click="saveSchoolMsg">确 定</el-button>
	  		</span>
        </el-dialog>
  </div>
  <!-- -->
</template>

<script>

import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';


export default {
  data(){
    return {
        schools: {},
        dialogVisible: false,
        isView1: true,
        isView2: true,
        isView3: true,
        isView4: true,
        isView5: true,
    }
  },
  computed: {
    ...mapGetters(['schoolInfoObj']),
  },
  created() {
    const that = this;
    this.findSchoolInfo()
      .then(function(data){
           that.schools = data;
      })
      .catch(function(error){
      	   console.log(error);
      })
  },
  methods: {
  	...mapActions(['findSchoolInfo','updateSchoolInfo']),
  	openDialog() {
  		 this.dialogVisible = true;
  	},
  	saveSchoolMsg() {
       const that = this;
       this.updateSchoolInfo(this.schools)
         .then(function(param){
                if(param.status == 200) {
                        that.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        });
                        that.findSchoolInfo();
                        that.dialogVisible = false;
                        that.isView1 = that.isView2 = that.isView3 =that.isView4 = that.isView5 = true;
                }
                else{
                    that.$notify.error({
                        title: '失败',
                        message: param.data.stauts+'失败'
                    });
                }
         })
         .catch(function(error){

         })
  	},
    readyTochange1() {
       this.isView1 = false;
       this.isView2 = this.isView3 = this.isView4 = this.isView5 = true;
    },
    readyTochange2() {
       this.isView2 = false;
       this.isView1 = this.isView3 = this.isView4 = this.isView5 = true;
    },
    readyTochange3() {
       this.isView3 = false;
       this.isView1 = this.isView2 = this.isView4 = this.isView5 = true;
    },
    readyTochange4() {
       this.isView4 = false;
       this.isView1 = this.isView2 = this.isView3 = this.isView5 = true;
    },
    readyTochange5() {
       this.isView5 = false;
       this.isView1 = this.isView2 = this.isView3 = this.isView4 = true;
    },
  }
}
</script>
<style>
	
</style>
<style scoped>
   table{
   	  width: 96%;
   	  table-layout: fixed;
      border-collapse: collapse;
      line-height: 30px;
      margin: 0 20px;
      font-size: 14px;
   } 
    td{
        border: 1px solid #333;
    }
    td:first-of-type{
        width: 15%;
        text-align: center;
    }
    td:last-of-type{
        padding:0 20px;
    }
    button.saveBtn{
   	  float: right;
   	  margin-top: 80px;
   	  margin-right: 40px;
    }
</style>