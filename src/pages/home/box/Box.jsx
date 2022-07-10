import style from './box.module.scss';
import {Fragment, useState} from "react";
import contractService from "../../../services/contract.service";
import bg from '../../../images/box-bg.png'
import {updateBox} from "../../../reducer/global.slice";
import {useSnackbar} from "../../../hooks/useSnackbar";
import {environment} from "../../../environments/environment";
import {useDispatch} from "react-redux";

export function Box(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [prizeInfo, setPrizeInfo] = useState(null);
    const {openSnackBar} = useSnackbar();
    const boxInfo = props.boxInfo;

    const openBox = () => {
        if (loading) {
            return;
        }
        setLoading(true)
        contractService.openNft(boxInfo.tokenId).subscribe(() => {
            contractService.getPrizeInfo(boxInfo.tokenId).subscribe(info => {

                setLoading(false)
                openSnackBar('success');

                console.log('result info', info)
                setPrizeInfo(info);
                dispatch(updateBox({tokenId: boxInfo.tokenId, prize: info.attributes[0].value, image: info.image}))
            })

        }, err => {
            openSnackBar(err.message, 'error')
            setLoading(false)
        });
    }

    return (
        <div className={style.box}>
            {boxInfo.prize > 1 ?
                <div className={style.prize}>
                    <img className={style.prizeFront} src={boxInfo.image} alt={'prize image'}/>

                </div>

                :
                <Fragment>
                    {

                        prizeInfo &&
                        <div className={style.getPrice + (prizeInfo ? ' ' +  style.getPriceShow : '')}>
                            <img className={style.prizeBack} src={bg} alt={'test'}/>
                            <img className={style.prizeFront} src={prizeInfo.image} alt={'test'}/>

                        </div>
                    }
                    <div className={style.openCover + (prizeInfo ? ' ' + style.hidden : '')} style={{
                        backgroundImage: `url(${environment.imagePath}/${boxInfo.prize}.png)`
                    }}>
                        <div className={style.boxBg + (loading ? ' ' + style.boxWaitingOpen : '')}>
                            <div className={style.openBtn} onClick={openBox}>
                                {
                                    loading ? 'Open...' : 'Open'
                                }
                            </div>
                        </div>
                    </div>

                </Fragment>
            }
        </div>
    )

}