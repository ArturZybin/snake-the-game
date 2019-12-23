'use strict';

import {
    fieldProperties
} from './snakeFieldProperties.js';

export {
    startPointsGeneration,
    endPointsGeneration
};


let bonusPointsInterval;



function startPointsGeneration() {
    let generatingFrequency = 20000;
    generateBonusPoint();
    generateNormalPoint();
    bonusPointsInterval = setInterval(generateBonusPoint, generatingFrequency);

    document.addEventListener('normalPointEaten', moveNormalPoint);
    document.addEventListener('bonusPointEaten', removeSpecialPoint);
}

function endPointsGeneration() {
    clearInterval(bonusPointsInterval);
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


function generateBonusPoint() {
    if (!fieldProperties.bonusPoints) return;

    let point = document.createElement('div');
    point.classList.add('special-point');
    point.classList.add('bonus-point');
    point.id = 'bonusPoint';

    let pointIndicator = document.createElement('div');
    pointIndicator.classList.add('special-point-indicator');
    pointIndicator.id = 'bonusPointIndicator'

    let cell = getRandomEmptyCell();
    cell.append(point);
    point.append(pointIndicator);

    setTimeout(removeSpecialPoint, 3000)
}
function removeSpecialPoint() {
    let point = document.getElementsByClassName('special-point')[0];
    if (!point) return;
    point.remove();
}


function getRandomEmptyCell() {
    let field = document.getElementById('field');
    for (let i = 0; i < 1000; i++) {
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