'use strict';

export {
    startPointsGeneration
};


function startPointsGeneration() {
    generateNormalPoint();
    document.addEventListener('normalPointEaten', moveNormalPoint);
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