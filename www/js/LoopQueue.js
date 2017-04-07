//This file holds all the logic behind the loop queue.





//Constructor for a new loopQueue object.
function LoopQueue(queueSize)
{
    this.maxQueueSize = queueSize;
    this.table = document.getElementById("queueTable");
    //this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
    this.LoopArray = [];
    this.BoolArray = []; 
    this.BeginArray = false; 
   // this.Attributes = new Attributes(); 
}

//Appends an element to the queue.
LoopQueue.prototype.addToQueue = function(Attribute,Direction)
{
    //Only add an element if there is room in the queue.
    if(this.currentQueueSize < this.maxQueueSize)
    {
        //Adds a new element to the end of the queue, then set its content.
        var x = this.row.insertCell(-1);
        this.LoopArray.push(Attribute); 
        this.BoolArray.push(Direction); 
        console.log(Attribute +" Pushed to array, size is now: "+this.LoopArray.length); 
        //TODO this should be changed to the sprite iteslf, this can be based on the attribute number that gets passed. 
        var l; 
        //hard coded for now. switch out later
        switch(Attribute)
                {
            case 1:
                    if(Direction == false)
                {
                l = "spr_gravityDecrease.png";
                }
                else
                l = "spr_gravityIncrease.png"; 
                
            case 2:
                 if(Direction == false)
                {
                l = "spr_velocityLeft.png";
                }
                else
                l = "spr_velocityRight.png"; 
            case 3:
                 if(Direction == false)
                {
                l = "spr_springDecrease.png";
                }
                else
                l = "spr_springIncrease.png"; 
        }
        
        x.innerHTML=" <img src=\"assets/images/Buttons/"+l+"\" >";
        //add switch for attribute pics
        this.currentQueueSize++;
    }

};

//Deletes the current queue and creates a new empty one.
LoopQueue.prototype.resetQueue = function()
{
    //Delete the current row, then create a new o   ne that is empty.  this is causing problems
   // this.table.deleteRow(0);
    //this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
    //clear array
    this.LoopArray = []; 
    this.BeginArray = false; 
    console.log("BeginArray is equal to " + this.BeginArray); 
};
//begins the looping process, basically turns it on. this will set a bool that will now, when buttons are pressed send them into the Looparray to be stored and read from. 
LoopQueue.prototype.startToQueue = function()
{
    this.BeginArray = true; 
    console.log("BeginArray is equal to " + this.BeginArray); 
}; 
//get beginarray
LoopQueue.prototype.GetBeginArray = function()
{

    return this.BeginArray; 

};

/*
//Start itterating through the array and sending the information to move the char
//this will go through the loop, and pass the information into the updatefrombuttons method
//if the game is paused during this period, the array will clear. 
//when it finishes the array, it starts again. 
LoopQueue.prototype.BeginLoop = function()
{
    this.BeginArray = false; 
    console.log("the boolean is: "+this.BeginArray); 
    console.log("Length of array: "+this.LoopArray.length); 
    //this is a forever loop im not smart
    //while the game is not paused loop
    var a =0; 
//if not paused go
   
    for(var i = 0; i<this.LoopArray.length; i++)
        {
            attributes.updateAttributeAmountFromButton(this.LoopArray[i], this.BoolArray[i]); 
            console.log("using"+this.LoopArray[i]+ " with " + this.BoolArray[i]); 
            //go back to the start
        }
        
    
};
*/

