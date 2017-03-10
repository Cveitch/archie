var Boot = function(game){
	//This function allows "Boot" to be accessed by the game instance
};
  
Boot.prototype = {

  	create: function()
	{
		//Boots up preload
		this.game.state.start("Preload");
	}
}