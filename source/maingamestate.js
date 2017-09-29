var mainGameState = {};

mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    
    game.load.image('sky', 'assets/images/sky.jpg');
    game.load.image('playership', 'assets/images/player-ship.png');
    game.load.audio('background-music', 'assets/music/fire.mp3'); 
    game.load.image('asteroid', 'assets/images/asteroid-medium-01.png');
    game.load.image('player-bullet', 'assets/images/bullet-fire.png');
    game.load.audio('bullet-1', 'assets/audio/player_fire_01.mp3');
    game.load.audio('bullet-2', 'assets/audio/player_fire_02.mp3');
    game.load.audio('bullet-3', 'assets/audio/player_fire_03.mp3');
    game.load.audio('sound-asteroid-1', 'assets/audio/asteroid_hit_01.mp3');
    game.load.audio('sound-asteroid-2', 'assets/audio/asteroid_hit_02.mp3');
    game.load.audio('sound-asteroid-3', 'assets/audio/asteroid_hit_03.mp3');
    game.load.audio('sound-death', 'assets/audio/final_boss_death_01.mp3');
    game.load.image('particles','assets/images/asteroid-small-02.png');
    game.load.image('dragonTexture', 'assets/images/dragon.png');
    game.load.json('dragonMesh', 'assets/images/dragon.json');
    
};

//---------------------------------------------------------------------

mainGameState.create = function () {
    var x = game.width*0.1;
    var y = game.height*0.5;
    
//Background: 
    game.add.sprite(0, 0, 'sky');
    
//Dragon!!! :
    this.dragon = game.add.sprite(x, y, '');  
    
    var child = game.add.creature(0,0,'dragonTexture','dragonMesh');
    child.scale.setTo(10.0);
    child.play(true);
    
    this.dragon.addChild(child);
    
//Spaceship:
//    this.playerShip = game.add.sprite(x, y, 'playership');   
//    
//    this.playerShip.anchor.setTo(0.5,0.5);
//    this.playerShip.scale.setTo(0.8,0.8);
//    this.playerShip.angle = -90;
    
//Movement:
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.dragon);
    this.cursors = game.input.keyboard.createCursorKeys();
    
////Music: 
    this.music = game.add.audio('background-music');
    this.music.play();
    
//Sound effects BULLETS:
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio('bullet-1'));
    this.playerFireSfx.push(game.add.audio('bullet-2'));
    this.playerFireSfx.push(game.add.audio('bullet-3'));
    
//Sound effect ASTEROIDS:
    this.playerAsteroidSfx = [];
    this.playerAsteroidSfx.push(game.add.audio('sound-asteroid-1'));
    this.playerAsteroidSfx.push(game.add.audio('sound-asteroid-2'));
    this.playerAsteroidSfx.push(game.add.audio('sound-asteroid-3'));
    
//Sound effect DEATH: 
    this.death = game.add.audio('sound-death');
    
//Astroids: 
    this.asteroidTimer = 2.0;
    this.asteroids = game.add.group();
    
////Destroyed astroid:
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.emitter = game.add.emitter(0,0,100);
    this.emitter.makeParticles('particles');
    this.emitter.gravity = 200;
    
//Shooting:
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.fireTimer = 0.4;
    this.playerBullets = game.add.group();
    
//Score:
    this.playerScore = 0; 
    var style = {font: "16px Cinzel Decorative", fontWeight: "bold", align: "center"};
    
    this.scoreTitle = game.add.text(game.width *0.90,game.height *0.10,"Score: ", style);
    this.scoreTitle.fixedToCamera = true; 
    this.scoreTitle.anchor.setTo(0.5,0.5);
    var grdTitle = this.scoreTitle.context.createLinearGradient(0,0,0,this.scoreTitle.height);
    grdTitle.addColorStop(0, '#d92b04');   
    grdTitle.addColorStop(1, '#e67958');
    this.scoreTitle.fill = grdTitle;
    
    this.scoreValue = game.add.text(game.width *0.90, game.height *0.15, "0", style);
    this.scoreValue.fixedToCamera = true; 
    this.scoreValue.anchor.setTo(0.5,0.5);
    var grdValue = this.scoreValue.context.createLinearGradient(0,0,0,this.scoreValue.height);
    grdValue.addColorStop(0, '#d92b04');   
    grdValue.addColorStop(1, '#e67958');
    this.scoreValue.fill = grdValue;

