//Get a reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");
var startButton = document.querySelector("#startButton");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);
startButton.addEventListener("click", startGame, false);

//The game map
//useing EC6 here to declare my object literal
let map = {
    
myMap: [
  [0, 2, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 2, 0, 0, 0],
  [0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0],
  [0, 1, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0]  
]
};

//I create two multidimensional arrays to draw the map and keep track of each cell's properties and these arrays are in parrallel allowing the two to work together in some parts of the game

//The game objects map
//useing EC6 here to declare my object literal
let gameObjects = {
    
myGameObjects: [
  [5, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]  
]
};

//Map code
//useing EC6 here to declare my object literal
let mapCode = {
    WATER : 0,
    ISLAND : 1,
    PIRATE : 2,
    HOME : 3,
    SHIP : 4,
    MONSTER : 5
}


//The size of each cell
//useing EC6 here to set size to a constant of 64 since the size does not change
const SIZE = 64;

//The number of rows and columns
var ROWS = map.myMap.length;
var COLUMNS = map.myMap[0].length;

//Arrow key codes
//useing EC6 here to declare my object literal
let keyCodes = {
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37
}


//Find the ship's start position
var shipRow;
var shipColumn;

var monsterRow;
var monsterColumn;

for(var row = 0; row < ROWS; row++)
{
  for(var column = 0; column < COLUMNS; column++)
  {
    if(gameObjects.myGameObjects[row][column] === mapCode.SHIP)
    {
      shipRow = row;
      shipColumn = column;
    }
    if(gameObjects.myGameObjects[row][column] === mapCode.MONSTER)
    {
      monsterRow = row;
      monsterColumn = column;
    }
  }
}

//this code above figures out where my player and monster is on the 'map' and assigns their location to variables which I use later on in the code to see if my player fights goblins or mines ore etc.

//The game variables
var food = 15;
var gold = 10;
var experience = 0;
var gameMessage = `Use the arrow keys to find your way to the chest.`;

$(function(){
    $('#pick').fadeIn(5000).animate({"left":"800px"},4000);
});

//render();

//this is my start game function that initially renders the game after the player presses the start button!

function startGame(){
    render();
}

//this function is called whenever a key is pressed and that keycode is passed into the function as an argument
//depending on what the keypress was my switch will pick up on what key was pressed and move the ship accordingly

function keydownHandler(event)
{
  switch(event.keyCode)
  {
    case keyCodes.UP:

     //Find out if the ship's move will be within the playing field
      if(shipRow > 0)
      {
       //If it is, clear the ship's current cell
       gameObjects.myGameObjects[shipRow][shipColumn] = 0;

       //Subtract 1 from the ship's row to move it up one row on the map
       shipRow--;

       //Apply the ship's new updated position to the array
       gameObjects.myGameObjects[shipRow][shipColumn] = mapCode.SHIP;
      }
      break;

    case keyCodes.DOWN:
      if(shipRow < ROWS - 1)
      {
        gameObjects.myGameObjects[shipRow][shipColumn] = 0;
        shipRow++;
        gameObjects.myGameObjects[shipRow][shipColumn] = mapCode.SHIP;
      }
      break;

    case keyCodes.LEFT:
      if(shipColumn > 0)
      {
        gameObjects.myGameObjects[shipRow][shipColumn] = 0;
        shipColumn--;
        gameObjects.myGameObjects[shipRow][shipColumn] = mapCode.SHIP;
      }
      break;

    case keyCodes.RIGHT:
      if(shipColumn < COLUMNS - 1)
      {
        gameObjects.myGameObjects[shipRow][shipColumn] = 0;

        shipColumn++;
        gameObjects.myGameObjects[shipRow][shipColumn] = mapCode.SHIP;
      }
      break;
  }

  //Find out what kind of cell the ship is on
  switch(map.myMap[shipRow][shipColumn])
  {
    case mapCode.WATER:
      gameMessage = "You walk abouts the cave..."
      break;

    case mapCode.PIRATE:
      fight();
      break;

    case mapCode.ISLAND:
      trade();
      break;

    case mapCode.HOME:
      endGame();
      break;
  }
    
  moveMonster();
    
  if(gameObjects.myGameObjects[shipRow][shipColumn] === mapCode.MONSTER)
    {
      endGame();
    }

  //Subtract some food each turn
  food--;
    
    if(food <= 0){
        endGame();
        gameMessage = "You starved to death!"
    }

  

  //Render the game
  render();
}

//this function occurs whenever my player steps on an ore icon and will mine for gold!

function trade()
{
    var audio = new Audio('audio/MiningNoise.wav');
        audio.play();
   
    gold += 10;
    gameMessage = "You mine for gold!"
}

//this function occurs when my player steps on a goblin icon and they will kill the gobin and receive some food!

function fight()
{
   gameMessage = "You kill the goblin and take the food he has on him!"
    experience += 5;
    food += 3;
}

//this function is called when my player reaches the chest and tells them their final score based on how much gold, experience, and food they have on them!

