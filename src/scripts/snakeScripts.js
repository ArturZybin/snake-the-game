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
    startSnakeDragging,
    drawSnakeBorder
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
    //!const direction = snakeProperties.direction;
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
// if option 'passing throught walls' is off
function getNextHeadCell() {
    const snakeHead = snakeProperties.snakePartsList[0];
    //!let direction = snakeProperties.movingDirection;

    const passing = fieldProperties.passingThroughtWalls;

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

    const bonusPoint = document.getElementById('bonusPoint');
    if (bonusPoint && nextCell.contains(bonusPoint)) {
        changeScore(5);
        snakeProperties.newPartsQueueLength += 3;
        document.dispatchEvent(new CustomEvent('bonusPointEaten'))
    }

    const poisonedPoint = document.getElementById('poisonedPoint');
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
    const zoom = getComputedStyle(document.body).zoom;

    const snake = document.getElementById('cagedSnake');
    if (snake.hasAttribute('hidden')) return;

    createNewField();
    if (fieldProperties.barriers) {
        createBarriers();
    }

    snake.classList.add('dragged-caged-snake');

    if (event.changedTouches) {
        event = event.changedTouches[0];
    }

    const snakeRect = snake.getBoundingClientRect();
    const snakeShiftX = event.clientX/zoom - snakeRect.left;
    const snakeShiftY = event.clientY/zoom - snakeRect.top;

    document.addEventListener('mousemove', moveDraggingSnake);
    document.addEventListener('mousemove', showStartingSnake);
    document.addEventListener('mouseup', endSnakeDragging);

    document.addEventListener('touchmove', moveDraggingSnake);
    document.addEventListener('touchmove', showStartingSnake);
    document.addEventListener('touchend', endSnakeDragging);


    function moveDraggingSnake(event) {
        const container = document.getElementById('mainContainer');
        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const containerTop = containerRect.top;

        if (event.changedTouches) {
            event = event.changedTouches[0];
        }

        const snake = document.getElementById('cagedSnake');
        const snakeRect = snake.getBoundingClientRect();
        const left = event.clientX/zoom - snakeShiftX;
        const top = event.clientY/zoom - snakeShiftY;

        if (left < containerRect.left) left = containerRect.left;
        if (left > containerRect.right - snakeRect.width) left = containerRect.right - snakeRect.width;
        if (top < containerRect.top) top = containerRect.top;
        if (top > containerRect.bottom - snakeRect.height) top = containerRect.bottom - snakeRect.height;

        snake.style.left = left - containerLeft + 'px';
        snake.style.top = top - containerTop + 'px';
    }

    function showStartingSnake(event) {
        if (event.changedTouches) {
            event = event.changedTouches[0];
        }

        snake.hidden = true;
        const elementBelowCursor = document.elementFromPoint(event.clientX, event.clientY);
        snake.removeAttribute('hidden');

        if (!elementBelowCursor.classList.contains('field-cell') && !elementBelowCursor.classList.contains('snake')) {
            removeSnake();
            return;
        }
        const cellBelowCursor = elementBelowCursor.closest('td');

        if (setNewStartingSnakePosition(cellBelowCursor)) {
            createStartingSnake();
            drawSnakeBorder();
            cellBelowCursor.addEventListener('mouseout', removeSnake);
        }
    }

    function endSnakeDragging(event) {
        removeSnake();
        document.removeEventListener('mousemove', moveDraggingSnake);
        document.removeEventListener('mousemove', showStartingSnake);
        document.removeEventListener('mouseup', endSnakeDragging);

        document.removeEventListener('touchmove', moveDraggingSnake);
        document.removeEventListener('touchmove', showStartingSnake);
        document.removeEventListener('touchend', endSnakeDragging);

        if (event.changedTouches) {
            event = event.changedTouches[0];
        }

        const snake = document.getElementById('cagedSnake');

        snake.hidden = true;
        const elementBelowCursor = document.elementFromPoint(event.clientX, event.clientY)

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
        const field = document.getElementById('field');
        const rowIndex = cell.closest('tr').rowIndex;
        const headCellIndex = cell.cellIndex;

        // creating starting snake on given cell
        // turn it back if it doesn't fit to the field
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

        // checking if snake occupies cell which has already been occupied
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