import {ContractAbi} from "../services/abi";

const abiDecoder = require('abi-decoder');

export function getShortAddress(address) {
    if (address.length < 10) {
        return address;
    }
    return address.slice(0, 6) + '...' + address.slice(address.length - 4);
}

export function getMintReceiptResult(receipt) {
    abiDecoder.addABI(ContractAbi);
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
    console.log(decodedLogs);
    const tokenIdList = [];
    for (const item of decodedLogs) {
        if (item.name === 'Transfer') {
            tokenIdList.push(item.events[2].value)
        }
    }
    return tokenIdList;
}

export function decodeResultInfo(str) {
    const reg = /nfts\/(\d+)\?prize=(\d+)/
    const result = str.match(reg);
    return {
        tokenId: result && (result[1]),
        prize: result && Number(result[2])
    }
}

