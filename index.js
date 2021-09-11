const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

class SnakePart {
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

let speed = 7

let tileCount = 20
let tileSize = canvas.width/tileCount -2
let headX = 10
let headY = 10
const snakeParts = []
let tailLength = 2

let appleX = 5
let appleY = 5

let xVelocity = 0
let yVelocity = 0 

let score = 0

const bgSound = new Audio("bg.mp3")
const gulpSound = new Audio("gulp.mp3")


//game loop
function drawGame() {
    changeSnakePosition()
    let result = isGameOver()
    if(result) {
        return;
    }
    clearScreen()
    checkAppleCollision()
    drawApple()
    drawSnake()
    drawScore()
    setTimeout(drawGame, 1000/speed)
}

function isGameOver(){
    let gameOver = false

    if(yVelocity === 0 && xVelocity === 0) {
        return false
    }

    //walls
    if(headX < 0){
        gameOver = true
    } else if (headX === tileCount) {
        gameOver = true
    } else if (headY < 0) {
        gameOver = true
    } else if (headY === tileCount){
        gameOver = true
    }

    //go into itself
    for (let i=0; i<snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true
            break
        }
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // Fill with gradient
        ctx.fillStyle = gradient;

        ctx.fillText("Game Over!", canvas.width / 8, canvas.height / 2);
    }
    return gameOver
}

function drawScore(){
    ctx.fillStyle = "black"
    ctx.font = "12px Verdana"
    ctx.fillText("Score: " + score, canvas.width-60, 20)
}

function clearScreen(){
    ctx.fillStyle = "#ccc"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

}

function drawSnake() {
    
    ctx.fillStyle = "green"
    for (let i=0; i<snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part.x*tileCount, part.y*tileCount, tileSize, tileSize)
    }
    snakeParts.push(new SnakePart(headX, headY)) //add new tail where the head previously was
    if(snakeParts.length > tailLength) {
        snakeParts.shift() //remove the furthest item from the snake parts if we have more than our tail size
    }

    ctx.fillStyle = "darkgreen"
    ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize)

}

function changeSnakePosition() {
    headX = headX + xVelocity
    headY = headY + yVelocity
    bgSound.play()
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize)
}

function checkAppleCollision(){
    if (appleX === headX && appleY === headY){
        //draw apple in new position
        appleX = Math.floor(Math.random()* tileCount)
        appleY = Math.floor(Math.random()* tileCount)
        //increase tail length
        tailLength++
        gulpSound.play()
        score++
        speed += 2
    }
    
}

document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    switch (event.key) {
      case "Down": 
      case "ArrowDown":
        if (yVelocity == -1)
            return;
        yVelocity = 1
        xVelocity= 0
        break;
      case "Up": 
      case "ArrowUp":
        if (yVelocity == 1)
            return;
        yVelocity = -1
        xVelocity= 0
        break;
      case "Left": 
      case "ArrowLeft":
        if (xVelocity == 1)
            return;
        yVelocity = 0
        xVelocity= -1
        break;
      case "Right":
      case "ArrowRight":
        if (xVelocity == -1)
            return;
        yVelocity = 0
        xVelocity= 1
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    event.preventDefault();
  }, true);

drawGame()

