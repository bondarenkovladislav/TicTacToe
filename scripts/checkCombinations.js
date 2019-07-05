/*
    Модуль содержит методы для проверки наличия победителя на сцене,
    То есть есть ли на текущий момент выигрышная комбинация?
*/

import {winner} from "./functions.js";

/*
    Возвращает булево значение, есть ли на текущий момент на сцене выигрышная комбинация.
    Вызывается каждый раз при клике пользователя ('eventListeners') в функции 'checkWinner' в модуле 'functions'.
    И если возвращается 'true' то игра останавливается, пишется история, меняется счет ...
 */

export function checkEqualsCombinations(list) {
    let result;
    //Проверка наличия 3х элемнтов одной команды на побочной диагонали
    if((result = checkOffDiag(list)) !==null) {
        //Красим в красный цвет выиграшную комбинацию
        winner(result);
        return true;
    }
    //Проверка наличия 3х элемнтов одной команды на главной диагонали
    else if((result = checkMainDiag(list)) !==null) {
        winner(result);
        return true;
    }
    //Проверка наличия 3х элемнтов одной команды на одной строке или столбце
    else if((result = checkEqualsRowsCols(list)) !==null) {
        winner(result);
        return true;
    }
    return false;
}

/*
    Проверяет наличие 3х маркеров одной команды на одной строке или столбце.
    Принимает на вход список id маркеров одной команды и анализирует их расположение.
    Возвращает список 'id' выигрышной комбинации, если его находит, иначе null
 */

//Проверка в строке и столбце
function checkEqualsRowsCols(list) {
    //Необходимо пройтись по всем элентом списка.
    for(let i =0;i<list.length;i++){
        //На каждом шаге организуем два массива.
        //Один собирает элементы, у которых совпадает первая цифра 'id' со первой цифрой 'id' текущего элемента.
        //Это означает, что все элементы в этом списке находятся в одной строке
        let equalRowIds=[list[i].id];
        //Второй массив по аналогии собирает элементы с совпадающей второй цифрой 'id'.
        //Это означает, что все элементы в этом списке находятся в одном столбце
        let equalColumnIds =[list[i].id];

        for(let j = 0;j<list.length;j++){
            if(i===j)
                continue;
            //Если совпали первые или вторые цифры, то кладем в соответвующий массив 'id'
            if(list[i].id.substring(0,1) === list[j].id.substring(0,1)) equalRowIds.push(list[j].id);
            if(list[i].id.substring(1) === list[j].id.substring(1)) equalColumnIds.push(list[j].id);
        }
        //Проверяем достаточно ли совпаших элементов для выиграшной комбинации из 3х элементов
        if(equalRowIds.length===3) return equalRowIds;
        if(equalColumnIds.length===3) return equalColumnIds;
    }
    //если не набралось ни одной комбинации возвращаем null
    return null;
}

/*
    Принимает на вход список id маркеров одной команды и анализирует их расположение на главной диагонали.
    Если находится 3 элемента одной команды на главной диагонали, то
    Возвращает список 'id' выигрышной комбинации, иначе null.
 */

function checkMainDiag(list) {
    let upper = list.filter(x=>{
        return x.id ==='00'
    });
    let middle= list.filter(x=>{
        return x.id ==='11'
    });
    let down= list.filter(x=>{
        return x.id ==='22'
    });

    if(  (upper.length !==0) && (middle.length !==0) && (down.length!==0))
        return ['00','11','22'];
    return null;
}

/*
    Принимает на вход список id маркеров одной команды и анализирует их расположение на побочной диагонали.
    Если находится 3 элемента одной команды на побочной диагонали, то
    Возвращает список 'id' выигрышной комбинации, иначе null.
 */

function checkOffDiag(list) {
    let upper = list.filter(x=>{
        return x.id ==='02'
    });
    let middle= list.filter(x=>{
        return x.id ==='11'
    });
    let down= list.filter(x=>{
        return x.id ==='20'
    });

    if(  (upper.length !==0) && (middle.length !==0) && (down.length!==0))
        return ['02','11','20'];
    return null;
}