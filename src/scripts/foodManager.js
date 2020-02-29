'use strict';

import {
    fieldProperties
} from './snakeFieldProperties.js';

export {
    startPointsGeneration,
    endPointsGeneration
};


let specialPointsInterval;



function startPointsGeneration() {
    generateNormalPoint();

    specialPointsInterval = setInterval(generateRandomSpecialPoint, 15000);

    document.addEventListener('normalPointEaten', moveNormalPoint);
    document.addEventListener('specialPointEaten', removeSpecialPoint);
}

function endPointsGeneration() {
    clearInterval(specialPointsInterval);
}


function generateNormalPoint() {
    const point = document.createElement('div');
    point.classList.add('normal-point');
    point.id = 'normalPoint';

    const cell = getRandomEmptyCell();

    cell.append(point);
}
function moveNormalPoint() {
    const point = document.getElementById('normalPoint');
    const cell = getRandomEmptyCell();
    cell.append(point);
}


function generateRandomSpecialPoint() {
    const randomPercentage = Math.floor(Math.random() * (101));
    if (randomPercentage <= 30) {
        generateSpecialPoint('poisoned');
    } else {
        generateSpecialPoint('bonus');
    }
}

function generateSpecialPoint(type) {
    if (!fieldProperties.bonusPoints) return;

    const point = document.createElement('div');
    point.classList.add('special-point');
    point.classList.add(`${type}-point`);
    point.id = 'specialPoint';

    const pointIndicator = document.createElement('div');
    pointIndicator.classList.add('special-point-indicator');

    const cell = getRandomEmptyCell();
    cell.append(point);
    point.append(pointIndicator);

    setTimeout(removeSpecialPoint, 4000)
}
function removeSpecialPoint() {
    const point = document.getElementById('specialPoint');
    if (!point) return;
    point.remove();
}


function getRandomEmptyCell() {
    const field = document.getElementById('field');
    for (let i = 0; i < 200; i++) {
        const randomRow = field.rows[Math.floor(Math.random() * (field.rows.length))];
        const randomCell = randomRow.cells[Math.floor(Math.random() * (randomRow.cells.length))];
        if (randomCell.innerHTML == '') return randomCell;
    }

    // if we can't take empty cell by random 1000 times,
    // we take first empty cell
    for (let row of field.rows) {
        for (let cell of row.cells) {
            if (cell.innerHTML == '') return cell;
        }
    }
}