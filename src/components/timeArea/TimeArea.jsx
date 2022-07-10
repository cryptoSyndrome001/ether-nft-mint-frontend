import style from "./time-area.module.scss";
import {useTranslation} from "react-i18next";
import {useCountdown} from "../../hooks/useCountDown";


function TimeDisplay({value}) {
    return (
        <span style={{
            width: '49px',
            display: 'inline-block',
            textAlign: 'center',
        }}>{value}</span>
    )

}
export function TimeArea({targetDate}) {

    const [days, hours, minutes, seconds] = useCountdown(targetDate)
    return (
        <div className={style.timeArea}>
            <div className={style.countDownLabel}>{days} days {hours} hours</div>
            <div className={style.countDown}><TimeDisplay value={days}/>:<TimeDisplay value={hours}/>:<TimeDisplay value={minutes}/>:<TimeDisplay value={seconds}/></div>
            <div className={style.timeAreaBg}/>
        </div>
    )
}