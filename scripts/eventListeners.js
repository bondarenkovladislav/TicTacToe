/*
    Модуль содержащий в себе все обработчики событий.
 */

import {clearScene, computerStep,checkCollision,generateMarker,checkWinner,createListOfMarkers} from "./functions.js";
import {score,history} from "./initialise.js";
import History from "./Classes/history.js"

//Для смены очередности хода при начале игры используется переменная 'FirstStep'
//'true', когда пользователь ходит первым
let firstStep = true;

//Для сокращения кода сохраним значение селектора
let battlefield = document.querySelector('.battlefield');

//Обработчик события сброса маркеров на поле при нажатии на кнопку 'ResetField' на сцене
document.querySelector('#reset').addEventListener('click',resetField);

//Обработчик при нажатии пользователя мышью внутри поля с клетками
// battlefield.addEventListener('click',battlefieldListener);
addBattlefieldListeners();

//При нажатии на 'ClearHistory'
//Очищается история
document.querySelector('#clear-history').addEventListener('click',x=>{
    history.clearHistory();
});
//Сбрасывается счет матча
document.querySelector('#clear-history').addEventListener('click',x=>{
    score.clearScore();
});
//Удаляются все маркеры на поле
document.querySelector('#clear-history').addEventListener('click',resetField);

/*
    Удаляет маркеры на сцене, определяет очередность хода игроков
 */

function resetField() {
    history.setHistoryOpen(false);
    clearScene(battlefield);
    //Необходимо восстановить обработчик клика на поле после вызова метода 'endOfGame' из 'functions.js',
    //Отключающего его
    addBattlefieldListeners();
    firstStep = !firstStep;
    if(!firstStep)
        computerStep();
}

/*
    При нажатии на клетку генерирует маркер игрока,
    А следом и маркер компьютера.
    Проверяет, не нажато ли на уже существующий маркер,
    А также нет ли при текущем раскладе маркеров выигрышных комбинаций.
 */

export function battlefieldListener(e) {
    //Получаем id элемента, на который был сделан клик
    const id = `${rowIndex(e.target)}${cellIndex(e.target)}`;
    if(!checkCollision(id)) {
        generateMarker(id, 'o');
        if(!checkWinner(createListOfMarkers())){
            computerStep();
            checkWinner(createListOfMarkers());
        }
    }
}

/*
    Возвращает индекс строки на поле, в котором находится 'element'
 */

function rowIndex(element) {
    return element.closest('tr').rowIndex;
}

/*
    Возвращает индекс столбца на поле, в котором находится 'element'
 */

function cellIndex(element) {
    return element.closest('td').cellIndex
}

/*
    Функция добавляет всем клеткам таблицы обработчик события 'click'
 */

function addBattlefieldListeners() {
    Array.from(battlefield.rows).forEach(x=>{
        Array.from(x.cells).forEach(y=>{
            y.addEventListener('click', battlefieldListener)
        })
    })
}