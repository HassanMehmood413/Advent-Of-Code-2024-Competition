let s = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

s = s.replace(/do_not_mul\([^\)]*\)/g, '');

let result = s.replace(/[^0-9(),\[\]]/g, '');



result = result.match(/\([0-9,]+\)/g);
console.log(result);

if (result) {
    result = result.join(''); 
    result = result.split('')

    for (let i = 0; i < result.length; i++) {
        if (result[i] == ',') {
            result[i] = '*';  
        }
        else if (result[i] == ')') {
            result[i] = '+';  
        }
    }

    result = result.join('').split('(').join('');

    result = result.replace(/[+\-*/^%&!@]+$/, '');


    let res = eval(result);
    console.log(res);
} else {
    console.log("No valid expressions found");
}
