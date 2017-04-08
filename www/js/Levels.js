/** This file holds all the specific level info including which attributes are effected by each one.
 *
 *  winCondition is a function that is called each game update and is used to determine if the player wins.
 *
 *  onUpdate is a function that is called each game update.
 *
 *  attribute1, attribute2, and attribute 3 are the 3 attributes modeled on the attribute bars.
 *  Each one has the following properties:
 *      name: The name of the attribute.
 *      max: The max value it can be.
 *      min: The min value it can be.
 *      init: The starting amount for this attribute.
 *      jump: How much a button press will effect the amount.
 *      coupled: What attribute will be effected when the button for this one is pressed.
 *      price: How much the affected attribute will change by when the button for this one if pressed.
 *
 *      Note: the value of 0 for coupled indicated that it is not coupled to any attribute.
 *
 *  queueSize is the maxSize the attribute queue can be.
 */
var levels = {
    level1: {
        winCondition: function(thisRef) {

        },
        onUpdate: function(thisRef) {

        },
        attribute1: {name:"gravity",max:1000,min:0,init:500,jump:100,coupled:0,price:0},
        attribute2: {name:"velocity",max:500,min:-500,init:0,jump:50,coupled:0,price:0},
        attribute3: {name:"bounce",max:1,min:0,init:0.5,jump:0.1,coupled:0,price:0},
        queueSize: 4

    },
    level2: {
        winCondition: function(thisRef) {

        },
        onUpdate: function(thisRef) {

        },
        attribute1: {name:"gravity",max:1000,min:0,init:500,jump:100,coupled:0,price:0},
        attribute2: {name:"velocity",max:500,min:-500,init:0,jump:50,coupled:0,price:0},
        attribute3: {name:"bounce",max:1,min:0,init:0,jump:0.1,coupled:0,price:0},
        queueSize: 4
    }
};

