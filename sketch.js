var player,player_image;
var ground,bg_image,invisible_ground;
var score=0;
var ObstacleGroup, CoinGroup;
var gameState= "PLAY";
var coin_image;
var restart,gameOver;
var restart_image,gameOver_image;
var scoreSound,dieSound;
var brick_image,BrickGroup;

function preload(){
   player_image=loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png","images/mar4.png");
  bg_image=loadImage("images/bg.jpg");
  
  obstacleimg=loadImage("images/obstacle1.png");
  brick_image=loadImage("images/brick.png");
  
  coin_image=loadImage("images/coin.png");
  restart_image=loadImage("images/restart.png");
  gameOver_image=loadImage("images/game-over.png");
  scoreSound=loadSound("sounds/scoreSound.wav");
  dieSound=loadSound("sounds/dieSound.mp3");

}

function setup() {

  createCanvas(800, 500);
  ground=createSprite(400,250,800,30);
  ground.x=ground.width/2;
  ground.addImage(bg_image);
  
  player=createSprite(200,20,20,60);
  player.addAnimation("a",player_image);
  player.scale=0.2;
  player.setCollider("rectangle",0,0,250,400);
  
  invisible_ground=createSprite(400,470,800,10);
  invisible_ground.visible=false;
  
  restart=createSprite(400,220,20,20);
  restart.addImage(restart_image);
  restart.scale=0.5;
  gameOver=createSprite(400,150,20,20);
  gameOver.addImage(gameOver_image);
  gameOver.scale=0.7;
  
  ObstacleGroup=new Group();
  CoinGroup=new Group();
  BrickGroup=new Group();
}


function draw() {

  background("black");
  if(gameState==="PLAY"){
    
    restart.visible=false;
    gameOver.visible=false;
   // bgSound.play();
  
     ground.velocityX = -(4+score/20);
    // infinite scrolling of ground
    if (ground.x < 0){
       ground.x = ground.width/2;
    }

    // jump & gravity for player
    if(keyDown("space") && player.y>=220) {
        player.velocityY = -10;  
     }  
    player.velocityY = player.velocityY + 1;
    
    //prevent player moving out with the bricks
  if(player.x<200){
    player.x=200;
  }
    
      spawnObstacles();
      spawnCoins();
      spawnBricks();
    if(player.isTouching(BrickGroup)){
      player.collide(BrickGroup);
    }

      if (player.isTouching(ObstacleGroup)){
        dieSound.play();
         gameState="END";
      }
    
    if(player.isTouching(CoinGroup)){
      score++;  
      scoreSound.play();
      player.velocityY=3;
      CoinGroup.destroyEach();
    }
    
  }else if( gameState==="END"){
          ObstacleGroup.setVelocityXEach(0);
          ObstacleGroup.setLifetimeEach(-1);
          CoinGroup.setVelocityXEach(0);
          CoinGroup.setLifetimeEach(-1);
          BrickGroup.setVelocityXEach(0);
          BrickGroup.setLifetimeEach(-1);
          ground.velocityX=0;
          player.velocityY=0;
          player.velocityX=0;
          restart.visible=true;
          gameOver.visible=true;
          if(mousePressedOver(restart)){
            reset();
          }
  }
 
  player.collide(invisible_ground);
  
  drawSprites();
  
  fill("white");
  text("SCORE: "+score,700,100);
}

function spawnObstacles() {
  if (frameCount % 100 === 0){
    var obstacle = createSprite(800,450,10,40);
    obstacle.scale=0.3;
    obstacle.addImage(obstacleimg);
    obstacle.velocityX = -(4+score/20);
    obstacle.lifetime=200;
    obstacle.setCollider("rectangle",0,0,100,60);
    ObstacleGroup.add(obstacle);
    } 
  }

function spawnBricks() {
  if (frameCount % 100 === 0){
    var brick = createSprite(800,random(150,350),10,40);
    brick.addImage(brick_image);
    brick.scale=0.5;
    brick.velocityX = -4;
    brick.lifetime=300;
    BrickGroup.add(brick);
    } 
  }

function spawnCoins() {
  if (frameCount % 200 === 0){
    var coin = createSprite(800,random(20,350),10,40);
    coin.addImage(coin_image);
    coin.scale=0.3;
    coin.velocityX = -4;
    coin.lifetime=200;
    CoinGroup.add(coin);
    } 
  }

function reset(){
    restart.visible=false;
    gameOver.visible=false;
    gameState ="PLAY";
    ObstacleGroup.destroyEach();
    CoinGroup.destroyEach();
    BrickGroup.destroyEach();
    score=0;
}
