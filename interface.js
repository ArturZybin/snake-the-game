'use strict'

createField();
addNewLeader('Arturchik', 1000);
document.getElementById('settingsButton').onclick = openSettings;
document.getElementById('closeSettingsButton').onclick = closeSettings;




function createField() {
    let field = document.getElementById('field');
    createFieldCells(field);
}


function createFieldCells(field) {
    let fieldSize = 17;
    for (let i=0; i<fieldSize; i++) {
        let row = document.createElement('tr');
        for (let j=0; j<fieldSize; j++) {
            let cell = document.createElement('td');
            cell.classList.add('field-cell');
            row.append(cell);
        };
        row.classList.add('field-row');
        field.append(row);
    };
}


function addNewLeader(newLeadername, newLeaderScore) {
    let leaderboard = document.getElementById('leaderboard');
    let leadersList = Array.from(leaderboard.querySelectorAll('.leader'));

    for (let currentLeader of leadersList) {
        let currentLeaderScore = currentLeader.querySelector('.leader-score').textContent;

        if (currentLeaderScore == '--||--' || parseInt(currentLeaderScore) < newLeaderScore) {
            currentLeader.querySelector('.leader-name').textContent = newLeadername;
            currentLeader.querySelector('.leader-score').textContent = newLeaderScore;
            break;
        }
    }
}


function openSettings() {
    let mainContainer = document.getElementById('mainContainer');
    let mainContainerLocker = document.getElementById('mainContainerLocker');
    let settingsContainer = document.getElementById('settingsContainer');

    mainContainer.classList.add('blured');
    mainContainerLocker.removeAttribute('hidden');
    settingsContainer.removeAttribute('hidden');
}
function closeSettings() {
    let mainContainer = document.getElementById('mainContainer');
    let mainContainerLocker = document.getElementById('mainContainerLocker');
    let settingsContainer = document.getElementById('settingsContainer');

    mainContainer.classList.remove('blured');
    mainContainerLocker.hidden = 'true';
    settingsContainer.hidden = 'true';
}