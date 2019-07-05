import {displayHistory} from "./history.js";
import Score from "./score.js"

export const score = new Score();
score.getSavedScore();
displayHistory();