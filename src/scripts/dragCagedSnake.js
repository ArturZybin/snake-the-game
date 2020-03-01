'use strict';

import {
   snakeProperties,
   fieldProperties,
} from './snakeFieldProperties.js';

import {
   createNewField,
   createBarriers,
} from './interfaceManager.js';

import {
   createStartingSnake,
   drawSnakeBorder,
   removeSnake
} from './snakeScripts.js';

import {
   startGame
} from './mainGameScript.js';

export {
   startSnakeDragging,
};


function startSnakeDragging(event) {
   event.preventDefault();

   let tempZoom = getComputedStyle(document.body).transform;
   tempZoom = tempZoom.match(/\(.*?(?=,)/)[0];
   tempZoom = tempZoom.slice(1);
   const zoom = tempZoom;

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
   const snakeShiftX = event.clientX - snakeRect.left;
   const snakeShiftY = event.clientY - snakeRect.top;

   document.addEventListener('mousemove', moveDraggingSnake);
   document.addEventListener('mousemove', showStartingSnake);
   document.addEventListener('mouseup', endSnakeDragging);

   document.addEventListener('touchmove', moveDraggingSnake);
   document.addEventListener('touchmove', showStartingSnake);
   document.addEventListener('touchend', endSnakeDragging);


   // moves caged snake
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
       let left = event.clientX - snakeShiftX;
       let top = event.clientY - snakeShiftY;

       if (left < containerRect.left) left = containerRect.left;
       if (left > containerRect.right - snakeRect.width) left = containerRect.right - snakeRect.width;
       if (top < containerRect.top) top = containerRect.top;
       if (top > containerRect.bottom - snakeRect.height) top = containerRect.bottom - snakeRect.height;

       snake.style.left = (left - containerLeft)/zoom + 'px';
       snake.style.top = (top - containerTop)/zoom + 'px';
   }

   // shows snake shape at field
   function showStartingSnake(event) {
       if (event.changedTouches) {
           event = event.changedTouches[0];
       }

       snake.hidden = true;
       const elementBelowCursor = document.elementFromPoint(event.clientX, event.clientY);
       snake.removeAttribute('hidden');
       if (!elementBelowCursor) return;

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

   // sets position for showStartingSnake(), draws nothing, only calculater
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