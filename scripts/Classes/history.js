/*
    Класс отвечвет за ведение истории побед
    При нажатии на строку истории в списке на поле вопроизводится ситуация, в который и был завершен матч
 */

import {createListOfMarkers,clearScene,generateMarker,checkWinner} from "../functions.js";

export default class History{
    //Конструктор принимает на вход объект класса 'Score' для его обнуления при сбросе истории
    constructor(score){
        this.score = score;
        //Показывает просматривает ли на текущий момент пользователь историю
        //(Кликнул ли он на строку)
        this.historyOpen = false;
    }

    /*
        Метод принимает на вход маркер команды победителя 'winner'
        От него зависит строка, которая будет записана в историю.
        Записывает строку истории в localStore каждый раз по окончанию матча.
     */

    historyLog(winner){
        if(this.historyOpen)
            return;
        //Восстанавливаем текущую историю из кеша
        let history = History.getHistory();
        if(!history)
            history = [];
        switch (winner){
            case 'x':{
                //Кладем в массив созданный объект, хранящий команду, время и историю ходов
                history.push(History.createHistoryElement('X'));
                localStorage.setItem('history',JSON.stringify(history));
                break;
            }
            case 'o':{
                history.push(History.createHistoryElement('O'));
                localStorage.setItem('history',JSON.stringify(history));
                break;
            }
            case '-':{
                history.push(History.createHistoryElement('Draw'));
                localStorage.setItem('history',JSON.stringify(history));
                break;
            }
        }
        //Обновляем дисплей, отображающий строки истории
        this.displayHistory();
    }

    /*
        Метод обновляет список истории, показываемый пользователю
     */

    displayHistory() {
        //Загружаем уже имеющуюся историю из кеша
        let history = History.getHistory();
        if(history===null){
            this.clearHistory();
            history = History.getHistory();
        }
        //Удаляем текущие строки в дисплее, чтобы не повторять их второй раз
        let histDisplayItem = document.querySelector('.history-display');
        histDisplayItem.innerHTML = '';

        //Формируем строку истории и добавляем ее в элемент '.history-display'
        history.forEach(el=>{
            let hItem =document.createElement('div');
            hItem.textContent = `Winner: ${el.type}. Time: ${el.time}`;

            //При клике на строку истории восстанавливаем маркеры на сцене, согласно истории
            hItem.addEventListener('click',x=>{
                this.repeatHistory(el);
            });

            //Настраиваем события наведения мыши
            hItem.onmouseover = function()
            {
                this.style.backgroundColor = "orange";
            };
            hItem.onmouseleave = function(){
                this.style.backgroundColor = 'black';
            };

            hItem.className = 'hItem';
            //Добавление анимации
            hItem.setAttribute('data-aos','zoom-in-up');
            //Добавляем созданный элемент в начало списка '.history-display'
            histDisplayItem.prepend(hItem);
        });
    }

    /*
        Возвращает массив записей истории из кеша.
     */

    static getHistory() {
        let item = localStorage.getItem('history');
        return JSON.parse(item);
    }

    /*
        Создает и возвращает объект истории, хранящий тип выигравшей команды, время события
        И расположение маркеров.
    */

    static createHistoryElement(markerType) {
        return{
            type:markerType,
            time:new Date().toLocaleTimeString('en-US'),
            steps: createListOfMarkers()
        }
    }

    /*
        Метод удаляет историю из кеша и обнуляет счет.
        Вызывается при нажатии на кнопку 'ClearHistory'
     */

    clearHistory() {
        this.score.setComputerScore(0);
        this.score.setUserScore(0);
        this.score.displayScore();
        let history = [];
        localStorage.setItem('history', JSON.stringify(history));
        //Обновляем дисплей истории
        this.displayHistory();
    }

    /*
        Принимает на вход объект истории из команды, времени и шагов.
        Метод вопроизводит расположение маркеров при нажатии на строку истории.
     */

    repeatHistory(histObject) {
        //Запоминаем, что пользователь просматривает историю, чтобы в лишний раз не изменить счет.
        this.historyOpen=true;
        const steps = histObject.steps;
        clearScene(document.querySelector('.battlefield'));
        steps.forEach(x=>{
            generateMarker(x.id,x.type.toLowerCase());
        });
        //Окрашиваем выигравшую комбинацию в красный цвет.
        checkWinner(steps);
    }

    /*
        Метод позволяет изменять значение поля historyOpen за пределами красса
     */

    setHistoryOpen(value) {
        this.historyOpen = value;
    }
}