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
    //Sets default parameters. These are functions instead of values so that if that attribute is
    //used, it is linked to the bar.
    this.velocity = function(){return 0};
    this.acceleration = function(){return 1};
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
         * have values ranging from negative to positive. */
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
/* There are two ways for the attributes amounts to be changed. The first is when the user presses the buttons on the
 * pause screen. The second is when they are changed indirectly from the game (IE, acceleration causes the velocity
 * to change over time). Each of these changes are modeled in the next 2 functions. */

/**Updates the attitudes when the player presses a button on the pause screen.
 * @param attrNum
 * @param isPositive*/
Attributes.prototype.updateAttributeAmountFromButton = function(attrNum, isPositive)
{
    //Don't do anything if the value is the max and your trying to increment or value is min and trying to decrement.
    if(!((isPositive && eval("this.attr"+attrNum+"CurrentVal == this.attr"+attrNum+".max")) || (!isPositive && eval("this.attr"+attrNum+"CurrentVal == this.attr"+attrNum+".min"))))
    {
        //Get the attribute number and the price for the coupled attribute.
        var coupledNum = eval("this.attr"+attrNum+".coupled");
        var coupledPrice = eval("this.attr"+attrNum+".price");
        //If the coupled attribute doesn't have over the price, the don't change.
        //If coupledNum == 0, then this attribute is not coupled so continue.
        if(eval("(this.attr"+coupledNum+"CurrentVal >= coupledPrice) || coupledNum == 0"))
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

            //Updates the attribute bar for this attribute to reflect the new changes.
            this.updateAttributeBar(attrNum);
            //Update the coupled attribute bar if it exists to reflect any new changes.
            if(coupledNum != 0)
            {
                eval("this.attr"+coupledNum+"CurrentVal -= coupledPrice;");
                this.updateAttributeBar(coupledNum);
            }
        }
    }
};

/**
 * Updates the attributes when the value is changed during the game. (Example: velocity changes according to acceleration)
 * @param attrName
 * @param amount
 * @returns amount - Either the amount, or max / min for that attribute.
 */
Attributes.prototype.updateAttributeAmountFromGame = function(attrName, amount)
{
    //Creates a reference to the attributes object to be used inside functions.
    var thisRef = this;
    //Rounds the attribute the the nearest whole number.
    amount = Math.round(amount);
    //Looks at how the value compares to max/min and
    function updateValueAndBar(attrNum)
    {
        var tempVal;
        //If the amount is over the max, then limit it.
        if(eval("thisRef.attr"+attrNum+".max < amount"))
        {
            eval("thisRef.attr"+attrNum+"CurrentVal = thisRef.attr"+attrNum+".max");
            tempVal = eval("thisRef.attr"+attrNum+".max");
        }
        //If the amount is under min, then limit it.
        else if(eval("thisRef.attr"+attrNum+".min > amount"))
        {
            eval("thisRef.attr"+attrNum+"CurrentVal = thisRef.attr"+attrNum+".min");
            tempVal = eval("thisRef.attr"+attrNum+".min");
        }
        //Otherwise set the new amount.
        else
        {
            eval("thisRef.attr"+attrNum+"CurrentVal = amount");
            tempVal = amount;
        }
        //Update the attribute bar and return the value. Returning is needed to let the game know if the attirubte
        //amount went out of bounds.
        thisRef.updateAttributeBar(attrNum);
        return tempVal;
    }

    //Decodes whether the attribute name is modeled on one of the attribute bars.
    //If it is, then make sure that the bar is updated to reflect new changes.
    switch(attrName)
    {
        case this.attr1.name:
            return updateValueAndBar(1);
            break;
        case this.attr2.name:
            return updateValueAndBar(2);
            break;
        case this.attr3.name:
            return updateValueAndBar(3);
            break;
    }
};
