var format-success-hover = function () {
   var cirlces = $('#format-success-module').find('circle'); 
   
   var Color() {
       var  this.red = 0, 
            this.blue = 0, 
            this.green = 0;
   }
   
   color.prototype.fromHex = function (hex) {
       this.red = hex >> 16
       this.green = hex >> 8 & 0xff;
       this.blue = hex & 0xff;
   }
   
   var onMouseOver = function () {
       var color = new Color().fromHex(this.attr())
   };
   
   var onMouseOut = function () {
       
   };
   
   circles.hover(onMouseOver,onMouseOut);
}();