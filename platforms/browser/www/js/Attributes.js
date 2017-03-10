/**
 * This file manages all the information about the attribute system. When the user presses
 * buttons, this effects the values in this file. These changes are propagated to the attribute bars.
 * Every game update, it looks to see if any of the values were changed and if so, makes the changes in
 * the game.
 */

//Constructor for an attribute object.
function Attributes()
{
    this.attrBars = new AttributeBars();
}
//Sets the objects variables to their proper amounts given a array of the form:
//{name: string, max: int, min: int, init: int, jump: int}
//These are found in the level file which stores info pertaining to level attribute amounts.
Attributes.prototype.setAttributes = function(attr1,attr2,attr3)
{
    //Saves the attribute arrays to the object
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.attr3 = attr3;
    //Sets variables to keep track of the current amounts.
    this.attr1CurrentVal = attr1.init;
    this.attr2CurrentVal = attr2.init;
    this.attr3CurrentVal = attr3.init;
    //Sets the attribute bars to display their initial amounts.
    this.updateAttributeBar(1);
    this.updateAttributeBar(2);
    this.updateAttributeBar(3);
    //Sets default parameters. These are functions instead of values so that
    this.velocity = function(){return 0};
    this.acceleration = function(){return 0};
    this.gravity = function(){return 500};
    this.elasticity = function(){return 0};
    this.friction = function(){return 0.5};

    /* This function connects the generic attributes referenced throughout the file with the corresponding
     attribute that it represents. This is so that the game can set the attributes without having to do
     a check each time to see what the name of the attribute corresponds too. If a attribute is not used
     in a level, then the default value assigned above is used i place.*/
    function interlockVariables(attrName, attrNum, thisRef)
    {
        switch(attrName)
        {
            case "velocity":
                thisRef.velocity = function(){return eval("this.attr"+attrNum+"CurrentVal;")};
                break;
            case "gravity":
                thisRef.gravity = function(){return eval("this.attr"+attrNum+"CurrentVal;")};
                break;
            case "elasticity":
                thisRef.elasticity = function(){return eval("this.attr"+attrNum+"CurrentVal;")};
                break;
            case "friction":
                thisRef.friction = function(){return eval("this.attr"+attrNum+"CurrentVal;")};
                break;
        }
    }
    interlockVariables(this.attr1.name,1,this);
    interlockVariables(this.attr2.name,2,this);
    interlockVariables(this.attr3.name,3,this);

};
//This function updates the percentage on the given attribute bar to reflect changes made to that attribute.
Attributes.prototype.updateAttributeBar = function(attrNum)
{
    switch(attrNum)
    {
        /* Updates the attribute bars to display the initial amounts.
         * The formula (current-min)/(max-min) is used to find the percentage since it is possible to
         * have a range ranging from negative to positive. */
        case 1:
            this.attrBars.setAttributeBar_1(100*(this.attr1CurrentVal - this.attr1.min)/(this.attr1.max - this.attr1.min));
            break;
        case 2:
            this.attrBars.setAttributeBar_2(100*(this.attr2CurrentVal - this.attr2.min)/(this.attr2.max - this.attr2.min));
            break;
        case 3:
            this.attrBars.setAttributeBar_3(100*(this.attr3CurrentVal - this.attr3.min)/(this.attr3.max - this.attr3.min));
            break;
    }
};
//Updates the attribute amount by the given jump.
Attributes.prototype.updateAttributeAmount = function(attrNum, isPositive)
{
    //Increments or decrements the number based on the isPositive param.
    if(isPositive)
    {
        //If the jump will cause the current value to go above the max, then limit it.
        if(eval("(this.attr"+attrNum+"CurrentVal + this.attr"+attrNum+".jump) <= this.attr"+attrNum+".max"))
            eval("this.attr"+attrNum+"CurrentVal += this.attr"+attrNum+".jump;");
        else eval("this.attr"+attrNum+"CurrentVal = this.attr"+attrNum+".max")
    }
    else
    {
        //If the jump will cause the current value to go below the min, then limit it.
        if(eval("(this.attr"+attrNum+"CurrentVal - this.attr"+attrNum+".jump) >= this.attr"+attrNum+".min"))
            eval("this.attr"+attrNum+"CurrentVal -= this.attr"+attrNum+".jump;");
        else eval("this.attr"+attrNum+"CurrentVal = this.attr"+attrNum+".min")
    }
    //Updates the attribute bar to reflect changes.
    this.updateAttributeBar(attrNum);
};
