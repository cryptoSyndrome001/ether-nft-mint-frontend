import {store} from "../reducer/store";
import {clearUserInfo, setAccount} from "../reducer/global.slice";

class MetamaskService {

    constructor() {
        if (window.ethereum) {
            window.ethereum.on('disconnect', err => {
                if (err) {
                    console.log(err)
                }
                console.log('disconnect')
                store.dispatch(clearUserInfo());
            })

            window.ethereum.on('accountsChanged', accounts => {
                console.log('accounts changed', accounts)
                store.dispatch(clearUserInfo());
                store.dispatch(setAccount(accounts[0]))
            })
            window.ethereum.on('chainChanged', chainId => {
                store.dispatch(clearUserInfo())

            })
        }
    }

    async connectMetamask() {
        return new Promise((resolve, reject) => {

            if (window.ethereum) {

                window.ethereum.request({method: 'eth_requestAccounts'}).then(res => {
                    console.log(res)
                    resolve(res)

                }, err => {
                    reject(this.handleError(err))

                });
            } else {
                reject(new Error('please install metamask'));
            }
        })
    }

    handleError(err) {

        if (typeof err === "object") {
            switch (err.code) {
                case -32002:
                    return new Error('already open, please check metamask')
                case 4001:
                    return new Error('user rejected the request')
                default:
                    return new Error('unknow error')

            }
        }
    }
}

const metamaskService = new MetamaskService();

export default metamaskService;