
var KeyReleaseMask = 2;
var ffi = require("ffi");
var ref = require("ref");

var intPtr = ref.refType('int');


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


var displayPtr = xlib.XOpenDisplay( 0 );
var rootWindow = xlib.XRootWindow( displayPtr, 0 );
    
var rootXPtr            = ref.alloc('int');
var rootYPtr            = ref.alloc('int');
var rootWindowPtr       = ref.alloc('int');
var childrenWindowPtr   = ref.alloc('int');
var windowXPtr          = ref.alloc('int');
var windowYPtr          = ref.alloc('int');
var maskPtr             = ref.alloc('int');

module.exports.getMouseInfo = function(){

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

module.exports.mouseMove = function( x, y ){

    xlib.XSelectInput( displayPtr, rootWindow, KeyReleaseMask );
    xlib.XWarpPointer( displayPtr, 0, rootWindow, 0, 0, 0, 0, x, y );

};

module.exports.mouseMoveRelative = function( x, y ){
    
    var relX = x ? x : 0 ;
    var relY = y ? y : 0 ;

    var mouseInfo = module.exports.getMouseInfo();

    module.exports.mouseMove( mouseInfo.rootX + relX, mouseInfo.rootY + relY );

};

module.exports.close = function(){

    xlib.XFlush( displayPtr );
    xlib.XCloseDisplay( displayPtr );

}
