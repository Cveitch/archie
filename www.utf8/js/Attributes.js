/**
 * Created by avrobullet on 18/11/16.
 */
//Constructor with the default settings for the player and the environment
Attributes = function()
{
    //Default attribute values
    this.gravity    = 500;    //Option 1
    this.velocity   = 0;     //Option 2
    this.elasticity = 0;     //Option 3
    this.friction   = 0.5;     //Option 4
    //More options later!...

    this.opt_n = "...";
    this.createdValue = 10;
};

//Global variable tha stores the variables for each affected attribute selected
var value_1;
var value_2;
var value_3;
var valueCompare;

//Attributes selected
var firstAttribute;
var secondAttribute;
var thirdAttribute;

//Allocates the change of the attributes
Attributes.prototype.allocateAttributeChange = function(OPT_n,FINAL_VALUE)
{
    switch(OPT_n)
    {
        case 1:
            this.opt_n = "gravity";
            //Set option 1
            this.setGravity(FINAL_VALUE);
            break;
        case 2:
            this.opt_n = "velocity";
            //Set option 3
            this.setVelocity(FINAL_VALUE);
            break;
        case 3:
            this.opt_n = "elasticity";
            //Set option 2
            this.setElasticity(FINAL_VALUE);
            break;
        case 4:
            this.opt_n = "friction";
            //Set option 4
            this.setFriction(FINAL_VALUE);
            break;
        default:
    }
};
//Determines the three attributes to be affected (selected based on the level set by Main.js)
Attributes.prototype.selectAttributes = function(OPT_1, OPT_2, OPT_3)
{
    firstAttribute     = OPT_1;
    secondAttribute    = OPT_2;
    thirdAttribute     = OPT_3;
};
//Increment the first attribute
Attributes.prototype.incrementFirst = function(VALUE)
{
    value_1 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(firstAttribute, value_1);
};
//Increment the second attribute
Attributes.prototype.incrementSecond = function(VALUE)
{
    value_2 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(secondAttribute, value_2);
};
//Increment the third attribute
Attributes.prototype.incrementThird = function(VALUE)
{
    value_3 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(thirdAttribute, value_3);
};
//Decrement the first attribute
Attributes.prototype.decrementFirst = function(VALUE)
{
    value_1 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(firstAttribute, value_1);
};
//Decrement the second attribute
Attributes.prototype.decrementSecond = function(VALUE)
{
    value_2 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(secondAttribute, value_2);
};
//Decrement the third attribute
Attributes.prototype.decrementThird = function(VALUE)
{
    value_3 = VALUE;
    //Determine which value to be set
    this.allocateAttributeChange(thirdAttribute, value_3);
};

//Set new gravity
/*
AD: Gravity cannot be negative!!!
* */
Attributes.prototype.setGravity = function(NEW_GRAVITY)
{
    //AD: at 50% of the bar the gravity's TRUE_PHYSICAL_VALUE as 9.8 m/s^2, then adjust appropriately
    //Added a multiplier of 9 to achieve distinctive change of gravity
    valueCompare = this.gravity+(9*NEW_GRAVITY);
    if(valueCompare <= 1000 && valueCompare >= 0)
    {
        this.gravity = valueCompare;
    }
};
//Set new velocity
Attributes.prototype.setVelocity = function(NEW_VELOCITY)
{
    //Added a multiplier of 9 to achieve distinctive change of velocity
    valueCompare = this.velocity+(9*NEW_VELOCITY);
    if(valueCompare <= 500 && valueCompare >= -500)
    {
        this.velocity = valueCompare;
    }
};
//Set new elasticity
Attributes.prototype.setElasticity = function(NEW_ELASTICITY)
{
    //Added a multiplier of 9 to achieve distinctive change of velocity
    valueCompare = this.elasticity+(0.1*NEW_ELASTICITY);
    if(valueCompare <= 1.5 && valueCompare >= 0)
    {
        this.elasticity = value;
    }
};
//Set new velocity
Attributes.prototype.setFriction = function(NEW_FRICTION)
{
    valueCompare = this.friction+(0.1*NEW_FRICTION);
    if(valueCompare <= 1 && valueCompare >= 0)
    {
        this.friction = valueCompare;
    }
};
/*
 //Set new friction
 setFriction = function(NEW_FRICTION)
 {
 this.friction = this.friction+NEW_FRICTION;
 };
 //Set new elasticity
 /*
 AD: this is called "restitution" in Phaser's P2 engine. Here's a good link to properly implement it: https://phaser.io/examples/v2/p2-physics/gravity-scale
 setElasticity = function(NEW_ELASTICITY)
 {
 this.elasticity = this.elasticity+NEW_ELASTICITY;
 };
* */