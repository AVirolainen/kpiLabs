
function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

const table = {}

const minCoef = 1
const maxCoef = 20

const coefs = {
    a0 : Math.round(getRandomInt(minCoef, maxCoef)),
    a1 : Math.round(getRandomInt(minCoef, maxCoef)),
    a2 : Math.round(getRandomInt(minCoef, maxCoef)),
    a3 : Math.round(getRandomInt(minCoef, maxCoef))
}

let keys = Object.keys(coefs);
let max = coefs[keys[0]];
let maxKey = keys[0]

for (let i = 0; i < keys.length; i++) {
    let value = coefs[keys[i]];
    if (value > max){
        max = value;
        maxKey = keys[i]
    }
}
console.log(`Максимальне значення ${maxKey} = ${max}`)

const values = {
    x1 : [],
    x2 : [],
    x3 : [],
}

const valuesY = []

for (let i = 0; i<8; i++){
    const line = {}
    for (let j = 0; j<3; j++){
        const factor = Math.round(getRandomInt(1, 20))
        line["X"+(j+1)] = factor
        switch (j){
            case 0:
                values.x1.push(factor)
                break
            case 1:
                values.x2.push(factor)
                break
            case 2:
                values.x3.push(factor)
                break
        }
    }
    line["Y"] = coefs.a0 + (coefs.a1*line.X1) + (coefs.a2*line.X2) + (coefs.a3*line.X3)
    valuesY.push(coefs.a0 + (coefs.a1*line.X1) + (coefs.a2*line.X2) + (coefs.a3*line.X3))
    table[i+1] = line
}

const nullFactor = {
    X0 : {},
    dx : {}
}

for (let i =0; i<3; i++) {
    let maxElem = getMaxOfArray(Object.values(values)[i])
    let minElem = getMinOfArray(Object.values(values)[i])

    nullFactor.X0["X"+(i+1)] = (maxElem+minElem)/2
    nullFactor.dx["X"+(i+1)] = ((maxElem+minElem)/2)-minElem
}

const table2 = {}
for (let i = 0; i<8; i++){
    const line = {}
    for (let j = 0; j<3; j++){
        line["Xn"+(j+1)] = parseFloat(((Object.values(values)[j][i]-Object.values(nullFactor.X0)[j])/Object.values(nullFactor.dx)[j]).toFixed(2))
        Object.values(table)[i]["Xn"+(j+1)] = parseFloat(((Object.values(values)[j][i]-Object.values(nullFactor.X0)[j])/Object.values(nullFactor.dx)[j]).toFixed(2))
    }
    table2[i+1] = line
}
console.table(coefs)
console.table(table)
console.table(nullFactor)

console.log("Yэт: "+(coefs.a0 + (coefs.a1*nullFactor.X0.X1) + (coefs.a2*nullFactor.X0.X2) + (coefs.a3*nullFactor.X0.X3)))
console.log("Y(max): "+getMaxOfArray(valuesY))
