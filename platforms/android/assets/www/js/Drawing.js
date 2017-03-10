//get canvas information
var canvas = document.getElementById("Canvas"); 
var canvas_Context = canvas.getContext("2d");
canvas.height = window.screen.height;   
canvas.width = window.screen.width; 
var button1 = document.getElementById("goButton");
var button2 = document.getElementById("resetButton"); 
var button3 = document.getElementById("canvasButton"); 
// array for x values
var xVal = [0]; 
var i = 0; 
//Wiggle wiggle wiggle room for drawing, so that its not so strict. 
var drawError = 30; 
//Drawing tells if mouse button has been pressed. 
var isDrawing; 
// bool to tell if the user has been alerted to drawing backwards, so that it does not become annoying. 
var hasBeenAlerted = false; 
//set 0,0 so that it fits on any screen. 
var startX = canvas.width - canvas.width; 
var startY = canvas.height / 2; 
var startLocation = false; 
//distance between each segment
var xSegmentLength = Math.floor(canvas.width / 50);
//array for coords
var Coords;  
//array for just y values test
var yCoords = [0]; 
//checks to see if drawing has been done, and can send cords to the engine. 
var updateReady = false; 
//draw a starting location on the canvas. 
var draw_Circle = function(X,Y)
{
    
    canvas_Context.beginPath(); 
    canvas_Context.lineWidth=5;
    canvas_Context.arc(X, Y, 25, 0, 2*Math.PI); 
    canvas_Context.moveTo(X,Y); 
    canvas_Context.stroke(); 
    canvas_Context.strokeStyle='#f2895c'
    canvas_Context.lineTo(canvas.width,Y); 
    canvas_Context.stroke(); 
    canvas_Context.closePath(); 
      
}

//methods for drawing
var setTouchDrawingTrue = function (e) 
{
    //move cords to new start location. 
    canvas_Context.moveTo(e.touches[0].clientX-this.offsetLeft, e.touches[0].clientY - this.offsetTop);
    //prevent scrolling
    event.preventDefault(); 
    isDrawing = true; 

}
//sets drawing to false
var setDrawingFalse = function (e) 
{          
    isDrawing = false;
    //show buttons
    button1.style.visibility = "visible";
    button2.style.visibility = "visible";
    button3.style.visibility = "visible";
}
//draw on Touchscreens 
var touchDraw = function (e)
{
    //hide buttons
    button1.style.visibility = "hidden";
    button2.style.visibility = "hidden";
    button3.style.visibility = "hidden";

    //prevents scrolling
    event.preventDefault(); 
    //add to array 
    xVal.push(e.touches[0].clientX-this.offsetLeft);
    //check X value 
    if(xVal[i] < e.touches[0].clientX-this.offsetLeft)
    {
        //start from 0,0
        if(!startLocation)
        {
        canvas_Context.moveTo(startX,startY); 
        startLocation = true; 
        }
        if(isDrawing)
        {
            canvas_Context.lineTo(e.touches[0].clientX-this.offsetLeft, e.touches[0].clientY-this.offsetTop); 
            canvas_Context.lineWidth=5;
            canvas_Context.stroke();
            if(xVal[i] % xSegmentLength == 0 )
            {
                cordGenerator(e.touches[0].clientY); 
                i++;
            }
            else
            { 
                i++;
            }
        }
    } 
    //if current value is less than or equal to old value than erase the canvas. 
    else if(xVal[i] >= e.touches[0].clientX-this.offsetLeft + drawError || xVal[i] < e.touches[0].clientX-this.offsetLeft - drawError )
    {
        errorAlert();     
    }
}
//dynamic canvas size
var setCanvasSize = function()
{
    canvas.height = window.screen.height; 
    canvas.width = window.screen.width;    
}

// alert for drawing backwards
var errorAlert = function()
{
    setDrawingFalse();
    if(!hasBeenAlerted)
    {
        var r = window.confirm("You cannot draw backards"); 
        if(r == true){
            canvasRedraw();
        } else {
            canvasRedraw(); 
        }
    }  
}

//Clear the canvas without popup
var canvasRedraw = function()
{
    //clear canvas
    arrayReset(); 
    //reset start local
    startLocation = false; 
    canvas_Context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_Context.beginPath();
    setDrawingFalse();  
    //redraw start location bubble and X line
    draw_Circle(startX, startY); 
 
}

//clear canvas and redraw circle
var canvasClear = function()
{
    //alert user they cant draw backwards
    errorAlert();  
     //clear canvas
    arrayReset(); 
    //reset start local
    startLocation = false; 
    canvas_Context.clearRect(0, 0, canvas.width, canvas.height);
    canvas_Context.beginPath();
    setDrawingFalse();  
    //redraw start location bubble and X line
    draw_Circle(startX, startY);
}

//generates Coordinates. 
var cordGenerator = function(yPixels)
{
    //send Y corrds to array. 
    yCoords.push((yPixels - startY) * (-1));
    i++;           
}

var getOut = function()
{
    goToWorld();
}

var sendCoords = function()
{
   storeDS(yCoords);
}

//resize the Canvas to fit the screen. 
var resize = function()
{
    arrayReset();
    setCanvasSize();
    startX = canvas.width - canvas.width;
    startY = canvas.height / 2;
    draw_Circle(startX, startY);
}

//reset arrays
var arrayReset = function()
{
    //reset Xvalue array
    xVal = [0];
    // reset Y array 
    yCoords = [0];
    i = 0;
    //reset start location
    startLocation = false;
    setDrawingFalse();
}

//save canvas drawing as image to display. 
var saveCanvas = function()
{
    canvas_Context.save();
}

//redraw the canvas with the image. 
var loadCanvas = function()
{
    canvas_Context.restore();
}

//event listeners for drawing with finger on touch screen
canvas.addEventListener('touchstart',   setTouchDrawingTrue,  false ); 
canvas.addEventListener("touchmove",    touchDraw,            false ); 
canvas.addEventListener("touchend",     setDrawingFalse,      false ); 
//checks to see if the window gets resized
window.addEventListener('load',              resize,          false );
window.addEventListener('orientationchange', resize,          false ); 




















