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
       // var x = this.row.insertCell(-1);
        this.LoopArray.push(Attribute); 
        this.BoolArray.push(Direction); 
        console.log(Attribute +" Pushed to array, size is now: "+this.LoopArray.length); 
        //TODO this should be changed to the sprite iteslf, this can be based on the attribute number that gets passed. 
        //x.innerHTML=" <img src=\"assets/images/Buttons/spr_clear.png\" >";
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
   // if(!paused)
        {
    for(var i = 0; i<this.LoopArray.length; i++)
        {
            attributes.updateAttributeAmountFromButton(this.LoopArray[i], this.BoolArray[i]); 
            console.log("using"+this.LoopArray[i]+ " with " + this.BoolArray[i]); 
            //wait before executing next step
           this.Wait(1000); 
            //go back to the start
            if(i == this.LoopArray.length-1)
                {
                        a++;
                }
        }
        }
    
};
LoopQueue.prototype.Wait = function(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
