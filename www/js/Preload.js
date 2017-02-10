var Preload = function(game){
	//This function allows "Preload" to be accessed by the game instance
};

Preload.prototype = {

	preload: function()
    {
		this.game.load.spritesheet	("avatar", "assets/images/spr_FrogSheet.png", 64,64);
		this.game.load.spritesheet	("goal", "assets/images/spr_FlyStrip.png", 64,64);
        this.game.load.tilemap	("Level1", "assets/sprite_physics/archie_cavelevel.json",null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap	("Level2", "assets/sprite_physics/archie_fastfalllevel.json",null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap	("Level3", "assets/sprite_physics/archie_cavelevel.json",null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image    ("bkg_tileset", "assets/images/bkg_tileset.png");
	   	 this.game.load.image 	("star","assets/star.png");

		/*
		//This is the button used to start the sprite on its adventure down the world in the Sprite page
		this.game.load.image	("button_goSprite", "assets/images/spr_button.png");
		//This is the button used to jump to the Canvas page from the Sprite page for the first time
		this.game.load.image	("button_goCanvas", "assets/images/spr_button5.png");
		//This is the button used to jump to the Sprite page from the Canvas page
		this.game.load.image	("button_goScore", "assets/images/spr_button4.png");
		*/
	},

	create: function()
    {
		this.game.state.start("Main");
	}
}

/*
* 	Should create some sort of superclass for environments for which this class
* can generate different types of environments, switching between them as a new
* level is made using a case statement.
* */