//Life and Death: 
    this.playerLife = 3; 
    var style = {font: "16px Cinzel Decorative", fontWeight: "bold", align: "center"};
    
    this.lifeTitle = game.add.text(game.width *0.80,game.height *0.10,"Life: ", style);
    this.lifeTitle.fixedToCamera = true; 
    this.lifeTitle.anchor.setTo(0.5,0.5);
    var grdTitle1 = this.scoreTitle.context.createLinearGradient(0,0,0,this.lifeTitle.height);
    grdTitle1.addColorStop(0, '#d92b04');   
    grdTitle1.addColorStop(1, '#e67958');
    this.lifeTitle.fill = grdTitle1;
    
    this.lifeValue = game.add.text(game.width *0.80, game.height *0.15, "3", style);
    this.lifeValue.fixedToCamera = true; 
    this.lifeValue.anchor.setTo(0.5,0.5);
    var grdValue1 = this.scoreValue.context.createLinearGradient(0,0,0,this.lifeValue.height);
    grdValue1.addColorStop(0, '#d92b04');   
    grdValue1.addColorStop(1, '#e67958');
    this.lifeValue.fill = grdValue1;
    
//Level: 
    this.playerLevel = 0; 
    var style = {font: "16px Cinzel Decorative", fontWeight: "bold", align: "center"};
    
    this.levelTitle = game.add.text(game.width *0.70,game.height *0.10,"Level: ", style);
    this.levelTitle.fixedToCamera = true; 
    this.levelTitle.anchor.setTo(0.5,0.5);
    var grdTitle2 = this.levelTitle.context.createLinearGradient(0,0,0,this.levelTitle.height);
    grdTitle2.addColorStop(0, '#d92b04');   
    grdTitle2.addColorStop(1, '#e67958');
    this.levelTitle.fill = grdTitle2;
    
    this.levelValue = game.add.text(game.width *0.70, game.height *0.15, "0", style);
    this.levelValue.fixedToCamera = true; 
    this.levelValue.anchor.setTo(0.5,0.5);
    var grdValue2 = this.levelValue.context.createLinearGradient(0,0,0,this.levelValue.height);
    grdValue2.addColorStop(0, '#d92b04');   
    grdValue2.addColorStop(1, '#e67958');
    this.levelValue.fill = grdValue2;    
    
};

//-----------------------------------------------------------------------

mainGameState.update = function () {
        
//Movement in y - directions:
    if (this.cursors.up.isDown) {
        console.log("UP PRESSED");
        this.dragon.body.velocity.y = -500;
    }else if (this.cursors.down.isDown) {
        console.log("DOWN PRESSED");
        this.dragon.body.velocity.y = 500;
    }else {
        this.dragon.body.velocity.y = 0;
    }
    
//Movement in x-directions:
    if (this.cursors.right.isDown) {
        console.log("RIGHT PRESSED");
        this.dragon.body.velocity.x = 500;
    }else if (this.cursors.left.isDown) {
        console.log("LEFT PRESSED");
        this.dragon.body.velocity.x = -500;
    } else {
        this.dragon.body.velocity.x = 0;
    }
    
//Stop it at the boarders: 
      if ((this.dragon.x  > game.width) && (this.dragon.body.velocity.x > 0)){
         this.dragon.body.velocity.x = 0;   
    }
    if (this.dragon.x < 0 && this.dragon.body.velocity.x < 0){
         this.dragon.body.velocity.x = 0;   
    }    
    if (this.dragon.y > game.height && this.dragon.body.velocity.y > 0){
         this.dragon.body.velocity.y = 0;   
    }
    if ((this.dragon.y < 0) && (this.dragon.body.velocity.y < 0)){
         this.dragon.body.velocity.y = 0;   
    }
    
//Asteroids: 
    this.asteroidTimer -= game.time.physicsElapsed;

    if (this.asteroidTimer <= 0.0){
        console.log("SPAWN ASTEROID");
        this.spawnAsteroid();
        if(this.playerScore >= 50 && this.playerScore <= 100){
            this.asteroidTimer = 1.0;            
            this.levelValue.setText(1);
        }else if(this.playerScore >= 100 && this.playerScore <150){
            this.asteroidTimer = 0.5;
            this.levelValue.setText(2);
        }else if(this.playerScore >= 150){
            this.asteroidTimer = 0.4;
            this.levelValue.setText(3);
        }else{
            this.asteroidTimer = 2.0;
        }; 
    }
    for(var i = 0; i < this.asteroids.children.length; i++){
        if(this.asteroids.children[i].x < - 100){
            this.asteroids.children[i].destroy();       
        }
    }

//Shooting: 
    this.updatePlayerBullets();
    
//Asteroids and bullets colliding: 
    game.physics.arcade.collide(this.asteroids, this.playerBullets, this.asteroidBulletCollision, null, this);


//Astroids and player colliding: 
    game.physics.arcade.collide(this.dragon, this.asteroids, this.astroidPlayerCollision, null, this);
    
//Score:
    this.scoreValue.setText(this.playerScore);
    
//Life:
    this.lifeValue.setText(this.playerLife);

//Death: 
    if(this.playerLife < 0){
        game.state.start("GameOver");
    }
    
};

