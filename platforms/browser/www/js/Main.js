var Main = function(game)
{
	//This function allows "Main" to be accessed by the game instance
};

//variables to keep track of time.
var timer;
var timerEvent;
//if out of time turn false
var outOfTime;
//Var for how much time you have to clear the level.
var timeAllowed = 25;

Main.prototype = {

	create: function()
	{
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
        timer = game.time.create();

		//delayed event
        timerEvent = timer. add(Phaser.Timer.SECOND * timeAllowed, this.endTimer, this);

		//start timer
        timer.start();
        outOfTime = false;

        //Enable the physics to start
        this.createPhysics();

		//Create the background for the game
        this.createBackground();

		//Sets the Character and Goals location
		this.objectLocations();

	    //Create the player
	    this.createPlayer();

		//Create Sprite page buttons
		this.createButtons();
	},

	update: function()
	{
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

		if 	(this.player.body.velocity.x < 0)
		{
			// flip character left
			this.player.scale.x = -1;
		}
		else if (this.player.body.velocity.x > 0)
		{
			// flip right
			this.player.scale.x = 1;
		}
	},

	createButtons: function()
	{
		//Initialize the buttons needed (BROKEN)
		this.buttonSprite = this.game.add.button(this.player.x-175, this.player.y-30, "button_goSprite", this.setSpriteToGo, this);
        this.buttonCanvas = this.game.add.button(this.player.x-175, this.player.y+40, "button_goCanvas", this.goToCanvas, this);
        this.buttonScore  = this.game.add.button(this.player.x-175, this.player.y-100, "button_goScore", this.goToScore, this);
    },

	createPhysics: function()
	{
		// Start the P2 Physics Engine
		this.game.physics.startSystem(Phaser.Physics.P2JS);

		// Set the gravity
		this.game.physics.p2.gravity.y = 1400;
	},

	createBackground: function()
	{
		//levelName is the string that is used to determine the level based on the level counter
		var levelName = "Level"+getCurrentLevel();

		// initialised tilemap with matching tileset
		var mymap = this.game.add.tilemap(levelName);
		mymap.addTilesetImage('tset_world1');

		//creates layers matching the .json testlevel
		layerbackground = mymap.createLayer('background');
		layerblocks 	= mymap.createLayer('block1');
		layerdetails 	= mymap.createLayer('detail1');

		//we resize the world to the background as it will be covering the entire level
		layerbackground.resizeWorld();

		//turns polylines solid
		//var layerpolyline_tiles = this.game.physics.p2.convertCollisionObjects(mymap, "objects1");
		this.game.physics.p2.convertCollisionObjects(mymap, "objects1");
	},
	
	objectLocations: function()
	{
        //Loads corresponding level based on getCurrentLevel() request
		switch(getCurrentLevel())
		{
			case "1":
				this.goal 	= this.game.add.sprite(this.game.world.width-100,400,"goal");
				this.player = this.game.add.sprite(200, 489, "avatar");
				break;
			case "2":
				this.goal 	= this.game.add.sprite(this.game.world.width-114,116,"goal");
				this.player = this.game.add.sprite(500, 160, "avatar");
				break;
			case "3":
				this.goal 	= this.game.add.sprite(0,400,"goal");
				this.player = this.game.add.sprite(200, 290, "avatar");
				break;
			default:
				this.goal 	= this.game.add.sprite(this.game.world.width-100,400,"goal");
				this.player = this.game.add.sprite(200, 489, "avatar");
				break;
		}
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
		this.player.body.setCircle(44,0,0);

		//wouldn't want the character tumbling over
		this.player.body.fixedRotation=true;
	},

    //Moves a player
	movePlayer: function()
	{
        //check win condition;
        this.gameWin(this.player,this.goal);

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

    //Checks game state to see if player won.
    gameWin: function(PLAYER, GOAL)
    {
        var error = 20;
        //get position of player.
        var playerX = Math.floor(PLAYER.x-35);
        var playerY = Math.floor(PLAYER.y-96);
        console.log("PX: "+ playerX +"PY: "+playerY );
        
    	//get position of Goal.
    	var goalX = Math.floor(GOAL.x);
    	var goalY = Math.floor(GOAL.y);
		console.log("GX: "+ goalX + "GY: "+goalY);
		
    	//if time is more than 5 seconds you lose.
    	if(!timer.running)
		{
			localStorage.win = false;
			window.location.href = 'Score_Page.html';
		}
		
        //if player is near goal, you win :D
		if((playerX <= goalX+error && playerX >= goalX-error ) && (playerY <= goalY+error && playerY >= goalY-error) )
		{
			localStorage.win = true;
			window.location.href = 'Score_Page.html';
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

    render: function () 
    {
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (timer.running)
        {
            game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), this.game.world.width/2, 30, "#d8c23f");
        }
        else
        {
            game.debug.text("Done!", 2, 14, "#6f6f6f");
        }
    },

	//Show Time Left
	formatTime: function(s)
	{
		// Convert seconds (s) to a nicely formatted and padded time string
		var minutes = "0" + Math.floor(s / 60);
		var seconds = "0" + (s - minutes * 60);
		return ":" + seconds.substr(-2);
	},

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
};
