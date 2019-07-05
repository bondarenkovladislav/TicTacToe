import {historyLog, historyOpen} from "./history.js";
import {checkEqualsCombinations} from "./checkCombinations.js";
import {tryPredictBestStep} from "./predictComputerStep.js";
import {battlefieldListener} from "./eventListeners.js";
import {score} from "./initialise.js";

export let idList= [];

//Создает список объектов: id,type
export function createListOfMarkers() {
    let allMarkers = document.querySelectorAll('.marker');
    let markers = Array.from(allMarkers);

    let objectsList =[];
    markers.forEach(x=>{
        objectsList.push({
            'id':x.id,
            'type':x.textContent
        });
    });
    return objectsList;
}

export function clearScene(battlefield) {
    Array.from(battlefield.rows).forEach(x=>{
        Array.from(x.cells).forEach(y=>{
            y.innerHTML = '';
        });
    })
}

export function generateMarker(id,flag) {
    idList.push(id);
    let marker = document.createElement('div');
    marker.className = 'marker';
    let td = getTd(id.substring(0,1),id.substring(1));
    marker.id = id;
    marker.setAttribute('data-aos','zoom-in');
    switch(flag){
        case 'x':{
            marker.textContent = 'X';
            marker.style.color = '#d85403';
            break;
        }
        case 'o':{
            marker.textContent = 'O';
            marker.style.color = '#dbb701';
            break;
        }
    }
    td.appendChild(marker);
}

function getTd(row,cell) {
    return document.querySelector('.battlefield').rows[row].cells[cell];
}

export function checkWinner(objectList) {
    // Если еще рано проверять
    if(objectList.length<5)
        return;
    let xList = objectList.filter(x=>{
        return x.type === 'X';
    });
    let oList = objectList.filter(x=>{
        return x.type === 'O';
    });
    if(checkEqualsCombinations(oList)) {
        if(!historyOpen)
            score.setUserScore(score.userScore+1);
        score.displayScore(score.userScore,score.computerScore);
        historyLog('o');
        endOfGame();
        return true;
    }
    if(checkEqualsCombinations(xList)){

        if(!historyOpen)
            score.setComputerScore(score.computerScore+1);
        score.displayScore(score.userScore,score.computerScore);
        historyLog('x');
        endOfGame();
        return true;
    }
    if(idList.length===9) {
        historyLog('-');
        endOfGame();
        return true;
    }
    return false;
}

function endOfGame() {
    document.querySelector('.battlefield').removeEventListener('click',battlefieldListener);
    // gameFinished = true;
}

export let winner = function(markersIds) {
    let allMarkers = document.querySelectorAll('.marker');
    let markers = Array.from(allMarkers);
    let results=[];

    markersIds.forEach((x,i)=>{
        results[i] = markers.find(y=>{
            return (y.id === x);
        });
    });
    results.forEach(x=>{
        if(x!==undefined)
            x.style.color = '#ff0907';
    })
};

//Возвращает есть ли коллизия
export function checkCollision(checkingId){
    const index=idList.findIndex(x=>{
        return(x===checkingId);
    });
    return (index!==-1);
}

export function computerStep() {
    if(tryPredictBestStep())
        return;

    let genId;
    do {
        genId = generateId();
    }
    while (checkCollision(genId));
    generateMarker(genId, 'x');
}

//Включая концы
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function generateId() {
    return `${randomInteger(0,2)}${randomInteger(0,2)}`;
}

export function clearIdList() {
    idList=[];
}