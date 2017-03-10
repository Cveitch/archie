/**
 * Created by Riley Wium on 3/4/2017.
 */
var LevelCreate = function(game){}


LevelCreate.prototype ={
    create: function() {


        this.createWorld();
        this.createGems();
        this.createGoal();
        this.createPlayer();

    },

    update: function()
    {
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
};
