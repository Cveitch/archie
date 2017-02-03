//variables to keep track of time.
var timer;
var timerEvent;
//if out of time turn false
var outOfTime;
//Var for how much time you have to clear the level.
var timeAllowed = 5;

//Incrementing value to be added
var increment_1   = 1;
var increment_2   = 1;
var increment_3   = 1;
//Decrementing value to be added
var decrement_1   = -1;
var decrement_2   = -1;
var decrement_3   = -1;

var attributeBar = new AttributeBars();

var Main = function(game)
{
    //This function allows "Main" to be accessed by the game instance
};

Main.prototype = {

    create: function()
    {
        //Start game with objective
        localStorage.atLevelBeginning = "true";

        //Index for the queue/array
        this.arrayIndex = 0;

        //Time interval value to determine when to pull from queue/array
        this.arrayMoment = 0;

        //Current speed for the sprite
        this.nextSpeed = 0;

        //String value to allow sprite action based on button pressing IF it is "GO"
        this.confirmGoSprite = "STOP";

        //Puts the index of the queue/array on display (TESTING)
        //OR: a possible expansion to displaying the score on the screen!
        this.labelIndex = game.add.text(20, 20, "0",{ font: "30px Arial", fill: "#000000" });

        //start timer
        //timer = game.time.create();

        //delayed event
        //timerEvent = timer. add(Phaser.Timer.SECOND * timeAllowed, this.endTimer, this);

        //start timer
        //timer.start();
        //outOfTime = false;

        //Initialize attributes
        this.createAttributes();
        //Enable the physics to start
        this.createPhysics();
        //Create the background for the game
        this.createWorld();
        //Sets the Character and Goals location
        this.objectLocations();
        //Create the player
        this.createPlayer();
        //Create Sprite page buttons
        //this.createButtons();
        //Add a onDown functions to game.
        this.game.input.onDown.add(togglePause,this);
    },

    update: function()
    {
        //text1 = this.game.add.text(0, 0, this.attributes.opt_n);
        //text2 = this.game.add.text(150, 0, this.attributes.elasticity);

        //local.atLevelBeginning === true
        if(localStorage.atLevelBeginning === "true")
        {
            goToObjective();
        }
        if(this.confirmGoSprite === "GO")
        {
            //Updates sprite speed
            this.movePlayer(this.getSpeed());
        }
        else if(this.confirmGoSprite === "STOP")
        {
            //Gives the sprite an initial velocity of 0 pixels/s
            this.movePlayer();
        }
        else
        {
            //Gives the sprite an initial velocity of 20 pixels/s
            this.movePlayer();
        }

        if  (attributes.velocity < 0)
        {

            // flip character left
            this.player.scale.x = -1;
        }

        else if (attributes.velocity > 0)
        {
            // flip right
            this.player.scale.x = 1;
        }

      if(this.touchingDown(this.player) == false)
		{
			this.player.loadTexture("avatar", 4);
		}
		else if(attributes.velocity != 0)
		{
			this.player.animations.play('walk');
		}
		else
		{
			this.player.loadTexture("avatar", 0);
		}

        //Check for changing attributes
        this.checkAttributes();
    },
    touchingDown: function(someone)
    {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
            if (c.bodyA === someone.body.data || c.bodyB === someone.body.data)        {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === someone.body.data) d *= -1;
                if (d > 0.2) result = true;
            }
        } return result;
    },
    createButtons: function()
    {
        //Initialize the buttons needed (BROKEN)
        //this.buttonSprite         = this.game.add.button(this.player.x-175, this.player.y-30, "button_goSprite", this.setSpriteToGo, this);
        //this.buttonCanvas         = this.game.add.button(this.player.x-175, this.player.y+40, "button_goCanvas", this.goToCanvas, this);
        //this.buttonScore          = this.game.add.button(this.player.x-175, this.player.y-100, "button_goScore", this.goToScore, this);

        switch (getCurrentLevel())
        {
            case "1":
                this.attribute_1_up = this.game.add.button(175, 30, "button_gravIncrease", this.setAttribute_1_up, this);
                this.attribute_1_down = this.game.add.button(175, 104, "button_gravDecrease", this.setAttribute_1_down, this);
                this.attribute_2_up = this.game.add.button(275, 30, "button_velRight", this.setAttribute_2_up, this);
                this.attribute_2_down = this.game.add.button(275, 104, "button_velLeft", this.setAttribute_2_down, this);
                this.attribute_3_up = this.game.add.button(375, 30, "button_elacIncrease", this.setAttribute_3_up, this);
                this.attribute_3_down = this.game.add.button(375, 104, "button_elacDecrease", this.setAttribute_3_down, this);
                break;
            case "2":
                this.attribute_1_up = this.game.add.button(175, 30, "button_gravIncrease", this.setAttribute_1_up, this);
                this.attribute_1_down = this.game.add.button(175, 104, "button_gravDecrease", this.setAttribute_1_down, this);
                this.attribute_2_up = this.game.add.button(275, 30, "button_velLeft", this.setAttribute_2_up, this);
                this.attribute_2_down = this.game.add.button(275, 104, "button_velRight", this.setAttribute_2_down, this);
                this.attribute_3_up = this.game.add.button(375, 30, "button_fricIncrease", this.setAttribute_3_up, this);
                this.attribute_3_down = this.game.add.button(375, 104, "button_fricDecrease", this.setAttribute_3_down, this);
                break;
            default:
                break;

        }
    },
    createAttributes: function()
    {
        //Initialize default attributes
        attributes = new Attributes();

        //Determine which attributes to use per level
        switch (getCurrentLevel())
        {
            case "1":
                //Determine which attributes to use for this level (default to 1,2,3 for now)
                attributes.selectAttributes(1, 2, 3);  //1: gravity; 2:h.velocity; 3:elasticity
                this.updatePauseScreenInfo(1,2,3);
                break;
            case "2":
                attributes.selectAttributes(1, 2, 4);  //1: gravity; 2:h.velocity; 4:friction
                this.updatePauseScreenInfo(1,2,4);
                break;
            default:
                this.createAttributes();
                break;
        }
    },
    createPhysics: function()
    {
        // Start the P2 Physics Engine
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        // Set the gravity
        this.game.physics.p2.gravity.y = attributes.gravity;
    },
    //Creates instance of a player
    createPlayer: function()
    {
        //places character in world
        this.game.physics.p2.enable(this.player);

        //Follow player
        this.player.anchor.setTo(0.5,0.5);
        this.game.camera.follow(this.player);

        //gives player a circle hitbox (radius,offestx,offsety)
        this.player.body.setCircle(22,0,0);

        //wouldn't want the character tumbling over
        this.player.body.fixedRotation=true;

        //adds animation
        this.player.animations.add('walk', [1,2,3], 10, true);

    },
    createWorld: function()
    {
        //levelName is the string that is used to determine the level based on the level counter
        var levelName = "Level"+getCurrentLevel();

        // initialised tilemap with matching tileset
        this.mymap = this.game.add.tilemap(levelName);
        this.mymap.addTilesetImage('bkg_tileset');

        //creates layers matching the .json testlevel
        this.layerbackground = this.mymap.createLayer('Bkg');
        this.mymap.createLayer('BkgDetails1');
        this.mymap.createLayer('BkgDetails2');
        this.mymap.createLayer('BkgDetails3');
        this.mymap.createLayer('BlockDetails');
        layermain = this.mymap.createLayer('Block');

        //we resize the world to the background as it will be covering the entire level
        this.layerbackground.resizeWorld();

        //this.mymap.setCollisionByExclusion([0],true, 'Block');
        //turns polylines solid
        //layermain_tiles = this.game.physics.p2.convertTilemap(this.mymap, layermain);
        this.game.physics.p2.convertCollisionObjects(this.mymap, "objects1");

        //set objects1 as world buildable(?)
        //this.game.p2.createMaterial("objects1");
    },
    objectLocations: function()
    {
        //Loads corresponding level based on getCurrentLevel() request
        switch(getCurrentLevel())
        {
            case "1":
                this.goal   = this.game.add.sprite(this.game.world.width-100,160,"goal");
                this.player = this.game.add.sprite(200, 200, "avatar");
                break;
            case "2":
                this.goal   = this.game.add.sprite(this.game.world.width-114,30,"goal");
                this.player = this.game.add.sprite(600, 350, "avatar");
                break;
            case "3":
                this.goal   = this.game.add.sprite(0,400,"goal");
                this.player = this.game.add.sprite(200, 290, "avatar");
                break;
            default:
                this.goal   = this.game.add.sprite(this.game.world.width-100,400,"goal");
                this.player = this.game.add.sprite(200, 489, "avatar");
                break;
        }
        this.goal.animations.add('fly', [0,1,2,3], 4, true);
        this.goal.animations.play('fly');
    },

        //Moves a player
    movePlayer: function()
    {
        //check win condition;
       this.superGameWin(this.player, getCurrentLevel());

        switch(this.confirmGoSprite)
        {
            case "STOP":
                //Give the sprite zero velocity
                this.player.body.velocity.x = this.nextSpeed;
                break;
            case "GO":
                //Give the sprite zero velocity
                this.player.body.velocity.x = this.nextSpeed;
                break;
            default:
                //Give the sprite a pathetic speed of 20 pixels/sec
                this.player.body.velocity.x = 20;
                break;
        }
    },

    //Sets the current speed of the player from the d.s.
    getSpeed: function()
    {
        //Retrieve queue/array of the speed values
        this.speedValues = JSON.parse(localStorage.ds);

        //Checks every 50 cycles to pull from queue/array
        if(this.arrayMoment % 100 === 0 && this.speedValues.length > 0)
        {
            //if(speedValues[this.arrayIndex] !== null)
            if(this.arrayIndex < this.speedValues.length)
            {
                this.nextSpeed = this.speedValues[this.arrayIndex]*2;
            }
            else
            {
                //sets the speed to the default setting
                this.nextSpeed = 0;
            }

            this.arrayIndex += 1;
        }

        //Update arrayMoment
        this.arrayMoment += 1;

        //Display the current velocity
        this.labelIndex.text =  "step..."+this.arrayIndex;
    },
    //Checks to see if the .
    Goalwin: function(PLAYER, GOAL)
    {
        var error = 50;
        //get position of player.
        var playerX = Math.floor(PLAYER.x-32);
        var playerY = Math.floor(PLAYER.y-32);
        console.log("PX: "+ playerX +"PY: "+playerY );
        
        //get position of Goal.
        var goalX = Math.floor(GOAL.x);
        var goalY = Math.floor(GOAL.y);
        console.log("GX: "+ goalX + "GY: "+goalY);
        
        
        //if player is near goal, you win :D
        if((playerX <= goalX+error && playerX >= goalX-error ) && (playerY <= goalY+error && playerY >= goalY-error) )
        {
            localStorage.win = true;
            window.location.href = 'Score_Page.html';
        }
    },
    //takes player, and a win speed the player needs to achive. 
    Speedwin: function(GOALSPEED)
    {
        
        if(Math.abs(this.player.body.velocity.y) >= GOALSPEED)
            {
                localStorage.win = true; 
                window.location.href = 'Score_Page.html'; 
            }
        
        
    },
    //Checks game state to see if player won.
    superGameWin: function(PLAYER,LEVELNAME)
    {
      LEVELNAME = "LEVEL"+LEVELNAME; 
        switch(LEVELNAME)
            {
                case "LEVEL1":
                    //level one will be won when the player gets to the cave, so I can repurpose the old code here. 
                    this.Goalwin(this.player,this.goal); 
                    break;
                case "LEVEL2":
                    //Level two will be won when the player achives a specific speed. 
                    this.Speedwin(450);
                    break; 
                    //can just add more switch statements. Theres probably a better way to do this, ill look into it. but for right now just need a way to win
                default: 
                    break; 
                          
            }
    },

    //stop timer;
    endTimer: function()
    {
        timer.stop();
        outOfTime = true;

        //Set sprite to no longer have a velocity when she has run out of time
        this.confirmGoSprite = "STOP";
    },
    //Show Time Left
    formatTime: function(s)
    {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return ":" + seconds.substr(-2);
    },

    //Check current attribute values and set them in game
    checkAttributes: function()
    {
        //update gravity
        this.game.physics.p2.gravity.y                              = attributes.gravity;
        //update world "bouncyness"
        this.game.physics.p2.restitution                            = attributes.elasticity;
        //update world friction
        //this.game.physics.p2.world.defaultContactMaterial.friction  = attributes.friction;
        //update world friction (air and ground)
        this.player.body.damping                                    = attributes.friction;
        //update player velocity
        this.player.body.velocity.x                                 =  attributes.velocity;


        //Gonna add more stuff here...
    },
    //Set attributes
    updateAttributes: function()
    {
        //this.setAttributes_1();
        //this.setAttributes_2();
        //this.setAttributes_3();
    },

    /*
    * AD: new way to setup attributes
    *
    setAttribute_1: function()
    {
        //AD: to be used
        //decrement_1 = localStorage.attribute1;
        //this.attribute.decrementSecond(decrement_1);
    }
    setAttribute_2: function()
    {
        //AD: to be used
        //decrement_2 = localStorage.attribute2;
        //this.attribute.decrementSecond(decrement_2);
    }
    setAttribute_3: function()
    {
        //AD: to be used
        //decrement_3 = localStorage.attribute3;
        //this.attribute.decrementSecond(decrement_3);
    }
    * */
    //These functions were used for Archie I
    /*
    //Button to make the sprite move
    setSpriteToGo: function()
    {
        localStorage.attempt++;
        //turns the button invisible
        this.buttonSprite.visible =! this.buttonSprite.visible;
        //Allow the sprite to go through its movement
        this.confirmGoSprite = "GO";
    },

    //Button to go to the canvas page to draw out velocity graph
    goToCanvas: function()
    {
        //turns the button invisible
        this.buttonCanvas.visible =! this.buttonCanvas.visible;
        //Go to Canvas page to permit drawing
        window.location.href = 'Canvas_Page.html';
    },

    //Button to go to the score screen to view progress
    goToScore: function()
    {
        //turns the button invisible
        this.buttonScore.visible =! this.buttonScore.visible;
            //Set winnings to neutral
         localStorage.win = null;
        //Go to Canvas page to permit drawing
        window.location.href = 'Score_Page.html';
    },
    */

    updatePauseScreenInfo: function(attr1, attr2, attr3)
    {
        //This function takes the attribute number and assigns the images, text, and onclick's to the pause screen.
        function addToScreen(attribute,upperContainer,lowerContainer)
        {

            switch(attribute)
            {
                //The gravity attribute.
                case 1:
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_gravityIncreaseBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Gravity";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_gravityDecreaseBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Gravity";
                    document.getElementById("button_"+upperContainer+"_image").onclick = function () {setAttribute_1_up();};
                    document.getElementById("button_"+lowerContainer+"_image").onclick = function () {setAttribute_1_down();};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Gravity";
                    break;
                //The velocity up/down attribute.
                case 2:
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_velocityRightBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Velocity";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_velocityLeftBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Velocity";
                    document.getElementById("button_"+upperContainer+"_image").onclick= function () {setAttribute_2_up();};
                    document.getElementById("button_"+lowerContainer+"_image").onclick= function () {setAttribute_2_down();};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Velocity";
                    break;
                //The spring attribute.
                case 3:
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_springIncreaseBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Spring";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_springDecreaseBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Spring";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {setAttribute_3_up();};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {setAttribute_3_down();};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Spring";
                    break;
                //The friction attribute
                case 4:
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_frictionUpBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Friction";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_frictionDownBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Friction";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {setAttribute_3_up();};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {setAttribute_3_down();};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Friction";
                    break;
                default:

                    break;
            }
        }
        //Call the above function for each attribute, passing in which buttons to modify.
        addToScreen(attr1,1,4);
        addToScreen(attr2,2,5);
        addToScreen(attr3,3,6);
    },
};

