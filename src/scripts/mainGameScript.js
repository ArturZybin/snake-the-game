'use strict'
import '../scss/style.scss';

import {
    snakeProperties,
    setNewSnakeProperties,
    fieldProperties,
    setNewFieldProperties
} from './snakeFieldProperties.js';

import {
    createNewField,
    createBarriers,
    changeScore,
    setScore,
    updateLeaderboard
} from './interfaceManager.js';

import {
    startPointsGeneration,
    endPointsGeneration
} from './foodManager.js';

import {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart,
    startSnakeDragging,
    drawSnakeBorder
} from './snakeScripts.js';

export {
    startGame
}

document.addEventListener('settingsClosed', setNewFieldProperties);
document.addEventListener('settingsClosed', setNewSnakeProperties);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('settingsButton').addEventListener('click', pauseGame);

document.getElementById('cage').addEventListener('mousedown', startSnakeDragging);
document.getElementById('cage').addEventListener('touchstart', startSnakeDragging);

let gameIntervalId;



function startGame() {
    document.getElementById('cagedSnake').hidden = 'true';

    startButton.hidden = 'true';
    scoreWindow.removeAttribute('hidden');

    setNewSnakeProperties();
    setNewFieldProperties();

    setScore(40);

    createNewField();
    if (fieldProperties.barriers) {
        createBarriers();
    }

    document.addEventListener('keydown', changeMovingDirection);
    enableScreenArrows();

    createStartingSnake();
    drawSnakeBorder();
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.currentSpeed);
    startPointsGeneration();
}


function pauseGame() {
    if (!gameIntervalId) return;
    clearInterval(gameIntervalId);
    gameIntervalId = null;
    document.addEventListener('settingsClosed', resumeGame);
}

function resumeGame() {
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.currentSpeed);
    document.removeEventListener('settingsClosed', resumeGame);
}


function oneStepAlgorithm(intervalId) {
    snakeProperties.movingDirection = snakeProperties.nextMovingDirection;

    if (isWinning()) {
        showMessage('win');
        endGame();
        return;
    }
    if (isLosing()) {
        showMessage('lose');
        endGame();
        return;
    }

    if (snakeProperties.newPartsQueueLength > 0) {
        addBodyPart(null, null, true);
        changeScore(10);
        snakeProperties.newPartsQueueLength--;
    }

    eatNextCell();
    moveSnake();
    drawSnakeBorder();
}


function enableScreenArrows() {
    const arrowsList = Array.from(document.getElementsByClassName('arrow'));
    arrowsList.forEach(arrow => {
        const arrowClick = new CustomEvent('arrowClick', {
            detail: {code: arrow.id}
        })
        
        arrow.onclick = () => changeMovingDirection(arrowClick);
        arrow.ontouchstart = (event) => {
            event.preventDefault();
            changeMovingDirection(arrowClick);
        };
    })
}


function disableScreenArrows() {
    const arrowsList = Array.from(document.getElementsByClassName('arrow'));
    arrowsList.forEach(arrow => {
        arrow.onclick = null;
        arrow.ontouchstart = null;
    })
}


function isWinning() {
    const field = document.getElementById('field');
    if (snakeProperties.snakePartsList.length == field.rows.length * field.rows[0].cells.length) {
        return true;
    }
}

function isLosing() {
    const snake = snakeProperties.snakePartsList;
    const nextHeadCell = getNextHeadCell();

    for (let snakePart of snake) {
        if (snakePart.closest('td') == nextHeadCell && snakePart != snake[0]) {
            return true;
        }
    }
    
    if (snake.length == 1) return true;

    if (!nextHeadCell) return true;
    
    const barriers = document.getElementsByClassName('barrier');
    for (let barrier of barriers) {
        if (barrier.closest('td') == nextHeadCell) return true;
    }
}


function endGame() {
    updateLeaderboard();

    document.getElementById('cagedSnake').removeAttribute('hidden');

    document.removeEventListener('keydown', changeMovingDirection);
    disableScreenArrows();

    clearInterval(gameIntervalId);
    gameIntervalId = null;

    endPointsGeneration();

    snakeProperties.snakePartsList = [];
    snakeProperties.movingDirection = 'right';
    snakeProperties.nextMovingDirection = 'right';

    scoreWindow.hidden = 'true';
    startButton.removeAttribute('hidden')
}


// CSS-class for the message must start with the text value
function showMessage(text) {
    const mainContainerLocker = document.getElementById('mainContainerLocker');
    const mainContainer = document.getElementById('mainContainer');
    mainContainerLocker.removeAttribute('hidden');
    mainContainer.classList.add('blured');

    text = text.toLowerCase();

    let message = document.getElementById('message');
    message.textContent = text;
    message.removeAttribute('hidden');
    message.classList.add('animate-message');
    message.classList.add(`${text}-message`);

    setTimeout(() => {
        message.hidden = 'true';
        message.classList.remove('animate-message');
        message.classList.remove(`${text}-message`);

        mainContainer.classList.remove('blured');
        mainContainerLocker.hidden = 'true';
    }, 1000)
}