import {winner} from "./functions.js";

export function checkEqualsCombinations(list) {
    let result;
    if((result = checkOffDiag(list)) !==null) {
        winner(result);
        return true;
    }
    else if((result = checkMainDiag(list)) !==null) {
        winner(result);
        return true;
    }
    else if((result = checkEqualsRowsCols(list)) !==null) {
        winner(result);
        return true;
    }
    return false;
}
//Проверка в строке и столбце
function checkEqualsRowsCols(list) {
    for(let i =0;i<list.length;i++){
        let equalRowIds=[list[i].id];
        let equalColumnIds =[list[i].id];
        for(let j = 0;j<list.length;j++){
            if(i===j)
                continue;
            if(list[i].id.substring(0,1) === list[j].id.substring(0,1)) equalRowIds.push(list[j].id);
            if(list[i].id.substring(1) === list[j].id.substring(1)) equalColumnIds.push(list[j].id);
        }
        if(equalRowIds.length===3) return equalRowIds;
        if(equalColumnIds.length===3) return equalColumnIds;
    }
    return null;
}


//Проверка на гравной диагонали
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
//Проверка на побочной диагонали
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