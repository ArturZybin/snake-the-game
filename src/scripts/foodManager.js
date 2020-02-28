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
    document.addEventListener('bonusPointEaten', removeBonusPoint);
    document.addEventListener('poisonedPointEaten', removePoisonedPoint);
}

function endPointsGeneration() {
    clearInterval(specialPointsInterval);
}


function generateNormalPoint() {
    let point = document.createElement('div');
    point.classList.add('normal-point');
    point.id = 'normalPoint';

    let cell = getRandomEmptyCell();

    cell.append(point);
}
function moveNormalPoint() {
    let point = document.getElementById('normalPoint');
    let cell = getRandomEmptyCell();
    cell.append(point);
}


function generateRandomSpecialPoint() {
    let randomPercentage = Math.floor(Math.random() * (101));
    if (randomPercentage <= 30) {
        generatePoisonedPoint();
    } else {
        generateBonusPoint();
    }
}

function generateBonusPoint() {
    if (!fieldProperties.bonusPoints) return;

    let point = document.createElement('div');
    point.classList.add('special-point');
    point.classList.add('bonus-point');
    point.id = 'bonusPoint';

    let pointIndicator = document.createElement('div');
    pointIndicator.classList.add('special-point-indicator');

    let cell = getRandomEmptyCell();
    cell.append(point);
    point.append(pointIndicator);

    setTimeout(removeBonusPoint, 4000)
}
function removeBonusPoint() {
    let point = document.getElementById('bonusPoint');
    if (!point) return;
    point.remove();
}

function generatePoisonedPoint() {
    if (!fieldProperties.poisonedPoints) return;

    let point = document.createElement('div');
    point.classList.add('special-point');
    point.classList.add('poisoned-point');
    point.id = 'poisonedPoint';

    let pointIndicator = document.createElement('div');
    pointIndicator.classList.add('special-point-indicator');

    let cell = getRandomEmptyCell();
    cell.append(point);
    point.append(pointIndicator);

    setTimeout(removePoisonedPoint, 4000)
}
function removePoisonedPoint() {
    let point = document.getElementById('poisonedPoint');
    if (!point) return;
    point.remove();
}


function getRandomEmptyCell() {
    let field = document.getElementById('field');
    for (let i = 0; i < 200; i++) {
        let randomRow = field.rows[Math.floor(Math.random() * (field.rows.length))];
        let randomCell = randomRow.cells[Math.floor(Math.random() * (randomRow.cells.length))];
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