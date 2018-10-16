(function(window){
   function Player($audio){
   	   return new Player.prototype.init($audio);
   }
   Player.prototype = {
   	   constructor:Player,
	   musicList: [],
	   init: function($audio){
   	   	   this.$audio = $audio;
   	   	   this.audio = $audio.get(0);
   	   	   this.audio.volume = 0.6;
	   },
	   currentIndex: -1,
	   playThisMusic: function(thisIndex,thisMusic){
	   	   if(this.currentIndex == thisIndex){
	   	   	    if(this.audio.paused){
	   	   	    	this.audio.play();
				}
				else{
	   	   	    	this.audio.pause();
				}
		   }
		   else{
	   	   	    this.audio.setAttribute('src',thisMusic.linkUrl);
	   	   	    this.audio.linkLrc = thisMusic.linkLrc;
	   	   	    this.audio.play();
	   	   	    this.currentIndex = thisIndex;
		   }
	   },
	   preIndex: function(){
	   	   var index = this.currentIndex - 1;
	   	   if(index < 0 ){
	   	   	   index = this.musicList.length - 1;
		   }
		   return index;
	   },
	   nextIndex: function(){
           var index = this.currentIndex + 1;
           if(index > this.musicList.length - 1){
               index = 0;
           }
           return index;
	   },
	   deleteMusic: function(index){
	   	   this.musicList.splice(index,1);
	   	   if(index < this.currentIndex){
	   	   	   this.currentIndex-- ;
		   }
	   },
	   standardTime: function(thisTime){
		      var min = parseInt(thisTime/60),
		          sec = parseInt(thisTime%60);
		      min = min <= 9 ? '0'+min : ''+min;
		      sec = sec <= 9 ? '0'+sec : ''+sec;
		      var standardThisTime = min + ":" +sec;
		      return standardThisTime;
	   },
	   controlMusicPlayTime: function(timeRadio){
	   	   if(this.audio.currentTime && timeRadio){
	   	   	//如果此时有歌曲播放则执行
			   this.audio.currentTime = this.audio.duration * timeRadio;
	   	   }
	   },
	   controlVoice: function(value){
			if(value >=1){
				value = 1;
			}
			else if(value <= 0){
				value = 0;
			}
			this.audio.volume = value;
	   }
   }
   Player.prototype.init.prototype = Player.prototype;
   window.Player = Player;
})(window);

