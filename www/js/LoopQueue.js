//This file holds all the logic behind the loop queue.

//Constructor for a new loopQueue object.
function LoopQueue(queueSize)
{
    this.maxQueueSize = queueSize;
    this.table = document.getElementById("queueTable");
    this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
}

//Appends an element to the queue.
LoopQueue.prototype.addToQueue = function()
{
    //Only add an element if there is room in the queue.
    if(this.currentQueueSize < this.maxQueueSize)
    {
        //Adds a new element to the end of the queue, then set its content.
        var x = this.row.insertCell(-1);
        x.innerHTML=" 1 ";
        this.currentQueueSize++;
    }

};

//Deletes the current queue and creates a new empty one.
LoopQueue.prototype.resetQueue = function()
{
    //Delete the current row, then create a new one that is empty.
    this.table.deleteRow(0);
    this.row = this.table.insertRow(0);
    this.currentQueueSize = 0;
};
