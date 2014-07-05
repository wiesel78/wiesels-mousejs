var mouse = require("./index.js");


// get and set the y position
console.log("y : ", mouse.y());
console.log("set the y position to 100 ");
mouse.y( 100 );

// get and set the x position
console.log("x : ", mouse.x());
console.log("set the x position to 100 ");
mouse.x( 100 );

// move the mouse position to x=200 y=200
console.log("move to x=200, y=200");
mouse.move( 1000, 200 );

// emulate a mouse click
console.log("click");
mouse.click();

