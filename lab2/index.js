const { matrix, det } = require('mathjs')



function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

const x1Min = -30
const x1Max = 0
const x2Min = 15
const x2Max = 50

const m = 8

const yMax = (30-24)*10
const yMin = (20-24)*10

var y1avarage = 0
var y2avarage = 0
var y3avarage = 0

var dispertion1 = 0
var dispertion1 = 0
var dispertion1 = 0



const table_planning = {
    "1": {X1:-1, X2:-1},
    "2": {X1:+1, X2:-1},
    "3": {X1:-1, X2:+1},

}

const exp = () =>{
    for (let i = 0; i<3; i++){
        for (let j = 0; j<m; j++){
            const factor = Math.round(getRandomInt(yMin, yMax))
            Object.values(table_planning)[i]["Y"+(j+1)] = factor
        }
    }

    console.table(table_planning)

    for (let i = 0; i<3; i++){
        const temp = Object.values(Object.values(table_planning)[i]).slice(2)
        switch(i){
            case 0:
                y1avarage = (temp.reduce((a, b) => a + b, 0))/m
                dispertion1 = (temp.reduce((a, b) => a + ((b-y1avarage)**2), 0))/m
                break
            case 1:
                y2avarage = (temp.reduce((a, b) => a + b, 0))/m
                dispertion2 = (temp.reduce((a, b) => a + ((b-y2avarage)**2), 0))/m
                break
            case 2:
                y3avarage = (temp.reduce((a, b) => a + b, 0))/m
                dispertion3 = (temp.reduce((a, b) => a + ((b-y3avarage)**2), 0))/m
                break

        }
    }
    const deviation = ((2*((2*m)-2))/(m*(m-4)))**(1/2)

    const Fuv1 = dispertion1/dispertion2
    const Fuv2 = dispertion3/dispertion1
    const Fuv3 = dispertion3/dispertion2

    const Ouv1 = ((m-2)/m)*Fuv1
    const Ouv2 = ((m-2)/m)*Fuv2
    const Ouv3 = ((m-2)/m)*Fuv3

    const Ruv1 = (Math.abs(Ouv1-1)/deviation).toFixed(3)
    const Ruv2 = (Math.abs(Ouv2-1)/deviation).toFixed(3)
    const Ruv3 = (Math.abs(Ouv3-1)/deviation).toFixed(3)

    const criteriaTable  = {
        "0.99": {"2":1.73, "6":2.16, "8":2.43, "10":2.62 , "12":2.75, "15":2.9},
        "0.98": {"2":1.72, "6":2.13, "8":2.37, "10":2.54 , "12":2.66, "15":2.8},
        "0.95": {"2":1.71, "6":2.10, "8":2.27, "10":2.41 , "12":2.52, "15":2.64},
        "0.90": {"2":1.69, "6":2, "8":2.17, "10":2.49 , "12":2.39, "15":2.49},

    }

    var Rcr = 0 
    for (let i = 3; i>=0; i--){
        let temp = Object.values(criteriaTable)[i][m]
        if (Ruv1<temp && Ruv2<temp && Ruv3<temp){
            Rcr = temp
            console.log(`Дисперсія однорідна, оскільки ${Ruv1}, ${Ruv2}, ${Ruv3} < ${temp}`)
            break
        }
    }
    return Rcr
}

while(true){
    flag = exp()
    if (flag == 0){
        exp()
    }
    else{
        var mx1 = 0;
        var mx2 = 0;
        var my = (y1avarage+y2avarage+y3avarage)/3
        var a1 = 0;
        var a2 = 0
        var a3 = 0;
        for (let i =0; i<2; i++){
            for (let j=0; j<3; j++){
                let temp = Object.values(table_planning)[j]["X"+(i+1)]
                switch(i){
                    case(0):    
                        mx1 += temp/3
                        a1 += ((temp)**2)/3
                        a2 += (temp*Object.values(table_planning)[j]["X"+(i+2)])/3
                        break
                    case(1):
                        mx2 += temp/3
                        a3 += ((temp)**2)/3
                        break
                }
            }
        }

        var a11 = 0
        var a22 = 0

        for (let i =0; i<2; i++){
            for (let j=0; j<3; j++){
                let temp = Object.values(table_planning)[j]["X"+(i+1)]
                switch(i){
                    case(0):
                        if(j == 0){
                            a11 += (temp*y1avarage)/3  
                        }
                        if(j == 1){
                            a11 += (temp*y2avarage)/3  
                        }    
                        if(j == 2){
                            a11 += (temp*y3avarage)/3  
                        }        
                        break
                    case(1):
                        if(j == 0){
                            a22 += (temp*y1avarage)/3  
                        }
                        if(j == 1){
                            a22 += (temp*y2avarage)/3  
                        }    
                        if(j == 2){
                            a22 += (temp*y3avarage)/3  
                        } 
                        break
                }
            }
        }

        let matrixDet0 = det(matrix([[my, mx1, mx2], [a11, a1, a2], [a22, a2, a3]]))
        let matrixDet1 = det(matrix([[1, my, mx2], [mx1, a11, a2], [mx2, a22, a3]]))
        let matrixDet2 = det(matrix([[1, mx1, my], [mx1, a1, a11], [mx2, a2, a22]]))
        let mainDet = det(matrix([[1, mx1, mx2], [mx1, a1, a2], [mx2, a2, a3]]))

        let b0 = parseFloat((matrixDet0/mainDet))
        let b1 = parseFloat((matrixDet1/mainDet))
        let b2 = parseFloat((matrixDet2/mainDet))

        console.log("-----Перевірка-----")

        let flags = []
        for (let j=0; j<3; j++){
            let temp1 = Object.values(table_planning)[j]["X1"]
            let temp2 = Object.values(table_planning)[j]["X2"]
            flags.push(b0+(temp1*b1)+(temp2*b2))
        }
        
        console.log(`y1 середнє = ${y1avarage}; перевірка =  ${flags[0].toFixed(3)}`)
        console.log(`y2 середнє = ${y2avarage}; перевірка =  ${flags[1].toFixed(3)}`)
        console.log(`y3 середнє = ${y3avarage}; перевірка =  ${flags[2].toFixed(3)}`)

        let deltaX1 = (Math.abs(x1Max-x1Min))/2
        let deltaX2 = (Math.abs(x2Max-x2Min))/2

        let x10 = (x1Max+x1Min)/2
        let x20 = (x2Max+x2Min)/2

        a0 = b0-(b1*(x10/deltaX1))-(b2*(x20/deltaX2))
        a1 = b1/deltaX1
        a2 = b2/deltaX2

        console.log("-------------------------")
        console.log("Натуралізоване рівняння:")
        console.log(`y=a0+a1x1+a2x2=${a0.toFixed(2)}+${a1.toFixed(2)}*x1+${a2.toFixed(2)}*x2`)
        
        console.log("-----Перевірка коефіцієнтів натуралізованого рівняння-----")
        let natur1 = a0+x1Min*a1+x2Min*a2
        console.log(`y1 середнє = ${y1avarage}; перевірка =  ${natur1.toFixed(3)}`)

        let natur2 = a0+x1Max*a1+x2Min*a2
        console.log(`y2 середнє = ${y2avarage}; перевірка =  ${natur2.toFixed(3)}`)

        let natur3 = a0+x1Min*a1+x2Max*a2
        console.log(`y3 середнє = ${y3avarage}; перевірка =  ${natur3.toFixed(3)}`)






        
        



        

        break
        
    }   
}



