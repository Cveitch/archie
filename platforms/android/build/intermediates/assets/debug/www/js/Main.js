var attributes = new Attributes();  //Global attribute object which manages the values
var currentLevel;                   //Holds what the current level is.
var winCondition;                   //Holds the win condition for the level. This function is checked every game update.
var onStart;                        //Function called at level creation to add level specific components into the game.
var onUpdate;                       //Holds the win condition for the level. This function is checked every game update.

var Main = function(game) {/*This function allows "Main" to be accessed by the game instance.*/};

Main.prototype = {
    //Called once at the start of the game to create and load everything in.
    create: function()
    {
        localStorage.atLevelBeginning = "true";     //Used to signal to the game to first got o the objective screen.
        this.loadLevelAttributeInfo();              //Loads the level specific info into the game.
        this.loadPauseScreenInfo();                 //Loads the proper pause screen info into the game.
        this.createPhysics();                       //Creates the physics of the game.
        this.createWorld();                         //Creates the world for the game.
        this.createPlayer();                        //Creates and loads the player into the game.
        this.game.input.onDown.add(togglePause,this);  //Add a onDown functions to game.
        game.physics.p2.setImpactEvents(true);      //Important: allows sprites to trigger impact events.
        onStart(this);
    },
  
    update: function()
    {
        //Check the win condition.
        winCondition(this);
        onUpdate(this);
        //Load the objective screen if just starting level.
        if(localStorage.atLevelBeginning === "true")
            goToObjective();
        //The sprite should be facing the way they are moving.
        if(attributes.velocity() < 0)
            this.player.scale.x = -1;
        else
            this.player.scale.x = 1;

        //Flips the character left of right depending on which way their velocity is. 1 is right, -1 is left.
        if(attributes.velocity() < 0)
            this.player.scale.x = -1;

        else if (attributes.velocity() > 0)
            this.player.scale.x = 1;

        //Updates the characters animation to match what they are doing.
        if(!this.isTouchingDown(this.player))
            this.player.loadTexture("avatar", 4);
        else if(attributes.velocity() != 0)
            this.player.animations.play('walk');
        else
            this.player.loadTexture("avatar", 0);


        this.updateGameAttributes();
    },
    //Called every game update and updates the attribute amount if any changes were made.
    updateGameAttributes: function()
    {
        this.player.body.velocity.x = attributes.velocity();
        this.game.physics.p2.gravity.y = attributes.gravity();

    },
  
    isTouchingDown: function(object)
    {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
            if (c.bodyA === object.body.data || c.bodyB === object.body.data)        {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === object.body.data) d *= -1;
                if (d > 0.2) result = true;
            }
        } return result;
    },
  
    createPhysics: function()
    {
        // Starts the Phaser P2 Physics Engine
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        // Set the initial gravity.
        this.game.physics.p2.gravity.y = attributes.gravity();
    },
    //Creates and places the players character in the game.
    createPlayer: function()
    {
        this.player = this.game.add.sprite(currentLevel.characterInfo.x, currentLevel.characterInfo.y, currentLevel.characterInfo.name);
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

    //Create the environment of the game.
    createWorld: function()
    {
        //Used to determine which level to load in.
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
        this.mymap.createLayer('Block');

        //this.mymap.createLayer("testObjects");
        //we resize the world to the background as it will be covering the entire level
        this.layerbackground.resizeWorld();

        this.game.physics.p2.convertCollisionObjects(this.mymap, "objects1");

    },
    loadLevelAttributeInfo: function()
    {
        switch(parseInt(getCurrentLevel()))
        {

            case 1:
                currentLevel = levels.level1;
                attributes.setAttributes(currentLevel.attribute1,currentLevel.attribute2,currentLevel.attribute3);
                winCondition = currentLevel.winCondition;
                onStart = currentLevel.onStart;
                onUpdate = currentLevel.onUpdate;
                break;
            //TODO: add other levels.
        }
    },
  
    loadPauseScreenInfo: function()
    {
        //This function takes the attribute number and assigns the images, text, and onclick's to the pause screen.
        function addToScreen(attrName,upperContainer,lowerContainer)
        {
            switch(attrName)
            {
                case "gravity":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_gravityIncreaseBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Gravity";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_gravityDecreaseBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Gravity";
                    document.getElementById("button_"+upperContainer+"_image").onclick = function () {attributes.updateAttributeAmount(upperContainer,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick = function () {attributes.updateAttributeAmount(upperContainer,false);};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Gravity";
                    break;
                case "velocity":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_velocityRightBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Velocity";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_velocityLeftBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Velocity";
                    document.getElementById("button_"+upperContainer+"_image").onclick= function () {attributes.updateAttributeAmount(upperContainer,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick= function () {attributes.updateAttributeAmount(upperContainer,false);};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Velocity";
                    break;
                case "elasticity":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_springIncreaseBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Spring";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_springDecreaseBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Spring";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {attributes.updateAttributeAmount(upperContainer,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {attributes.updateAttributeAmount(upperContainer,false);};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Spring";
                    break;
                case "friction":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_frictionUpBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Increase Friction";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_frictionDownBlue.png";
                    document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Friction";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {attributes.updateAttributeAmount(upperContainer,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {attributes.updateAttributeAmount(upperContainer,false);};
                    document.getElementById("attributeBar_"+upperContainer+"_label").innerHTML = "Friction";
                    break;
            }
        }
        //Call the above function for each attribute, passing in which buttons to modify.
        addToScreen(attributes.attr1.name,1,4);
        addToScreen(attributes.attr2.name,2,5);
        addToScreen(attributes.attr3.name,3,6);
    },
    //Adds a point object to the game. Calls pointCollisionEvent when the player hits it.
    addPointObject: function(x,y)
    {
        //Creates a new point object as a sprite.
        var temp = this.game.add.sprite(x,y,'star');
        //Enable the physics on the sprite.
        temp.enableBody = true;
        //Add the sprite to the game.
        this.game.physics.p2.enable(temp,false);
        //Creates a 'sensor' that triggers an event whenever the player collides with it.
        temp.body.setCircle(25);
        //Set the point object to remain static in the game (ie. wont fall).
        temp.body.static = true;
        //Adds a callback event for whenever the player collides with it.
        temp.body.createBodyCallback(this.player,pointCollisionEvent,this.game);

        function pointCollisionEvent(bodyA,bodyB)
        {
            bodyA.sprite.destroy();
        }
    },
    addGoal: function(x,y)
    {
        //Creates a new point object as a sprite.
        var temp = this.game.add.sprite(x,y,'goal');
        //Enable the physics on the sprite.
        temp.enableBody = true;
        //Add the sprite to the game.
        this.game.physics.p2.enable(temp,false);
        //Creates a 'sensor' that triggers an event whenever the player collides with it.
        temp.body.setCircle(25);
        //Set the point object to remain static in the game (ie. wont fall).
        temp.body.static = true;
        //Adds a callback event for whenever the player collides with it.
        temp.body.createBodyCallback(this.player,goalCollisionEvent,this.game);

        function goalCollisionEvent(bodyA,bodyB)
        {
            window.location.href = 'Score_Page.html';
        }
        temp.animations.add('fly', [0,1,2,3], 4, true);
        temp.animations.play('fly');
    }
};

//Toggles between the pause and un-pause states of the game.
function togglePause()
{
    if(this.game.paused)
    {
        document.getElementById("buttonLayer").style.display = "none";
        //this.game.add.text(175, 800, game.paused);
        this.game.paused = false;
    }
    else
    {
        document.getElementById("buttonLayer").style.display = "block";
        this.game.paused = true;
    }
}

//Reloads the page to reset the level.
function retryLevel()
{
    //vibrates the phone for feed back
    
    window.location.href = 'Sprite_Page.html';
}
