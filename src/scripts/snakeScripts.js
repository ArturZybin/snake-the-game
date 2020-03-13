'use strict';

import {
    snakeProperties,
    fieldProperties
} from './snakeFieldProperties.js';

import {
    changeScore,
    createNewField,
    createBarriers
} from './interfaceManager.js';

export {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart,
    drawSnakeBorder,
    removeSnake
};


function createStartingSnake() {
    const field = document.getElementById('field');

    snakeProperties.currentColor = snakeProperties.color;
    snakeProperties.currentSpeed = snakeProperties.speed;

    const snakeHead = document.createElement('div');
    snakeHead.id = 'snakeHead';
    snakeHead.classList.add('snake');
    snakeHead.classList.add('snake-head');
    snakeHead.style.background = snakeProperties.color;
    const snakeHeadRow = snakeProperties.startingHeadPosition[0];
    const snakeHeadCell = snakeProperties.startingHeadPosition[1];
    field.rows[snakeHeadRow].cells[snakeHeadCell].append(snakeHead);
    snakeProperties.snakePartsList.push(snakeHead)

    for (let bodyPartCoords of snakeProperties.startingBodyPartsPositions) {
        addBodyPart(bodyPartCoords[0], bodyPartCoords[1]);
    }
}


function addBodyPart(rowIndex, cellIndex, animateBodyPart) {
    // finding coordinates if they haven't been given
    if (!rowIndex && rowIndex !== 0) {
        let newBodyPartCoords = getNewBodyPartCoords();
        rowIndex = newBodyPartCoords[0];
        cellIndex = newBodyPartCoords[1];
    }

    const bodyPart = document.createElement('div');
    bodyPart.classList.add('snake');
    bodyPart.classList.add('snake-body');
    bodyPart.style.background = snakeProperties.currentColor;
    field.rows[rowIndex].cells[cellIndex].append(bodyPart);
    snakeProperties.snakePartsList.push(bodyPart);

    if (animateBodyPart) {
        bodyPart.classList.add('new-snake-part');
        setTimeout(() => bodyPart.classList.remove('new-snake-part'), 300);
    }
}
function getNewBodyPartCoords() {
    const lastBodyPart = snakeProperties.snakePartsList[snakeProperties.snakePartsList.length - 1];
    const rowIndex = lastBodyPart.closest('tr').rowIndex;
    const cellIndex = lastBodyPart.closest('td').cellIndex;
    return [rowIndex, cellIndex];
}

function removeBodyPart() {
    const snake = snakeProperties.snakePartsList;
    if (snake.length == 1) {
        return;
    }
    snake.pop().remove();
}

function removeSnake() {
    snakeProperties.snakePartsList.forEach( part => part.remove() );
    snakeProperties.snakePartsList = []
}

function moveSnake() {
    const field = document.getElementById('field');
    const snakePartsList = snakeProperties.snakePartsList;

    // needs for remember current coordinates of all body parts
    // and then move all body parts by one step.
    const snakePartsCoordsList = [];
    for (let index = 0; index < snakePartsList.length; index++) {
        let nextRowIndex = snakePartsList[index].closest('tr').rowIndex;
        let nextCellIndex = snakePartsList[index].closest('td').cellIndex;
        snakePartsCoordsList.push([nextRowIndex, nextCellIndex])
    }

    const snakeHead = snakePartsList[0];
    const nextHeadCell = getNextHeadCell();
    nextHeadCell.append(snakeHead);

    for (let index = 1; index < snakePartsList.length; index++) {
        field.rows[snakePartsCoordsList[index - 1][0]].cells[snakePartsCoordsList[index - 1][1]].append(snakePartsList[index]);
    }
}

