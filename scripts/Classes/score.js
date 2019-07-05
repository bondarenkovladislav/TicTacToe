/*
    Класс реализующий функционал ведения счета.
    Счет обновляется каждый раз при завершении матча.
 */

export default class Score{
    constructor(){
        //Поле, хранящее счет игрока
        this.userScore = 0;
        //Поле, хранящее счет компьютера
        this.computerScore = 0;
        //Поле хранящие изменяемый элемент на сцене
        this.scoreEl = document.querySelector('#score');
    }

    /*
        Метод обновляет табло счета, прерисовывая его с новыми значениями 'userScore' и 'computerScore'
     */

    displayScore(){
        this.scoreEl.textContent = `${this.userScore}:${this.computerScore}`;
        //Сохраняем новое значение в кеш
        this.saveScore();
    }

    /*
        Метод позоляет устанавливать счет пользователя за пределами класса
     */

    setUserScore(value) {
        this.userScore = value;
    }

    /*
        Метод позоляет устанавливать счет компьютера за пределами класса
     */

    setComputerScore(value) {
        this.computerScore = value;
    }

    /*
        Метод восстанавливает из кеша текущий счет пользователя и компьютера
     */

    getSavedScore(){
        let score = JSON.parse(localStorage.getItem('score'));
        if(!score) {
            this.userScore = 0;
            this.computerScore = 0;
            this.saveScore();
        }
        else {
            this.userScore = score.UserScore;
            this.computerScore = score.ComputerScore;
        }
        //Обновляем табло счета
        this.displayScore();
    }

    /*
        Метод сохраняет текущий счет пользователя и компьютера в кеш
     */

    saveScore(){
        let json = JSON.stringify({'UserScore':this.userScore,'ComputerScore':this.computerScore});
        localStorage.setItem('score',json);
    }

    /*
        Метод обнуляет количество очков пользователя, компьютера и сохраняет новые значени в кеш
     */

    clearScore(){
        this.computerScore=0;
        this.userScore = 0;
        this.saveScore();
    }
}