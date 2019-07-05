import {clearHistory, resetColorHistory, setHistoryOpen} from "./history.js";
import {clearIdList, clearScene, computerStep,checkCollision,generateMarker,checkWinner,createListOfMarkers} from "./functions.js";
let firstStep = true;

let battlefield = document.querySelector('.battlefield');

document.querySelector('#reset').addEventListener('click',x=>{
    setHistoryOpen(false);
    resetColorHistory();
    clearScene(battlefield);
    clearIdList();
    battlefield.addEventListener('click',battlefieldListener);
    firstStep = !firstStep;
    if(!firstStep)
        computerStep();
});

battlefield.addEventListener('click',battlefieldListener);

document.querySelector('#clear-history').addEventListener('click',clearHistory);

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