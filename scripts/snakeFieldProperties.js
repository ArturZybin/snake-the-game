'use strict'
export {
    snakeProperties,
    setNewSnakeProperties,
    fieldProperties,
    setNewFieldProperties,
}


let snakeProperties = {
    color: '#2ecc71',
    speed: 200,
    // to keep snake properties throughout all game
    currentColor: '#2ecc71',
    currentSpeed: 200,
    
    movingDirection: 'right',
    nextMovingDirection: 'right',
    // includes head and all body parts
    snakePartsList: [],
    newPartsQueueLength: 0,

    startingHeadPosition: [8, 9],
    startingBodyPartsPositions: [
        [8, 8],
        [8, 7],
        [8, 6],
    ],
}

let fieldProperties = {
    barriers: false,
    poisonedPoints: false,
    bonusPoints: true,
    passingThroughtWalls: false,
}


function setNewSnakeProperties() {
    let snakeSettingsForm = document.forms.snakeSettingsForm;
    setSnakeColor(snakeSettingsForm);
    setSnakeSpeed(snakeSettingsForm);
}

function setSnakeColor(snakeSettingsForm) {
    let aviableSnakeColors = snakeSettingsForm.elements.snakeColor;
    let currentSnakeColor;
    for (let color of aviableSnakeColors) {
        if (color.checked) {
            currentSnakeColor = color.value;
        }
    }
    snakeProperties.color = currentSnakeColor;
}

function setSnakeSpeed(snakeSettingsForm) {
    let aviableSnakeSpeed = snakeSettingsForm.elements.snakeSpeed;
    let currentSnakeSpeed;
    for (let speed of aviableSnakeSpeed) {
        if (speed.checked) {
            currentSnakeSpeed = speed.value;
        };
    };
    snakeProperties.speed = parseInt(currentSnakeSpeed);
}


function setNewFieldProperties() {
    let fieldSettingsForm = document.forms.fieldSettingsForm;

    for (let option of fieldSettingsForm.elements) {
        if (option.checked) {
            fieldProperties[option.value] = true;
        } else {
            fieldProperties[option.value] = false;
        }
    }
}