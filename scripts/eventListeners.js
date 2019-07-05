import {clearScene, computerStep,checkCollision,generateMarker,checkWinner,createListOfMarkers} from "./functions.js";
import {score,history} from "./initialise.js";
import History from "./Classes/history.js"

let firstStep = true;
let battlefield = document.querySelector('.battlefield');

document.querySelector('#reset').addEventListener('click',resetField);

battlefield.addEventListener('click',battlefieldListener);

document.querySelector('#clear-history').addEventListener('click',x=>{
    history.clearHistory();
});
document.querySelector('#clear-history').addEventListener('click',x=>{
    score.clearScore();
});
document.querySelector('#clear-history').addEventListener('click',resetField);


function resetField() {
    history.setHistoryOpen(false);
    History.resetColorHistory();
    clearScene(battlefield);
    battlefield.addEventListener('click',battlefieldListener);
    firstStep = !firstStep;
    if(!firstStep)
        computerStep();
}

export function battlefieldListener(e) {
    const id = `${rowIndex(e.target)}${cellIndex(e.target)}`;
    if(!checkCollision(id)) {
        generateMarker(id, 'o');
        if(!checkWinner(createListOfMarkers())){
            computerStep();
            checkWinner(createListOfMarkers());
        }
    }
}

function rowIndex(element) {
    return element.closest('tr').rowIndex;
}

function cellIndex(element) {
    return element.closest('td').cellIndex
}