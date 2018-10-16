//关闭模态框
$("#consultAddModal .modal-footer .btn-danger,#consultAddModal span.close").click(
    function(){
    	$("#consultAddModal").modal("hide");
});
$("#editConModal .modal-footer .btn-danger,#editConModal span.close").click(
    function(){
    	$("#editConModal").modal("hide");
});
//关闭批量删除提示模态框
$("#delTipModal .modal-footer .btn-info, #delTipModal .modal-header span").click(
    function(){
    	$('tr').not(":first,:nth-of-type(2)").find("input[type='checkbox']").prop("checked",false);
        $("#delTipModal").modal("hide");
});
// -------
var $tbody = $(".consultBlock div table tbody"),
    $nextBtn = $("div.pageTip button.next"),
    $lastBtn = $("div.pageTip button.last"),
    $pPage = $("div.pageTip p");
//创建行及单元格
    function createTrModal(){
    	var $cloneTr = $tbody.children().eq(1).clone(true),
    	tdArr = $cloneTr.find("td").toArray(),tempArr;
        $tbody.append($cloneTr);
        $cloneTr.removeClass("viewable");
        tempArr = [$cloneTr,tdArr];
        return tempArr;
    }
//创建模态框下select option子元素,
    //定义数组临时存储每一条资讯的父栏信息
    var parentNameArr = [],parentIdArr = [];
    function createParentOpt(){
    	for(var i = 0;i<parentNameArr.length;i++){
    		var parentVal = parentNameArr[i],parentId = parentIdArr[i];
    		$("#consultAddModal .modal-body select:nth-of-type(1)").eq(0).append("<option value='"+parentId+"'>"+parentVal+"</option>");
    	}
    }
    var authorNameArr = [],authorIdArr = [];
    function createAuthorOpt(){
    	for(var i = 0;i<authorNameArr.length;i++){
    		var authorVal = authorNameArr[i],authorId = authorIdArr[i];
    		$("#consultAddModal .modal-body select:nth-of-type(2)").eq(0).append("<option value='"+authorId+"'>"+authorVal+"</option>");
    	}
    }
//获取所有数据---初始化
    var pagesNum = 0;
    function getAllConsultData(no,size){
    	//通过改变page值,改变页码,获取不同的值
        // var page = 1,pageSize = 10;
        var page,pageSize;
        page = arguments[0] == undefined?1:no;
        pageSize = arguments[1] == undefined?10:size;
       
        //获取资讯模块所有信息
    	$.get("http://120.78.164.247:8099/manager/article/findArticle?page="+page+"&pageSize="+pageSize+"",function(request){
            if(request.status == "500"){
               $('.warningBox span.iconfont').text('Warning');
               $('.warningBox span:nth-of-type(2)').text('500异常,请翻页试试看');
               $('.warningBox').css('display','block');
               $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
            }
            else if(request.status == "200"){
              if(request.data){
                $('.warningBox').css('display','none');
              	var pageData = request.data.list,len = pageData.length;
              	    pagesNum = Math.ceil(request.data.total/pageSize);
  	            for(var i =0;i<len;i++){
  	            	var tempArr = createTrModal();
  	            	//存储id到行级,每一行一个id
  	            	tempArr[0].attr("consultId",pageData[i].id);
  	            	//单元格内赋值
  	            	$(tempArr[1][1]).text(pageData[i].title);
  	            	pageData[i].music == null? $(tempArr[1][3]).text("无"):$(tempArr[1][3]).text(pageData[i].music);
  	            	$(tempArr[1][4]).text(pageData[i].author);
  	            	pageData[i].publishtime==null?$(tempArr[1][5]).text("未发布"):$(tempArr[1][5]).text(pageData[i].publishtime);
  	            	$(tempArr[1][6]).text(pageData[i].readtimes);
  	            	//将查询到的父栏id与文本存给数组parentNameArr,parentIdArr
  	              	if(pageData[i].category){
  	              		$(tempArr[1][2]).text(pageData[i].category.name);
  	              	}
  	              	else{
  	              		$(tempArr[1][2]).text("无");
  	              	}
  	            }
  	            // fobid(pagesNum);//是否禁止翻页按钮
              }
            }
            
    	});
    	//获取栏目模块的栏目名称和Id
    	$.get("http://120.78.164.247:8099/manager/category/findAllCategory",function(request){
             var itemData = request.data,len = itemData.length;
             for(var i =0;i<len;i++){
             	parentIdArr[i] = itemData[i].id;
             	parentNameArr[i] = itemData[i].name;
             }
             createParentOpt();
    	});
    	//获取用户模块的用户名和ID
    	$.get("http://120.78.164.247:8099/manager/user/findAllUser",function(request){
             var userData = request.data,len = userData.length;
             for(var i =0;i<len;i++){
             	authorIdArr[i] = userData[i].id;
             	authorNameArr[i] = userData[i].username;
             }
             createAuthorOpt();
    	});
    }
    getAllConsultData();
