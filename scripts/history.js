// import {userScore,computerScore} from "./view";
import {createListOfMarkers,clearScene,generateMarker,checkWinner,setScore} from "./functions.js";

export let userScore = 0;
export let computerScore= 0;

export let historyOpen = false;
export function historyLog(winner) {
    if(historyOpen)
        return;
    let history = getHistory();
    if(!history)
        history = [];
    switch (winner){
        case 'x':{
            history.push(createHistoryElement('X'));
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
        case 'o':{
            history.push(createHistoryElement('O'));
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
        case '-':{
            history.push(createHistoryElement('Draw'));
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
    }
    historyDisplay();
}

export function createHistoryElement(markerType) {
    return{
        type:markerType,
        time:new Date().toLocaleTimeString('en-US'),
        steps: createListOfMarkers()
    }
}

export function getHistory() {
    let item = localStorage.getItem('history');
    return JSON.parse(item);
}

export function clearHistory() {
    userScore = computerScore = 0;
    setScore(userScore,computerScore);
    let history = [];
    localStorage.setItem('history', JSON.stringify(history));
    historyDisplay();
}

export function historyDisplay() {
    let history = getHistory();
    if(history===null){
        clearHistory();
        history = getHistory();
    }
    let histDisplayItem = document.querySelector('.history-display');
    histDisplayItem.innerHTML = '';

    history.forEach(el=>{
        let hItem =document.createElement('div');
        hItem.textContent = `Winner: ${el.type}. Time: ${el.time}`;

        hItem.addEventListener('click',x=>{
            resetColorHistory();
            repeatHystory(el);
        });

        hItem.onmouseover = function()
        {
            this.style.backgroundColor = "orange";
        };
        hItem.onmouseleave = function(){
            this.style.backgroundColor = 'black';
        };

        hItem.className = 'hItem';
        hItem.setAttribute('data-aos','zoom-in-up');
        histDisplayItem.prepend(hItem);
    });
}

export function repeatHystory(histObject) {
    historyOpen=true;
    const steps = histObject.steps;
    clearScene(document.querySelector('.battlefield'));
    steps.forEach(x=>{
        generateMarker(x.id,x.type.toLowerCase());
    });
    checkWinner(steps);
}

export function resetColorHistory() {
    document.querySelector('.history-display').childNodes.forEach(x=>{
        x.style.backgroundColor = 'black';
    })
}

export function addComputerScore() {
    computerScore++;
}
export function addUserScore() {
    userScore++;
}

export function setHistoryOpen(value) {
    historyOpen = value;
}