let battlefield = document.querySelector('.battlefield');

let idList = [];
let objectList= null;
//Идикатор первого хода игрока
let firstStep = true;
let historyOpen = false;

let userScore = 0;
let computerScore= 0;
setScore(userScore,computerScore);
historyDisplay();
battlefield.addEventListener('click',battlefieldListener);

document.querySelector('#reset').addEventListener('click',x=>{
        historyOpen=false;
        resetColorHistory();
        clearScene();
        idList = [];
        battlefield.addEventListener('click',battlefieldListener);
        firstStep = !firstStep;
        if(!firstStep)
            computerStep();
});
// generateMarker('20','x');
// generateMarker('02','x');
// predictBestInOffDiagonal([{type:'X',id:'02'},{type:'X',id:'20'}]);
// tryPredictBestStep();

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
            x.style.color = '#ff0907';
    })
};

function computerStep() {
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

function checkWinner(objectList) {
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
        userScore = historyOpen?userScore:userScore+1;
        setScore(userScore,computerScore);
        historyLog('o');
        endOfGame();
        return true;
    }
    if(checkEqualsCombinations(xList)){
        computerScore = historyOpen?computerScore:computerScore+1;
        setScore(userScore,computerScore);
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

function predictBestInRow(list){
    let rowIndex = list[0].substring(0,1);
    let predictIds= [`${rowIndex}0`,`${rowIndex}1`,`${rowIndex}2`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

function predictBestInColumn(list) {
    let columnIndex = list[0].substring(1);
    let predictIds= [`0${columnIndex}`,`1${columnIndex}`,`2${columnIndex}`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(!checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

function predictBestInMainDiagonal(list) {
    let predictIds = [`00`,`11`,`22`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(predictIds.length===1 && !checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

function predictBestInOffDiagonal(list){
    let predictIds = [`02`,`11`,`20`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(predictIds.length===1 &&!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

function tryPredictBestStep() {
    let markerList = createListOfMarkers();
    let xList = markerList.filter(x=>{
        return x.type === 'X';
    });
    let oList = markerList.filter(x=>{
        return x.type === 'O';
    });
    let xRowPredictVariants = [];
    let xCellPredictVariants = [];
    let oRowPredictVariants = [];
    let oCellPredictVariants = [];

    for(let i =0;i<xList.length;i++){
        let equalRowIds=[xList[i].id];
        let equalColumnIds =[xList[i].id];
        for(let j = 0;j<xList.length;j++){
            if(i===j)
                continue;
            if(xList[i].id.substring(0,1) ===xList[j].id.substring(0,1)) equalRowIds.push(xList[j].id);
            if(xList[i].id.substring(1) === xList[j].id.substring(1)) equalColumnIds.push(xList[j].id);
        }
        if(equalRowIds.length===2) xRowPredictVariants.push(equalRowIds);
        if(equalColumnIds.length===2) xCellPredictVariants.push(equalColumnIds);
    }

    for(let i =0;i<oList.length;i++){
        let equalRowIds=[oList[i].id];
        let equalColumnIds =[oList[i].id];
        for(let j = 0;j<oList.length;j++){
            if(i===j)
                continue;
            if(oList[i].id.substring(0,1) ===oList[j].id.substring(0,1)) equalRowIds.push(oList[j].id);
            if(oList[i].id.substring(1) === oList[j].id.substring(1)) equalColumnIds.push(oList[j].id);
        }
        if(equalRowIds.length===2) oRowPredictVariants.push(equalRowIds);
        if(equalColumnIds.length===2) oCellPredictVariants.push(equalColumnIds);
    }

    for(let i=0;i<xRowPredictVariants.length;i++){
        if(predictBestInRow(xRowPredictVariants[i]))
            return true;
    }
    for(let i=0;i<xCellPredictVariants.length;i++){
        if(predictBestInColumn(xCellPredictVariants[i]))
            return true;
    }

    for(let i=0;i<oRowPredictVariants.length;i++){
        if(predictBestInRow(oRowPredictVariants[i]))
            return true;
    }
    for(let i=0;i<oCellPredictVariants.length;i++){
        if(predictBestInColumn(oCellPredictVariants[i]))
            return true;
    }

    let diagIds = xList.filter(x=>{
       return x.id.substring(0,1) === x.id.substring(1);
    });
    if(predictBestInMainDiagonal(diagIds))
        return true;
    let offdiagIds = xList.filter(x=>{
       return x.id ==='02' || x.id ==='20' || x.id === '11'
    });
    if(predictBestInOffDiagonal(offdiagIds))
        return true;

    diagIds = oList.filter(x=>{
        return x.id.substring(0,1) === x.id.substring(1);
    });
    if(predictBestInMainDiagonal(diagIds))
        return true;
    offdiagIds = oList.filter(x=>{
        return x.id ==='02' || x.id ==='20' || x.id === '11'
    });
    if(predictBestInOffDiagonal(offdiagIds))
        return true;
    return false;
}



function endOfGame() {
    battlefield.removeEventListener('click',battlefieldListener);
    gameFinished = true;
}

function battlefieldListener(e) {
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
    scoreEl.textContent = `${userScore}:${computerScore}`;
}

function historyLog(winner) {
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

function createHistoryElement(markerType) {
    return{
        type:markerType,
        time:new Date().toLocaleTimeString('en-US'),
        steps: createListOfMarkers()
    }
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

function repeatHystory(histObject) {
    historyOpen=true;
    const steps = histObject.steps;
    clearScene();
    steps.forEach(x=>{
       generateMarker(x.id,x.type.toLowerCase());
    });
    checkWinner(steps);
}

function resetColorHistory() {
    document.querySelector('.history-display').childNodes.forEach(x=>{
        x.style.backgroundColor = 'black';
    })
}