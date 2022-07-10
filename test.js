function decodeResultInfo(str) {
    const reg = /nfts\/(\d+)\?prize=(\d+)/
    const result = str.match(reg);
    console.log(result)
    return {
        tokenId: result && result[1],
        prize: result && result[2]
    }
}

console.log(decodeResultInfo('https://cryptagendegame.avosapps.us/nfts/10?prize=6'))