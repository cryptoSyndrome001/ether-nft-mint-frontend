import style from './connect-wallet-modal.module.scss'
import metamaskService from "../../services/metamask.service";
import {useDispatch} from "react-redux";
import {enqueueSnackbar, setAccount} from "../../reducer/global.slice";
export function ConnectWalletModal(props) {
    const dispatch = useDispatch();
    const {isShow} = props;

    const onClose = () => {
       props.onClose();
    }

    const contentClick = (e) => {
        e.stopPropagation();

    }

    const connect = () => {
        metamaskService.connectMetamask().then(res => {
            console.log('connect success', res)
            dispatch(enqueueSnackbar({message: 'success'}))
            if (res && Array.isArray(res)) {
                dispatch(setAccount(res[0]))
                onClose();
            }

        }, err => {
            console.log('connect error', err)
            if (typeof err === "object") {
                dispatch(enqueueSnackbar({message: err.message, type: 'warning'}))
            } else {
                dispatch(enqueueSnackbar({message: err.message, type: 'error'}))
            }



        });

    }




    return (
        <div  className={style.wrapper + (isShow ?  ' ' + style.show : '')} onClick={onClose}>

            <div className={style.content} onClick={contentClick}>
                <div className={style.btn} onClick={connect}></div>
            </div>
        </div>
    )
}