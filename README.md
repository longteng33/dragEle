# dragEle
拖拽元素,
https://longteng33.github.io/dragEle  
这是boundary分支，使用getboundingClientrect()方法  
click事件在鼠标放开后才产生  
mouseup事件在鼠标按下去的时候就已经产生了  
如果父元素是mousedown事件，子元素是绑定click事件  
在子元素触发click事件的时候，在取消冒泡之前，就已经触发了父元素的mousedown事件，所以取消冒泡无用  