

var imgSrc ="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538226186799&di=8dd5be71655769df474e87b0109a936f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01460b57e4a6fa0000012e7ed75e83.png";
// 获取数据库所有数据
function getAllUserData(){
    $.get("http://120.78.164.247:8099/manager/user/findAllUser",function(request){
    //所有的数据 与之对应的是所有的div信息块
        var dataArr = request.data;
        var len = request.data.length;
        for(var i = 0;i<len;i++){
            // 问题：将每个$cloneBorade和每个tdArr对应
            var $cloneBorade = $(".cloneForm").eq(0).clone(true);
            $cloneBorade.removeClass("noviewable");
            var tdArr = $cloneBorade.find("tr:not(:last) td:odd").toArray();
            //当className和属性名相同时，插入数据（一个信息块内）
            for(var key in dataArr[i]){
               if(tdArr[0].className == key){
                  $(tdArr[0]).text(dataArr[i][key]);
               }
               else if(tdArr[1].className == key){
                  $(tdArr[1]).text(dataArr[i][key]);
               }
               else if(tdArr[2].className == key){
                  $(tdArr[2]).text(dataArr[i][key]);
               }
               else if(key == "id"){
                  $cloneBorade.attr("flag",dataArr[i][key]);
               }
            }
            //img
            if(dataArr[i].userface){
               $cloneBorade.find("img").attr("src",dataArr[i].userface);   
            }
            else{
               $cloneBorade.find("img").attr("src","../images/user.png");  
            }
            // 滑块状态
            var boolValue = dataArr[i].enabled;
            if(boolValue == true){
               $cloneBorade.find("div.state").addClass("openState");
               $cloneBorade.find("div.state .circle").addClass("slide");
               $cloneBorade.find("div.state span").text("启动");
            }
            $("div.userMsg").append($cloneBorade);
        }
    });
}
getAllUserData();


$("button.clozz").click(function(){
    $('div.usermodal').modal('hide');
});
$(".modal-header span.close").click(function(){
    $('div.usermodal').modal('hide');
});
// 添加数据
var checkArr = [];

$('#usermodal input').focus(function(){
    $(this).css("borderColor","#333");
    $("button.add").attr("disabled",false);
});
//验证数据
$('#usermodal input').eq(0).blur(function(){
    var  userNameReg = /(\S)/ig, $value = $(this).val();
    if(userNameReg.test($value)){
       checkArr[0] = $value;
    }
    else {
        checkArr[0] = null;
        $(this).css("borderColor","red");
    }
});
$('#usermodal input').eq(1).blur(function(){
    var  passReg = /[A-z|0-9]+/ig, $value = $(this).val();
    console.log($value);
    if(passReg.test($value)){
        checkArr[1] = $value;
    }
    else {
        checkArr[1] = null;
        $(this).css("borderColor","red");
    }
});
$('#usermodal input').eq(2).blur(function(){
    var $value = $(this).val();
    console.log($value);
    if($value == $('#usermodal input').eq(1).val()){
        checkArr[2] = $value;
    }
    else {
        checkArr[2] = null;
        $(this).css("borderColor","red");
    }
});
$('#usermodal input').eq(3).blur(function(){
    var nickReg = /^[\u4e00-\u9fa5]+$/g, $value = $(this).val();
    if(nickReg.test($value)){
         checkArr[3] = $value;
    }
    else {
         checkArr[3] = null;
        $(this).css("borderColor","red");
    }
});
$('#usermodal input').eq(4).blur(function(){
    // var emailReg = /[0-9]+/g,
        var emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/g,
        $value = $(this).val();
    if(emailReg.test($value)){
         checkArr[4] = $value;
    }
    else {
         checkArr[4] = null;
        $(this).css("borderColor","red");
    }
});
$("button.add").removeAttr("disabled");
$('button.add').click(function(){
    if(checkArr.length ==5&&checkArr.indexOf(null)==-1){
      sendUserData();
    }
    else {
      $("button.add").attr("disabled",true);
    }
});


//发送数据
function sendUserData(){
    console.log(checkArr);
    var obj = {
        username : checkArr[0],
        password : checkArr[1],
        nickname : checkArr[3],
        email    : checkArr[4],
        userface : imgSrc
    };
    $.post("http://120.78.164.247:8099/manager/user/saveOrUpdateUser",obj,function(){
    });
    $("div.userMsg").find(".cloneForm").not(":first").remove();
    getAllUserData();
    checkArr.length = 0;
    $("input").each(function(index,item){
           $(item).val("");
    });
    $("button.add").attr('disabled',"true");
}

//修改--换头像
$("div.userMsg").on("click","button.changePhoto",function(event){
   var $fakeBtn = $(event.target),$img = $fakeBtn.parents(".cloneForm").find("img"); 
   var $this = changePhoto($fakeBtn);

   // console.log($fakeBtn,$img);
   $this.on("change",function(){
      var formData = new FormData(),
          file = this.files[0];
      var obj = {
             id:$fakeBtn.parents(".cloneForm").attr("flag"),
             username:$fakeBtn.parents(".cloneForm").find("td.username").text(),
             nickname:$fakeBtn.parents(".cloneForm").find("td.nickname").text(),
             email:$fakeBtn.parents(".cloneForm").find("td.email").text()
          }
          console.log(obj);
       formData.append("file",file);
       $.ajax({
          url:"http://120.78.164.247:8099/manager/file/upload",
          type:'POST',
          cache: false,
          processData: false,
          contentType: false,
          data: formData,
          success: function(request){
              var url = "http://39.108.81.60:8888/" + request.data.groupname +"/"+ request.data.id;
              obj.userface = url;
              $.post("http://120.78.164.247:8099/manager/user/saveOrUpdateUser",obj);
              $img.attr("src",url);
          }
       });
   });
});
function changePhoto($fakeBtn){
     var $fake = $fakeBtn;
     var $thisPar =$fake.parents(".cloneForm"); 
     return  $thisPar.find("input.file").click();
     // return  $(".file").click();
}

//查询用户
$("div.operate button.btn-warning").click(function(){
       var reg = $.trim($("div.operate input").val());
       console.log(reg);
       if(reg){
        $("div.userMsg .cloneForm").not(":first").remove();
         var $cloneBorade = $(".cloneForm").eq(0).clone(true),
             tdArr = $cloneBorade.find("tr:not(:last) td:odd").toArray(),
             obj = {username:reg};
         $cloneBorade.removeClass("noviewable");
         $.get("http://120.78.164.247:8099/manager/user/findUserByUsername",obj,function(request){
            // if(request.state == 200){
               $cloneBorade.attr("flag",request.data.id);
               $(tdArr[0]).text(request.data.username);
               $(tdArr[1]).text(request.data.nickname);
               $(tdArr[2]).text(request.data.email);
               if(request.data.userface){
                   $cloneBorade.find("img").attr("src",request.data.userface);   
                }
                else{
                   $cloneBorade.find("img").attr("src","../images/user.png");  
                }
                // 滑块状态
                var boolValue = request.data.enabled;
                if(boolValue == true){
                   $cloneBorade.find("div.state").addClass("openState");
                   $cloneBorade.find("div.state .circle").addClass("slide");
                   $cloneBorade.find("div.state span").text("启动");
                }
                $("div.userMsg").append($cloneBorade);
                $("div.operate input").val("");
            // }
         });
       }
       else{
          // $("div.userMsg .cloneForm").not(":first").remove();
          // getAllUserData();
          location.reload();
       }
});
