
$(function(){
    var $tbody = $(".itemBlock tbody"),
        itemDataArr = [],
        parentNameArr  = [];
    var parentIdArr = [],url="http://120.78.164.247:8099/manager/category/";

    //创建行及单元格
    function insertTr(){
    	var $cloneTr = $tbody.children().eq(1).clone(true),
    	tdArr = $cloneTr.find("td").toArray(),tempArr;
        $tbody.append($cloneTr);
        $cloneTr.removeClass("viewable");
        tempArr = [$cloneTr,tdArr];
        return tempArr;
    }
    //创建模态框下select option子元素,供选择
    function createOpt(){
    	for(var i = 0;i<parentNameArr.length;i++){
    		var parentVal = parentNameArr[i],parentId = parentIdArr[i];
    		$("#itemAddModal .modal-body select").eq(0).append("<option value='"+parentId+"'>"+parentVal+"</option>");
    		$("#changeAddModal .modal-body select").eq(0).append("<option value='"+parentId+"'>"+parentVal+"</option>");
    	}
    }
    //获取所有数据
    function getAllItmeData(){
    	 $.get(url + "findAllCategory",function(request){
              var itemData = request.data,len = itemData.length;
              for(var i =0;i<len;i++){
              	  var tempArr = insertTr();
              	  tempArr[0].attr("itemId",itemData[i].id);
              	  $(tempArr[1][1]).text(itemData[i].name);
              	    if(parentNameArr.indexOf(itemData[i].name)==-1){
              	  		parentNameArr.push(itemData[i].name);
              	  		parentIdArr.push(itemData[i].id);
              	  	}
              	  if(itemData[i].parent){
              	  	$(tempArr[1][2]).attr("parentId",itemData[i].parent.id);
              	  	$(tempArr[1][2]).text(itemData[i].parent.name);
              	  }
              	  else $(tempArr[1][2]).text("无");
              	  $(tempArr[1][3]).text(itemData[i].comment);
              } 
              createOpt();
    	 });
    }
    getAllItmeData();
    //验证新增数据
    $('.modal-body input').eq(0).blur(function(){
    	 var nameReg = /[\u4e00-\u9fa5A-z]/g;
    	 if(nameReg.test($(this).val())){
    	 	itemDataArr[0] = $(this).val();
    	 }
    	 else {
    	 	itemDataArr[0] = null;
    	 	$(".modal-body span").eq(0).text("*格式有误");
    	 }
    });

    $(".modal-body input").eq(1).blur(function(){
         var descReg = /\S/g; 
         if(descReg.test($(this).val())){
         	itemDataArr[2] = $(this).val();
         }
         else {
    	 	itemDataArr[2] = null;
    	 	$(".modal-body span").eq(1).text("*格式有误");
    	 }
    });
    $(".modal-body input").focus(function(){
    	$(this).next("span").text("");
    });
    //新增数据
    $(".modal-footer .btn-success").click(function(){
          addItemData();
    });
    function addItemData(){
       itemDataArr[1] = $('.modal-body select').eq(0).val();
       if(itemDataArr.length == 3&&itemDataArr.indexOf(null) == -1){
          var obj = {
          	  name:itemDataArr[0],
          	  comment:itemDataArr[2]
          }
          if(itemDataArr[1]!="无"){
             obj.parentId = itemDataArr[1]
          }
          $.post(url+"saveOrUpdateCategory",obj,function(request){
              if(request.status == 200){
                $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
                getAllItmeData();clearModalValue();
              }
              else{
                alert(request.status+",异常");
              }
          });
       }       
    }	
    //事件冒泡 删除一条/修改一条数据

    $tbody.on("click","button",function(event){
      var type = $(event.target).attr("class").indexOf("change") == -1;
      //type 为true ：为删除按钮
      var goal = $(this).parents("tr").attr("itemId");
      if(type){
      	 delAData(goal);
      	 $(this).parents("tr").remove();
      }
      //type 为false：为修改按钮
      else{
      	var changeTdArr = $(this).parents('tr').find('td');
      	changeData(goal,changeTdArr);
      }
    });
    function delAData(goal){
       var obj = {id:goal}
       $.get(url+"deleteCategoryById",obj,function(request){
           if(request.status == 500){
               alert('500,后台异常')
           }
       });
    }
    function changeData(goal,changeTdArr){
    	//goal:本栏目的id;
    	var changeName = $(changeTdArr[1]).text(),
            changeParent = $(changeTdArr[2]).text(),
            changeComment = $(changeTdArr[3]).text();
        $('#changeAddModal select').find('option').each(function(index,item){
             if($(item).text() == changeParent){
                   $(item).attr("selected",true);
                   $('#changeAddModal p').eq(1).attr('thisParId',$(item).attr("value"));
             }
        });
    	$('#changeAddModal input').eq(0).val(changeName);
    	$('#changeAddModal input').eq(1).val(changeComment);
    	$('#changeAddModal p').eq(0).attr("thisId",goal);

    }

    $('#changeAddModal .btn-success').click(function(){
    	 var obj = {
    	 	id:$('#changeAddModal p').eq(0).attr("thisId"),
    	 	name:$('#changeAddModal input').eq(0).val(),
    	 	comment:$('#changeAddModal input').eq(1).val()
    	 }
    	 if($('#changeAddModal option:selected').text() !="无"){
    	 	 obj.parentId = $('#changeAddModal option:selected').attr("value");
    	 }
    	 console.log(obj);
    	 $.post(url+"saveOrUpdateCategory",obj,function(request){
    	 	       if(request.status == 200){
                  $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
                  getAllItmeData();
                  $("#changeAddModal").modal("hide");
               }
               else{
                  alert(request.status+",异常");
               }
         });
    });

    // 删除全部选中的数据
    $('.del .modal-footer .yesdel').click(function(){
          delAllOfData();
    });
    $(".itemBlock button.allChecked").click(function(){
        $tbody.find("tr").not(":first,:nth-of-type(2)").find("input[type='checkbox']").prop("checked",true);
    });
    $(".itemBlock button.reduceChecked").click(function(){
        $tbody.find("tr").not(":first,:nth-of-type(2)").find("input[type='checkbox']").prop("checked",false);
    });
    function delAllOfData(){
         var checkArr  = $('tr').find("input[type=checkbox]:checked"),
               targetArr = [];
           checkArr.each(function(index,item){
           	   targetArr.push($(item).parents('tr').attr("itemId"));
           });
           var obj = {
           	   ids:targetArr.toString()
           }
           $.post(url+"batchDeleteCategory",obj,function(request){
               if(request.status == 200){
                  $tbody.find("tr").not(":first,:nth-of-type(2)").remove();
                  getAllItmeData();
                  $("#delAllModal").modal("hide");
               }
               else{
                  alert(request.status+",异常");
               }
           });
    }

    //关闭模态框
    //add模态框
    $("#itemAddModal .modal-footer .btn-danger,#itemAddModal span.close").click(
    function(){
    	$("#itemAddModal").modal("hide");
    });
    //全删模态框
    $(".del .modal-footer .btn-info, .del .modal-header span").click(
    function(){
    	$('tr').not(":first,:nth-of-type(2)").find("input[type='checkbox']").prop("checked",false);
        $("#delAllModal").modal("hide");
    });
    //修改模态框
    $("#changeAddModal .modal-footer .btn-danger,#changeAddModal .modal-header span").click(
    function(){
    	$('tr').not(":first,:nth-of-type(2)").find("input[type='checkbox']").prop("checked",false);
        $("#changeAddModal").modal("hide");
    });
    //清除模态框内数据
    function clearModalValue(){
    	$(".modal-body input").each(function(index,item){
    		$(item).val("");
    	});
    	$(".modal-body select").eq(0).val("无");
    }
});