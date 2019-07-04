let battlefield = document.querySelector('.battlefield');

let idList = [];
let objectList= null;


getCoordsOfBattlefield();

battlefield.addEventListener('click',battlefieldListener);

//Возвращает есть ли коллизия
function checkCollision(checkingId){
    const index=idList.findIndex(x=>{
        return(x===checkingId);
    });
    return (index!==-1);
}

let getIndexesOfSquare = function (x,y) {
    const xInside = x-this.x;
    const yInside = y-this.y;
    const res= {};
    if(xInside<200)
        res.ix = 0;
    else if(xInside<400)
        res.ix = 1;
    else
        res.ix = 2;

    if(yInside<200)
        res.iy = 0;
    else if(yInside<400)
        res.iy = 1;
    else res.iy = 2;
    return res;
};

function getCoordsOfBattlefield() {
    this.x = battlefield.getBoundingClientRect().left;
    this.y = battlefield.getBoundingClientRect().top;
}

function generateMarker(coords,flag) {
    idList.push(id(coords));
    const marginLeftInside = 50;
    const marginTopInside = 25;
    let marker = document.createElement('span');
    marker.className = 'marker';
    marker.style.marginTop = 200*coords.iy+ marginTopInside+'px';
    marker.style.marginLeft = 200* coords.ix+ marginLeftInside+'px';
    marker.id = id(coords);

    switch(flag){
        case 'x':{
            marker.textContent = 'X';
            marker.style.color = '#38612d';
            break;
        }
        case 'o':{
            marker.textContent = 'O';
            marker.style.color = '#224461'
            break;
        }
    }
    battlefield.appendChild(marker);
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
    let genid;
    do {
        genId = generateId();
    }
    while (checkCollision(genId));
    generateMarker(getCoordsFromId(genId),'x');
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
function getCoordsFromId(id) {
    return {ix:id.substring(0,1),iy:id.substring(1)};

}
function id(object) {
    return `${object.ix}${object.iy}`;
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
        endOfGame();
        return;
    }
    if(checkEqualsCombinations(xList)){
        endOfGame();
        return;
    }
    if(idList.length===9)
        endOfGame();
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
    console.log('win');
}

function battlefieldListener(e) {
    let indexOfSquare = getIndexesOfSquare(e.pageX,e.pageY);
    if(!checkCollision(id(indexOfSquare)))
        generateMarker(indexOfSquare,'o');
    computerStep();
    checkWinner();
}