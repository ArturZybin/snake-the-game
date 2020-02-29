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

    defaultStartingHeadPosition: [8, 9],
    defaultStartingBodyPartsPositions: [
        [8, 8],
        [8, 7],
        [8, 6],
    ],
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
    const snakeSettingsForm = document.forms.snakeSettingsForm;
    setSnakeColor(snakeSettingsForm);
    setSnakeSpeed(snakeSettingsForm);
}

function setSnakeColor(snakeSettingsForm) {
    const availableSnakeColors = snakeSettingsForm.elements.snakeColor;
    let currentSnakeColor;
    for (let color of availableSnakeColors) {
        if (color.checked) {
            currentSnakeColor = color.value;
        }
    }
    snakeProperties.color = currentSnakeColor;
}

function setSnakeSpeed(snakeSettingsForm) {
    const availableSnakeSpeed = snakeSettingsForm.elements.snakeSpeed;
    let currentSnakeSpeed;
    for (let speed of availableSnakeSpeed) {
        if (speed.checked) {
            currentSnakeSpeed = speed.value;
        };
    };
    snakeProperties.speed = parseInt(currentSnakeSpeed);
}


function setNewFieldProperties() {
    const fieldSettingsForm = document.forms.fieldSettingsForm;

    for (let option of fieldSettingsForm.elements) {
        if (option.checked) {
            fieldProperties[option.value] = true;
        } else {
            fieldProperties[option.value] = false;
        }
    }
}