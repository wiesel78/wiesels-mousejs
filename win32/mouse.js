
var ffi = require("ffi");
var ref = require("ref");
var struct = require("ref-struct");

var pointStr = struct({
	'x' : 'long',
	'y' : 'long'
});

var pointStrPtr = ref.refType(pointStr);

var user32 = ffi.Library('user32', {
	'SetCursorPos' : ['long', ['long', 'long']],
	'GetCursorPos' : ['bool', [pointStrPtr]]
});


var point = new pointStr();

module.exports.move = function( x, y){
	user32.SetCursorPos( x, y );
}

module.exports.moveRelative = function( x, y ){
	var x = x ? x : 0;
	var y = y ? y : 0;
	var currentPos = module.exports.get();
	
	module.exports.move( currentPos.x + x, currentPos.y + y );
}

module.exports.get = function(){
	if( user32.GetCursorPos(point.ref()) ){
		return {
			x : point.x,
			y : point.y
		};
	}else{
		return {
			x : 0,
			y : 0
		}
	}
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

}