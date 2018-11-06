// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		//课调管理
		surveymsg: [],
		monitors: [],
		checkedmsg: []
	},
	getters:{
		surveymsg: state=>state.surveymsg,
		monitors: state=>state.monitors,
		checkedmsg: state=>state.checkedmsg,
	},
	mutations:{
		changeSurveyMsg(state,data) {
			state.surveymsg = data;
		},
		changeMonitors(state,data) {
			state.monitors = data;
		},
	    changeChecked(state,data) {
			state.checkedmsg = data;
		},
	},
	actions:{
		findAllSurveyMsg(context) {
			return new Promise(function(resolve,reject){
                 axios.get('/survey/findAllSurveyVM')
                   .then(function(param){
                   	   let temp = [];
                   	   param.data.data.forEach(function(item){
                            if(item.user){
                            	temp.push(item);
                            }
                   	   })
                       context.commit('changeSurveyMsg',temp);
                       resolve(temp);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
		},
		deleteSurveyMsgById(context,obj) {
            return new Promise(function(resolve,reject){
                axios.get('/survey/deleteSurveyById',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
		deleteSurveyMsgByChecked(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		updateSurveyMsgInfo(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.post('/survey/saveOrUpdateSurvey',qs.stringify(obj))
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		previewSurveyMsg(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.get('/survey/previewSurvey',{params:obj})
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},
		findThisStatus(context,obj) {
			return new Promise((resolve,reject)=>{
				axios.get('/survey/beginSurvey',{params:obj})
				  .then(function(param){
                      resolve(param);
				  })
				  .catch(function(error){
				  	  reject(error);
				  })
			});
		},

        //课调监控
        findAllMonitors(context) {
			return new Promise(function(resolve,reject){
                 axios.get('/survey/findAllSurveyVM')
                   .then(function(param){
                   	   let temp = [];
                   	   param.data.data.forEach(function(item){
                            if(item.status == "开启" || item.status == "未开启"){
                            	temp.push(item);
                            }
                   	   });
                       context.commit('changeMonitors',temp);
                       resolve(temp);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
		},
		closeCurrentMonitor(context,obj) {
			return new Promise(function(resolve,reject){
                axios.get('/survey/stopSurvey',{params: {id: obj.id}})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
		},
        
        //课调审核
        findAllCheckInfo(context) {
        	return new Promise(function(resolve,reject){
                 axios.get('/survey/findAllSurveyVM')
                   .then(function(param){
                   	   let temp = [];
                   	   param.data.data.forEach(function(item){
                            if(item.status && item.status.indexOf('审核') !== -1){
                            	temp.push(item);
                            }
                   	   });
                       context.commit('changeChecked',temp);
                       resolve(temp);
                   })
                   .catch(function(error){
                   	    reject(error);
                   });
			});
        },
        CanOrNotPassCheck(context,obj) {
        	return new Promise(function(resolve,reject){
                axios.get('/survey/checkSurvey',{params:obj})
                  .then(function(param){
                      resolve(param);
                  })
                  .catch(function(error){
                      reject(error);
                  })
            });
        },
        batchDeleteCheckedSurcey(context,obj) {
        	return new Promise(function(resolve,reject){
                axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj))
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