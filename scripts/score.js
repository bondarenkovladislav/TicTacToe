export let userScore = 0;
export let computerScore= 0;

export function displayScore(){
    const scoreEl = document.querySelector('#score');
    scoreEl.textContent = `${userScore}:${computerScore}`;
}

export function setUserScore(value) {
    userScore = value;
}

export function setComputerScore(value) {
    computerScore = value;
}