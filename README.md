wiesels-mousejs
===============

## Install

```
    npm install wiesels-mousejs
```

## Init

```
    var mouse = require("wiesels-mousejs");
```

### Click  

emulate a click event

```
    mouse.click();
```

### Move

```
    mouse.move( 100, 300 )
```

set the mouse position to x = 100 and y = 300

### MoveRelative

```
    mouse.moveRelative( 20, 0 );
```

set the position relative to the current position  

### X

getter/setter

```
    mouse.x() // get the current x position
    mouse.x(20) // set the x position to 20
```

### Y 

getter/setter

```
    mouse.y() // get the current x position
    mouse.y(300) // set the y position to 300 
```

### open and close

open and close the mouse object.  
require("wiesels-mousejs") do a "open" automaticaly.


```
    mouse.open();

    // do any mouse operations

    mouse.close();
```
