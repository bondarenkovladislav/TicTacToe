import Score from "./Classes/score.js"
import History from "./Classes/history.js"

export const score = new Score();
score.getSavedScore();
export const history = new History(score);
history.displayHistory();