//翻页
    // 下一页
    function nextPage(){
        var no = $pPage.text();
        no++;
        $pPage.text(no);
        $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
        getAllConsultData(no);

        fobid(pagesNum);
    }
    $nextBtn.click(function(){
         var open = true;
         if(open){
         	 open = false;
         	 nextPage();
         }
    });
    // 上一页
    function lastPage(){
        var no = $pPage.text();
        no--;
        $pPage.text(no);
        $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
        getAllConsultData(no);

        fobid(pagesNum);
    }
    $lastBtn.click(function(){
         var open = true;
         if(open){
         	 open = false;
         	 lastPage();
         }
    });

//输入页码和数据条数以展现
    $('.pageControl button').click(function(){
         var page = $('.pageControl input').eq(0).val();
         var size = $('.pageControl input').eq(1).val();
         sta = '';
         $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
         getAllConsultData(page,size);
         $('.pageControl input').val('');
         $('p.btn').text(page);
        
    });


//禁用nextOrlast按钮
    function fobid(pagesNum){
        $pPage.text() == 1?$lastBtn.attr("disabled",true):$lastBtn.attr("disabled",false);
        // $pPage.text()<pagesNum?$nextBtn.attr("disabled",true):$nextBtn.attr("disabled",false);
    }
    fobid();
//删除单条数据
    function deleteAConcultData(goal){
    	var obj = {id:goal},
    	    url = "http://120.78.164.247:8099/manager/article/deleteArticleById";
    	$.get(url,obj,function(request){
          if(request.status == 500){
             alert("后台异常"+ request.status);
          }
    	});
    }
//给单元格内删除和修改按钮绑定对应事件
$tbody.on("click","i",function(event){
      var type = $(event.target).attr("class").indexOf("glyphicon-trash") == -1;
      //type 为true ：为修改按钮
      var goal = $(this).parents("tr").attr("consultid");
      if(type){
      	var changeTdArr = $(this).parents('tr').find('td'),
      	    id = $(this).parents("tr").attr("consultid");
      	$("#editConModal input").eq(0).val($(changeTdArr[1]).text());
      	$("#editConModal input").eq(3).val($(changeTdArr[3]).text());
      	$("#editConModal .modal-body p").eq(0).attr("changeTargerId",id);
      }
      //type 为false：为删除按钮
      else{
      	deleteAConcultData(goal);
      	$(this).parents("tr").remove();
      }
});
//删除所有勾选的数据
function delAllOfConData(){
    var checkArr  = $('tr').find("input[type=checkbox]:checked"),
        targetArr = [],
        url = "http://120.78.164.247:8099/manager/article/batchDeleteArticle";
    checkArr.each(function(index,item){
       	targetArr.push($(item).parents('tr').attr("consultid"));
    });
    var obj = {
       	ids:targetArr.toString()
    }

    checkArr.parents('tr').remove();
    $.post(url,obj,function(request){
          console.log(request.status);
          if(request.status == 200){
            $('.warningBox span.iconfont').text('Tip');
            $('.warningBox span:nth-of-type(2)').text('删除成功');
            $('.warningBox').css('display','block');
            setTimeout(function(){
               $('.warningBox').css('display','none');
            },1500);
          }
          else{
            alert('删除失败,状态码：'+request.status);
          }
    });
    // $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
    // getAllConsultData($('p.btn').text());

    $("#delTipModal").modal("hide");
    // location.reload();
}
//绑定勾选数据的删除事件给模态框内yes按钮;
$('#delTipModal .modal-footer .yesdel').click(function(){
          delAllOfConData();
});

