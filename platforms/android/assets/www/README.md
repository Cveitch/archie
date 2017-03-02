# project_Archimedes_CPSC_499
Project repository for group A, CPSC 499

What currently works:
+Switching between pages without causing the physics engine to load info to other pages that should only be specific to
ONE page
+Solved a work around when switching between pages by having each page jump to another (SPRITE<->CANVAS). Error 404
occurs whenever Comparison.js is involved somehow.

What currently doesn't work:
-Physics engine keeps reloading its settings whenever Sprite page is activated; should just keep the previous settings
form the first time it is loaded (fixed!)
-The game isn't resizing to the device window despite being told to resize to the viewing window (initialized in Sprite_Page.html).

//--How things work--//:

I'll try to make as simple as possible, but the best way to explain how the physics engine works will seem like a bore.
So bear with me.

1) What you'll need to do is create an object of Phaser in order to use all of it's methods and engines (in our case it'll
be P2):
    game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);
    <!--The parameters are self-explanatory except for Phaser.AUTO. This allows Phaser to use WebGL to run things on the webapge-->

2) Allow the following .js files to have their objects be used by the game instance:
    game.state.add("Boot", Boot);
    game.state.add("Preload", Preload);
    game.state.add("Main", Main);

3) Start the state of the game. This causes the game instance to set it's current state to begin in the Boot.js
    game.state.start("Boot");

4) Jumping into Boot.js, "Boot" (which is represented as the Boot variable called earlier in state.add) runs through
and into create():
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.state.start("Preload");
    <!--ScaleManager.SHOW_ALL allows the current game instance to show the entire game display while still maintaining
    the aspect ratio-->
    <!--game instance then jumps into the Preload.js-->

5) Jumping into Preload.js, "Preload" (which is represented as the Preload variable called earlier in state.add) loads
up:
    this.game.load.image("example_sprite_image", "dir/to/example_sprite_image.png");
    this.game.load.tilemap("example_level", "dir/to/example_level.json", null, Phaser.Tilemap.TILE_JSON);
    <!--This is where sprites, images, and tile sets (level layout) are loaded to be used by the game instance-->
    <!--The second line is creating the physics and collision parameters of the level-->

    this.game.state.start("Main");
    <!--As you can guess, we are jumping into Main.js-->

Jumping into Main.js, "Main" (which is represented as the Main variable called earlier in state.add) loads
up and steps through all the functions in sequential order. These include functions creating the physics for the world, the background, the player (sprite), levels, and buttons.

6) createPhysics() sets up the physics to be used throughout the entire game. This is where the P2 physics engine is activated to be 	    used throughout the game. 

    this.game.physics.startSystem(Phaser.Physics.P2JS);.
    <!--This line allows for the P2 engine to be engaged-->

    this.game.physics.p2.gravity.y = 1400;
    <!--Once the P2 engine has been activated, you can set the gravity of the game instance envrionment-->

7) createBackground() enables the level and the rest of the game world to be loaded.
    var blockShape = this.game.add.bitmapData(this.game.world.width, 200);
    <!--Creates a blockShape variable that is the width of the game's display in terms of pixels and 200 pixels in length-->

    blockShape.ctx.rect(0, 0, this.game.world.width, 200);
    <!--Sets blockShape to have a rectangle perimeter-->

    blockShape.ctx.fillStyle = '000';
    <!--The fill pattern for blockShape will now be black-->

    blockShape.ctx.fill();
    <!--blockShape will allow the area denoted by the perimeter set previously to be entirely black-->

    this.block = this.game.add.sprite(0, 0, blockShape);
    <!--Adding blockShape to block instance in order to be used a sprite-->

    this.game.physics.p2.enable(this.block);
    <!--This enables the block instance to be affect by the P2 engine's calculations-->

    this.block.body.static = true;
    <!--Fixes the block instance in the space, preventing to be influenced by gravity-->

    this.block.anchor.setTo(0, 0);
    <!--This places the block instance in a specific location in the game's display, in this case the origin of the
    rectangle is set to the top left corner of the game's display. This will cause it to appear like a tiled roof-->

