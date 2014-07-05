
var ffi = require("ffi");
var ref = require("ref");

var user32 = ffi.Library('user32', {
	'SetCursorPos' : ['long', ['long', 'long']]
});

module.exports.move = function( x, y){
	user32.SetCursorPos( x, y );
}

module.exports.x = function( x ){

}

module.exports.y = function( y ){

}

module.exports.click = function(){

}