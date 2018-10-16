
	//头部隐藏区域的显隐
	function viewOrNoTop(){
		var topBarMenu = document.getElementsByClassName('topBarMenu')[0];
		topBarMenu.onmouseenter = function(){
			this.className = "topBarMenu viewable";
		}
		topBarMenu.onmouseleave = function(){
			this.className = "topBarMenu";
		}
	}
	viewOrNoTop();

    // ---------------------
	//头部文字轮播
	function slideWord(){
		var topBarRigh = document.getElementsByClassName('topBarRigh')[0],
		    aWord = topBarRigh.getElementsByTagName('a')[0];
		    wordArr = ["领取网易严选宝箱","游戏充值9.8折"];
		var index = 0;

        setInterval(function(){
        	aWord.className = "wordUpOut";
        	index = (index+1)%2;
        	setTimeout(function(){
        		aWord.className = 'wordDownOut';
        		aWord.innerText = wordArr[index];
        		setTimeout(function(){
        			aWord.className = "wordIn";
        		},500);
        	},500);
        },5000);
	}
    slideWord();

    // ---------------------
	//职业图片轮播
	function slideJobImg(){
		var jobNav = document.getElementsByClassName('jobNav')[0],
		    jobPeo = document.getElementsByClassName('jobPeo')[0],
		    jobImgArr = jobPeo.children,
		    jobNavArr = jobNav.children,
		    len = jobImgArr.length;
	    var index = 0,timer;

        //控制轮播
	    function controlSlide(){
	    	for(var i = 0 ;i < len ;i++){
	    		(function(i){
	    			jobNavArr[i].onclick = function(){
	    				//清除此时自动轮播的图片样式，改变index,重新开始自动轮播
	    				Array.prototype.slice.call(jobNavArr).forEach(function(item,index){
                             if(item.className.indexOf('jobNavActive') != -1){
                             	 item.removeAttribute('class');
                             	 jobImgArr[index].className = 'out';
                             	 jobImgArr[index].style.display = 'none';
                             }
	    				});
	    			
	    				index = i;
	    				jobImgArr[i].className = 'in';
	    				jobImgArr[i].style.display = "block";
	    		        jobNavArr[i].className = "jobNavActive";

	    		        clearInterval(timer);
	    		        timer = setInterval(slides,3000);
	    			}
	    		})(i);
	    	}
	    }
	    controlSlide();

	    //自动轮播
	    function slides(){
	    	index++;
	    	if(index == 0 ||index >=len){
	    		if(index>=len){index=0}
	    		jobImgArr[0].className = "in";
	    		jobImgArr[0].style.display = "block";
	    		jobNavArr[0].className = "jobNavActive";
	    		
	    		jobImgArr[len-1].className = "out"
	    		jobImgArr[len-1].style.display = "none";
	    		jobNavArr[len-1].removeAttribute('class');
	    	}
	    	else{
		    	jobImgArr[index].className = "in";
		    	jobImgArr[index].style.display = "block";
		    	jobNavArr[index].className = "jobNavActive";
		    	
		    	jobImgArr[index-1].className = "out"
		    	jobImgArr[index-1].style.display = "none";	
		    	jobNavArr[index-1].removeAttribute('class');
	        }
	    }
	    timer = setInterval(function(){
	    	slides();
	    },3000);
	   
	}
	slideJobImg();

    // ---------------------
    var btnChangeBox = document.getElementsByClassName('switchView')[0],
        viewBox = document.getElementsByClassName('viewBox')[0],
        noviewBox = document.getElementsByClassName('noviewBox')[0],
        withView = document.getElementsByClassName('withView')[0];
    var viewTime,indexs = 0;
    //控制右侧两个叠加的图片盒子的切换
    btnChangeBox.onclick = function(event){
    	var that = event.target;
        if(that.nodeName == 'A'){
        	that.className = 'selected';
        	if(that.previousElementSibling){
        		that.previousElementSibling.removeAttribute('class');
                viewBox.style.display = 'none';
                noviewBox.style.display = 'block';
                clearInterval(viewTime);
                slideRightViewImg(noviewBox);
        	}
        	else{
        		that.nextElementSibling.removeAttribute('class');
        		viewBox.style.display = 'block';
        		noviewBox.style.display = 'none';
        		clearInterval(viewTime);
        		slideRightViewImg(viewBox);
        	}
        }
    }

  
    //右侧显现盒子内的img切换
    function slideRightViewImg(targetBox){
        var iArr = withView.children,
	        imgArr = targetBox.children,
	        imgLen = imgArr.length;
	   
            function doSlide(){
             	if(indexs === 0 ){
	             	imgArr[0].style.opacity = '1';
	             	imgArr[0].style.zIndex = '1';
	             	iArr[0].className = 'viewI';
	             	imgArr[imgLen-1].style.opacity = '0';
	             	imgArr[imgLen-1].style.zIndex = '0';
	             	iArr[imgLen-1].removeAttribute('class');
                }
	            else{
		            imgArr[indexs].style.opacity = '1';
		            imgArr[indexs].style.zIndex = '1';
		            iArr[indexs].className = 'viewI';
		            imgArr[indexs-1].style.opacity = '0';
		            imgArr[indexs-1].style.zIndex = '0';
		            iArr[indexs-1].removeAttribute('class');
	            }
                indexs ++;
                indexs = indexs >= imgLen ? 0 : indexs;
            }

	    viewTime = setInterval(doSlide,2000);

 
        Array.prototype.slice.call(iArr).forEach(function(item,index){
        	item.onmouseenter = function(){
        		clearInterval(viewTime);
                  
                 Array.prototype.slice.call(iArr).forEach(function(item,index){
                        item.removeAttribute('class');
                 }); 
                
                  Array.prototype.slice.call(imgArr).forEach(function(item,index){
                        item.style.opacity = '0';
                        item.style.zIndex = '0';
                 }); 

        		imgArr[index].style.opacity = '1';
             	imgArr[index].style.zIndex = '1';
             	iArr[index].className = 'viewI';

                indexs = index+1;
             	viewTime = setInterval(doSlide,2000);
        	}
        });

    }
    slideRightViewImg(viewBox);
    
    // ---------------------
    //切换新闻展现----选项卡切换
    function tabControl(){
        var newsTitle = document.getElementsByClassName('newsTitle')[0],
            newsContent = document.getElementsByClassName('newsContent')[0],
            newsArr = newsContent.getElementsByTagName('ul'),
            titleLi = newsTitle.children[0].children,
            liArr = Array.prototype.slice.call(titleLi);
        newsTitle.addEventListener('mouseover',function(event){
        	if(event.target.nodeName == 'A'){
        		liArr.forEach(function(item,index){
        			item.removeAttribute('class');
        		});
        		Array.prototype.slice.call(newsArr).forEach(function(item){
                    item.removeAttribute('class');
        		});
                event.target.parentNode.className = 'newsActive';
                var flag = event.target.parentNode.getAttribute('flag');
                newsArr[flag].className = 'viewNews';
        	}
        },false);
    }
    tabControl();

    // ---------------------
    //背景音乐
	var btnAudio = document.getElementsByClassName('btnAudio')[0];
	var audio = document.getElementById('audio');
	function audioPlay(){
	    if(btnAudio.className.indexOf('on') == -1){
	    	//如果btn有on class 则将其转为off
	    	audio.play();
	    	btnAudio.className = "btnAudio on";
	    }
	    else{
	    	audio.pause();
	    	btnAudio.className = "btnAudio off";
	    }
	};	
	btnAudio.onclick = function(){
		audioPlay();
	}

	//// ---------------------
	var flag = 0;
	var imgUlBox = document.getElementsByClassName('imgUlBox')[0],
	        withChangeI = document.getElementsByClassName('strategyLine')[0].children;
            withChangeI = Array.prototype.slice.call(withChangeI);
    var len = withChangeI.length;
    var dist = parseFloat(imgUlBox.offsetWidth/2),currentDist,picTimer;
    function twoPictureSlide(){
    	var e  = flag%len;
        if(flag < len){
        	currentDist = -dist*flag;
        }
        else{
        	currentDist = 0;
        	flag = 0;
        }
        flag++;
        imgUlBox.style.transform = 'translateX('+currentDist+'px)';
        withChangeI.forEach(function(item){
            item.removeAttribute('class');
        });
        withChangeI[e].className = 'viewI';
        picTimer =  setTimeout(twoPictureSlide,3000);
    }
    twoPictureSlide();

    withChangeI.forEach(function(item,index){
           item.onclick = function(){
           	    clearTimeout(picTimer);
           	    imgUlBox.style.transform = 'translateX('+(-index*dist)+'px)';
           	    withChangeI.forEach(function(item){
                    item.removeAttribute('class');
                });
           	    withChangeI[index].className = 'viewI';
           	  
           	   flag = index+1;
           	  
           	   picTimer =  setTimeout(twoPictureSlide,3000);
           }
    });


     
     var dsTabArr = document.getElementsByClassName('dsTab')[0].children;
         dsTabArr = Array.prototype.slice.call(dsTabArr),
         dsIndex = 0,dsLen = dsTabArr.length;
     var dsTime;
       
     function dsSlide(){
         if(dsIndex == 0){
         	 dsTabArr[dsLen-1].style.zIndex = '-1';
         	 dsTabArr[dsLen-1].style.opacity = '0';
             dsTabArr[dsLen-1].removeAttribute('class');

         	 dsTabArr[0].style.zIndex = '1';
         	 dsTabArr[0].style.opacity = '1';
         	 dsTabArr[0].removeAttribute('class');   	 
         }
         else if(dsIndex == 1){
         	 dsTabArr[0].style.zIndex = '-1';
         	 dsTabArr[0].style.opacity = '0';

         	 dsTabArr[1].className = 'dsView open';
         	 dsTabArr[1].style.zIndex = '1';
         	 dsTabArr[1].style.opacity = '1';
         }
         else{  
         	 dsTabArr[dsIndex].style.zIndex = '1';
         	 dsTabArr[dsIndex].style.opacity = '1';
    
         	 dsTabArr[dsIndex-1].style.zIndex = '-1';
         	 dsTabArr[dsIndex-1].style.opacity = '0';
         	 dsTabArr[dsIndex-1].removeAttribute('class');
         }
         dsIndex++;
         dsIndex = dsIndex >= dsLen ? 0 : dsIndex;
         dsTime = setTimeout(dsSlide,3000);
     }     
     dsSlide();