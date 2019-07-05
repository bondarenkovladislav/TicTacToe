/*
    Модуль создает необходимые для дальнейшей работы объекты Счета и Истории
*/

import Score from "./Classes/score.js"
import History from "./Classes/history.js"

export const score = new Score();
score.getSavedScore();
export const history = new History(score);
history.displayHistory();