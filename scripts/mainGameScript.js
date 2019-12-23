'use strict'
import {snakeProperties, setNewSnakeProperties, fieldProperties, setNewFieldProperties} from './snakeFieldProperties.js';
import {createClearField} from './interfaceCreator.js';
import {startPointsGeneration} from './pointsGenerator.js';
import {createStartingSnake, changeMovingDirection, getNextHeadCell, eatNextCell, moveSnake} from './snakeScripts.js';


document.addEventListener('settingsClosed', setNewFieldProperties);
document.addEventListener('settingsClosed', setNewSnakeProperties);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('settingsButton').addEventListener('click', pauseGame);

let gameIntervalId;

function startGame() {
    document.removeEventListener('settingsClosed', setNewFieldProperties);
    document.removeEventListener('settingsClosed', setNewSnakeProperties);

    startButton.classList.add('inactive-start-button');
    startButton.removeEventListener('click', startGame);

    createClearField();

    setNewSnakeProperties();
    setNewFieldProperties();
    document.addEventListener('keydown', changeMovingDirection);

    createStartingSnake();
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.speed);
    startPointsGeneration();
}

function pauseGame() {
    if (!gameIntervalId) return;
    clearInterval(gameIntervalId);
    gameIntervalId = null;
    document.addEventListener('settingsClosed', resumeGame);
}

function resumeGame() {
    gameIntervalId = setInterval(oneStepAlgorithm, snakeProperties.speed);
    document.removeEventListener('settingsClosed', resumeGame);
}


function oneStepAlgorithm(intervalId) {
    snakeProperties.movingDirection = snakeProperties.nextMovingDirection;
    if (isLosing()) {
        endGame();
        return;
    }
    if (isWinning()) {
        showWinMessage();
        endGame();
        return;
    }

    eatNextCell();
    moveSnake();
}


function isLosing() {
    let snake = snakeProperties.snakePartsList;
    let nextHeadCell = getNextHeadCell();

    for (let snakePart of snake) {
        if (snakePart.closest('td') == nextHeadCell && snakePart != snake[0]) {
            return true;
        }
    }
}

function isWinning() {
    let field = document.getElementById('field');
    if (snakeProperties.snakePartsList.length == field.rows.length * field.rows[0].cells.length) {
        return true;
    }
}

function endGame() {
    document.removeEventListener('keydown', changeMovingDirection);
    clearInterval(gameIntervalId);
    gameIntervalId = null;

    snakeProperties.snakePartsList = [];
    snakeProperties.movingDirection = 'right';
    snakeProperties.nextMovingDirection = 'right';

    document.addEventListener('settingsClosed', setNewFieldProperties);
    document.addEventListener('settingsClosed', setNewSnakeProperties);

    startButton.classList.remove('inactive-start-button');
    document.getElementById('startButton').addEventListener('click', startGame);
}

function showWinMessage() {
    alert('You win!')
}