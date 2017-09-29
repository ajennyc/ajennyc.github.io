var gameOverState = {}; 

gameOverState.preload = function () {
    
};

gameOverState.create = function () {
    var style = {font: "40px Cinzel Decorative", fontWeight: "bold", align: "center"};
    
    this.death = game.add.text(game.width *0.5,game.height *0.5,"GAME OVER!", style);
    this.death.fixedToCamera = true; 
    this.death.anchor.setTo(0.5,0.5);
    var grd = this.death.context.createLinearGradient(0,0,0,this.death.height);
    grd.addColorStop(0, '#d92b04');   
    grd.addColorStop(1, '#e67958');
    this.death.fill = grd;
    
    this.reStart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}; 

gameOverState.update = function () {
    if (this.reStart.isDown) {
        game.state.start("MainGame");
    };
}; 