import {createListOfMarkers, generateMarker,checkCollision} from "./functions.js";

function predictBestInRow(list){
    let rowIndex = list[0].substring(0,1);
    let predictIds= [`${rowIndex}0`,`${rowIndex}1`,`${rowIndex}2`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

function predictBestInColumn(list) {
    let columnIndex = list[0].substring(1);
    let predictIds= [`0${columnIndex}`,`1${columnIndex}`,`2${columnIndex}`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(!checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

function predictBestInMainDiagonal(list) {
    let predictIds = [`00`,`11`,`22`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(predictIds.length===1 && !checkCollision(predictIds[0])) {
        generateMarker(predictIds[0], 'x');
        return true;
    }
    return false;
}

function predictBestInOffDiagonal(list){
    let predictIds = [`02`,`11`,`20`];
    list.forEach((x)=>{
        let index = predictIds.findIndex(y=>{
            return y ===x.id;
        });
        if(index!==-1)
            predictIds.splice(index,1);
    });
    if(predictIds.length===1 &&!checkCollision(predictIds[0])){
        generateMarker(predictIds[0],'x');
        return true;
    }
    return false;
}

export function tryPredictBestStep() {
    let markerList = createListOfMarkers();
    let xList = markerList.filter(x=>{
        return x.type === 'X';
    });
    let oList = markerList.filter(x=>{
        return x.type === 'O';
    });
    let xRowPredictVariants = [];
    let xCellPredictVariants = [];
    let oRowPredictVariants = [];
    let oCellPredictVariants = [];

    for(let i =0;i<xList.length;i++){
        let equalRowIds=[xList[i].id];
        let equalColumnIds =[xList[i].id];
        for(let j = 0;j<xList.length;j++){
            if(i===j)
                continue;
            if(xList[i].id.substring(0,1) ===xList[j].id.substring(0,1)) equalRowIds.push(xList[j].id);
            if(xList[i].id.substring(1) === xList[j].id.substring(1)) equalColumnIds.push(xList[j].id);
        }
        if(equalRowIds.length===2) xRowPredictVariants.push(equalRowIds);
        if(equalColumnIds.length===2) xCellPredictVariants.push(equalColumnIds);
    }

    for(let i =0;i<oList.length;i++){
        let equalRowIds=[oList[i].id];
        let equalColumnIds =[oList[i].id];
        for(let j = 0;j<oList.length;j++){
            if(i===j)
                continue;
            if(oList[i].id.substring(0,1) ===oList[j].id.substring(0,1)) equalRowIds.push(oList[j].id);
            if(oList[i].id.substring(1) === oList[j].id.substring(1)) equalColumnIds.push(oList[j].id);
        }
        if(equalRowIds.length===2) oRowPredictVariants.push(equalRowIds);
        if(equalColumnIds.length===2) oCellPredictVariants.push(equalColumnIds);
    }

    for(let i=0;i<xRowPredictVariants.length;i++){
        if(predictBestInRow(xRowPredictVariants[i]))
            return true;
    }
    for(let i=0;i<xCellPredictVariants.length;i++){
        if(predictBestInColumn(xCellPredictVariants[i]))
            return true;
    }

    for(let i=0;i<oRowPredictVariants.length;i++){
        if(predictBestInRow(oRowPredictVariants[i]))
            return true;
    }
    for(let i=0;i<oCellPredictVariants.length;i++){
        if(predictBestInColumn(oCellPredictVariants[i]))
            return true;
    }

    let diagIds = xList.filter(x=>{
        return x.id.substring(0,1) === x.id.substring(1);
    });
    if(predictBestInMainDiagonal(diagIds))
        return true;
    let offdiagIds = xList.filter(x=>{
        return x.id ==='02' || x.id ==='20' || x.id === '11'
    });
    if(predictBestInOffDiagonal(offdiagIds))
        return true;

    diagIds = oList.filter(x=>{
        return x.id.substring(0,1) === x.id.substring(1);
    });
    if(predictBestInMainDiagonal(diagIds))
        return true;
    offdiagIds = oList.filter(x=>{
        return x.id ==='02' || x.id ==='20' || x.id === '11'
    });
    if(predictBestInOffDiagonal(offdiagIds))
        return true;
    return false;
}