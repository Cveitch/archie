var attributes = new Attributes();  //Global attribute object which manages the value
var loopQueue = new LoopQueue(8);
// loopQueue = new LoopQueue(currentLevel.queueSize);
var currentLevel;                   //Holds what the current level is.
var winCondition;                   //Holds the win condition for the level. This function is checked every game update.
var onStart;                        //Function called at level creation to add level specific components into the game.
var onUpdate;                       //Holds the win condition for the level. This function is checked every game update.

var currentlyOnGround = true;
var previousYVelocities = [0];

var Main = function(game) {/*This function allows "Main" to be accessed by the game instance.*/};

Main.prototype = {
    //Called once at the start of the game to create and load everything in.
    create: function()
    {
        localStorage.atLevelBeginning = "true";     //Used to signal to the game to first got o the objective screen.
        this.loadLevelAttributeInfo();              //Loads the level specific info into the game.
        this.loadPauseScreenInfo();                 //Loads the proper pause screen info into the game.
        this.loadAttributeQueueInfo();              //Loads the attribute queue info into the game.
        this.createPhysics();                       //Creates the physics of the game.
        this.createWorld();                         //Creates the world for the game.
        this.createPlayer();                        //Creates and loads the player into the game.
        this.createGoal();
        this.createGems();
        this.createBBlocks();
        this.createSpikes();
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
        if(!this.isTouchingDirection(this.player,"down",0.5))
            this.player.loadTexture("avatar", 4);
        else if(attributes.velocity() != 0)
            this.player.animations.play('walk');
        else
            this.player.loadTexture("avatar", 0);

        this.checkOverlapManually(this.gems, 40);
        this.checkOverlapManually(this.goals, 60);

        this.checkOverlapManually(this.spikeSeed, 40);
        this.checkOverlapManually(this.breakBlock, 65);

        this.updateGameAttributes();
        

    },
    //Called every game update and updates the attribute amount if any changes were made.
    updateGameAttributes: function()
    {
        //Gets whether the player is hitting obstacles in any of the directions. These are created so the functions only
        // need to be called once.
        var touchingUp = this.isTouchingDirection(this.player,"up",-0.2);
        var touchingDown = this.isTouchingDirection(this.player,"down",0.2);
        var touchingLeft = this.isTouchingDirection(this.player,"left",-0.95);
        var touchingRight = this.isTouchingDirection(this.player,"right",0.95);
        this.game.physics.p2.gravity.y = attributes.gravity();

        //Gets the current velocity.
        var newVelocity = attributes.velocity();
        //If the player hits an object and has a speed going in the direction they hit, then reset it to 0.
        //This is important since if only checking left/right, the player cannot move away from the edge.
        if((touchingRight && newVelocity > 0) || (touchingLeft && newVelocity < 0))
        {
            this.player.body.velocity.x = attributes.updateAttributeAmountFromGame("velocity",0);
        }
        else
        {
            //Only allow for velocity to increase when the player is on the ground. Wouldn't make sense otherwise.
            if(touchingDown)
            {
                //Get the new velocity using the equation vf = vo +at.
                //0.1 is used to scale the acceleration to a more appropriate value for the game.

                //Take into account friction.
                newVelocity += attributes.acceleration()*this.time.elapsed*0.1;

                var frictionCalc = attributes.friction()*this.time.elapsed*0.1;
                //Friction will always make your velocity approach 0.
                if(newVelocity > 0)
                {
                    if(newVelocity - frictionCalc < 0)
                        newVelocity = 0;
                    else
                        newVelocity = Math.floor(newVelocity-frictionCalc);
                }
                else
                {
                    if(newVelocity + frictionCalc > 0)
                        newVelocity = 0;
                    else
                        newVelocity = Math.ceil(newVelocity+frictionCalc);
                }

                this.player.body.velocity.x = attributes.updateAttributeAmountFromGame("velocity",newVelocity);
            }
        }

        //This array is needed because by the time the player hits the ground, the y-velocity has already been canceled out.
        //This array is used to hold the 10 previous velocities. Then when you hit the ground, you can take the max of these.
        //Remove the head element if there are more then 10. This is to keep only the 10 previous velocities.
        if(previousYVelocities.length > 10)
            previousYVelocities.shift();
        //Add the current velocity to the list.
        previousYVelocities.push(this.player.body.velocity.y);

        //If the player just touched the ground while they were previously in the air:
        if(!currentlyOnGround && touchingDown)
        {
            //This is a minimum y-speed requirement to prevent multiple small bounces when moving across horizontal surface.
            if(Math.abs(this.player.body.velocity.y) > 10)
                this.player.body.velocity.y = -Math.max.apply(Math, previousYVelocities)*attributes.bounce();
            currentlyOnGround = true;
        }
        else
        {
            currentlyOnGround = false;
        }
        
    },

    /**
     * Determines whether the given object is touching a surface in the direction given.
     * @param object - the sprite to test for.
     * @param direction - which direction to test for (up, down, left, right)
     * @param strength - specified how steep the angle between the object and the player is.
     * @returns boolean - true if touching, false if not.
     */
    isTouchingDirection: function(object, direction, strength)
    {
        //Axis indicates whether testing for left/right or up/down
        //Strength is how steep the surface must be for it to count. To avoid having the sprite move up hills count as
        //left / right collision, they have value +-0.75. Where as down has only 0.2 meaning it doesn't need to be to steep.
        var axis;
        var result = false;
        //Determines what direction we want to check based on the given input.
        switch(direction)
        {
            //The values 1,0 indicate the y-axis where as 1,0 indicates the x-axis.
            case "up":
                axis = p2.vec2.fromValues(0, 1);
                break;
            case "down":
                axis = p2.vec2.fromValues(0, 1);
                break;
            case "left":
                axis = p2.vec2.fromValues(1, 0);
                break;
            case "right":
                axis = p2.vec2.fromValues(1, 0);
                break;
        }
        //Iterates over P2's contact equations to see if any involve the given object.
        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];
            if (c.bodyA === object.body.data || c.bodyB === object.body.data)        {
                var d = p2.vec2.dot(c.normalA, axis); // Normal dot Y-axis
                if (c.bodyA === object.body.data) d *= -1;
                //Down and right need to be greater for it to be true.
                if(direction == "down" || direction == "right")
                {
                    if (d > strength) result = true;
                }
                //Up and left need to be smaller.
                else
                {
                    if (d < strength) result = true;
                }

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
    //creates collectible gems from level file
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
    //creates collectable gems from level file
    createSpikes: function()
    {
        //create gem group
        this.spikeSeed = this.game.add.group();
        this.spikeSeed.enableBody = true;
        this.spikeSeed.name = 'spikeSeed'; // used for identifying group
        //this.gems.physicsBodyType = Phaser.Physics.P2JS;

        result = this.findObjectsByType('spikeSeed', this.mymap, 'entities');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.spikeSeed);

        }, this);

        this.spikeSeed.forEachExists(function(temp) {
            //Add the sprite to the game.
            this.game.physics.p2.enable(temp, false);
            //Creates a 'sensor' that triggers an event whenever the player collides with it.
            temp.body.setCircle(50);
            //Set the point object to remain static in the game (ie. wont fall).
            temp.body.static = false; //unnecessary but shows potential

        });
    },
    //creates collectable gems from level file
    createBBlocks: function()
    {
        //create gem group
        this.breakBlock = this.game.add.group();
        this.breakBlock.enableBody = true;
        this.breakBlock.name = 'breakBlock'; // used for identifying group
        this.breakBlock.physicsBodyType = Phaser.Physics.P2JS;

        result = this.findObjectsByType('breakBlock', this.mymap, 'entities');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.breakBlock);

        }, this);

        this.breakBlock.forEachExists(function(temp) {
            //Add the sprite to the game.
            this.game.physics.p2.enable(temp, true);
            //Creates a 'sensor' that triggers an event whenever the player collides with it.
            temp.body.setCircle(15);

            temp.body.x = temp.x + 16;
            temp.body.y = temp.y + 16;
            //Set the point object to remain static in the game (ie. wont fall).
            temp.body.static = true; //unnecessary but shows potential

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
    //source of work detailed in level creation guide
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
    //source of work detailed in level creation guide
    createFromTiledObject: function(element, group)
    {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    },

    //finds if a group of objects touch the player
    //source of work detailed in level creation guide
    checkOverlapManually: function(group, given_bounds)
    {
        var playerX = this.player.x;
        var playerY = this.player.y;
        //console.log(group);
        group.forEachExists(function(entity)
        {
            var dx = playerX - (entity.x + (entity.width/2));  //distance ship X to enemy X
            var dy = playerY - (entity.y + (entity.height/2));  //distance ship Y to enemy Y
            var dist = Math.sqrt(dx*dx + dy*dy);     //pythagoras ^^  (get the distance to each other)
            if (dist < given_bounds)
            {  // if distance to each other is smaller than both radii together a collision/overlap is happening
                if(group.name === 'gems')
                {
                    entity.destroy();
                    incrementPoints(1);
                }
                else if (group.name === 'goals')
                {
                    window.location.href = 'Score_Page.html';
                }
                else if (group.name === 'spikeSeed')
                {
                    window.location.href = 'Sprite_Page.html';
                }
                else if (group.name === 'breakBlock')
                {
                    if (attributes.gravity()> 100)
                    {
                        entity.destroy();
                    }
                }
            }
        });
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
               // loopQueue = new LoopQueue(currentLevel.queueSize);
                break;
            case 2:
                currentLevel = levels.level2;
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
        function addToScreen(attrName,upperContainer,lowerContainer,barNum)
        {
            switch(attrName)
            {
                case "gravity":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_gravityIncrease.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Gravity";

                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_gravityDecrease.png";
                    //document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Gravity";
                    document.getElementById("button_"+upperContainer+"_image").onclick = function () {attributes.updateAttributeAmountFromButton(barNum,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick = function () {attributes.updateAttributeAmountFromButton(barNum,false);};
                    document.getElementById("attributeBar_"+barNum+"_label").innerHTML = "Gravity";
                    break;
                case "velocity":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_velocityRight.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Velocity";

                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_velocityLeft.png";
                    //document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Velocity";
                    document.getElementById("button_"+upperContainer+"_image").onclick= function () {attributes.updateAttributeAmountFromButton(barNum,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick= function () {attributes.updateAttributeAmountFromButton(barNum,false);};
                    document.getElementById("attributeBar_"+barNum+"_label").innerHTML = "Velocity";
                    break;

                case "bounce":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_springIncrease.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Bounce";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_springDecrease.png";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,false);};
                    document.getElementById("attributeBar_"+barNum+"_label").innerHTML = "Bounce";
                    break;
                case "friction":

                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_frictionUp.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Friction";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_frictionDown.png";
                    //document.getElementById("button_"+lowerContainer+"_text").innerHTML = "Decrease Friction";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,false);};
                    document.getElementById("attributeBar_"+barNum+"_label").innerHTML = "Friction";
                    break;
                    break;
                case "acceleration":
                    document.getElementById("button_"+upperContainer+"_image").src = "assets/images/Buttons/spr_accelerationRightBlue.png";
                    document.getElementById("button_"+upperContainer+"_text").innerHTML = "Acceleration";
                    document.getElementById("button_"+lowerContainer+"_image").src = "assets/images/Buttons/spr_accelerationLeftBlue.png";
                    document.getElementById("button_"+upperContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,true);};
                    document.getElementById("button_"+lowerContainer+"_image").onclick=function () {attributes.updateAttributeAmountFromButton(barNum,false);};
                    document.getElementById("attributeBar_"+barNum+"_label").innerHTML = "Acceleration";
                    break;
            }
        }
        //Call the above function for each attribute, passing in which buttons to modify.
        addToScreen(attributes.attr1.name,1,2,1);
        addToScreen(attributes.attr2.name,3,4,2);
        addToScreen(attributes.attr3.name,5,6,3);
    },

    loadAttributeQueueInfo: function()
    {
       // document.getElementById("loop_button").onclick = function() {loopQueue.addToQueue()};
        document.getElementById("loop_button").onclick = function() {loopQueue.startToQueue()};
        document.getElementById("reset_loop_button").onclick = function() {loopQueue.resetQueue()};
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
        //when You unpause the game iterate through the looparray
        this.game.paused = true;
        //when you pause the game, clear the loop array
        loopQueue.resetQueue(); 
       
    }
  
    
}

//Reloads the page to reset the level.
function retryLevel()
{
    //vibrates the phone for feed back

    window.location.href = 'Sprite_Page.html';
}
