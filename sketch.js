var d,sadd,happyd, database,food1,feed,addFood,fedTime,lastFed,foodS,foodStock,gameState;

function preload(){
sadd=loadImage("images/dogImg.png");
happyd=loadImage("images/dogImg1.png");
bedroom=loadImage("images/Bed Room.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(900,600);
  food1 = new food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  d=createSprite(800,200,150,150);
  d.addImage(sadd);
  d.scale=0.15;
  button=createButton("Feed the Dog");
  button.position(700,95);
  button.mousePressed(fed);
  moreFood=createButton("Add Food");
  moreFood.position(800,95);
  moreFood.mousePressed(addFoods);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  }

function draw() {
  background(66, 108, 245);
  console.log(fedTime);
  console.log(gameState);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill("yellow");
  textSize(20);
  
  if(lastFed>=12){
    text("last fed : "+ lastFed%12 + " PM", 330,38);
   }else if(lastFed==0){
     text("last fed : 12 AM",350,30);
   }else{
     text("last fed : "+ lastFed + " AM", 330,38);
   }
   currentTime=hour();
   //food1.display();
   if(gameState!=="hungry"){
     button.hide();
     moreFood.hide();
     d.visible=false;
   }
   else{
    button.show();
    moreFood.show();
    food1.display();
    d.visible=true;
   }
   if(currentTime===lastFed+1){
     food1.garden();
     //gameState="playing";
     food1.updateGameState("playing");
   }
  else if(currentTime===lastFed+2){
    food1.bedroom();
    food1.updateGameState("sleeping");
  }
 else if(currentTime===lastFed+3){
    food1.washroom();
    food1.updateGameState("bathing");
  }
  else{
    food1.updateGameState("hungry")
  }
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  food1.updateStock(foodS);
}

function fed(){
  d.addImage(happyd);

  food1.updateStock(food1.getFoodStock()-1);
  database.ref('/').update({
    Food:food1.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}