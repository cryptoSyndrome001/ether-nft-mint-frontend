import Web3 from "web3";
import {store} from "../reducer/store";
import {environment} from "../environments/environment";
import {ContractAbi, ContractAddress} from "./abi";
import {BigNumber} from 'bignumber.js';
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {exhaustMap, Observable, Subject, switchMap, takeUntil, tap, timer} from "rxjs";
import {decodeResultInfo} from "../utils/common";
import {clearUserInfo, setAccount, setBoxList} from "../reducer/global.slice";
const {createWatcher} = require('@makerdao/multicall');

const multiCallConfig = {
    // preset: 'mainnet',
    // todo 测试网
    // preset: 'rinkeby',
    multicallAddress: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
}


class ContractService {
    _web3js = new Web3(Web3.givenProvider)
    _account;

    cancel$ = new Subject();

    async getAccount() {
        const accountId = store.getState().global.accountId;
        if (!accountId) {
            console.log('please connect wallet')
            return Promise.reject(new Error('please connect wallet'));
        }
        const account = await this._web3js.eth.getAccounts();
        if (!account.length) {
            // 没有授权，需要重新授权
            store.dispatch(setAccount(null))
            store.dispatch(setBoxList([]))
            return Promise.reject(new Error('please check metamask'))
        }
        this._account = account;

        const netId = await this._web3js.eth.net.getId()
        console.log('netid', netId)
        let netName;
        switch (netId) {
            case 1:
                netName = 'Mainnet'
                break
            case 2:
                netName = 'Morden'
                break
            case 3:
                netName = 'Ropsten'
                break
            case 4:
                netName = 'Rinkeby'
                break
            case 56:
                netName = 'BSC';
                break;
            default:
                netName = 'Unknown network = ' + netId;
        }
        if (netName !== environment.contract.chainId) {
            return new Error('network error')
        }
        return account;
    }

    getContractInstance() {
        return new this._web3js.eth.Contract(ContractAbi, ContractAddress);
    }

    transactionReceipt(hash, cancel$) {
        return timer(0, 1000).pipe(
            exhaustMap(_ => {
                return fromPromise(this._web3js.eth.getTransactionReceipt(hash))
            }),
            tap((e) => {
                console.log('request hash', e);
            }),
            takeUntil(cancel$),
        )

    }

    mintNFT(amount = 1, price = 0.01) {
        return fromPromise(this.getAccount()).pipe(
            switchMap(() => {
                console.log('account', this._account)
                const obs = new Observable(observable => {
                    const contractInstance = this.getContractInstance();
                    const money = new BigNumber(1e18).multipliedBy(price).multipliedBy(amount).toFixed();
                    try {

                        fromPromise(contractInstance.methods.mintNft(amount).send({
                            from: this._account[0],
                            value: money
                        }).on(
                            'transactionHash', (hash) => {
                                console.log('hash', hash);
                                const cancelTimer$ = new Subject();

                                this.transactionReceipt(hash, cancelTimer$).subscribe(receipt => {
                                    if (receipt) {
                                        cancelTimer$.next(3);
                                        observable.next(receipt)
                                        observable.complete();
                                    }
                                })
                            },
                            'error', (e) => {

                                console.log('e', e);
                                this.cancel$.next(3);

                                observable.error(e);
                            }
                        )).subscribe(_ => {

                        }, err => {

                            this.cancel$.next(3);
                            observable.error(err);
                        });
                    } catch (e) {
                        console.log('e', e);
                        this.cancel$.next(3);
                        observable.error(e);
                    }
                });
                return obs;
            })
        )
    }

    openNft(tokenId) {
        return fromPromise(this.getAccount()).pipe(
            switchMap(() => {
                console.log('account', this._account)
                const obs = new Observable(observable => {
                    const contractInstance = this.getContractInstance();
                    try {
                        fromPromise(contractInstance.methods.OpenNft(tokenId, Math.random().toString()).send({
                            from: this._account[0],
                            value: 0,
                        }).on(
                            'transactionHash', (hash) => {
                                console.log('hash', hash);

                                const cancelTimer$ = new Subject();
                                this.transactionReceipt(hash, cancelTimer$).subscribe(receipt => {
                                    if (receipt) {
                                        cancelTimer$.next(3);
                                        observable.next(receipt)
                                        observable.complete();
                                    }
                                })
                            },
                            'error', (e) => {

                                console.log('e', e);
                                this.cancel$.next(3);

                                observable.error(e);
                            }
                        )).subscribe(_ => {

                        }, err => {

                            this.cancel$.next(3);
                            observable.error(err);
                        });
                    } catch (e) {
                        console.log('e', e);
                        this.cancel$.next(3);
                        observable.error(e);
                    }
                });
                return obs;
            })
        )
    }

