var $ = require('NodObjC');
$.framework('Cocoa');

var pool;
var windowHeight = 0;

module.exports.init = function (){
    pool = $.NSAutoreleasePool('alloc')('init');
};

module.exports.init();

/**
 * 
 * Just that we don't get undefined method, when calling a linux method
 */
module.exports.open = function(){
    
};

module.exports.getScreenFrame = function(){
    var frame = $.NSScreen("mainScreen")("frame");
    return frame;
}

/** 
 * get a mouse object
 * 
 * We also need to get a window height
 * because y zero position starts from bottom of the screen
 * and when we set y position (using mouse.y(45)) than it starts from top, so we simply
 * subtract pos.y from windowHeight to get expected y position
 * 
 * @return MouseInfo
 */
module.exports.get = function(){
    var pos = $.NSEvent("mouseLocation");
    
    if(windowHeight == 0){
        var windowFrame = module.exports.getScreenFrame();
        windowHeight = windowFrame.size.height;
    }
    
    return { x: pos.x, y: windowHeight - pos.y };
};

/** set mouse position
 * @param x : Number : the x position
 * @param y : Number : the y position
 * @return void
 */
module.exports.move = function( x, y ){
    var moveEvent = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake(x, y), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, moveEvent);
};

/** set mouse position relative to the current position
 * @param x : Number : the relative x position
 * @param y : Number : the relative y position
 * @return void
 */
module.exports.moveRelative = function( x, y ){
    var pos = module.exports.get();
    
    module.exports.move(pos.x + x, pos.y + y);
};

/** emulate a mouse click event
 * 
 * Getting strange behavior when using right click
 * right now commented out
 * 
 * @return void
 */
module.exports.click = function(isRight){
    var pos = module.exports.get();
    
    var clickDown = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, $.CGPointMake(pos.x, pos.y), $.kCGMouseButtonLeft);
    $.CGEventPost($.kCGHIDEventTap, clickDown);
    
    setTimeout(function(){
        var clickUp = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseUp, $.CGPointMake(pos.x, pos.y), $.kCGMouseButtonLeft);
        $.CGEventPost($.kCGHIDEventTap, clickUp);
    }, 10);
    
};

/** flush all operations
 * @return void
 */
module.exports.flush = function(){
    
};

/** close the mouse object
 * @return void
 */
module.exports.close = function(){
    pool('drain');
};

/** get or set the x position
 * @param x : Number : if defined then the x position is set to x
 * @return number
 */
module.exports.x = function( x ){
    var mouse = module.exports.get();
    
    if( x && typeof (x) === "number" ){
        module.exports.move( x, mouse.y );
        
        return x;
    }else{
        return mouse.x;
    }
};

/** get or set the y position
 * @param y : Number : if defined then the y position is set to y
 * @return number
 */
module.exports.y = function( y ){
    var mouse = module.exports.get();
    
    if( y && typeof (y) === "number" ){
        module.exports.move( mouse.x, y );
        
        return y;
    }else{
        return mouse.y;
    }
};



