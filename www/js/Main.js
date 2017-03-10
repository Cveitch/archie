var attributes = new Attributes();  //Global attribute object which manages the value
//var levelCreate = new LevelCreate();
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
        this.createGoal();
        this.createGems();
        this.game.input.onDown.add(togglePause,this);  //Add a onDown functions to game.
        this.game.physics.p2.setImpactEvents(true);      //Important: allows sprites to trigger impact events.

        //text.text = game.add.text(16, 16, 'Drag the sprites. Overlapping: False', { fill: '#ffffff' });

    },
  
    update: function()
    {
        //Check the win condition.
        winCondition(this);
        onUpdate(this);
        //Load the objective screen if just starting level.
        if(localStorage.atLevelBeginning === "true")
            goToObjective();


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

        //this.gems.forEachAlive(console.log(this.gems)) // used to monitor gem properties


        this.checkOverlapManually(this.gems);
        this.checkOverlapManually(this.goals);



        this.updateGameAttributes();
    },

    createPhysics: function()
    {
        // Starts the Phaser P2 Physics Engine
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        // Set the initial gravity.
        this.game.physics.p2.gravity.y = attributes.gravity();
    },

    createPlayer: function()
    {
        var result = this.findObjectsByType('playerStart', this.mymap, 'entities');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'avatar');
        this.game.physics.p2.enable(this.player);

        this.player.physicsBodyType = Phaser.Physics.P2JS;
        this.player.anchor.setTo(0.5,0.5);
        //gives player a circle hitbox (radius,offestx,offsety)
        this.player.body.setCircle(22,0,0);
        //wouldn't want the character tumbling over
        this.player.body.fixedRotation=true;
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        //adds animation
        this.player.animations.add('walk', [1,2,3], 10, true);
        this.player.animations.play('walk');

        //fun
        //this.player.scale.set(2);
    },
    createWorld: function()
    {
        //Used to determine which level to load in.
        var levelName = "Level"+getCurrentLevel();

        // initialised tilemap with matching tileset
        this.mymap = this.game.add.tilemap(levelName);
        this.mymap.addTilesetImage('bkg_tileset');

        //creates layers matching the .json levels
        this.backgroundlayer = this.mymap.createLayer('bkgDetail3');
        this.mymap.createLayer('bkgDetail2');
        this.mymap.createLayer('bkgDetail1');
        this.mymap.createLayer('block');

        //we resize the world to the background as it will be covering the entire level
        this.backgroundlayer.resizeWorld();

        this.game.physics.p2.convertCollisionObjects(this.mymap, "collisionTerrain");

    },
    //creates collectable gems from level file
    createGems: function()
    {
        //create gem group
        this.gems = this.game.add.group();
        this.gems.enableBody = true;
        this.gems.name = 'gems'; // used for identifying group
        //this.gems.physicsBodyType = Phaser.Physics.P2JS;

        result = this.findObjectsByType('gem', this.mymap, 'entities');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.gems);

        }, this);

        this.gems.forEachExists(function(temp) {
            //Add the sprite to the game.
            this.game.physics.p2.enable(temp, false);
            //Creates a 'sensor' that triggers an event whenever the player collides with it.
            temp.body.setCircle(15);
            //Set the point object to remain static in the game (ie. wont fall).
            temp.body.static = false; //unnecessary but shows potential

        });
    },
    //creates goals from level file
    createGoal: function()
    {
        //create goal group
        this.goals = this.game.add.group();
        this.goals.enableBody = true;
        this.goals.name = 'goals';

        //gets an array of objects
        result = this.findObjectsByType('goal', this.mymap, 'entities');
        var goal;
        result.forEach(function(element){
            goal = this.createFromTiledObject(element, this.goals);

        }, this);

        this.goals.forEachExists(function(temp) {
            //Add the sprite to the game.
            this.game.physics.p2.enable(temp, false);
            //Creates a 'sensor' that triggers an event whenever the player collides with it.
            temp.body.setCircle(25);
            //Set the point object to remain static in the game (ie. wont fall).
            temp.body.static = true;
        });
        //  Now using the power of callAll we can add the same animation to all goals in the group:
        this.goals.callAll('animations.add', 'animations', 'fly', [0, 1, 2, 3], 4, true);

        //  And play them
        this.goals.callAll('animations.play', 'animations', 'fly');
    },


    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            if(element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    //create a sprite from an object
    createFromTiledObject: function(element, group)
    {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    },

    //finds if a group of objects touch the player
    checkOverlapManually: function(group)
    {
        var playerX = this.player.x;
        var playerY = this.player.y;
        //console.log(group);
        group.forEachExists(function(entity)
        {
            var dx = playerX - entity.x;  //distance ship X to enemy X
            var dy = playerY - entity.y;  //distance ship Y to enemy Y
            var dist = Math.sqrt(dx*dx + dy*dy);     //pythagoras ^^  (get the distance to each other)
            if (dist < 50)
            {  // if distance to each other is smaller than both radii together a collision/overlap is happening
                if(group.name === 'gems')
                {
                    entity.destroy();
                }
                else if (group.name === 'goals')
                {
                    window.location.href = 'Score_Page.html';
                }
            }
        });
    },

    //Called every game update and updates the attribute amount if any changes were made.
    updateGameAttributes: function()
    {
        this.player.body.velocity.x = attributes.velocity();
        this.game.physics.p2.gravity.y = attributes.gravity();

    },
    //checks to see if an object (the player) is touching the ground
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
    window.location.href = 'Sprite_Page.html';
}
