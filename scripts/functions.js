/*
    В этом модуле отдельно вынесены функции, которое требуются в ходе
    Выполнения программы.
 */

import {checkEqualsCombinations} from "./checkCombinations.js";
import {tryPredictBestStep} from "./predictComputerStep.js";
import {battlefieldListener} from "./eventListeners.js";
import {score,history} from "./initialise.js";

/*
    Возвращает массив объектов с полями 'id' и 'type' имеющихся на сцене маркеров.
    Требуется для предотвращения колизий при размещении новых маркеров на сцене,
    При проверке победителя и предсказания правильного хода
 */

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

/*
    Удаляет со сцены все имеющиеся маркеры.
    Используется при начале новой игры.
    Также по окончании просмотра истории.
 */

export function clearScene(battlefield) {
    Array.from(battlefield.rows).forEach(x=>{
        Array.from(x.cells).forEach(y=>{
            y.innerHTML = '';
        });
    })
}

/*
    Генерирует новый маркер на сцене с 'id' и командой 'flag'
    Id соответвует индексам строки(первый символ id) и столбца(второй символ id)
    В которых элемнт находится на сцене.
    Flag (X или O) показывет какой из команд соответствует создаваемый маркер
 */

export function generateMarker(id,flag) {
    let marker = document.createElement('div');
    marker.className = 'marker';
    let td = getTd(id.substring(0,1),id.substring(1));
    marker.id = id;
    //Добавление атрибута для анимации
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

/*
    Возвращает по индексу строки 'row' и столбца 'cell'
    Элемент таблицы на сцене, в который в последствии будет помещен маркер.
 */

function getTd(row,cell) {
    return document.querySelector('.battlefield').rows[row].cells[cell];
}

/*
    Возвращает булево значение есть ли при текущем положении маркеров на сцене победитель.
 */

export function checkWinner(objectList) {
    // При количестве маркеров <5 не может быть победителей из-за малого их количества
    if(objectList.length<5)
        return;
    //Выделяем массив с метками комманды 'X' для анализа, выиграла ли команда 'X'
    let xList = objectList.filter(x=>{
        return x.type === 'X';
    });
    //Аналогично с командой 'O'
    let oList = objectList.filter(x=>{
        return x.type === 'O';
    });
    //Проверяем есть ли на сцене выигрышные комбинации маркеров комманды 'O'
    if(checkEqualsCombinations(oList)) {
        //Необходимо изменить счет игры в пользу команды 'O',
        //Если только пользователь не просматривает историю.
        //(При клике на строку истории воспроизводится положение маркеров на сцене)
        if(!history.historyOpen)
            score.setUserScore(score.userScore+1);
        //Отображаем новый счет игры
        score.displayScore(score.userScore,score.computerScore);
        //Добавляем значение в историю игр
        history.historyLog('o');
        endOfGame();
        return true;
    }
    if(checkEqualsCombinations(xList)){
        //Аналогично для команды 'X'
        if(!history.historyOpen)
            score.setComputerScore(score.computerScore+1);
        score.displayScore(score.userScore,score.computerScore);
        history.historyLog('x');
        endOfGame();
        return true;
    }
    //Проверяем результат матча на нечью
    if(createListOfMarkers().length===9) {
        history.historyLog('-');
        endOfGame();
        return true;
    }
    return false;
}

/*
    По завершении матча необходимо запретить пользователю
    нажимать на свободные клетки поля
 */

function endOfGame() {
    let battlefield = document.querySelector('.battlefield');
    Array.from(battlefield.rows).forEach(x=>{
        Array.from(x.cells).forEach(y=>{
            y.removeEventListener('click', battlefieldListener)
        })
    })
}

/*
    Принимает на вход массив из 3х id 'markersIds' выигрышной комбинации,
    и выделяет маркеры с такими id красным цветом.
    Вызывается при нахождении выигрышной комбинации в модуле
    'checkCombinations'
*/

export function winner(markersIds) {
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
}

/*
    Возвращет булево значение есть ли предполагемый для генерации маркер
    с  id = 'checkingId' на сцене.
    Напомню, что первый символ id отвечает за строку расположения маркера,
    А второй за столбец.
 */

export function checkCollision(checkingId){
    const index=createListOfMarkers().findIndex(x=>{
        return(x.id===checkingId);
    });
    return (index!==-1);
}

/*
    Вызывается после хода игрока.
    Генерирует маркер по пустому месту на сцене
 */

export function computerStep() {
    //Если удалось предсказать выигрышную или предотвращающую выигрыш соперника комбинацию
    //То маркер ставиться в указанное место в модуле 'predictComputerStep'
    if(tryPredictBestStep())
        return;
    //Иначе генерируется новый свободный id(место), в которое будет помещен элемент
    let genId;
    do {
        genId = generateId();
    }
    while (checkCollision(genId));
    //Вставляем маркер на найденную позицию
    generateMarker(genId, 'x');
}

/*
    Возвращает случайное число на отрезке [min,max]
 */

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

/*
    Генерирует случайное id для последующей вставки элемента на сцену по полученному значению
 */

function generateId() {
    return `${randomInteger(0,2)}${randomInteger(0,2)}`;
}