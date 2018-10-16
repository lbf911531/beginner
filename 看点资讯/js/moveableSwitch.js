
// 活动开关模块
$("div.state").click(function(event){
	var switchVal = moveable($(this));
	var id = $(this).parents(".cloneForm").attr("flag");
	var obj = {
          id:id,
          status:switchVal
	}
	$.post("http://120.78.164.247:8099/manager/user/changeStatus",obj,function(){
	});
});
function moveable(target){
	var $span = target.find("span"),$text = $span.text(),
	    switchVal =false;
	if($text=="关闭"){
		target.find("span").text("启动");
        switchVal = true;
	}
	else target.find("span").text("关闭");
	target.toggleClass("openState");
	target.find(".circle").toggleClass("slide");
	return switchVal;
}