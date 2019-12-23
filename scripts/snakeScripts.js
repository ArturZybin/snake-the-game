'use strict';

import {
    snakeProperties,
    fieldProperties
} from './snakeFieldProperties.js';

export {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart
};


function createStartingSnake() {
    let field = document.getElementById('field');

    let snakeHead = document.createElement('div');
    snakeHead.id = 'snakeHead';
    snakeHead.classList.add('snake');
    snakeHead.classList.add('snake-head');
    snakeHead.style.background = snakeProperties.color;
    let snakeHeadRow = snakeProperties.startingHeadPosition[0];
    let snakeHeadCell = snakeProperties.startingHeadPosition[1];
    field.rows[snakeHeadRow].cells[snakeHeadCell].append(snakeHead);
    snakeProperties.snakePartsList.push(snakeHead)

    for (let bodyPartCoords of snakeProperties.startingBodyPartsPositions) {
        addBodyPart(bodyPartCoords[0], bodyPartCoords[1]);
    }
}


function addBodyPart(rowIndex, cellIndex) {
    // finding coordinates if they haven't been given
    if (!rowIndex) {
        let newBodyPartCoords = getNewBodyPartCoords();
        rowIndex = newBodyPartCoords[0];
        cellIndex = newBodyPartCoords[1];
    }

    let bodyPart = document.createElement('div');
    bodyPart.classList.add('snake');
    bodyPart.classList.add('snake-body');
    bodyPart.style.background = snakeProperties.color;
    field.rows[rowIndex].cells[cellIndex].append(bodyPart);
    snakeProperties.snakePartsList.push(bodyPart);
}
function getNewBodyPartCoords() {
    let lastBodyPart = snakeProperties.snakePartsList[snakeProperties.snakePartsList.length - 1];
    let rowIndex = lastBodyPart.closest('tr').rowIndex;
    let cellIndex = lastBodyPart.closest('td').cellIndex;
    return [rowIndex, cellIndex];
}

function removeBodyPart() {
    let snake = snakeProperties.snakePartsList;
    if (snake.length == 1) {
        return;
    }
    snake.pop().remove();
}

function moveSnake() {
    let field = document.getElementById('field');
    let direction = snakeProperties.direction;
    let snakePartsList = snakeProperties.snakePartsList;

    // needs for remember current coordinates of all body parts
    // and then move all body parts by one step.
    let snakePartsCoordsList = [];
    for (let index = 0; index < snakePartsList.length; index++) {
        let nextRowIndex = snakePartsList[index].closest('tr').rowIndex;
        let nextCellIndex = snakePartsList[index].closest('td').cellIndex;
        snakePartsCoordsList.push([nextRowIndex, nextCellIndex])
    }

    let snakeHead = snakePartsList[0];
    let nextHeadCell = getNextHeadCell();
    nextHeadCell.append(snakeHead);

    for (let index = 1; index < snakePartsList.length; index++) {
        field.rows[snakePartsCoordsList[index - 1][0]].cells[snakePartsCoordsList[index - 1][1]].append(snakePartsList[index]);
    }
}


// can return undefined (cell with coordinated out of field)
// if option 'passing throught walls' is off
function getNextHeadCell() {
    let snakeHead = snakeProperties.snakePartsList[0];
    let direction = snakeProperties.movingDirection;

    let passing = fieldProperties.passingThroughtWalls;

    let fieldSize = document.getElementById('field').rows.length;
    let currentRow = snakeHead.closest('tr').rowIndex;
    let currentCell = snakeHead.closest('td').cellIndex;
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

    let field = document.getElementById('field');
    if (!field.rows[nextRow]) return field.rows[nextRow];
    return field.rows[nextRow].cells[nextCell];
}


function changeMovingDirection(event) {
    let nextMovingDirection = snakeProperties.movingDirection;
    switch (event.code) {
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
    let nextCell = getNextHeadCell();

    let normalPoint = document.getElementById('normalPoint');
    if (nextCell.contains(normalPoint)) {
        snakeProperties.newPartsQueueLength++;
        document.dispatchEvent(new CustomEvent('normalPointEaten'))
    }

    let bonusPoint = document.getElementById('bonusPoint');
    if (bonusPoint && nextCell.contains(bonusPoint)) {
        let newBodyPartsCount = 3;
        for (let i = 0; i < newBodyPartsCount; i++) {
            snakeProperties.newPartsQueueLength++;
        }
        document.dispatchEvent(new CustomEvent('bonusPointEaten'))
    }

    let poisonedPoint = document.getElementById('poisonedPoint');
    if (poisonedPoint && nextCell.contains(poisonedPoint)) {
        let removableBodyPartsCount = 3;
        for (let i = 0; i < removableBodyPartsCount; i++) {
            removeBodyPart();
        }
        document.dispatchEvent(new CustomEvent('poisonedPointEaten'))
    }
}