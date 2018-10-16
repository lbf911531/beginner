(function(window){
    function Voice($voiceBox,$voiceSpan,$voiceOver){
        return new Voice.prototype.init($voiceBox,$voiceSpan,$voiceOver);
    }
    Voice.prototype = {
        constructor : Voice,
        init : function($voiceBox,$voiceSpan,$voiceOver){
             this.$voiceBox = $voiceBox;
             this.$voiceSpan = $voiceSpan;
             this.$voiceOver = $voiceOver;
        },
        voiceDotClick : function(callBack){
            var startPos = this.$voiceBox.offset().left,
                overLen = this.$voiceBox.get(0).offsetWidth,
                that = this;
            this.$voiceBox.click(function(event){
                 var endPos = event.pageX,endLen = endPos - startPos;
                 if(endLen < 0 ){
                     endLen = 0;
                 }
                 else if(endLen >= overLen){
                     endLen = overLen;
                 }
                 that.$voiceOver.css('width',endLen + 'px');
                 var voiceValue = ( endLen / overLen ).toFixed(2);
                 var spanValue = parseInt(voiceValue*100);
                 if(spanValue >=100){spanValue = 100}
                 else if(spanValue <=0){spanValue = 0}
                 that.$voiceSpan.text(spanValue + '%');
                 callBack(voiceValue);
            });
        },
        voiceDotMove : function(callBack){
            var that = this,overLen = this.$voiceBox.get(0).offsetWidth;
            var endPos,startPos = this.$voiceBox.offset().left;
            this.$voiceBox.mousedown(function(){
                $(document).mousemove(function(){
                   endPos = event.pageX;
                   var endLen = endPos - startPos;
                   if(endLen < 0 ){
                       endLen = 0;
                   }
                   else if(endLen >= overLen){
                       endLen = overLen;
                   }
                   that.$voiceOver.css('width',endLen + 'px');
                   window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                   return false;
                });
            });
            $(document).mouseup(function(){
                $(this).off('mousemove');
                if((endPos - startPos)) {
                    var voiceValue = ( (endPos - startPos) / overLen ).toFixed(2);
                    var spanValue = parseInt(voiceValue*100);
                    if(spanValue >=100){spanValue = 100}
                    else if(spanValue <=0){spanValue = 0}
                    that.$voiceSpan.text(spanValue + '%');
                    callBack(voiceValue);
                }
            });
        }
    }
    Voice.prototype.init.prototype = Voice.prototype;
    window.Voice = Voice;
})(window);