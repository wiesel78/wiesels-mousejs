var os = require("os");
var fs = require("fs");

var modulePath = __dirname + "/" + os.platform() + "/mouse.js";

if( fs.existsSync( modulePath ) ){
    module.exports = require( modulePath ); 
}else{
    console.log("nicht unterstütztes System : ", os.platform());
    console.log("pfad nicht gefunden : ", modulePath );
    console.log("boolean ", fs.existsSync(modulePath));

}