    async tokenURI(tokenId) {
        try {
            await this.getAccount();
            const contractInstance = this.getContractInstance();
            return await contractInstance.methods.tokenURI(tokenId).call();
        } catch (e) {
            return this.handleError(e);
        }
    }

    getPrizeInfo(tokenId) {
        return fromPromise(this.tokenURI(tokenId)).pipe(
            switchMap(uri => fromPromise(this.getNFTInfoByUrl(uri)))
        );

    }

    getMultiResultInfo(tokenIds) {
        return fromPromise(this.getAccount()).pipe(
            switchMap(() => {
                return new Promise((resolve, reject) => {
                    try {
                        const start = new Date().getTime();
                        console.log('start rpc get tokenUri')

                        const tokenList = [];
                        const queryList = []
                        for (const tokenId of tokenIds) {
                            queryList.push(
                                {
                                    target: ContractAddress,
                                    call: ['tokenURI(uint256)(string)', tokenId],
                                    returns: [[`uri${tokenId}`]]
                                },
                            )

                        }
                        const watcher = createWatcher(
                            queryList,
                            multiCallConfig
                        );
                        watcher.batch().subscribe(updates => {
                            for (const item of updates) {
                                tokenList.push(decodeResultInfo(item.value));
                            }
                            const end = new Date().getTime()
                            console.log('[get token uri] rpc progress time: ', (end - start) / 1000)

                            resolve(tokenList);
                        });
                        watcher.start();
                    } catch (e) {
                        reject(e)
                    }

                })

            })
        )
    }

    handleError(e) {
        console.log('e', e)
        return Promise.reject(e);
    }

    getAllNFTs() {
        return fromPromise(this.getAccount()).pipe(
            switchMap(() => {
                const contractInstance = this.getContractInstance();
                return fromPromise(contractInstance.methods.balanceOf(this._account[0]).call())
            }),
            switchMap((spacePunksBalance) => {
                return new Promise((resolve, reject) => {
                    try {

                        const start = new Date().getTime();
                        console.log('start rpc get token')
                        const tokenList = [];
                        const queryList = []
                        for (let i = 0; i < spacePunksBalance; i++) {
                            queryList.push(
                                {
                                    target: ContractAddress,
                                    call: ['tokenOfOwnerByIndex(address,uint256)(uint256)', this._account[0], i],
                                    returns: [[`tokenId${i}`]]
                                },
                            )

                        }
                        const watcher = createWatcher(
                            queryList,
                            multiCallConfig
                        );
                        watcher.batch().subscribe(updates => {
                            for (const item of updates) {
                                tokenList.push(item.value.toNumber());
                            }
                            const end = new Date().getTime()
                            console.log('[get all token] rpc progress time: ', (end - start) / 1000)
                            resolve(tokenList);
                        });
                        watcher.start();
                    } catch (e) {
                        reject(e)
                    }

                })

            })
        )

    }

    async getWhiteMintPrice() {
        const contractInstance = this.getContractInstance();
        return await contractInstance.methods.mintWhitePrice().call();
    }

    async getMintPrice() {
        const contractInstance = this.getContractInstance();
        return await contractInstance.methods.mintPrice().call();

    }

    async getTotalSupply() {
        const contractInstance = this.getContractInstance();
        return await contractInstance.methods.totalSupply().call();
    }

    async getNFTInfoByUrl(url) {
        try {
            const response = await fetch(url)
            return await response.json();
        } catch (err) {
            return Promise.reject(err);
        }

    }

    async isWhite() {
        await this.getAccount();
        const contractInstance = this.getContractInstance();
        console.log('checks sum address', this._account[0])
        return await contractInstance.methods.isWhite(Web3.utils.toChecksumAddress(this._account[0])).call();
    }

    async logout() {
        // this._web3js.eth.currentProvider.disconnect();
        store.dispatch(clearUserInfo())

    }

    sendChannelNft(address, tokenId, channel) {
        // ，统计是哪个渠道推荐来的，address是用户钱包的地址，channelId是渠道Id
        fetch(`${environment.baseUrl}/statistics?address=${address}&tokenId=${tokenId}&channelId=${channel}`).then();
    }


}

const contractService = new ContractService();
export default contractService;