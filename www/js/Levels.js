/**
 * This variable holds all the specific level information that is used in the game
 */
var levels = {
    level1: {
        winCondition: function(thisRef) {

        },
        onStart: function(thisRef) {
            thisRef.addGoal(200,150);
        },
        onUpdate: function(thisRef) {

        },
        attribute1: {name:"gravity",max:1000,min:0,init:500,jump:100},
        attribute2: {name:"velocity",max:500,min:-500,init:0,jump:50},
        attribute3: {name:"elasticity",max:10,min:0,init:0,jump:1},
        characterInfo: {x:200,y:200,name:"avatar"}
    },
    level2: {
        winCondition: function(thisRef) {

        },
        onStart: function(thisRef) {

        },
        onUpdate: function(thisRef) {

        },
        attribute1: {name:"gravity",max:10,min:0,init:0,jump:1},
        attribute2: {name:"velocity",max:10,min:0,init:0,jump:1},
        attribute3: {name:"elasticity",max:10,min:0,init:0,jump:1},
        characterInfo: {x:200,y:200,name:"avatar"}
    }

};