function endGame()
{
  if(map.myMap[shipRow][shipColumn] === mapCode.HOME)
  {
     //Calculate the score
     var score = food + gold + experience;

     //Display the game message
     gameMessage
       = "You made it to the chest alive! " + "Final Score: " + score;
  }
  else if(gameObjects.myGameObjects[shipRow] [shipColumn] === mapCode.MONSTER){
      gameMessage += "You have been eaten by the Orc!";
  }  
  

   //Remove the keyboard listener to end the game
   window.removeEventListener("keydown", keydownHandler, false);
}

//this draws in my game area for me

function render()
{
   //Clear the stage of img cells from the previous turn

   if(stage.hasChildNodes())
   {
     for(var i = 0; i < ROWS * COLUMNS; i++)
     {
       stage.removeChild(stage.firstChild);
     }
   }

   //Render the game by looping through the map arrays
   for(var row = 0; row < ROWS; row++)
   {
     for(var column = 0; column < COLUMNS; column++)
     {
       //Create an img tag called cell
       var cell = document.createElement("img");

       //Set its CSS class to "cell"
       cell.setAttribute("class", "cell");

       //Add the img tag to the <div id="stage"> tag
       stage.appendChild(cell);

       //Find the correct image for this map cell
       switch(map.myMap[row][column])
       {
         case mapCode.WATER:
           cell.src = "images/Ground.png";
           break;

         case mapCode.ISLAND:
           cell.src = "images/Ore.png";
           break;

         case mapCode.PIRATE:
           cell.src = "images/Goblin.png";
           break;

         case mapCode.HOME:
           cell.src = "images/Chest.png";
           break;
       }

       //Add the ship from the gameObjects array
       switch(gameObjects.myGameObjects[row][column])
       {
         case mapCode.SHIP:
         cell.src = "images/Miner.png";
         break;
               
         case mapCode.MONSTER:
         cell.src = "images/Orc.png";
         break;      
       }
         
         stage.style.backgroundImage = "url('images/Ground.png')";

       //Position the cell
       cell.style.top = row * SIZE + "px";
       cell.style.left = column * SIZE + "px";
     }
   }

   //Display the game message
   output.innerHTML = gameMessage;

   //Display the player's food, gold, and experience
   output.innerHTML
     += "<br>Gold: " + gold + ", Food: "
     + food + ", Experience: " + experience;
}

//this is the code that determines where my monter will move based on what is around him and is called after the player has moved

function moveMonster()
{
  //The 4 possible directions that the monster can move
  let UP = 1;
  let DOWN = 2;
  let LEFT = 3;
  let RIGHT = 4;

    //An array to store the valid direction that the monster is allowed to move in
    var validDirections = [];

    //The final direction that the monster will move in
    var direction = undefined;

    //Find out what kinds of things are in the cells
    //that surround the monster. If the cells contain WATER,
    //push the corresponding direction (UP, DOWN, LEFT, or RIGHT) into the validDirections array
    if(monsterRow > 0)
    {
     var thingAbove = map.myMap[monsterRow - 1][monsterColumn];

      if(thingAbove === mapCode.WATER)
      {
        validDirections.push(UP)
      }
    }
    if(monsterRow < ROWS - 1)
    {
      var thingBelow = map.myMap[monsterRow + 1][monsterColumn];
      if(thingBelow === mapCode.WATER)
      {
        validDirections.push(DOWN)
      }
    }
    if(monsterColumn > 0)
    {
      var thingToTheLeft = map.myMap[monsterRow][monsterColumn - 1];
      if(thingToTheLeft === mapCode.WATER)
      {
        validDirections.push(LEFT)
      }
    }
    if(monsterColumn < COLUMNS - 1)
    {
      var thingToTheRight = map.myMap[monsterRow][monsterColumn + 1];
      if(thingToTheRight === mapCode.WATER)
      {
        validDirections.push(RIGHT)
      }
    }

      //The validDirections array now contains 0 to 4 directions that
      //contain WATER cells. Which of those directions will the monster
      //choose to move in?

      //If a valid direction was found, randomly choose one of the
      //possible directions and assign it to the direction variable
      if(validDirections.length !== 0)
      {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
      }

      //Move the monster in the chosen random direction
      switch(direction)
      {
        case UP:
          //Clear the monster's current cell
          gameObjects.myGameObjects[monsterRow][monsterColumn] = 0;
          //Subtract 1 from the monster's row
          monsterRow--;

          //Apply the monster's new updated position to the array
          gameObjects.myGameObjects[monsterRow][monsterColumn] = mapCode.MONSTER;
          break;

    case DOWN:
      gameObjects.myGameObjects[monsterRow][monsterColumn] = 0;
      monsterRow++;
      gameObjects.myGameObjects[monsterRow][monsterColumn] = mapCode.MONSTER;
      break;

    case LEFT:
      gameObjects.myGameObjects[monsterRow][monsterColumn] = 0;
      monsterColumn--;
      gameObjects.myGameObjects[monsterRow][monsterColumn] = mapCode.MONSTER;
      break;

    case RIGHT:
      gameObjects.myGameObjects[monsterRow][monsterColumn] = 0;
      monsterColumn++;
      gameObjects.myGameObjects[monsterRow][monsterColumn] = mapCode.MONSTER;
  }
}