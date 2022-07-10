import {ReactComponent as BtnPlus} from "../../../images/btn-plus.svg";
import {ReactComponent as BtnMinus} from "../../../images/btn-minus.svg";
import {ReactComponent as BtnFive} from "../../../images/btn-5.svg";
import {ReactComponent as BtnMint} from "../../../images/btn-mint.svg";
import style from './right-content.module.scss'
import contractService from "../../../services/contract.service";
import {useEffect, useState} from "react";
import {getMintReceiptResult} from "../../../utils/common";
import {useDispatch, useSelector} from "react-redux";
import {enqueueSnackbar, mintBox} from "../../../reducer/global.slice";
import boxImg from '../../../images/box.png'
import {store} from "../../../reducer/store";
import styled from "@emotion/styled";
import {Tooltip, tooltipClasses} from "@mui/material";
import {useTranslation} from "react-i18next";

const HtmlToolTip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#4ccef8',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#4ccef8',
        color: '#000',
        fontFamily: 'tomorrow, sans-serif',
        fontWeight: 500,
        padding: '10px 20px',
        fontSize: '12px',

    },
}))

export function RightContent() {
    const [userChannel, setUserChannel] = useState('');
    const {t} = useTranslation();
    const {mintPrice, whiteMintPrice, accountId} = useSelector(state => state.global);
    const [loading, setLoading] = useState(false)
    const [num, setNum] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const channel = queryParams.get('c');
        if (channel) {
            console.log('channel', channel)
            setUserChannel(channel)
        }
    }, [])

    const mint = () => {
        if (loading) {
            return;
        }
        if (!num) {
            dispatch(enqueueSnackbar({message: 'please check box number', type: 'warning'}))
            return false;
        }
        setLoading(true)
        const {mintPrice, whiteMintPrice, isWhite} = store.getState().global;
        let price = mintPrice;
        if (isWhite) {
            price = whiteMintPrice;
        }
        console.log('price', price)
        contractService.mintNFT(num, price).subscribe(res => {
            setLoading(false)
            dispatch(enqueueSnackbar({message: 'mint success', type: 'success'}))

            const tokenList = getMintReceiptResult(res)

            console.log('tokenlist', tokenList)
            if (tokenList && tokenList.length) {
                // 获得tokenId的相关信息
                contractService.getMultiResultInfo(tokenList).subscribe(boxList => {
                    dispatch(mintBox(boxList))
                })
                if (userChannel) {
                    for (const tokenId of tokenList) {
                        contractService.sendChannelNft(accountId, tokenId, userChannel)
                    }

                }

            }
        }, err => {
            setLoading(false)
            dispatch(enqueueSnackbar({message: err.message, type: 'error'}))
        })
    }
    const plusNum = () => {
        setNum(num + 1);
    }

    const minusNum = () => {
        if (num === 0) {
            return;

        }
        setNum(num - 1);
    }
    const addFive = () => {
        setNum(num + 5)
    }
    return (
        <div className={style.rightContent}>
            <div className={style.boxShow}>
                <img src={boxImg} alt={'box'}/>
            </div>
            <div className={style.handleArea}>
                <div className={style.handleNum}>
                    <div onClick={minusNum}>
                        <BtnMinus/>
                    </div>
                    <div className={style.num}>
                        {num}
                    </div>
                    <div onClick={plusNum}>
                        <BtnPlus/>
                    </div>
                </div>

                <HtmlToolTip title={'Buy 5 get 1 free'} placement={'top'} arrow>

                    <div className={style.handleFive}>
                        <BtnFive/>
                        <div className={style.addFive} onClick={addFive}>
                            +5
                        </div>
                    </div>
                </HtmlToolTip>
            </div>
            <div className={style.buyInfo}>
                <div className={style.buyInfoRow}>
                    <span>{t('Price')}</span>
                    <span>{mintPrice} ETH</span>
                </div>
                <div className={style.buyInfoRow}>
                    <span>{t('WhitePrice')}</span>
                    <span>{whiteMintPrice} ETH</span>
                </div>
                <div className={style.buyInfoRow}>
                    <span>{t('Quantity')}</span>
                    <span>{num}</span>
                </div>
            </div>
            <div className={style.btnMint} onClick={mint}>
                {loading ? 'Mint...' : 'Mint'}
                <BtnMint className={style.mintBg}/>
            </div>
            <div className={style.desc}>
                {t('Description')}
            </div>
        </div>
    )
}