function drawSnakeBorder() {
    const field = document.getElementById('field');
    const fieldSize = field.rows.length;
    const snake = snakeProperties.snakePartsList;

    snake.push('fake body part');

    // checking every side of every body part
    for (let i = 1; i < snake.length-1; i++) {
        snake[i].removeAttribute('style');
        snake[i].style.background = snakeProperties.currentColor;

        const rowIndex = snake[i].closest('tr').rowIndex;
        const cellIndex = snake[i].closest('td').cellIndex
        if( rowIndex == 0 || ( !(field.rows[rowIndex-1].cells[cellIndex].firstChild == snake[i+1]) && !(field.rows[rowIndex-1].cells[cellIndex].firstChild == snake[i-1]) ) ) {
            snake[i].style.borderTopWidth = '2px';
            snake[i].style.borderTopColor = '#51381F';
        }
        if( rowIndex == fieldSize-1 || ( !(field.rows[rowIndex+1].cells[cellIndex].firstChild == snake[i+1]) && !(field.rows[rowIndex+1].cells[cellIndex].firstChild == snake[i-1]) ) ) {
            snake[i].style.borderBottomWidth = '2px';
            snake[i].style.borderBottomColor = '#51381F';
        }
        if( cellIndex == 0 || ( !(field.rows[rowIndex].cells[cellIndex-1].firstChild == snake[i+1]) && !(field.rows[rowIndex].cells[cellIndex-1].firstChild == snake[i-1]) ) ) {
            snake[i].style.borderLeftWidth = '2px';
            snake[i].style.borderLeftColor = '#51381F';
        }
        if( cellIndex == fieldSize-1 || ( !(field.rows[rowIndex].cells[cellIndex+1].firstChild == snake[i+1]) && !(field.rows[rowIndex].cells[cellIndex+1].firstChild == snake[i-1]) ) ) {
            snake[i].style.borderRightWidth = '2px';
            snake[i].style.borderRightColor = '#51381F';
        }
    }

    snake.pop();
}

// can return undefined (cell with coordinated out of field)
// if option 'passing through walls' is off
function getNextHeadCell() {
    const snakeHead = snakeProperties.snakePartsList[0];

    const passing = fieldProperties.passingThroughWalls;

    const fieldSize = document.getElementById('field').rows.length;
    const currentRow = snakeHead.closest('tr').rowIndex;
    const currentCell = snakeHead.closest('td').cellIndex;
    let nextRow = currentRow;
    let nextCell = currentCell;

    switch (snakeProperties.movingDirection) {
        case 'right':
            nextCell++;
            if ((nextCell == fieldSize) && passing) nextCell = 0;
            break;
        case 'left':
            nextCell--;
            if ((nextCell == -1) && passing) nextCell = fieldSize - 1;
            break;
        case 'down':
            nextRow++;
            if ((nextRow == fieldSize) && passing) nextRow = 0;
            break;
        case 'up':
            nextRow--;
            if ((nextRow == -1) && passing) nextRow = fieldSize - 1;
            break;
    }

    const field = document.getElementById('field');
    if (!field.rows[nextRow]) {
        return field.rows[nextRow]
    };
    return field.rows[nextRow].cells[nextCell];
}


function changeMovingDirection(event) {
    let nextMovingDirection = snakeProperties.movingDirection;
    const arrow = event.detail ? event.detail.code : event.code;
    
    switch (arrow) {
        case 'ArrowRight':
            nextMovingDirection = 'right';
            break;
        case 'ArrowLeft':
            nextMovingDirection = 'left';
            break;
        case 'ArrowDown':
            nextMovingDirection = 'down';
            break;
        case 'ArrowUp':
            nextMovingDirection = 'up';
            break;
    }

    // snake can turn only right/left and can't turn back
    // so we check it
    let previousAxis;
    let nextAxis;
    switch (snakeProperties.movingDirection) {
        case 'right':
        case 'left':
            previousAxis = 'X';
            break;
        case 'down':
        case 'up':
            previousAxis = 'Y';
            break;
    }
    switch (nextMovingDirection) {
        case 'right':
        case 'left':
            nextAxis = 'X';
            break;
        case 'down':
        case 'up':
            nextAxis = 'Y';
            break;
    }
    if (previousAxis == nextAxis) return;

    // direction can change only one time per snake step
    // so we save the next direction in another variable
    // and change the main direction once per step
    snakeProperties.nextMovingDirection = nextMovingDirection;
}


function eatNextCell() {
    const nextCell = getNextHeadCell();

    const normalPoint = document.getElementById('normalPoint');
    if (nextCell.contains(normalPoint)) {
        snakeProperties.newPartsQueueLength++;
        document.dispatchEvent(new CustomEvent('normalPointEaten'))
    }

    const specialPoint = document.getElementById('specialPoint');
    if (!specialPoint) return;

    const bonusPoint = specialPoint.classList.contains('bonus-point') ? specialPoint : null;
    if (bonusPoint && nextCell.contains(bonusPoint)) {
        changeScore(5);
        snakeProperties.newPartsQueueLength += 3;
        document.dispatchEvent(new CustomEvent('specialPointEaten'))
    }

    const poisonedPoint = specialPoint.classList.contains('poisoned-point') ? specialPoint : null;
    if (poisonedPoint && nextCell.contains(poisonedPoint)) {
        changeScore(-5);
        let removableBodyPartsCount = 3;
        for (let i = 0; i < removableBodyPartsCount; i++) {
            removeBodyPart();
            changeScore(-10);
        }
        document.dispatchEvent(new CustomEvent('specialPointEaten'))
    }
}