(function(window){
    function Progress($progressBar,$progressOver,$progressLine){
        return new Progress.prototype.init($progressBar,$progressOver,$progressLine);
    }
    Progress.prototype = {
        constructor:Progress,
        isSyc: false,
        init: function($progressBar,$progressOver,$progressLine){
              this.$progressBar = $progressBar;
              this.$progressOver = $progressOver;
              this.$progressLine = $progressLine;
        },
        dotClick: function (callBack) {
            var that = this;//此时this指向调用该函数的对象
            var startPos = this.$progressBar.offset().left;
            this.$progressBar.click(function(event){
                //获取进度条的宽度，当前点击相对于进度条的位置；
                //控制playOver的宽度控制dot和播放的进度
                //此时this指向$progressBar
                // -------方法一:绑定与dotMove方法不一的对象上
                var overLength = this.offsetWidth;
                //     currentPos = event.offsetX,
                //     currentLen =(currentPos/overLength)*100;
                // currentLen = currentLen.toFixed(2) + "%";
                // that.$progressOver.css('width',currentLen);
                // 方法二
                var endPos = event.pageX;
                that.$progressOver.css('width',endPos - startPos);
                // ------回调函数获取controlTime值，以此实现进度条控制audio播放进度
                var timeRadio = ((endPos - startPos)/overLength);
                callBack(timeRadio);
            });
        },
        dotMove: function(callBack){
            //mousedown,mousemove,mouseup.
            var that = this;
            this.$progressBar.mousedown(function (event) {
               //通过监听document，不局限于$progressBar范围;
                that.isSyc = true;
                var startPos = $(this).offset().left,
                    sumLen = this.offsetWidth,endPos;
                $(document).mousemove(function(event){
                    endPos = event.pageX;
                    var overWidth = endPos - startPos;
                    if(overWidth < 0){
                       overWidth = 0;
                    }
                    else if(overWidth >= sumLen){
                       overWidth = sumLen;
                    }
                    that.$progressOver.css('width',overWidth);
                    //清除在滑动时会选择到的页面内容，导致mousemove和mouseup的混乱
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    return false;
                });
                $(document).mouseup(function(){
                    $(document).off('mousemove');
                    that.isSyc = false;
                    var timeRadio = ((endPos - startPos) / sumLen);
                    callBack(timeRadio);
                });
            });
        },
        syncProgress: function(value){
            if(this.isSyc){return;}
            this.$progressOver.css('width',value+'%');
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);