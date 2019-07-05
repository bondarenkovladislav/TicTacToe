export default class Score{
    constructor(){
        this.userScore = 0;
        this.computerScore = 0;
        this.scoreEl = document.querySelector('#score');
    }

    displayScore(){
        this.scoreEl.textContent = `${this.userScore}:${this.computerScore}`;
        this.saveScore();
    }

    setUserScore(value) {
        this.userScore = value;
    }

    setComputerScore(value) {
        this.computerScore = value;
    }

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
        this.displayScore();
    }
    saveScore(){
        let json = JSON.stringify({'UserScore':this.userScore,'ComputerScore':this.computerScore});
        localStorage.setItem('score',json);
    }

    clearScore(){
        this.computerScore=0;
        this.userScore = 0;
        this.saveScore();
    }
}