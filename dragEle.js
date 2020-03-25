
function DragEle(dragEleObj) {
    this.ele = dragEleObj.ele;

    this.isDraging = false;//是否在拖拽

    this.offsetLeft = this.ele.offsetLeft;//ele元素在当前页面上(body)的x坐标
    this.offsetTop = this.ele.offsetTop;//ele元素在当前页面上(body)的y坐标

    this.bodyWidth = document.body.offsetWidth;//整个body页面的宽度(包含被卷进去的部分)
    this.bodyHeight = document.body.offsetHeight;//整个body页面的高度(包含被卷进去的部分)

    this.clientWidth = document.documentElement.clientWidth;//当前视窗的宽度(不含滚动条的宽度)
    this.clientHeight = document.documentElement.clientHeight;//当前视窗的高度(不含滚动条的高度)

    this.eleWidth = this.ele.offsetWidth;//ele元素的宽度(包含padding、border、width，不含margin)
    this.eleHeight = this.ele.offsetHeight;//ele元素的高度(包含padding、border、width，不含margin)

    this.scrollX = document.documentElement.scrollLeft;//滚动条x方向滚动的距离
    this.scrollY = document.documentElement.scrollTop;//滚动条y方向滚动的距离

    this.boundX = this.ele.getBoundingClientRect().x;//ele元素距离当前视窗边界x方向的距离
    this.boundY = this.ele.getBoundingClientRect().y;//ele元素距离当前视窗边界y方向的距离

    this.disX = 0;//鼠标点击ele元素时距离ele元素的左边的距离（鼠标点击使才确定）
    this.disY = 0;
    this.pos=[{ x: this.offsetLeft, y: this.offsetTop }];//数组用来记录所有经过的位置的坐标

    this.init();
    this.bindEvent();
};

DragEle.prototype = {
    init: function () {
        
         // 可能动态修改了页面的宽高，所以也重新获取
         this.bodyWidth = document.body.offsetWidth;//整个body页面的宽度(包含被卷进去的部分)
         this.bodyHeight = document.body.offsetHeight;//整个body页面的高度(包含被卷进去的部分)
         // 视窗的宽高可能会被调整了，所以重新获取
         this.clientWidth = document.documentElement.clientWidth;//当前视窗的宽度(不含滚动条的宽度)
         this.clientHeight = document.documentElement.clientHeight;//当前视窗的高度(不含滚动条的高度)
         // 当前的ele元素的宽高也可能被动态修改了，所以重新获取
         this.eleWidth = this.ele.offsetWidth;//ele元素的宽度(包含padding、border、width，不含margin)
         this.eleHeight = this.ele.offsetHeight;//ele元素的高度(包含padding、border、width，不含margin)
         // 滚动的距离重新获取
         this.scrollX = document.documentElement.scrollLeft;//滚动条x方向滚动的距离
         this.scrollY = document.documentElement.scrollTop;//滚动条y方向滚动的距离
 
        //  this.boundX = this.ele.getBoundingClientRect().x;//ele元素距离当前视窗边界x方向的距离
        //  this.boundY = this.ele.getBoundingClientRect().y;//ele元素距离当前视窗边界y方向的距离
    },

    bindEvent: function () {
        var _this = this;
        // 事件的回调函数都写到bindEvent中，这样方便使用_this，因为事件函数中的this会指向事件调用者
        // 对元素的处理的函数可写到原型当中
        this.ele.addEventListener("mousedown", ele_mousedown);
        this.ele.addEventListener("mouseup", ele_mouseup);


        function ele_mousedown(e) {
            var e = e || window.e;
            _this.isDraging = true;
            _this.scrollX = document.documentElement.scrollLeft;
            _this.scrollY = document.documentElement.scrollTop;
            document.addEventListener("mousemove", document_mousemove);

            // e.pageX为鼠标刚点下去时（对于整个页面，包括滚动条下面的部分）落点的坐标
            // ele.offsetLeft为ele距离定位父节点的left方向的距离
            // disX为鼠标落点距离ele的左边缘距离
            _this.offsetLeft = _this.ele.offsetLeft;
            _this.offsetTop = _this.ele.offsetTop;
            _this.disX = e.pageX - _this.ele.offsetLeft;
            _this.disY = e.pageY - _this.ele.offsetTop;

            // _this.pos.push({ x: _this.offsetLeft, y: _this.offsetTop });

            // 原来的定位使用了margin，现在使其归零
            _this.ele.style.margin = 0;
            // 原来的定位可能没有absoulte，现在使其absoulte
            _this.ele.style.position = "absolute"
            return false;
        };



        function document_mousemove(e) {
            var e = e || window.event;
            // 每次移动都重新init，重新获取这些数据
            _this.init();

            // 元素在页面的位置必须通过e.pageX、e.pageY来修改
            _this.offsetLeft = e.pageX - _this.disX;
            _this.offsetTop = e.pageY - _this.disY;

            // 元素在screen的位置必须通过e.clientX、e.clientY来修改
            _this.boundX=e.clientX-_this.disX;
            _this.boundY=e.clientY-_this.disY;

            // 当ele元素超出页面边界时，对其进行处理
            _this.dealWithPosition(e);

            _this.pos.push({ x: _this.offsetLeft, y: _this.offsetTop });

            _this.ele.style.left = _this.offsetLeft + "px";
            _this.ele.style.top = _this.offsetTop + "px";

            // console.log(_this.ele.getBoundingClientRect().x,_this.ele.offsetLeft)
            document.documentElement.scrollLeft = _this.scrollX;
            document.documentElement.scrollTop = _this.scrollY;

        };

        function ele_mouseup() {
            document.removeEventListener("mousemove", document_mousemove);
            _this.isDraging = false;
        };



    },

    dealWithPosition: function () {
        
        if (this.boundX + this.eleWidth >= this.clientWidth) {
            this.scrollX =this.offsetLeft + this.eleWidth- this.clientWidth;
            if(this.offsetLeft+this.eleWidth>=this.bodyWidth){
                this.offsetLeft=this.bodyWidth-this.eleWidth
            }
        }
        
        if(this.boundX<=0){
            this.scrollX=this.offsetLeft;
            if(this.offsetLeft<=0){
                this.offsetLeft=0;
            }
        }
       
        if (this.boundY + this.eleHeight >= this.clientHeight) {
            this.scrollY =this.offsetTop + this.eleHeight- this.clientHeight;
            if(this.offsetTop+this.eleHeight>=this.bodyHeight){
                this.offsetTop=this.bodyHeight-this.eleHeight
            }
        }
        
        if(this.boundY<=0){
            this.scrollY=this.offsetTop;
            if(this.offsetTop<=0){
                this.offsetTop=0;
            }
        }

    },

    
};



