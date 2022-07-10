import {Footer} from "../../components/footer/Footer";
import style from './home.module.scss'
import {ReactComponent as CenterPoint} from "../../images/center-point.svg";
import {TimeArea} from "../../components/timeArea/TimeArea";
import {LeftContent} from "./left-content/LeftContent";
import {RightContent} from "./right-content/RightContent";

export function Home() {
    const THREE_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
    // 用6月1号做测试
    const NOW_IN_MS = new Date(1654041600000).getTime();
    const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

    console.log('date time after ', dateTimeAfterThreeDays)
    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: 'column',
            marginTop: '10px',
        }}>
            <TimeArea targetDate={dateTimeAfterThreeDays}/>
            <div className={style.mainContent}>
                <div className={style.leftTopBorder}/>
                <div className={style.leftBottomBorder}/>
                <div className={style.rightBottomBorder}/>
                <div className={style.rightTopBorder}/>
                <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'center',
                    flex: 1,
                }}>

                    <div className={style.leftContent}>
                        <LeftContent/>
                    </div>
                    <div className={style.rightContent}>
                        <RightContent/>
                    </div>
                </div>
                <Footer/>
                <div className={style.centerBg + ' ' + style.centerBgLeft}>

                    <CenterPoint/>
                    <div className={style.square}/>
                </div>

                <div className={style.centerBg + ' ' + style.centerBgRight}>

                    <div className={style.square}/>
                    <CenterPoint/>
                </div>

            </div>


        </div>
    )
}