//验证添加的数据是否标准并添加数据
$("#consultAddModal input").focus(function(){
  $("#consultAddModal .btn-success").attr("disabled",false);
  $("#consultAddModal .modal-body span").text("");
});

var dataArr = [],reg = /[A-z|\u4e00-\u9fa5]/g;;
$("#consultAddModal .modal-body input").eq(0).blur(function(){
    if(reg.test($(this).val())){
    	dataArr[0] = $(this).val();
    }
    else{
    	$("#consultAddModal .modal-body span").text("*标题栏格式不符");
    	$("#consultAddModal .btn-success").attr("disabled",true);
    }
});

$("#consultAddModal .modal-footer .btn-success").click(function(){
    dataArr[1] = $("#consultAddModal .modal-body select").eq(0).val();
    dataArr[2] = $("#consultAddModal .modal-body input[type='radio']:checked").val();
    dataArr[3] = $("#consultAddModal .modal-body select").eq(1).val();
    var musicVal = $("#consultAddModal .modal-body input").eq(5).val();
    if(musicVal&&musicVal!="无"){
     	dataArr[4] = $("#consultAddModal .modal-body input").eq(5).val();
    }
    var obj = {
    	title:dataArr[0],
    	liststyle:dataArr[2],
    }
    if(dataArr[1] !="无"&&dataArr[3]!="无"){
    	obj.categoryId = dataArr[1];
    	obj.userId = dataArr[3];
    }
    else if(dataArr[1] !="无"&&dataArr[3] == "无"){
    	obj.categoryId = dataArr[1];
    }
    else if(dataArr[3] !="无"&&dataArr[1] == "无"){
    	obj.userId = dataArr[3];
    }
    $.post("http://120.78.164.247:8099/manager/article/saveOrUpdateArticle",obj,function(request){
          console.log(request.status);
          if(request.status == 200){
            $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
            // console.log('总页数'+pagesNum);
            getAllConsultData(pagesNum);
            $('p.btn').text(pagesNum);
          }
          else{
            alert('添加失败,状态码：'+request.status);
          }
    });
});

//修改数据
$("#editConModal input").focus(function(){
     $("#editConModal .modal-footer .btn-success").attr("disabled",false);
});
$("#editConModal .modal-footer .btn-success").click(function(){

      var obj = {
      	id:$("#editConModal .modal-body p").eq(0).attr("changeTargerId"),
      	liststyle:$("#editConModal input[type='radio']:checked").val(),
      	readtimes:0,
      	music:$("#editConModal input").eq(3).val(),
      };
      if(reg.test($("#editConModal input").eq(0).val())){
          obj.title = $("#editConModal input").eq(0).val();
         
          $.post("http://120.78.164.247:8099/manager/article/saveOrUpdateArticle",obj,function(request){
               console.log(request);
               if(request.status == 200){
                 $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
                 $("#editConModal").modal("hide");
                 $("div.pageTip p").text("1");
                 var page = $('p.btn').text();
                 getAllConsultData(page);
               }
               else{
                 alert("修改失败,状态码："+request.status);
               }
          });
      }
      else{
      	$(this).attr("disabled",true);
      }   
});