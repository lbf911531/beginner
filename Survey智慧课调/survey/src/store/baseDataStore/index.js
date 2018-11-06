// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
        //校园信息
        schoolInfoObj: [],
        //年级管理
        grades: [],
        //班级管理
        clazzs: [],
        // 课程管理
        courses: [],
        // 教师管理
        teachers: [],
	},
	getters:{
		schoolInfoObj: state=> state.schoolInfoObj,
		grades: state=>state.grades,
		teachers: state=>state.teachers,
		courses: state=>state.courses,
		clazzs: state=>state.clazzs
	},
	mutations:{
        changeSchoolInfo(state,data){
        	state.schoolInfoObj = data;
        },
        changeGradesInfo(state,data){
        	state.grades =  data;
        },
        changeTeacherInfo(state,data){
        	state.teachers = data;
        },
        changeCourseInfo(state,data){
        	state.courses = data;
        },
        changeClazzInfo(state,data){
        	state.clazzs = data;
        }
	},
	actions:{
		// 查询校园信息
		findSchoolInfo(context) {
			return new Promise((resolve,reject)=>{
				axios.get('/school/findById',{params:{id:3}})
				  .then(function(param){
                      context.commit('changeSchoolInfo',param.data.data);
                      resolve(param.data.data);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			})
		},
		// 修改校园信息
		updateSchoolInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/school/saveOrUpdate',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
	// --------------------
		// 查询年级信息
		findGradesInfo(context) {
			return new Promise((resolve,reject)=>{
				axios.get('/grade/findAll')
				  .then(function(param){
				  	  var temp = [];
				  	  param.data.data.forEach(function(item,index){
                           if(item.schoolId == 3) {
                           	   temp.push(item);
                           }
				  	  });
				  
                      context.commit('changeGradesInfo',temp);
                      resolve(temp);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		// 新增、编辑年级数据
		saveGradesInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/grade/saveOrUpdate',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		//删除单条年级数据
		deleteGradeById(context,obj) {
             return new Promise(function(resolve,reject){
                axios.get('/grade/deleteById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		// 删除勾选的年级数据
		deleteGradeByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.get('/grade/batchDelete',{params:obj})
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
	// --------------------
		// 查询教师信息
		findTeacherInfo(context) {
			return new Promise((resolve,reject)=>{
				axios.get('/user/findAll')
				  .then(function(param){
                      context.commit('changeTeacherInfo',param.data.data);
                      resolve(param.data.data);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		// 新增、编辑教师数据
		saveTeacherInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/user/saveOrUpdate',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		//删除单条教师数据
		deleteTeacherById(context,obj) {
             return new Promise(function(resolve,reject){
                axios.get('/user/deleteById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		// 删除勾选的教师数据
		deleteTeacherByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/user/batchDelete',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
	// --------------------
	    //信息
	    // 查询课程信息
		findCourseInfo(context) {
			return new Promise((resolve,reject)=>{
				axios.get('/course/findAllCourse')
				  .then(function(param){
                      context.commit('changeCourseInfo',param.data.data);
                      resolve(param.data.data);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		// 新增、编辑课程数据
		saveCourseInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/course/saveOrUpdate',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		//删除单条课程数据
		deleteCourseById(context,obj) {
             return new Promise(function(resolve,reject){
                axios.get('/course/deleteById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		// 删除勾选的课程数据
		deleteCourseByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/course/batchDelete',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
	// --------------------
	    // 查询班级信息
		findClazzInfo(context) {
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findAllVM')
				  .then(function(param){
                      context.commit('changeClazzInfo',param.data.data);
                      resolve(param.data.data);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		// 新增、编辑班级数据
		saveClazzInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		//删除单条班级数据
		deleteClazzById(context,obj) {
             return new Promise(function(resolve,reject){
                axios.get('/clazz/deleteClazzById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		// 删除勾选的班级数据
		deleteClazzByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
	}
}