
var KeyReleaseMask = 2;
var ffi = require("ffi");
var ref = require("ref");

var intPtr = ref.refType('int');


var xlibext = ffi.Library('libXtst', {
    "XTestFakeButtonEvent" : ["void", 
        [   
            "pointer", 
            "int", 
            "bool", 
            "int"
        ]
    ]
});

var xlib = ffi.Library('libX11', {
    "XOpenDisplay" : [ "pointer", [ "int" ] ],
    "XCloseDisplay" : [ "int", [ "pointer" ] ],
    "XFlush" : [ "int", [ "pointer" ] ],
    "XRootWindow" : [ "int", [ "pointer", "int" ] ],
    "XSelectInput" : [ "int", [ "pointer", "int", "int" ] ],
    "XWarpPointer" : [ "int", [ 
        "pointer", "int", "int", 
        "int", "int", "int", "int", 
        "int", "int" ] ],
    "XQueryPointer" : [ "bool", [
        "pointer", 
        "int", 
        "pointer", "pointer",
        intPtr, intPtr,
        intPtr, intPtr,
        "pointer" ] ]
});


var displayPtr = null;
var rootWindow = null;
    
var rootXPtr            = ref.alloc('int');
var rootYPtr            = ref.alloc('int');
var rootWindowPtr       = ref.alloc('int');
var childrenWindowPtr   = ref.alloc('int');
var windowXPtr          = ref.alloc('int');
var windowYPtr          = ref.alloc('int');
var maskPtr             = ref.alloc('int');

module.exports.open = function(){
    if( !displayPtr ){
        displayPtr = xlib.XOpenDisplay( 0 );
        rootWindow = xlib.XRootWindow( displayPtr, 0 );
    }
}

module.exports.open();

/** get a mouse object
 * @return MouseInfo
 */
module.exports.get = function(){

    module.exports.open();

    xlib.XQueryPointer(
        displayPtr, rootWindow, 
        rootWindowPtr, childrenWindowPtr, 
        rootXPtr, rootYPtr, 
        windowXPtr, windowYPtr, maskPtr
    );

    return {
        rootX : rootXPtr.deref(),
        rootY : rootYPtr.deref(),
        rootWindow : rootWindowPtr.deref(),
        childrenWindow : childrenWindowPtr.deref(),
        windowX : windowXPtr.deref(),
        windowY : windowYPtr.deref(),
        mask : maskPtr.deref()
    }
}

/** set mouse position
 * @param x : Number : the x position
 * @param y : Number : the y position
 * @return void
 */
module.exports.move = function( x, y ){
    xlib.XSelectInput( displayPtr, rootWindow, KeyReleaseMask );
    xlib.XWarpPointer( displayPtr, 0, rootWindow, 0, 0, 0, 0, x, y );
    module.exports.flush();
};


/** set mouse position relative to the current position
 * @param x : Number : the relative x position
 * @param y : Number : the relative y position
 * @return void
 */
module.exports.moveRelative = function( x, y ){
    
    var relX = x ? x : 0 ;
    var relY = y ? y : 0 ;

    var mouse = module.exports.get();

    module.exports.move( mouse.rootX + relX, mouse.rootY + relY );

};


/** emulate a mouse click event
 * @return void
 */
module.exports.click = function(){
    xlibext.XTestFakeButtonEvent( displayPtr, 1, 1, 0);
    xlibext.XTestFakeButtonEvent( displayPtr, 1, 0, 0);
    module.exports.flush();
}


/** flush all operations
 * @return void
 */
module.exports.flush = function(){
    if( displayPtr ){
        xlib.XFlush( displayPtr );
    }
}

/** close the mouse object
 * @return void
 */
module.exports.close = function(){
    if( displayPtr ){
        module.exports.flush();
        xlib.XCloseDisplay( displayPtr );
    }
}

/** get or set the x position
 * @param x : Number : if defined then the x position is set to x
 * @return number
 */
module.exports.x = function( x ){
    var mouse = module.exports.get();
    
    if( x && typeof (x) == "number" ){
        module.exports.move( x, mouse.rootY );
        
        return x;
    }else{
        return mouse.rootX;
    }
}


/** get or set the y position
 * @param y : Number : if defined then the y position is set to y
 * @return number
 */
module.exports.y = function( y ){
    var mouse = module.exports.get();
    
    if( y && typeof (y) == "number" ){
        module.exports.move( mouse.rootX, y );
        
        return y;
    }else{
        return mouse.rootY;
    }
}