8) createPlayer() creates a sprite using the sprite files preloaded from the Preload.js:

    this.game.physics.p2.enable(this.player);
    <!--places character in world-->

    this.player.anchor.setTo(0.5,0.5);
    <!--Sets the sprite at an x and y placement from its original initiation-->
    
    this.game.camera.follow(this.player);;
    <!--Camera follows the player throughout the world-->
    
    this.player.body.setCircle(44,0,0)
    <!--Gives the player a hitbox (radius, offestx, offsety)-->

    this.player.body.fixedRotation=true;
    <!--wouldn't want the character tumbling over-->

9) createButtons() sets up the buttons to be used in-game. The functions button_goSprite(), button_goCanvas(), and button_goScore() are called when their respective buttons are pressed.
    
    <!--Create the buttons in the game-->
    createButtons: function()
    {
	this.buttonSprite = this.game.add.button(this.game.world.centerX-50, this.game.world.centerY+240, "button_goSprite",
	      this.setSpriteToGo, this);
      	this.buttonCanvas = this.game.add.button(this.game.world.centerX+375, this.game.world.centerY-300, "button_goCanvas", this.goToCanvas, this);
      	this.buttonScore  = this.game.add.button(this.game.world.centerX-500, this.game.world.centerY-300, "button_goScore", this.goToScore, this);
    },

10) getSpeed() pulls the latest speed present from a queue/array and then to be updated as the next speed for the sprite to have. The latest speed is saved as the nextSpeed object:
    if(this.arrayMoment % 50 === 0)
    {
	if(this.arrayIndex < speedValues.length)
	{
		this.nextSpeed = speedValues[this.arrayIndex];
	}
	else
	{
		//sets the speed to the degault setting
		this.nextSpeed = 0;
	}
	this.arrayIndex += 1;
    }
    this.arrayMoment += 1;

11) movePlayer() is pretty self-explanatory: this is the function that will set the velocity taken by getSpeed() to the sprite.
    
    this.gameWin(this.player,this.goal);
    <!--This checks to see if the player has reached the goal-->

    switch(this.confirmGoSprite)
    {
    	<!--The velocity is measured using pixels per second-->
      	case "STOP"
         this.player.body.velocity.x = this.nextSpeed;
         break;
      	case "GO":
         this.player.body.velocity.x = this.nextSpeed;
         break;
      	default:
	 this.player.body.velocity.x = 20;
	 break;
   }

12) objectLocations() is a case statement function that loads up the goal and sprite image from Preload.js to be activated in      game:

   <!--Loads corresponding level based on getCurrentLevel() request-->
   switch(getCurrentLevel())
   {
   	case "1":
      	 this.goal  = this.game.add.sprite(this.game.world.width-100,400,"goal");
      	 this.player = this.game.add.sprite(200, 489, "avatar");
	 break;
   	case "2":
      	 this.goal  = this.game.add.sprite(this.game.world.width-114,116,"goal");
       	 this.player = this.game.add.sprite(500, 160, "avatar");
      	 break;
   	case "3":
      	 this.goal  = this.game.add.sprite(0,400,"goal");
      	 this.player = this.game.add.sprite(200, 290, "avatar");
      	 break;
   	default:
      	 this.goal  = this.game.add.sprite(this.game.world.width-100,400,"goal");
      	 this.player = this.game.add.sprite(200, 489, "avatar");
      	 break;
   }
	

Credit where it's due:

I followed the tutorial given here: https://www.codeandweb.com/physicseditor/tutorials/phaser-p2-physics-example-tutorial

It helped me understand how the basics work. My next goal is to delve deep into creating an environment for a landscape
to allow our sprite to pass through.
