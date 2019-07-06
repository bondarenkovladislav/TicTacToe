/*
    Файл 'score.js' реальзует паттерн модуля,
    Который эффективно использует мощь замыканий.

    Для реализации модуля необходимо:
    1) Вызов обертки определения фнукции ('Score').
    2) Возвращение значения в качетсве API для этого модуля ('publicAPI').

    Модуль реализует функционал ведения счета.
    Счет обновляется каждый раз при завершении матча.

    Функция 'Score' закрывает поля для видимости вне функции,
    Делая их приватными.

    Возврашает "publicAPI" объект с методами,
    Замкнутыми на приватную область видимости функции 'Score',
    В т.ч на поля 'userScore' и 'computerScore'
 */

export default function Score() {
    let userScore=0;
    let computerScore=0;
    let scoreEl = document.querySelector('#score');

    /*
        Метод обновляет табло счета, прерисовывая его с новыми значениями 'userScore' и 'computerScore'
     */

    function displayScore(){
        scoreEl.textContent = `${userScore}:${computerScore}`;
        //Сохраняем новое значение в кеш
        saveScore();
    }

    /*
        Метод сохраняет текущий счет пользователя и компьютера в кеш
     */

    function saveScore(){
        let json = JSON.stringify({'UserScore':userScore,'ComputerScore':computerScore});
        localStorage.setItem('score',json);
    }

    /*
        Метод позоляет устанавливать счет пользователя за пределами класса
     */

    function setUserScore(value) {
        userScore = value;
    }

    /*
        Метод позоляет устанавливать счет компьютера за пределами класса
     */

    function setComputerScore(value) {
        computerScore = value;
    }

    /*
        Метод восстанавливает из кеша текущий счет пользователя и компьютера
     */

    function getSavedScore(){
        let score = JSON.parse(localStorage.getItem('score'));
        if(!score) {
            userScore = 0;
            computerScore = 0;
            saveScore();
        }
        else {
            userScore = score.UserScore;
            computerScore = score.ComputerScore;
        }
        //Обновляем табло счета
        displayScore();
    }

    /*
        Метод обнуляет количество очков пользователя, компьютера и сохраняет новые значени в кеш
     */

    function clearScore(){
        computerScore=0;
        userScore = 0;
        saveScore();
    }

    /*
        Метод доступа к приватному полю 'userScore'
     */

    function getUserScore() {
        return userScore;
    }

    /*
        Метод доступа к приватному полю 'computerScore'
     */

    function getComputerScore() {
        return computerScore;
    }

    /*
        Создает 'publicAPI' объект для доступа к необходимым методам модуля.
        Этот объект будет возварщен функцией 'Score'.
     */

    let publicAPI = {
        displayScore,
            saveScore,
            setUserScore,
            setComputerScore,
            getSavedScore,
            getUserScore,
            getComputerScore
    };

    return publicAPI;
}
// }