var edge = require("edge");

/*
   Using EdgeJS as alternative of node-ffi
*/
var user32 = {
    GetCursorPos: edge.func(function () {/*
        using System.Threading.Tasks;
        using System.Runtime.InteropServices;

        public struct POINT
        {
            public int x;
            public int y;
        }

        public class Startup {
            public async Task<object> Invoke(object input){
                return Mouse.GetCursorPosition();
            }
        }

        public static class Mouse {
            [DllImport("user32.dll")]
            public static extern bool GetCursorPos(out POINT lpPoint);

            public static POINT GetCursorPosition()
            {
                POINT lpPoint;
                GetCursorPos(out lpPoint);
                return lpPoint;
            }
        }
    */
    }),
    SetCursorPos: edge.func(function () {/*
        using System.Threading.Tasks;
        using System.Runtime.InteropServices;
        
        public struct POINT
        {
            public int x;
            public int y;
        }

        public class Startup {
            public async Task<object> Invoke(dynamic input){
                int x = (int) input.x;
                int y = (int) input.y;
                return Mouse.SetCursorPosition(x, y);
            }
        }

        public static class Mouse {
            [DllImport("user32.dll")]
            public static extern bool SetCursorPos(int x, int y);

            public static bool SetCursorPosition(int y, int x)
            {
                return SetCursorPos(x, y);
            }
        }
    */
    }),
    MouseEvent: edge.func(function () {/*
        using System.Threading.Tasks;
        using System.Runtime.InteropServices;

        public class Startup {
            public async Task<object> Invoke(dynamic input){
                uint flags = (uint) input.flags;

                return Mouse.MouseEvent(flags);
            }
        }

        public static class Mouse {
            [DllImport("user32.dll")]
            public static extern void mouse_event(uint flags, uint x, uint y, uint btn, uint info);

            public static bool MouseEvent(uint flags)
            {
                mouse_event( flags, 0, 0, 0, 0 );
                return true;
            }
        }
    */
    })
};

/* 
   Values of mouse events
*/
var MOUSEEVENT = {
    LEFTDOWN    : 0x02,
    LEFTUP      : 0x04,
    RIGHTDOWN   : 0x08,
    RIGHTUP     : 0x10
};

module.exports.move = function( x, y){
    user32.SetCursorPos({ x: x, y: y });
}

module.exports.moveRelative = function( x, y ){
	var x = x ? x : 0;
	var y = y ? y : 0;
	var currentPos = module.exports.get();
	
	module.exports.move( currentPos.x + x, currentPos.y + y );
}

module.exports.get = function(){
    return user32.GetCursorPos(null, true); 
}

module.exports.x = function( x ){
	if( typeof(x) == 'number'){
		module.exports.move( x, module.exports.y());
	}

	return module.exports.get().x;
}

module.exports.y = function( y ){
	if( typeof(y) == 'number'){
		module.exports.move( module.exports.x(), y);
	}

	return module.exports.get().y;
}

module.exports.click = function(){
    user32.MouseEvent({flags : MOUSEEVENT.LEFTDOWN | MOUSEEVENT.LEFTUP}, true);
}