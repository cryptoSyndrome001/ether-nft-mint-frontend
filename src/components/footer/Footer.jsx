import {ReactComponent as Progress} from "../../images/progress.svg";
import style from './footer.module.scss'
import contractService from "../../services/contract.service";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const firstProgress = new Array(10).fill(0);
const secondProgress = new Array(10).fill(0);
const thirdProgress = new Array(10).fill(0);

export function Footer() {
    const {boxList} = useSelector(state => state.global)
    const [totalBox, setTotalBox] = useState();
    const [showAnimation, setShowAnimation] = useState(false)
    useEffect(() => {

        const timer = setInterval(() => {
            contractService.getTotalSupply().then(res => {
                setTotalBox(res);
            })
        }, 3000)
        return () => {
            clearInterval(timer);
        }

    }, [])

    useEffect(() => {
        setShowAnimation(true)
        const timeId = setTimeout(() => {
            setShowAnimation(false);
        }, 3000)
        return () => clearTimeout(timeId);

    }, [boxList.length])
    return (
        <div className={style.footer}>
            <div className={style.inProgress + (showAnimation && totalBox < 5000 ? ' ' + style.animationProgress : '')}>
                {firstProgress.map((item, index) => <Progress key={index}  stroke={ totalBox > (100 * (index + 1))? '#00FF85' : '#445E51'}/>)}
            </div>
            <div className={style.number}>5000</div>
            <div className={style.inProgress + (showAnimation && (totalBox >= 5000 && totalBox < 20000) ? ' ' + style.animationProgress : '')}>
                {secondProgress.map((item, index) => <Progress key={index} stroke={ totalBox > (150 * (index + 1) + 5000)? '#00FF85' : '#445E51'}/> )}
            </div>
            <div className={style.number + (showAnimation && (totalBox >= 20000 && totalBox < 40000) ? ' ' + style.animationProgress : '')}>20000</div>
            <div className={style.inProgress}>
                {thirdProgress.map((item, index) => <Progress key={index} stroke={ totalBox > (2000 * (index + 1) + 20000)? '#00FF85' : '#445E51'}/>)}
            </div>
            <div className={style.number}>40000</div>
        </div>
    )
}