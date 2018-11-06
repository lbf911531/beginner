// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		//题库管理模块信息
		questions: [],   //----全部题目
		//问卷管理模块
		naires: []
	},
	getters:{
		questions: state=>state.questions,
		naires: state=>state.naires
	},
	mutations:{
		changeQuesInfo(state,data) {
			state.questions = data;
		},
		changeNaireInfo(state,data) {
			state.naires = data;
		}
	},
	actions:{
		//题库管理模块信息
		// 查询
		findAllQues(context) {
			return new Promise(function(resolve,reject){
                 axios.get('/question/findAllQuestionVM')
                   .then(function(param){
                   	   var temp = [];
                       param.data.data.forEach(function(item){
                           if(item.questionType && item.questionType.indexOf("选") !== -1){
		                       	temp.unshift(item);
		                    }
		                   else{
		                        temp.push(item);
		                    }
                       });
                       context.commit('changeQuesInfo',temp);
                       resolve(temp);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
		},
		saveQuestionInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/question/saveOrUpdateQuestion',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		deleteQuestionByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/question/batchDeleteQuestion',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		deleteOneQuestion(context,obj) {
			return new Promise(function(resolve,reject){
                axios.get('/question/deleteQuestionById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
	  //----------------------
	    //问卷
	    findAllNaire(context) {
	    	return new Promise(function(resolve,reject){
                 axios.get('/questionnaire/findAllQuestionnaire')
                   .then(function(param){
                       context.commit('changeNaireInfo',param.data.data);
                       resolve(param.data.data);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
	    },
	    findQuestionNaireById(context,obj) {
	    	return new Promise(function(resolve,reject){
                 axios.get('/questionnaire/findQuestionnaireVMById',{params:obj})
                   .then(function(param){
                       resolve(param.data.data);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
	    },
	    updateNaireInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/saveOrUpdateQuestionnaire',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		deleteNaireById(context,obj) {
            return new Promise(function(resolve,reject){
                axios.get('/questionnaire/deleteQuestionnaireById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		deleteNaireByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		}
	}
}