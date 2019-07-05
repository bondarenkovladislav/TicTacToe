/*
    Модуль отвечает за 'Предсказывание' лучшего хода.
    Это может быть выигрышный ход для компьютера,
    Либо ход, предотвращающий победу пользоваетеля.
    Работает на основе высчитывания недостающего для выигрыша элемента.
*/

import {createListOfMarkers, generateMarker,checkCollision} from "./functions.js";

/*
    Метод принимает на вход массив 'id' одной из команд.
    Возвращает булево значение, удалось ли найти недостающий 3ий элемент в строке.
    Если удалось, вставляет его.
 */

function predictBestInRow(list){
    //Достаем индекс строки из id
    let rowIndex = list[0].substring(0,1);
    //Предполагаемые id для вставки элемента (добавляем к индексу строки индекс столбца)
    let predictIds= [`${rowIndex}0`,`${rowIndex}1`,`${rowIndex}2`];
    //Удаляем 'id' из предполагаемых позиций, если
    //Совпали 'id' элемента из принятого списка и элемента из списка предполагаемых позиций
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    //Оставший уникальный элемент в списке предполагаемых позиций и будет верным предсказанием
    if(!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

/*
    Метод принимает на вход массив 'id' одной из команд.
    Возвращает булево значение, удалось ли найти недостающий 3ий элемент в столбце.
    Если удалось, вставляет его.
 */

function predictBestInColumn(list) {
    //Достаем индекс столбца из id
    let columnIndex = list[0].substring(1);
    //Предполагаемые id для вставки элемента (вставляем перед индексом столбца индекс строки)
    let predictIds= [`0${columnIndex}`,`1${columnIndex}`,`2${columnIndex}`];
    //Удаляем 'id' из предполагаемых позиций, если
    //Совпали 'id' элемента из принятого списка и элемента из списка предполагаемых позиций
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    //Оставший уникальный элемент в списке предполагаемых позиций и будет верным предсказанием
    if(!checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

/*
    Метод принимает на вход массив 'id' одной из команд.
    Возвращает булево значение, удалось ли найти недостающий 3ий элемент на Главной диагонали.
    Если удалось, вставляет его.
 */

function predictBestInMainDiagonal(list) {
    //Предполагаемые id для вставки элемента на главной диагонали (их можно просто пребрать)
    let predictIds = [`00`,`11`,`22`];
    //Удаляем 'id' из предполагаемых позиций, если
    //Совпали 'id' элемента из принятого списка и элемента из списка предполагаемых позиций
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    //Оставший уникальный элемент в списке предполагаемых позиций и будет верным предсказанием
    if(predictIds.length===1 && !checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

/*
    Метод принимает на вход массив 'id' одной из команд.
    Возвращает булево значение, удалось ли найти недостающий 3ий элемент на Побочной диагонали.
    Если удалось, вставляет его.
 */

function predictBestInOffDiagonal(list){
    //Предполагаемые id для вставки элемента на побочной диагонали (их можно просто пребрать)
    let predictIds = [`02`,`11`,`20`];
    //Удаляем 'id' из предполагаемых позиций, если
    //Совпали 'id' элемента из принятого списка и элемента из списка предполагаемых позиций
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    //Оставший уникальный элемент в списке предполагаемых позиций и будет верным предсказанием
    if(predictIds.length===1 &&!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

/*
    Функция создает списки 'id' и для каждого класса предсказывает наилучшие ходы
    для выигрыша.
    Возвращает булево значение удалось ли предсказать выгодный ход.
    Если удалось, то сразу всталяется маркер на нужное место.
    Если не удалось, то в функции 'computerStep' ход будет сделан случайно.
 */

export function tryPredictBestStep() {
    //Формируем список всех маркеров на сцене
    let markerList = createListOfMarkers();
    //разделяем полученный список на команды 'X' и 'O'
    let xList = markerList.filter(x=>{
        return x.type === 'X';
    });
    let oList = markerList.filter(x=>{
        return x.type === 'O';
    });

    //Заводим 4 массива для хранения предсказынных варинтов(id) для каждой команды
    //По строкам и столбцам
    let xRowPredictVariants = [];
    let xCellPredictVariants = [];
    let oRowPredictVariants = [];
    let oCellPredictVariants = [];

    //Собираем в соответсвующие списки пары элементов, которым не хватает 3его для победы
    //Для обоих команд
    findPairs(xList,xRowPredictVariants,xCellPredictVariants);
    findPairs(oList,oRowPredictVariants,oCellPredictVariants);

    //Пытаемся предсказать для полученных списков пар наилучший вариант...

    //В строке для комнады 'X'
    for(let i=0;i<xRowPredictVariants.length;i++){
        if(predictBestInRow(xRowPredictVariants[i]))
            return true;
    }
    //В столбце для команды 'X'
    for(let i=0;i<xCellPredictVariants.length;i++){
        if(predictBestInColumn(xCellPredictVariants[i]))
            return true;
    }
    //На диагоналях для команды 'X'
    if(tryPredictForDiagonals(xList))
        return true;

    //В строке для комнады 'O'
    for(let i=0;i<oRowPredictVariants.length;i++){
        if(predictBestInRow(oRowPredictVariants[i]))
            return true;
    }
    //В столбце для команды 'O'
    for(let i=0;i<oCellPredictVariants.length;i++){
        if(predictBestInColumn(oCellPredictVariants[i]))
            return true;
    }

    //На диагоналях для команды 'O'
    if(tryPredictForDiagonals(oList))
        return true;

    return false;
}

/*
    Функция принимает на вход список просматриваемых 'id' одной из команд.
    Находит пары, которым недостает третьего элемента для выигрыша в строке или столбцу
    Собирает результаты нахождения в строке в массив 'resultListRowId'
    В столбце в массив 'resultListColumnId'
 */

function findPairs(idList,resultListRowId,resultListCellId) {
    for(let i =0;i<idList.length;i++){
        //На каждом шаге организуем два массива.
        //Один собирает элементы, у которых совпадает первая цифра 'id' со первой цифрой 'id' текущего элемента.
        //Это означает, что все элементы в этом списке находятся в одной строке
        let equalRowIds=[idList[i].id];
        //Второй массив по аналогии собирает элементы с совпадающей второй цифрой 'id'.
        //Это означает, что все элементы в этом списке находятся в одном столбце
        let equalColumnIds =[idList[i].id];
        for(let j = 0;j<idList.length;j++){
            if(i===j)
                continue;
            if (idList[i].id.substring(0, 1) === idList[j].id.substring(0, 1)) equalRowIds.push(idList[j].id);
            if (idList[i].id.substring(1) === idList[j].id.substring(1)) equalColumnIds.push(idList[j].id);
        }
        //Проверяем достаточно ли совпаших элементов для образования пары.
        //Если достаточно, кладем элементы в соответсвующий массив ('resultListRowID' или 'resultListCellId')
        if(equalRowIds.length===2) resultListRowId.push(equalRowIds);
        if(equalColumnIds.length===2) resultListCellId.push(equalColumnIds);
    }
}

/*
    Функция пытается предсказать лучший ход для элементов на диагонали.
    Принимает на вход массив 'id ' одной из команд.
    Возвращает булево значение удалось ли найти лучший ход и вставить туда элемент.
 */

function tryPredictForDiagonals(idList) {
    //Нахождение элементов, лежащих на главной диагонали
    let diagIds = idList.filter(x=>{
        return x.id.substring(0,1) === x.id.substring(1);
    });
    //Предсказывание позиции недостающего элемента на главной диагонали
    if(predictBestInMainDiagonal(diagIds))
        return true;
    //Нахождение элементов, лежащих на побочной диагонали
    let offdiagIds = idList.filter(x=>{
        return x.id ==='02' || x.id ==='20' || x.id === '11'
    });
    //Предсказывание позиции недостающего элемента на побочной диагонали
    if(predictBestInOffDiagonal(offdiagIds))
        return true;
    return false;
}