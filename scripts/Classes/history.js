import {createListOfMarkers,clearScene,generateMarker,checkWinner} from "../functions.js";

export default class History{
    constructor(score){
        this.score = score;
        this.historyOpen = false;
    }

    historyLog(winner){
        if(this.historyOpen)
            return;
        let history = History.getHistory();
        if(!history)
            history = [];
        switch (winner){
            case 'x':{
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
        this.displayHistory();
    }

    displayHistory() {
        let history = History.getHistory();
        if(history===null){
            this.clearHistory();
            history = History.getHistory();
        }
        let histDisplayItem = document.querySelector('.history-display');
        histDisplayItem.innerHTML = '';

        history.forEach(el=>{
            let hItem =document.createElement('div');
            hItem.textContent = `Winner: ${el.type}. Time: ${el.time}`;

            hItem.addEventListener('click',x=>{
                History.resetColorHistory();
                this.repeatHistory(el);
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
    static getHistory() {
        let item = localStorage.getItem('history');
        return JSON.parse(item);
    }
    static createHistoryElement(markerType) {
        return{
            type:markerType,
            time:new Date().toLocaleTimeString('en-US'),
            steps: createListOfMarkers()
        }
    }
    clearHistory() {
        this.score.setComputerScore(0);
        this.score.setUserScore(0);
        this.score.displayScore();
        let history = [];
        localStorage.setItem('history', JSON.stringify(history));
        this.displayHistory();
    }

    repeatHistory(histObject) {
        this.historyOpen=true;
        const steps = histObject.steps;
        clearScene(document.querySelector('.battlefield'));
        steps.forEach(x=>{
            generateMarker(x.id,x.type.toLowerCase());
        });
        checkWinner(steps);
    }

    static resetColorHistory() {
        document.querySelector('.history-display').childNodes.forEach(x=>{
            x.style.backgroundColor = 'black';
        })
    }

    setHistoryOpen(value) {
        this.historyOpen = value;
    }
}