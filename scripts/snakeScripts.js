'use strict';

import {
    snakeProperties,
    fieldProperties
} from './snakeFieldProperties.js';

import {
    changeScore,
    createClearField,
    createBarriers
} from './interfaceManager.js';

import {
    startGame
} from './mainGameScript.js';

export {
    createStartingSnake,
    changeMovingDirection,
    getNextHeadCell,
    eatNextCell,
    moveSnake,
    addBodyPart,
    startSnakeDragging
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
    if (typeof rowIndex == 'undefined') {
        let newBodyPartCoords = getNewBodyPartCoords();
        rowIndex = newBodyPartCoords[0];
        cellIndex = newBodyPartCoords[1];
    }

    let bodyPart = document.createElement('div');
    bodyPart.classList.add('snake');
    bodyPart.classList.add('snake-body');
    bodyPart.style.background = snakeProperties.currentColor;
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

function removeSnake() {
    snakeProperties.snakePartsList.forEach( part => part.remove() );
    snakeProperties.snakePartsList = []
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
        changeScore(5);
        snakeProperties.newPartsQueueLength += 3;
        document.dispatchEvent(new CustomEvent('bonusPointEaten'))
    }

    let poisonedPoint = document.getElementById('poisonedPoint');
    if (poisonedPoint && nextCell.contains(poisonedPoint)) {
        changeScore(-5);
        let removableBodyPartsCount = 3;
        for (let i = 0; i < removableBodyPartsCount; i++) {
            removeBodyPart();
            changeScore(-10);
        }
        document.dispatchEvent(new CustomEvent('poisonedPointEaten'))
    }
}



function startSnakeDragging(event) {
    let snake = document.getElementById('cagedSnake');
    if (snake.hasAttribute('hidden')) return;

    createClearField();
    if (fieldProperties.barriers) {
        createBarriers();
    }

    snake.classList.add('dragged-caged-snake');

    let snakeRect = snake.getBoundingClientRect();
    let snakeShiftX = event.clientX - snakeRect.left;
    let snakeShiftY = event.clientY - snakeRect.top;

    document.addEventListener('mousemove', moveDraggingSnake);
    document.addEventListener('mousemove', showStartingSnake);

    document.addEventListener('mouseup', endSnakeDragging);


    function moveDraggingSnake(event) {
        let container = document.getElementById('mainContainer');
        let containerRect = container.getBoundingClientRect();
        let containerShiftX = containerRect.left;
        let containerShiftY = containerRect.top;

        let snake = document.getElementById('cagedSnake');
        let snakeRect = snake.getBoundingClientRect();
        let left = event.clientX - snakeShiftX;
        let top = event.clientY - snakeShiftY;

        if (left < containerRect.left) left = containerRect.left;
        if (left > containerRect.right - snakeRect.width) left = containerRect.right - snakeRect.width;
        if (top < containerRect.top) top = containerRect.top;
        if (top > containerRect.bottom - snakeRect.height) top = containerRect.bottom - snakeRect.height;

        snake.style.left = left - containerShiftX + 'px';
        snake.style.top = top - containerShiftY + 'px';
    }

    function showStartingSnake(event) {
        snake.hidden = true;
        let elementBelowCursor = document.elementFromPoint(event.clientX, event.clientY);
        snake.removeAttribute('hidden');

        if (!elementBelowCursor.classList.contains('field-cell') && !elementBelowCursor.classList.contains('snake')) return;
        elementBelowCursor = elementBelowCursor.closest('td');

        if (setNewStartingSnakePosition(elementBelowCursor)) {
            createStartingSnake();
            elementBelowCursor.addEventListener('mouseout', removeSnake);
        }
    }

    function endSnakeDragging(event) {
        removeSnake();
        document.removeEventListener('mousemove', moveDraggingSnake);
        document.removeEventListener('mousemove', showStartingSnake);
        document.removeEventListener('mouseup', endSnakeDragging);

        let snake = document.getElementById('cagedSnake');

        snake.hidden = true;
        let elementBelowCursor = document.elementFromPoint(event.clientX, event.clientY)

        snake.removeAttribute('style');
        snake.classList.remove('dragged-caged-snake');

        if (!elementBelowCursor.classList.contains('field-cell')) {
            snake.removeAttribute('hidden');
            return;
        }

        if ( !setNewStartingSnakePosition(elementBelowCursor) ) {
            snake.removeAttribute('hidden');
            return;
        }

        startGame();

        // reset starting positions and direction to default
        snakeProperties.startingHeadPosition = snakeProperties.defaultStartingHeadPosition;
        snakeProperties.startingBodyPartsPositions = snakeProperties.defaultStartingBodyPartsPositions;
    }

    // returns false if the cell isn't suits for spawning snake
    function setNewStartingSnakePosition(cell) {
        let field = document.getElementById('field');
        let rowIndex = cell.closest('tr').rowIndex;
        let headCellIndex = cell.cellIndex;

        snakeProperties.startingHeadPosition = [rowIndex, headCellIndex];
        if (headCellIndex > 3) {
            snakeProperties.startingBodyPartsPositions = [
                [rowIndex, headCellIndex-1],
                [rowIndex, headCellIndex-2],
                [rowIndex, headCellIndex-3],
            ]
            snakeProperties.movingDirection = 'right';
            snakeProperties.nextMovingDirection = 'right';
        } else {
            snakeProperties.startingBodyPartsPositions = [
                [rowIndex, headCellIndex+1],
                [rowIndex, headCellIndex+2],
                [rowIndex, headCellIndex+3],
            ]
            snakeProperties.movingDirection = 'left';
            snakeProperties.nextMovingDirection = 'left';
        }
        createStartingSnake();

        for (let snakePart of snakeProperties.snakePartsList) {
            if ( !(typeof snakePart.closest('td').childNodes[1] == 'undefined')) { 

                if (!snakePart.closest('td').childNodes[0].classList.contains('snake')) {
                    // reset starting positions and direction to default
                    snakeProperties.startingHeadPosition = snakeProperties.defaultStartingHeadPosition;
                    snakeProperties.startingBodyPartsPositions = snakeProperties.defaultStartingBodyPartsPositions;

                    removeSnake();
                    return false;
                }

            }
        }
        removeSnake();
        return true;
    }
}