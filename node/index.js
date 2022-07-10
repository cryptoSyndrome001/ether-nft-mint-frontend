const xls = require('node-xlsx').default;

const fs = require('fs')
const path = require("path");


function saveLangFile(name, content) {
    console.log('name', name, content)
    try {
        fs.writeFileSync(name, JSON.stringify(content), {flag: 'w'})
    } catch (err) {
        console.log(err)
    }

}

function handleRow(row, {cnLang, enLang, frLang, itLang, esLang}) {
    const [key, cn, en, fr, it, es] = row;
    cnLang[key] = formatStr(cn);
    enLang[key] = formatStr(en);
    frLang[key] = formatStr(fr);
    itLang[key] = formatStr(it);
    esLang[key] = formatStr(es);
}

function formatStr(text) {
    let str = String(text)
    if (!str) {
       return '';
    }
    return str.trim();

}

function run() {

    const sheetFile = path.join(__dirname, './Fields in different languages.xlsx')
    const workSheetsFromBuffer = xls.parse(fs.readFileSync(sheetFile))

    const rowList = workSheetsFromBuffer[0].data;

// 第一行是标题
    rowList.shift();
// 中文
    const cnLang = {}
// 英语
    const enLang = {}
// 西班牙
    const esLang = {}
// 法国
    const frLang = {}
// 意大利
    const itLang = {}
    for (const row of rowList) {
        if (!row.length) {
            continue;
        }
        handleRow(row, {cnLang, enLang, frLang, esLang, itLang});
    }

    saveLangFile(path.join(__dirname, '../src/locales', 'cn.json'), cnLang)
    saveLangFile(path.join(__dirname, '../src/locales', 'es.json'), esLang)
    saveLangFile(path.join(__dirname, '../src/locales', 'en.json'), enLang)
    saveLangFile(path.join(__dirname, '../src/locales', 'fr.json'), frLang)
    saveLangFile(path.join(__dirname, '../src/locales', 'it.json'), itLang)
}

run();
