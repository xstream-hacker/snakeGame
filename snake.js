const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const palyerNameElement = document.querySelector(".name");
const startMsg = document.querySelector("#msg");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let eatSong = new Audio ("eat.mp3");
let endSong = new Audio ("end.mp3");
let gameSong = new Audio ("gamesong.mp3");
// validating player name
var name = localStorage.getItem("player-name");
console.log(name.length);

validation();   
function validation(){
    if (name === "null" || name === '' || name === " " ) {
        name = prompt("Please Enter Your Name:");
        name.trim();
        localStorage.setItem("player-name",name);
        palyerNameElement.innerText = `Name: ${name}`;

        validation();

    }else {
    palyerNameElement.innerText = `Name: ${name}`;
        
    }
}

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    gameSong.pause();
    endSong.play();
    document.removeEventListener("keyup",changeDirection);
    setTimeout(gameEnd,225);
    function gameEnd() {
        alert("Game Over Press Ok to restart");
        location.reload();
    }
    
}

const changeDirection = e => {
    
    
    // Changing velocity value based on key press
    
    console.log(e);
        if(e.key === "ArrowUp" && velocityY != 1) {
            startMsg.style.display="none";
            velocityX = 0;
            velocityY = -1;
            gameSong.play();
        } else if(e.key === "ArrowDown" && velocityY != -1) {
            startMsg.style.display="none";
            velocityX = 0;
            velocityY = 1;
            gameSong.play();
        } else if(e.key === "ArrowLeft" && velocityX != 1) {
            startMsg.style.display="none";
            velocityX = -1;
            velocityY = 0;
            gameSong.play();
        } else if(e.key === "ArrowRight" && velocityX != -1) {
            startMsg.style.display="none";
            velocityX = 1;
            velocityY = 0;
            gameSong.play();
        }
}



// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {


    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        eatSong.play(); //play song
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;

    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
