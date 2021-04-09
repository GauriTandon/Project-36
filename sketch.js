//Create variables here
var dog, happyDog, database, foodS, foodStock, foodObj;
var dogImg, happyDogImg, lastFed;
var changeGameState, readGameState;
var bedroomImg, gardenImg, washroomImg;


function preload() {
  //load images here
  dogImg = loadImage('images/dogImg.png');
  happyDogImg = loadImage('images/dogImg1.png');
  bedroomImg = loadImage('images/Bed Room.png');
  gardenImg = loadImage('images/Garden.png');
  washroomImg = loadImage('images/Wash Room.png');
}


function setup() {
  var canvas = createCanvas(500,500);
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  dog = createSprite(250,250,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(500,450);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(650,450);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);

  /*if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDogImg);
  }*/

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed = data.val();
  })

  drawSprites();
  //add styles here
  textSize(18);
  fill("white");
  stroke("white");
  text("Note: Press UP_ARROW Key To Feed Drago Milk!", 50, 90);
  text("Food Remaining : " + foodS, 130, 130);

  fill(255,255,254);
  textSize(15);

  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + "PM", 350, 30);
  } else if(lastFed == 0){
      text("Last Feed : 12 AM", 350, 30);
  } else{
    text("Last Feed : " + lastFed + "AM", 350, 30);
  }
}


//Function to write values in DB
function writeStock(x){

  if(x <= 0){
    x = 0
  } else{
    x = x - 1
  }

  database.ref('/').update({
    Food:x
  })
}


//Function to read values from DB
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}


//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}