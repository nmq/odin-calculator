function add(a, b) {
    result = parseFloat((a+b).toFixed(3)).toString();
    // restrict floats to 10 digits
    if (result.length > 10 && +result % 1) result = result.slice(0,10);
    return +result;
}

function subtract(a, b) {
    result = parseFloat((a-b).toFixed(3)).toString();
    if (result.length > 10 && +result % 1) result = result.slice(0,10);
    return +result;
}

function multiply(a, b) {
    result = parseFloat((a*b).toFixed(3)).toString();
    if (result.length > 10 && +result % 1) result = result.slice(0,10);
    return +result;
}

function divide(a, b) {
    result = parseFloat((a/b).toFixed(3)).toString();
    if (result.length > 10 && +result % 1) result = result.slice(0,10);
    return +result;
}

function operate(a, op, b) {
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case 'x':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}

function backspace(str) {
    //
    if (str.length === 2 && str.at(0) === '-') return '0';
    return str.slice(0,-1);
}

function flipSignal(str) {
    if (str === '0') return str;
    if (str.at(0) === '-') return str.slice(1);
    return `-${str}`;
}

// used to restrict ints to 10 digits
const MAXNUM = 9999999999;

const buttons = document.querySelectorAll("button");
const display = document.querySelector("#display");

const operators = ['+','-','x','/'];

const keyboardChart = {
    'Digit0': 16,
    'Digit1': 3,
    'Digit2': 4,
    'Digit3': 5,
    'Digit4': 7,
    'Digit5': 8,
    'Digit6': 9,
    'Digit7': 11,
    'Digit8': 12,
    'Digit9': 13,
    'Escape': 0,
    'Backspace': 1,
    'Slash': 6,
    'KeyX': 10,
    'Minus': 14,
    'Period': 15,
    'Equal': 17,
    'Enter': 17,
}

let displayValue = '0';
let firstNum = '0', operator = '', secondNum = '', lastCalc = [];

document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.code === 'Equal') buttons[18].click();
    else if (event.shiftKey && event.code === 'Digit8') buttons[10].click();
    else if (event.code in keyboardChart) {
        buttons[keyboardChart[event.code]].click();
    }
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        switch (button.id) {
            case 'clear':
                displayValue = '0';
                firstNum = '0';
                operator = '';
                secondNum = '';
                lastCalc = [];
                break;
            case 'delete':
                if (!operator) {
                    if (firstNum.length === 1) {
                        firstNum = '0';
                        displayValue = '0';
                    }
                    else {
                        firstNum = backspace(firstNum);
                        displayValue = backspace(displayValue);
                    }
                    break;
                }
                if (!secondNum) {
                    operator = '';
                    displayValue = backspace(displayValue);
                    break;
                }
                secondNum = backspace(secondNum);
                displayValue = backspace(displayValue);
                break;
            case 'signal':
                if (!secondNum) {
                    firstNum = flipSignal(firstNum);
                    displayValue = `${firstNum}${operator}`;
                    break;
                }
                secondNum = flipSignal(secondNum);
                if (secondNum.at(0) === '-') displayValue = `${firstNum}${operator}(${secondNum})`;
                else displayValue = `${firstNum}${operator}${secondNum}`;
                break;
            case 'equal':
                if (operator === '/' && +secondNum === 0) {
                    alert("Can't divide by zero!");
                    break;
                }
                if (lastCalc.length) {
                    firstNum = operate(+firstNum, lastCalc[0], +lastCalc[1]);
                    if (firstNum > MAXNUM) displayValue = firstNum.toExponential(4);
                    else {
                        firstNum = firstNum.toString();
                        displayValue = firstNum;
                    }
                    break;
                }
                if (!operator) break;
                if (!secondNum) secondNum = firstNum;
                firstNum = operate(+firstNum, operator, +secondNum);
                if (firstNum > MAXNUM) displayValue = firstNum.toExponential(4);
                else {
                    firstNum = firstNum.toString();
                    displayValue = firstNum;
                }
                lastCalc.push(operator, secondNum);
                operator = '';
                secondNum = '';
                break;
            case 'float':
                if (displayValue.at(-1) === '.') break;
                if (displayValue === '0') {
                    firstNum += button.textContent;
                    displayValue += button.textContent;
                    break;
                }
            case '0':
                if (displayValue === '0') break;
            default:
                if (displayValue.length >= 10) break;
                lastCalc = []
                if (operators.includes(button.textContent)) {
                    if (operator) {
                        if (!secondNum) break;
                        firstNum = operate(+firstNum, operator, +secondNum).toString();
                        displayValue = firstNum;
                        operator = button.textContent;
                        secondNum = '';
                    }
                    operator = button.textContent;
                } else { // numbers
                    if (operator) secondNum += button.textContent;
                    else if (firstNum === '0') {
                        firstNum = button.textContent;
                        displayValue = '';
                    } else firstNum += button.textContent;
                }
                displayValue += button.textContent;
        }
        display.textContent = displayValue;
    });
});
