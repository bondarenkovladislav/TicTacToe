let battlefield = document.querySelector('.battlefield');

let idList = [];
let objectList= null;
let gameFinished = false;
//Идикатор первого хода игрока
let firstStep = true;

let userScore = 0;
let computerScore= 0;
setScore(userScore,computerScore);
historyDisplay();
battlefield.addEventListener('click',battlefieldListener);

document.querySelector('#reset').addEventListener('click',x=>{
    if(gameFinished) {
        gameFinished = !gameFinished;
        clearScene();
        idList = [];
        battlefield.addEventListener('click',battlefieldListener);
        firstStep = !firstStep;
        if(!firstStep)
            computerStep();
    }
});

//Возвращает есть ли коллизия
function checkCollision(checkingId){
    const index=idList.findIndex(x=>{
        return(x===checkingId);
    });
    return (index!==-1);
}

function generateMarker(id,flag) {
    idList.push(id);
    let marker = document.createElement('div');
    marker.className = 'marker';
    let td = getTd(id.substring(0,1),id.substring(1));
    marker.id = id;

    switch(flag){
        case 'x':{
            marker.textContent = 'X';
            marker.style.color = '#38612d';
            break;
        }
        case 'o':{
            marker.textContent = 'O';
            marker.style.color = '#224461';
            break;
        }
    }
    td.appendChild(marker);
}

let winner = function(markersIds) {
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
            x.style.color = 'red';
    })
};

function computerStep() {
    let genId;

    do {
        genId = generateId();
    }
    while (checkCollision(genId));
    generateMarker(genId,'x');
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

function checkWinner() {
    objectList = createListOfMarkers();
    // Если еще рано проверять
    if(objectList.length<5)
        return;
    xList = objectList.filter(x=>{
        return x.type === 'X';
    });
    oList = objectList.filter(x=>{
        return x.type === 'O';
    });
    if(checkEqualsCombinations(oList)) {
        setScore(++userScore);
        historyLog('o');
        endOfGame();
        return true;
    }
    if(checkEqualsCombinations(xList)){
        setScore(++computerScore);
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
//Создает список объектов: id,type
function createListOfMarkers() {
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

function checkEqualsCombinations(list) {
    let result;
    if((result = checkOffDiag(list)) !==null) {
        winner(result);
        return true;
    }
    else if((result = checkMainDiag(list)) !==null) {
        winner(result);
        return true;
    }
    else if((result = checkEqualsRowsCols(list)) !==null) {
        winner(result);
        return true;
    }
    return false;
}
//Проверка в строке и столбце
function checkEqualsRowsCols(list) {
    for(let i =0;i<list.length;i++){
        let equalRowIds=[list[i].id];
        let equalColumnIds =[list[i].id];
        for(let j = 0;j<list.length;j++){
            if(i===j)
                continue;
            if(list[i].id.substring(0,1) === list[j].id.substring(0,1)) equalRowIds.push(list[j].id);
            if(list[i].id.substring(1) === list[j].id.substring(1)) equalColumnIds.push(list[j].id);
        }
        if(equalRowIds.length===3) return equalRowIds;
        if(equalColumnIds.length===3) return equalColumnIds;
    }
    return null;
}

//Проверка на гравной диагонали
function checkMainDiag(list) {
    let upper = list.filter(x=>{
        return x.id ==='00'
    });
    let middle= list.filter(x=>{
        return x.id ==='11'
    });
    let down= list.filter(x=>{
        return x.id ==='22'
    });

   if(  (upper.length !==0) && (middle.length !==0) && (down.length!==0))
       return ['00','11','22'];
   return null;
}
//Проверка на побочной диагонали
function checkOffDiag(list) {
    let upper = list.filter(x=>{
        return x.id ==='02'
    });
    let middle= list.filter(x=>{
        return x.id ==='11'
    });
    let down= list.filter(x=>{
        return x.id ==='20'
    });

    if(  (upper.length !==0) && (middle.length !==0) && (down.length!==0))
        return ['02','11','20'];
    return null;
}

function endOfGame() {
    battlefield.removeEventListener('click',battlefieldListener);
    gameFinished = true;
}

function battlefieldListener(e) {
    const id = `${rowIndex(e.target)}${cellIndex(e.target)}`;
    if(!checkCollision(id)) {
        generateMarker(id, 'o');
        if(!checkWinner()){
            computerStep();
            checkWinner();
        }
    }
}

function rowIndex(element) {
    return element.closest('tr').rowIndex;
}

function cellIndex(element) {
    return element.closest('td').cellIndex
}

function getTd(row,cell) {
    return battlefield.rows[row].cells[cell];
}

function clearScene() {
    Array.from(battlefield.rows).forEach(x=>{
        Array.from(x.cells).forEach(y=>{
           y.innerHTML = '';
        });
    })
}

function setScore(){
    const scoreEl = document.querySelector('#score');
    scoreEl.textContent = `User score: ${userScore}. ComputerScore: ${computerScore}`;
}

function historyLog(winner) {
    let history = getHistory();
    if(!history)
        history = [];
    switch (winner){
        case 'x':{
            history.push({
                type:'X',
                time:new Date().toLocaleTimeString('en-US'),

            });
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
        case 'o':{
            history.push({
                type:'O',
                time:new Date().toLocaleTimeString('en-US')
            });
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
        case '-':{
            history.push({
                type:'Draw',
                time:new Date().toLocaleTimeString('en-US')
            });
            localStorage.setItem('history',JSON.stringify(history));
            break;
        }
    }
    historyDisplay();
}

function getHistory() {
    let item = localStorage.getItem('history');
    return JSON.parse(item);
}

function clearHistory() {
    userScore = computerScore = 0;
    setScore(userScore,computerScore);
    let history = [];
    localStorage.setItem('history', JSON.stringify(history));
    historyDisplay();
}

function historyDisplay() {
    let history = getHistory();
    let histDisplayItem = document.querySelector('.history-display');
    histDisplayItem.innerHTML = '';

    history.forEach(el=>{
        let hItem =document.createElement('div');
        hItem.textContent = `Winner: ${el.type}. Time: ${el.time}`;
        histDisplayItem.prepend(hItem);
    });
}