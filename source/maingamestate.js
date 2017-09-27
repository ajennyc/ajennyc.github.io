var mainGameState = {};

mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('playership', 'assets/images/player-ship.png');
};

mainGameState.create = function () {
    var x = game.width*0.5;
    var y = game.height*0.9;
    
    game.add.sprite(0, 0, 'space-bg');
    
    this.playerShip = game.add.sprite(x, y, 'playership');
    
    this.playerShip.anchor.setTo(0.5,0.5);
    this.playerShip.scale.setTo(1,1);
    this.playerShip.angle.setTo(30);
};

mainGameState.update = function () {};