mainGameState.render = function() {
    game.debug.body(this.dragon);
}

//---------------------------------------------------------------------

mainGameState.spawnAsteroid = function (){

    var y = game.rnd.integerInRange(0, game.height);

    var asteroid = game.add.sprite(game.width*1.1, y, 'asteroid');    
    asteroid.anchor.setTo(0.5,0.5);

    game.physics.arcade.enable(asteroid);
    asteroid.body.velocity.x = -game.rnd.integerInRange(100,300);
    asteroid.body.angularVelocity = -game.rnd.integerInRange(50,100);
    
    this.asteroids.add(asteroid);

    //check in console: mainGameState.asteroids.children : give # of asteroids.
};

//----------------------------------------------------------------------

mainGameState.spawnPlayerBullet = function() {
    if (this.fireTimer < 0){
        this.fireTimer = 0.4;
        
        var bullet = game.add.sprite(this.dragon.x, this.dragon.y, 'player-bullet');    
        bullet.anchor.setTo(1,0.5);
        bullet.angle = 90;
        
        game.physics.arcade.enable(bullet);
        bullet.body.velocity.setTo(400,0);

        this.playerBullets.add(bullet);
        
    }
    var index = game.rnd.integerInRange(0, this.playerFireSfx.length-1);
    this.playerFireSfx[index].play();
    
};

//------------------------------------------------------------------------

mainGameState.updatePlayerBullets = function() {
    
//Shooting at the asteroids:     
    
    if(this.fireKey.isDown){
        console.log("FIREBALLS! :D ");
        this.spawnPlayerBullet();
    }
    
    this.fireTimer -= game.time.physicsElapsed;
    
    for(var i = 0; i < this.playerBullets.children.length; i++){
        if(this.playerBullets.children[i].x > (game.width + 100)){
            this.playerBullets.children[i].destroy();
        }
    }

};

//------------------------------------------------------------------------

mainGameState.asteroidBulletCollision = function(object1, object2) {
    object1.pendingDestroy = true;
    object2.pendingDestroy = true;
    this.particleBurst(object2);
    
    var index = game.rnd.integerInRange(0, this.playerAsteroidSfx.length-1);
    this.playerAsteroidSfx[index].play();
    
    this.playerScore += 10;

};

//------------------------------------------------------------------------

mainGameState.astroidPlayerCollision = function(object1, object2){
    
    if(object1.key.includes("asteroid")){
        object1.pendingDestroy = true;
        this.particleBurst(object1);
    }else{
        object2.pendingDestroy = true;
        this.particleBurst(object2);
    }
    
    this.playerLife -= 1; 
    this.death.play();
    
};

//------------------------------------------------------------------------

mainGameState.particleBurst = function(object) {
    
    this.emitter.x = object.x;
    this.emitter.y = object.y;    
    this.emitter.start(true, 3000, null, 5);
};








