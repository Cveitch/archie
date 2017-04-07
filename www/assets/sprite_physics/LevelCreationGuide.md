# project_Archimedes_CPSC_499
Project repository for group A, CPSC 499

Hello there, what a nice surprise to find someone working on project Archimedes.
 I assume that is why your here, to create levels in a similar fashion to me, if so then you've opened the right document.

 So i'll cover making these levels in 3 steps, 1. the software used 2. how to use the software and 3. where I learned to use the software.
 Once you read even partially through this document you should find making levels for Archimedes pretty easy.

 1. The main tool used for level creation is "Tiled" a free generic tile editor.
  For making the sprites I used Adobe Photoshop CS5, but any sketching software should serve just as well.
  Finally for implementing the levels I used javascript and the webstorm IDE.

  And look at that step 1 already done.

  2. For working with Tiled you should first look to the top left and create a new map with the blank page icon.
  A menu will pop up, I always have the settings to Orthogonal, CSV, Right Down, and then have the tile size be set to 32x32px.
  These are just basic settings for the program, their was one setting I didn't mention and that was the map size which is
  measured in tiles, each tile will be 32 pixels wide and tall (since my sprites were made to be compatible with 32x32px,
  that's what we set the tile size to be).
  Next find the "Layers Panel" there you will find that you can create many different types of layers, the main layers
  we will work with are Tile Layers and Object Layers. I usually create 4 tile layers each hold the background, terrain,
  and level details each named respectfully, we do this by importing a tile set using the source tset_world1.png and
  setting tile width and height to 32x32px (even though the sprites I made are 128x128px this allows for more complex
  level design). Once we have the layers created and tile set imported all that is needed is to select the tile from the
  tile set and place it on the layer with the clone tool, just repeat until you've drawn the level you want.

  Next is the Object layer all I did was use polylines to create my levels though feel free to experiment with the other tools
  Tiled provides. To use polylines just find the insert polyline button on the top bar and start drawing the collision areas
  you want in the object layer. To get straight polylines hold ctrl, Its that easy. EDIT: I have since changed the polyline layer
  to collision terrain and added a layer entities for holding property objects. The names of every layer is important as they are
  used to help import them into the game. The proccess for importing and making entities is described in some of the links in part
  3, much better than it ever could have been explained here.

  For creating the sprites I basically just drew them on a 128x128 canvas then copy and pasted them onto tset_world1.png.

  Implementing your level in the game should be quite simple. First go to Preload.js and load both the .json file you get
  from exporting your level and the tileset you used to make it. Next go to Main.js and set the var mymap to yourlevel.json
  and add the tile set you used to mymap. To place assests like the player, goal, and anything else I manually placed them
  by using code like "goal 	= this.game.add.sprite(520,400,"goal");" in create.js.

  3. If you have more questions I found everything I needed to know by using these tutorials and forum threads.
  http://www.html5gamedevs.com/topic/9809-creating-collision-polygons-on-tiles-in-tiled-mapeditor/
  https://gamedevacademy.org/platformer-tutorial-with-phaser-and-tiled/
  http://www.html5gamedevs.com/topic/4839-p2-physics-overlap/#comment-30764
  http://examples.phaser.io/_site/view_full.html?d=sprites&f=overlap+without+physics.js&t=overlap%20without%20physics
  https://gamemechanicexplorer.com/#homingmissiles-5
  http://examples.phaser.io/_site/view_lite.html?d=p2%20physics&f=postbroadphase+callback.js&t=postbroadphase%20callback
  http://test.xapient.net/phaser/overlap2.html
  http://www.html5gamedevs.com/topic/18019-better-way-to-check-all-children-in-a-group-against-conditional/
  http://www.html5gamedevs.com/topic/7572-call-a-function-on-a-groups-exist-members/

  I hope you have just as much fun working on this game as I did.
