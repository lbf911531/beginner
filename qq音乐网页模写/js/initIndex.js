
$(function(){
    var $musicUl = $('div.musicHouse ul').eq(0);
    var $audio = $('audio').eq(0),
         player = new Player($audio),
         $progressBar = $('div.playBar'),$progressOver = $('div.playOver'),
         $progressLine = $('div.playLoad'),
         progress = new Progress($progressBar,$progressOver,$progressLine);
    var $voiceBox = $('div.voiceBox'),$voiceSpan = $('div.voiceBox span'),
         $voiceOver = $('div.voiceOver'),
         voice = new Voice($voiceBox,$voiceSpan,$voiceOver);
    var $lyricUl = $('div.sangLyrics ul');
    var index = -1;
    //初始化
    init();
    function init(){
        //1.滚动条
        $('div.musicHouse').mCustomScrollbar();

        //歌曲列表鼠标移入出现列表中menu组
        $('div.musicHouse ul').on('mouseover','li',function(event){
            $(this).find('.listMenu').stop().fadeIn('normal');
            $(this).find('.listMusicTime a').stop().fadeIn('normal');
            $(this).find('.listMusicTime span').stop().fadeOut('normal');
        });
        $('div.musicHouse ul').on('mouseout','li',function(event){
            $(this).find('.listMenu').stop().fadeOut('normal');
            $(this).find('.listMusicTime a').stop().fadeOut('normal');
            $(this).find('.listMusicTime span').stop().fadeIn('normal');
        });

        //2.模拟input[type=checkbox]
           // 单选
        $('div.listCheck i').not('.overCheck').click(function(){
            $(this).toggleClass('checked');
            if(!$(this).hasClass('checked')){
                $('div.listCheck i.overCheck').removeClass('checked');
            }
        });
           // 全选
        $('div.listCheck i.overCheck').click(function(){
            if($(this).hasClass('checked')){
                $('div.listCheck i').removeClass('checked');
            }
            else{
                $('div.listCheck i').addClass('checked');
            }
            $('li.noviewable i').removeClass('checked');
        });

        //3.创建音乐列表的li
        function createMusicLi(index,musicData){
            var $clone = $('li.listTheme:nth-of-type(2)').clone(true);
            $clone.removeClass('noviewable');
            $clone.attr('flag',index+1);
            $clone.get(0).musicMsg = musicData;
            $clone.get(0).index = index;
            $clone.find('div.listMusicNo span').text(index+1);
            $clone.find('div.listMusicName span').text(musicData.name);
            $clone.find('div.listMusicSinger').text(musicData.singer);
            $clone.find('div.listMusicTime span').text(musicData.time);
            $musicUl.append($clone);
        }

        //4.获取本地数据
        getJsonData();
        function getJsonData(){
            $.ajax({
                url:'./source/musicSource.json',
                dataType:'json',
                success:function(data){
                    player.musicList = data;
                    data.forEach(function(item,index){
                        createMusicLi(index,item);
                    });
                },
                error:function(event){
                    console.log(event);
                }
            });
        }

        //5.调用封装的方法，点击控制进度条
        progress.dotClick(function(timeRadio){
            player.controlMusicPlayTime(timeRadio);
        });
        progress.dotMove(function(timeRadio){
            player.controlMusicPlayTime(timeRadio);
        });

        //6.调用封装的方法，控制音量
        voice.voiceDotClick(function(voiceValue){
            player.controlVoice(voiceValue);
        });
        voice.voiceDotMove(function(voiceValue){
            player.controlVoice(voiceValue);
        });
    }

    //监听事件
    addListenEvent();
    function addListenEvent(){
        //监听音乐列表中播放歌曲的一切信息
        $('div.musicHouse ul').on('click','a',function(event){
            var $target = $(event.target);
            var name = $target.parents('li.listTheme').find('div.listMusicName span').text(),
                singer = $target.parents('li.listTheme').find('div.listMusicSinger').text(),
                time = $target.parents('li.listTheme').find('div.listMusicTime').text(),
                no = $target.parents('li.listTheme').attr('flag'),
                obj = {
                    no:no,
                    name:name,
                    singer:singer,
                    time:time
                };
            var thisMusicMsg = $target.parents('li.listTheme').get(0).musicMsg,
                thisIndex = $target.parents('li.listTheme').get(0).index;
            if($target.index() == 0){
                $target.parents('li.listTheme').siblings().find('a:first').attr('class','stop');

                //调用audio方法播放本列歌曲
                player.playThisMusic(thisIndex,thisMusicMsg);

                //本列歌曲播放与否的按钮状态
                $target.toggleClass('play');
                if($target.hasClass('play')){
                    $('div.footContent a:nth-of-type(2)').addClass('btnStop');
                }
                else{
                    $('div.footContent a:nth-of-type(2)').removeClass('btnStop');
                }
                //本列选中后的状态
                $target.parents('li.listTheme').siblings().css({
                    opacity:'0.7',
                    borderColor:'rgba(255,255,255,0.02)'
                });
                $target.parents('li.listTheme').css({
                    opacity:'1',
                    borderColor:'rgba(255,255,255,0.2)'
                });

                //本列歌曲播放与否的gif动图
                gifPlayingState($target.parents('li.listTheme'));
                footPlayingState(obj);

                //本列歌曲写真
                changeImg($target.parents('li.listTheme'));

                //右侧信息栏
                initRightMsg($target.parents('li.listTheme'));
            }
        });

        //删除对应音乐
        $('div.listMusicTime a').click(function () {
            var index = $(this).parents('li.listTheme').get(0).index;
            //如果该歌曲此时正在播放，则删除后播放下一首
            if(index == player.currentIndex){
                console.log("1");
                $('a.btnNext').trigger('click');
            }

            $(this).parents('li.listTheme').remove();
            player.deleteMusic(index);

            //重新排列列表no以及获取到的index属性值
            $('li.listTheme:gt(1)').each(function (index,item){
                item.index = index;
                $(item).find('div.listMusicNo span').text(index + 1);
            });
        });

        //底部播放按钮关联对应播放队列歌曲的状态
        $('div.footContent a:nth-of-type(2)').click(function () {

            if(player.currentIndex === -1){
                //此时处于一首都未播放状态,默认第一首歌曲的播放按钮关联点击
                $('li.listTheme:nth-of-type(3)').find('div.listMenu a:first').trigger('click');
            }
            else{
                //获取由列表内点击的歌曲的存储到进度条上的index，找到该曲在列表的位置，trigger其事件
                var num = parseInt($('div.progressBox').attr('flag'))+2;
                $target = $('li.listTheme:nth-of-type('+num+')');
                $target.find('div.listMenu a:first').trigger('click');
            }
        });

        //底部前后按钮切换关联列表歌曲
        //上一首歌曲
        $('a.btnPre').click(function(){
            $('li.listTheme:gt(1)').eq(player.preIndex()).find('div.listMenu a:first').trigger('click');
        });
        //下一首歌曲
        $('a.btnNext').click(function(){
            $('li.listTheme:gt(1)').eq(player.nextIndex()).find('div.listMenu a:first').trigger('click');
        });

        //图标控制声音有否
        $('a.btnVoice').click(function(){
            $(this).toggleClass('voiceOff');
            if($(this).hasClass('voiceOff')){
                //静音;
                player.controlVoice(0);
            }
            else{
                player.controlVoice(1);
            }
        });

        //切换歌曲循环模式
        $('a.btnMod').click(function(){
            if($(this).hasClass('btnMod1')){
                //单曲循环
                $(this).attr('class','btnMod btnMod2');
            }
            else if($(this).hasClass('btnMod2')){
                //列表循环
                $(this).attr('class','btnMod btnMod3');
            }
            else if($(this).hasClass('btnMod3')){
                //顺序播放
                $(this).attr('class','btnMod btnMod4');
            }
            else{
                //随机播放
                $(this).attr('class','btnMod btnMod1');
            }
        });

        //切换纯净模式
        $('a.btnChange').click(function(){
            $(this).toggleClass('close');
            if($(this).hasClass('close')){
                $(this).attr('title','关闭纯净模式');
            }
        });

        //同步歌曲
        sync();
        function sync(){
            //同步歌曲时间
            player.$audio.on("loadeddata",function(){
                clearHistory();
                var overTime = this.duration,
                    overMin = parseInt(overTime/60),
                    overSec = parseInt(overTime%60);
                overMin = overMin <= 9 ? '0'+overMin : ''+overMin;
                overSec = overSec <= 9 ? '0'+overSec : ''+overSec;
                var standardOverTime = overMin + ":" +overSec;
                $(this).on('timeupdate',function (){
                    var thisTime = this.currentTime;
                    var standardThisTime = player.standardTime(thisTime);
                    $('div.playTime').text(standardThisTime+' / '+standardOverTime);
                    //同步歌曲进度
                    var value = (thisTime / overTime)*100;
                    progress.syncProgress(value);
                    lyricSlide(thisTime);
                });
                //同步歌曲歌词
                getMusicLyric(player.audio.linkLrc);
            });
        }

        //获取歌曲对应的歌词
        function getMusicLyric(path){
            var lyricPath = path;
            if(lyricPath){
                $.ajax({
                    url:lyricPath,
                    dataType:'text',
                    success: function(data){
                        player.audio.timeArr = parseLyric(data);
                    },
                    error: function(event){
                        console.log(event);
                    }
                });
            }
        }
        function parseLyric(lrc){
             var lrcArr = lrc.split('\n'),
                 reg = /\[(\d*:\d*((\.|\:)\d*)*)\]/ig,timeArr = [];
             lrcArr.forEach(function(item,index){
                 var timeRegExpData = reg.exec(item);
                 if(!timeRegExpData)return;
                 var filterLrc = item.replace(reg,''),
                     lrcTime = timeRegExpData[1],
                     lrcTimeArr = lrcTime.split(':');
                 var min = parseInt(lrcTimeArr[0]*60),
                     sec = parseFloat(lrcTimeArr[1]),
                     time = parseFloat(Number(min + sec).toFixed(2));
                 timeArr.push(time);
                 insertLyric(filterLrc);
             });
             return timeArr;
        }
        function insertLyric(lyric){
            var $li = $('<li>'+lyric+'</li>');
            $lyricUl.append($li);
        }
        function lyricSlide(thisTime){
            var timpTempArr = player.audio.timeArr;
            var slideHeight = $('div.sangLyrics ul li').height();
            if(thisTime >= timpTempArr[0]){
                index ++;
                timpTempArr.shift();
                $('div.sangLyrics ul li').eq(index).attr('class','onplay')
                $('div.sangLyrics ul li').eq(index).siblings().removeAttr('class');
                if(index <= 1)return;
                $('div.sangLyrics ul').css({
                    'margin-top':( (index-1) * -slideHeight )
                });
            }
        }
        function clearHistory(){
            $('div.sangLyrics ul').empty();
            index = -1;
            $('div.sangLyrics ul').css({
                'margin-top':0
            });
        }

        //关联右侧信息
        function initRightMsg($target) {
            $('p.sangName a').text($target.get(0).musicMsg.name);
            $('p.singer a').text($target.get(0).musicMsg.singer);
            $('p.sangAlbum a').text($target.get(0).musicMsg.album);
        }

        //对应列中gif图随相应歌曲状态改变
        function gifPlayingState($target){
            $target.find('.listMusicNo').toggleClass('playing');
            $target.siblings().find('.listMusicNo').removeClass('playing');
            var bool = $target.find('.listMenu a:first').hasClass('play');
            if(bool){
                $target.find('.listMusicNo span').css('visibility','hidden');
            }
            else {
                $target.find('.listMusicNo span').css('visibility','visible');
            }
            $target.siblings().find('.listMusicNo span').css('visibility','visible');
        }

        //底部进度条获取当前需要播放的信息
        function footPlayingState(data){
            $('div.progressBox').attr('flag',data.no);
            $('div.playMusic a:nth-of-type(1)').text(data.name);
            $('div.playMusic a:nth-of-type(2)').text(data.singer);
            $('div.playTime').text('00:00 / '+data.time);
        }

        //切换专辑写真
        function changeImg($target){
            var img = $target.get(0).musicMsg.linkImg;
            $('div.contentRigh img').attr('src',img);
            $('div.mark').css('background','url('+img+') no-repeat 0 0');
        }

        //收藏
        $('a.btnLove').click(function(){
            $(this).css('background-position','102px -96px');
        });

        //监听歌曲结束后发生的事件 : 模式下歌曲切换
        $audio.on('ended',function(){
            if( $('a.btnMod').hasClass('btnMod4')||$('a.btnMod').hasClass('btnMod3')){
                 //顺序模式下或者列表模式下
                $('a.btnNext').trigger('click');
            }
            else if($('a.btnMod').hasClass('btnMod2')){
                 //单曲模式下
                var num = parseInt($('.progressBox').attr('flag'))+2;
                $('li.listTheme:nth-of-type('+num+')').find('.listMenu a:first').trigger('click');
            }
            else if($('a.btnMod').hasClass('btnMod1')){
                //随机模式下
                var len = player.musicList.length-1;
                var randomIndex = (Math.round(Math.random()*len+1))+2;
                // console.log(randomIndex);
                $('li.listTheme:nth-of-type('+randomIndex+')').find('.listMenu a:first').trigger('click');
            }
        });
    }
});