/**
 * Function that toggles between the pause and unpause states of the game.
 *
 * AD: works!!
 */
function togglePause()
{
    //this.pauseButton.visible;

    //game.add.text(175, 500, game.paused);
    if(this.game.paused)
    {
        this.game.add.text(175, 800, "trying to unpause");
        document.getElementById("buttonLayer").style.display = "none";
        //this.game.add.text(175, 800, game.paused);
        this.game.paused = false;
    }
    else
    {
        this.game.add.text(150, 600, "trying to pause");
        document.getElementById("buttonLayer").style.display = "block";
        this.game.paused = true;
        this.game.add.text(150, 600, game.paused);

        //AD: add the function to check the attributes once game is unpaused
        //this.updateAttributes();

    }
}

function retryLevel()
{
    window.location.href = 'Sprite_Page.html';
}

//Increase values for attributes 1, 2, and 3 by the user based on button pressed
function setAttribute_1_up()
{
    ++increment_1;
    attributes.incrementFirst(increment_1);
    attributeBar.changeAttributeBar_1(3);
    increment_1 =1;
}
function setAttribute_2_up()
{
    ++increment_2;
    //Make the button visible
    //this.attribute_2_up.visible;
    //increment the attribute
    attributes.incrementSecond(increment_2);
    attributeBar.changeAttributeBar_2(3);
    increment_2 =1;
}
function setAttribute_3_up()
{
    ++increment_3;
    //Make the button visible
    //this.attribute_3_up.visible;
    //increment the attribute
    attributes.incrementThird(increment_3);
    attributeBar.changeAttributeBar_3(3);
    increment_3 =1;
}
//Lower values for attributes 1, 2, and 3 by the user based on button pressed
function setAttribute_1_down()
{
    --decrement_1;
    //Make the button visible
    //this.attribute_1_down.visible;
    //decrement the attribute
    attributes.decrementFirst(decrement_1);
    attributeBar.changeAttributeBar_1(-3);
    decrement_1 = -1;
}
function setAttribute_2_down()
{
    --decrement_2;
    //Make the button visible
    //this.attribute_2_down.visible;
    //decrement the attribute
    attributes.decrementSecond(decrement_2);
    attributeBar.changeAttributeBar_2(-3);
    decrement_2 = -1;
}
function setAttribute_3_down()
{
    --decrement_3;
    //Make the button visible
    //this.attribute_3_down.visible;
    //decrement the attribute
    attributes.decrementThird(decrement_3);
    attributeBar.changeAttributeBar_3(-3);
    decrement_3 = -1;
}