// @ts-check

'use strict';

const specialChars = '()[]{}<>:;,.=!+-*/%&|^';

const textareaElements = /** @type {HTMLTextAreaElement} */ (document.querySelector('#elements'));
const textareaInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#input'));
const textareaDefine = /** @type {HTMLTextAreaElement} */ (document.querySelector('#define'));
const textareaOutput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#output'));

/**
 * 随机生成一个符号
 * @param {string[]} elements 用于组成符号的元素
 * @param {number} length 符号的长度
 */
function randomSymbol(elements, length) {
    const result = [];
    for (let i = 0; i < length; ++i) {
        result.push(elements[Math.floor(Math.random() * elements.length)]);
    }
    return result.join('');
}

/**
 * 生成一个新的唯一符号
 * @param {string[]} elements 用于组成符号的元素
 * @param {Set<string>} symbols 已有的符号
 * @param {number} length 符号的长度
 */
function uniqueSymbol(elements, symbols, length) {
    let result;
    do {
        result = randomSymbol(elements, length);
    } while (symbols.has(result));
    return result;
}

function run() {
    textareaDefine.value = '';
    textareaOutput.value = '';
    /** @type {Set<string>} */
    const symbols = new Set;
    /** @type {Map<string, string>} */
    const map = new Map;
    const elements = textareaElements.value.split(/[\r\n]+/g);
    let length = 0, capacity = 0;
    const getOrCreate = (/** @type {string} */ symbol) => {
        if (map.has(symbol)) {
            return map.get(symbol);
        }
        if (symbols.size === capacity) {
            capacity = elements.length ** ++length;
        }
        const newSymbol = uniqueSymbol(elements, symbols, length);
        symbols.add(newSymbol);
        map.set(symbol, newSymbol);
        return newSymbol;
    };
    const regex1 = /.+$/gm;
    let array1;
    while (array1 = regex1.exec(textareaInput.value)) {
        const line = array1[0].trim();
        const result = [];
        let start = 0;
        for (let i = 0; i < line.length; ++i) {
            if (line[i] === ' ') {
                const word = line.substring(start, i);
                if (word) {
                    result.push(getOrCreate(word));
                    start = i + 1;
                }
            } else if (specialChars.includes(line[i]) != specialChars.includes(line[start])) {
                const word = line.substring(start, i);
                if (word) {
                    result.push(getOrCreate(word));
                    start = i;
                }
            }
        }
        if (start < line.length) {
            result.push(getOrCreate(line.substring(start)));
        }
        textareaOutput.value += result.join(' ') + '\n';
    }
    console.log(map);
    for (const i of map) {
        textareaDefine.value += `#define ${i[1]} ${i[0]}` + '\n';
    }
}

document.querySelector('#run')?.addEventListener('click', run);