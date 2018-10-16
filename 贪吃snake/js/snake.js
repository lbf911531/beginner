var div  = document.getElementsByTagName('div')[0];
var ul = document.getElementsByTagName('ul')[0];
var temp = document.getElementsByClassName('grade')[0];
var span = temp.getElementsByTagName('span')[0];
var btn = temp.getElementsByTagName('button');
  //初始化地图
  function createLi(){
    var li = document.createElement('li');
    li.style.width = 50 + "px";
    li.style.height = 50 +"px";
    li.style.listStyle = "none";
    li.style.cssFloat = "left"; 
    return li;
  }
  var  liList = [];
  for(var i =0;i<10;i++){
      liList[i] = [];
      for (var j = 0;j<10;j++){
        liList[i][j] = createLi();
        ul.appendChild(liList[i][j]);
      }
  }
 //初始化蛇头
 var snake = [];
 function initHead(){ 
     // var i = Math.floor(Math.random()*9+1) ;
     // var j = Math.floor(Math.random()*9+1) ;
     var i = Math.floor(Math.random()*7+1) ;
     var j = Math.floor(Math.random()*7+1) ;

     liList[i][j].style.backgroundImage = "url(images/head.png)"; 
     liList[i][j].style.backgroundSize = "50px 50px";
     i=i>9?i+"":"0"+i;
     j=j>9?i+"":"0"+j;
     var str = i+j;
     return str;
  }
   //返回蛇头的位置，并存储在一维数组
  snake.push(initHead());
   //初始化食物,食物的位置必须不等于蛇头与蛇身的位置
  var foodArr = [];
  function initFood(){
     var len = snake.length;
     var foodX = Math.floor(Math.random()*9+1);
     var foodY = Math.floor(Math.random()*9+1);
     var foodPosStr = "0"+foodX+"0"+foodY; 
     var decide = snake.every(function(item,index){
          return item !=  foodPosStr;
     });
     if(decide){
          liList[foodX][foodY].style.backgroundImage = "url(images/food.png)";
          liList[foodX][foodY].style.backgroundSize = "50px 50px";
          foodArr[0]=foodX;
          foodArr[1]=foodY;
     }
     else{
         initFood();
     }
  }
   //事件：键盘绑定事件，控制蛇的行动onkeydown
  var temp = [];
  document.addEventListener("keydown",controlSport);
  function controlSport(e){
    var eo = e||window.event;
    var code = eo.keyCode;
    switch (code){
      //上
      case 38:case 87:upward(); break; 
      //下
      case 40:case 83:downward(); break;
      //左
      case 37:case 65:leftward(); break; 
      //右
      case 39:case 68:rightward(); break; 
      default:console.log("---非方向控制键,无效---");
    }
  }
  function upward(){
       temp[0] = snake[0].slice(0,2);
       temp[1] = "-";
       temp[2] = "y";
  }
  function downward(){
       temp[0] = snake[0].slice(0,2);
       temp[1] = "+";
       temp[2] = "y";
  }
  function leftward(){
       temp[0] = snake[0].slice(2);
       temp[1] = "-";
       temp[2] = "x";
  }
  function rightward(){
       temp[0] = snake[0].slice(2);
       temp[1] = "+";
       temp[2] = "x";
  }
   //事件二:每当蛇吃完一个食物，随机刷新新的食物,且蛇本身添加一单位长度
   //       调用initFood()方法
  function eatFood(){
   if(foodArr[0]==snake[0].slice(0,2)&&foodArr[1]==snake[0].slice(2)){
        liList[foodArr[0]][foodArr[1]].style.borderRadius = "0";
        liList[foodArr[0]][foodArr[1]].style.backgroundColor = "none";
        foodArr.length = 0;
         
        var addSnakeX = snake[snake.length-1].slice(0,2);
        var addSnakeY = snake[snake.length-1].slice(2);

        growUp(addSnakeX,addSnakeY,temp[1],temp[2]);
        initFood();

        //每吃一个食物的同时计一分
        var grade = parseInt(span.innerHTML);
        span.innerHTML = ++grade;
    }
  }
  //当遇到食物后,在此刻snake数组尾部对应的位置添加一个单位
  function growUp(addX,addY,addDir1,addDir2){
        var str  = "";
        if((addDir2=="x"&&addDir1=="+")){
            //向右
            addY = parseInt(addY)-1;
        }
        else if(addDir2=="x"&&addDir1=="-"){
            //向左
            addY = parseInt(addY)+1;
        }
        else if(addDir2=="y"&&addDir1=="+"){
            //向下
            addX = parseInt(addX)-1;
        }
        else if(addDir2=="y"&&addDir1=="-"){
            //向上
            addX = parseInt(addX)+1;
        }
        addX = parseInt(addX);
        addY = parseInt(addY);
        if(addX>9||addY>9){snake.push("0000")}
        else{
        liList[addX][addY].style.backgroundImage = "url(images/body.png)";
        liList[addX][addY].style.backgroundSize = "50px 50px";
        addX = addX>9?""+addX:"0"+addX;
        addY = addY>9?""+addY:"0"+addY;
        str = addX+addY;
        snake.push(str);}
  }
  //身体的运动,刷新前一次snake数组内坐标对应的位置的色块,视觉上使之行动
  function changeSnakeColor(){
    for(var i=1;i<snake.length;i++){
      if(snake[i]!="0000"){
       liList[parseInt(snake[i].slice(0,2))][parseInt(snake[i].slice(2))].style.backgroundImage="url(images/body.png)";
       liList[parseInt(snake[i].slice(0,2))][parseInt(snake[i].slice(2))].style.backgroundSize = "50px 50px";
      }
     }
  }
  var tempSnake = [];
  function sportAfterGrow(tempArr){
    tempSnake = snake;//前一次的snake坐标
     for(var i=1;i<tempSnake.length;i++){
      liList[parseInt(tempSnake[i].slice(0,2))][parseInt(tempSnake[i].slice(2))].style.backgroundImage = "none";
       // liList[parseInt(tempSnake[i].slice(0,2))][parseInt(tempSnake[i].slice(2))].style.backgroundColor = "#83E0C4";
     }
     for(var i =tempArr.length-1;i>0;i--){
       snake[i]=tempArr[i-1];
     }
  }
  //判定当蛇撞到自身结束游戏
  function warning(){
     for(var i =1;i<snake.length;i++){
       if(snake[0]==snake[i]){
          alert("game over,你撞到自己了！！！");
          location.reload();
       }
     }
  }
   //事件三:初始化时蛇自动行动 
   //       蛇行动setTimeOut()/setInterval(),操作蛇头的坐标向左移动
  var switching;
  function initSport(target,aos,direct){
        var snakeX = snake[0].slice(0,2),
            snakeY = snake[0].slice(2);
        var tempArr = snake;
        sportAfterGrow(tempArr);
        
        if(arguments.length == 0){
           target = snake[0].slice(2);
           aos = "+";
           direct = "x";
        }
        liList[parseInt(snakeX)][parseInt(snakeY)].style.backgroundImage = "none";
        if(aos == "-"){ target --;}
        else if(aos == "+"){target ++;}
        if(target>liList.length-1||target<0){
           alert("gameOver!!");
           location.reload();
        }
        else{
          if(direct == "y"){
            if(aos == "+"){
              liList[target][parseInt(snakeY)].style.backgroundImage = "url(images/headD.png)";
            }
            else{
              liList[target][parseInt(snakeY)].style.backgroundImage = "url(images/head.png)";
            }
            liList[target][parseInt(snakeY)].style.backgroundSize = "50px 50px";
            target = target>9?""+target:"0"+target;
            snakeX = target;
            snake[0] = snakeX+snakeY;
          }
          else{
            if(aos =="+"){
               liList[parseInt(snakeX)][target].style.backgroundImage = "url(images/headR.png)";
            }
            else{
               liList[parseInt(snakeX)][target].style.backgroundImage = "url(images/headL.png)";
            }
            liList[parseInt(snakeX)][target].style.backgroundSize = "50px 50px";
            target = target>9?""+target:"0"+target;
            snakeY = target;
            snake[0] = snakeX+snakeY;
          }
            eatFood();    
            warning();
            changeSnakeColor();
          //循环调用本函数,使视觉上蛇在行动
          if(temp.length!=3){
             switching = setTimeout("initSport()",600);
          }
          else{
            if(temp[2] == "x"){
              temp[0]=snake[0].slice(2); 
            }
            else{
               temp[0] = snake[0].slice(0,2);
            } 
            switching=setTimeout("initSport(temp[0],temp[1],temp[2])",600);
          }
        }
  };
  btn[0].onclick = function(){
    initSport();
    initFood();
    this.disabled = 'true';
  } 
  btn[1].onclick = function(){
    clearTimeout(switching);
  }
  btn[2].onclick = function(){
    if(temp[0] == undefined&& temp[1] == undefined&& temp[2] ==undefined){
      initSport(snake[0].slice(2),'+','x');
    }
    else
    initSport(temp[0],temp[1],temp[2]);
  }

