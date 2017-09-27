var mainGameState = {};

mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    
    game.load.image('sky', 'assets/images/sky.jpg');
    game.load.image('playership', 'assets/images/player-ship.png');
    game.load.audio('background-music', 'assets/music/maingame.mp3'); 
    game.load.image('asteroid', 'assets/images/asteroid-medium-01.png');
    game.load.image('player-bullet', 'assets/images/bullet_fire.png');

};

//-----------------------------------------------------------------------

mainGameState.create = function () {
    var x = game.width*0.1;
    var y = game.height*0.5;
    
//Background: 
    game.add.sprite(0, 0, 'sky');
    
//Spaceship:
    this.playerShip = game.add.sprite(x, y, 'playership');   
    
    this.playerShip.anchor.setTo(0.5,0.5);
    this.playerShip.scale.setTo(1,1);
    this.playerShip.angle = -90;
    
//Movement:
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.playerShip);
    this.cursors = game.input.keyboard.createCursorKeys();
    
//Shooting:
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.playerBullets = game.add.group();
    
//Music: 
    this.music = game.add.audio('background-music');
    this.music.play();
    
//Astroids: 
    this.asteroidTimer = 2.0;
    this.asteroids = game.add.group();
};

//-----------------------------------------------------------------------

mainGameState.update = function () {
        
//Movement in y - directions:
    if (this.cursors.up.isDown) {
        console.log("UP PRESSED");
        this.playerShip.body.velocity.y = -500;
    }else if (this.cursors.down.isDown) {
        console.log("DOWN PRESSED");
        this.playerShip.body.velocity.y = 500;
    }else {
        this.playerShip.body.velocity.y = 0;
    }
    
//Movement in x-directions:
    if (this.cursors.right.isDown) {
        console.log("RIGHT PRESSED");
        this.playerShip.body.velocity.x = 500;
    }else if (this.cursors.left.isDown) {
        console.log("LEFT PRESSED");
        this.playerShip.body.velocity.x = -500;
    } else {
        this.playerShip.body.velocity.x = 0;
}
    
//Stop it at the boarders: 
    
    if ((this.playerShip.x  > game.width) && (this.playerShip.body.velocity.x > 0)){
         this.playerShip.body.velocity.x = 0;   
    }
    if (this.playerShip.x < 0 && this.playerShip.body.velocity.x < 0){
         this.playerShip.body.velocity.x = 0;   
    }    
    if (this.playerShip.y > game.height && this.playerShip.body.velocity.y > 0){
         this.playerShip.body.velocity.y = 0;   
    }
    if ((this.playerShip.y < 0) && (this.playerShip.body.velocity.y < 0)){
         this.playerShip.body.velocity.y = 0;   
    }    
    
// Asteroids: 
    this.asteroidTimer -= game.time.physicsElapsed;

    if (this.asteroidTimer <= 0.0){
        console.log("SPAWN ASTEROID");
        this.spawnAsteroid();
        this.asteroidTimer = 3.0; 
    }
    for(var i = 0; i < this.asteroids.children.lenght; i++){
        if(this.asteroids.children[i].y > (game.width - 200)){
            this.asteroids.children[i].destroy();       
        }
    }

//Shooting at the asteroids:     
    
    if(this.fireKey.isDown){
         console.log("FIREBALLS! :D ");
        this.spawnPlayerBullet();
    }
    for(var i = 9; i < this.playerBullets.children.lenght; i++){
        if(this.asteriods.children[i].y > (game.width - 200)){
            this.playerBullets.children[i].destroy();
        }
    }
    
    
};

//---------------------------------------------------------------------

mainGameState.spawnAsteroid = function (){

    var y = game.rnd.integerInRange(0, game.height);

    var asteroid = game.add.sprite(game.width*1.2, y, 'asteroid');    
    asteroid.anchor.setTo(0.5,0.5);

    game.physics.arcade.enable(asteroid);
    asteroid.body.velocity.x = -game.rnd.integerInRange(10,200);
    asteroid.body.angularVelocity = -game.rnd.integerInRange(50,100);
    
    this.asteroids.add(asteroid);

    //check in console: mainGameState.asteroids.children : give # of asteroids.
};

//----------------------------------------------------------------------

mainGameState.spawnPlayerBullet = function() {
    
    var bullet = game.add.sprite(this.playerShip.x, this.playerShip.y, "player-bullet");    
    bullet.anchor.setTo(0.5,0.5);
    bullet.angle = -90;
    game.physics.arcade.enable(bullet);
    bullet.body.velocity.setTo(300,0);

    this.playerBullets.add(bullet);
    
};












