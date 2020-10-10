export {
    getRandomInt,
    getRandomNumber,
    getRandomFromArray,
    processLoadData,
    popDuplicateFromArray,
};

function getRandomInt(min: number, max: number): number {
    const Range = max - min;
    const Rand = Math.random(); //获取[0-1）的随机数
    return min + Math.round(Rand * Range); //放大取整
}
function getRandomNumber(min: number, max: number): number {
    const Range = max - min;
    const Rand = Math.random(); //获取[0-1）的随机数
    return min + Rand * Range; //放大
}
function getRandomFromArray(list: Array<any>) {
    return list[getRandomInt(0, list.length - 1)];
}
function processLoadData(data: string | number): string | number {
    data = String(data);
    const list = data.split("/,");
    const r = getRandomInt(0, list.length - 1);
    const range = list[r].split("/_");
    const a = Number(range[0]);
    const b = Number(range[range.length - 1]);
    if (!isNaN(a) && !isNaN(b)) {
        if (range[0].indexOf(".") > -1) {
            //此时为浮点数
            return getRandomNumber(a, b);
        } else {
            //此时为整数
            return getRandomInt(a, b);
        }
    } else {
        return range[0];
    }
}
function popDuplicateFromArray(list): Array<any> {
    /*const n = {};
    const r = []; //n为hash表，r为临时数组
    for (const i in list) {
        if (!n[list[i]]) {
            //如果hash表中没有当前项
            n[list[i]] = true; //存入hash表
            r.push(list[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
    */

    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (list[i] == list[j]) {
                //第一个等同于第二个，splice方法删除第二个
                list.splice(j, 1);
                j--;
            }
        }
    }
    return list;
}
