 window.onload = function(){

	var fixtop = document.getElementById('fixtop');
    function scrollEvent(){
		if(document.documentElement.scrollTop||document.body.scrollTop||window.pageYOffset){
		 	 var scrollTop = document.documentElement.scrollTop;
		}
		if(scrollTop>660){
		 	 fixtop.style.display = "block";
		}
		else {
		 	 fixtop.style.display = "none";
		}
	}
	setInterval(scrollEvent,500);


    function imgCartoon(){
	    var imgarea = document.getElementById('imgarea');
	    var imgArr=["./images/590/18.jpg","./images/590/8.jpg","./images/590/6.jpg","./images/590/9.jpg"]; 
        var len = imgArr.length;
        var num = 0;
        setInterval(function(){
	        for (var i =0; i<len;i++){
	              if(num < len){
	            	    imgarea.src= imgArr[num];
	               }
	              else{
	            	    imgarea.src=imgArr[0];
	            	    num = 0;
	               }  
	        }  
	        num++;
        },2000);
    }
    imgCartoon();
}