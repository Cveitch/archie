//This file holds all the logic behind the loop queue.

//Constructor for a new loopQueue object.
function LoopQueue(queueSize)
{
    this.maxQueueSize = queueSize;
    this.table = document.getElementById("queueTable");
    this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
    this.currentElement = 0;
    this.LoopArray = [];
    this.BoolArray = []; 
    this.AddingToArray = false;
    this.firstIteration = true;
    this.points = 0;
}

//Appends an element to the queue.
LoopQueue.prototype.addToQueue = function(attribute,direction)
{
    //Only add an element if there is room in the queue and the user has signaled to add it to the array.
    if(this.currentQueueSize < this.maxQueueSize && this.AddingToArray)
    {
        this.LoopArray.push(attribute);
        this.BoolArray.push(direction);
        //Adds a new element to the end of the queue, then set its content.
        var x = this.row.insertCell(-1);
        var imageToAdd;
        switch(attribute)
        {
            case "gravity":
                if(direction == false)
                    imageToAdd = "spr_gravityDecrease.png";
                else
                    imageToAdd = "spr_gravityIncrease.png";
                break;
            case "velocity":
                if(direction == false)
                    imageToAdd = "spr_velocityLeft.png";
                else
                    imageToAdd = "spr_velocityRight.png";
                break;
            case "bounce":
                if(direction == false)
                    imageToAdd = "spr_springDecrease.png";
                else
                    imageToAdd = "spr_springIncrease.png";
                break;
            case "friction":
                if(direction == false)
                    imageToAdd = "spr_frictionDown.png";
                else
                    imageToAdd = "spr_frictionUp.png";
                break;
            case "acceleration":
                if(direction == false)
                    imageToAdd = "spr_accelerationLeft.png";
                else
                    imageToAdd = "spr_accelerationRight.png";
                break;

        }
        x.innerHTML="<img src=\"assets/images/Buttons/"+imageToAdd+"\">";
        this.currentQueueSize++;
    }

};

//Deletes the current queue and creates a new empty one.
LoopQueue.prototype.resetQueue = function()
{
    //Delete the current row, then create a new o   ne that is empty.  this is causing problems
    this.table.deleteRow(0);
    this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
    //clear array
    this.LoopArray = []; 
    this.AddingToArray = false;
    this.firstIteration = true;
};

//Add the button press to the quote instead of triggering it right away.
LoopQueue.prototype.startAddingToArray = function()
{
    this.AddingToArray = true;
};

//The user has finished adding elements to the queue.
LoopQueue.prototype.stopAddingToArray = function()
{
    this.AddingToArray = false;
};

LoopQueue.prototype.getNextElement = function()
{
    //Return null if there are no elements in the array.
    if(this.LoopArray.length == 0)
        return null;
    var element = [this.LoopArray[this.currentElement],this.BoolArray[this.currentElement]];

    if(!this.firstIteration)
    {
        if(this.currentElement == 0)
            this.points++;
    }
    else
    {
        this.points++;
    }

    //Increment the currentElement counter. If it has reached the end of the array, loop back to beginning.
    this.currentElement++;
    if(this.currentElement >= this.LoopArray.length)
    {
        this.firstIteration = false;
        this.currentElement = 0;
    }
    return element;
};

//Returns the amount of points;
LoopQueue.prototype.getPoints = function()
{
    return this.points;
};

LoopQueue.prototype.incrementPoints = function()
{
    this.points++;
};
