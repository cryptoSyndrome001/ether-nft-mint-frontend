import style from './left-content.module.scss'
import contractService from "../../../services/contract.service";
import {useDispatch, useSelector} from "react-redux";
import {Box} from "../box/Box";
import {Fragment, useEffect, useRef, useState} from "react";
import BigNumber from "bignumber.js";
import {setBoxList, setMintPrice, setWhiteMintPrice, setWhiteUser} from "../../../reducer/global.slice";
import {CircularProgress, Pagination} from "@mui/material";
import {ReactComponent as ReloadSvg} from "../../../images/reload.svg";
import {makeStyles} from "@mui/styles";
import {useTranslation} from "react-i18next";


const paginationStyle = makeStyles(() => ({
    root: {
        '& .MuiPaginationItem-root': {
            color: "#fff",
            width: '32px',
            height: '32px',
            fontFamily: 'tomorrow, sans-serif',
            fontWeight: '400',
            border: '1px solid #fff',
        },
        '& .MuiPaginationItem-root:hover': {
            background: 'rgba(102, 102, 102, .3)'
        },
        '& .Mui-selected': {
            backgroundColor: 'rgba(76, 206, 248, 0.14) !important',
            color: "#4ccef8",
            borderRadius: '2px',
            border: '1px solid #4ccef8',
        },
        '& .Mui-selected:hover': {
            background: '#666',
        }
    }
}))

function debounce(fn, ms) {
    let timer;
    return _ => {
        console.log('timer', timer)
        clearTimeout(timer);
        timer = setTimeout(_ => {
            timer = null;
            fn.apply(this, arguments);
        }, ms)
    }
}

export function LeftContent() {
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(8)
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const dispatch = useDispatch();
    const {boxList = [], accountId} = useSelector(state => state.global)
    const [boxInfoList, setBoxInfoList] = useState([])
    const {t} = useTranslation();

    useEffect(() => {

        console.log('page size -------')
        const debouncedHandleResize = debounce(function handleResize() {
            console.log('page size -------tttt')

            const el =document.querySelector('#center-area');
            if (!el) {
               return;
            }
            const height = el.clientHeight;
            const row = Math.floor((height - 32 - 20) / 250);
            console.log('row', row)
            setPageSize(row * 4);

        }, 500)
        debouncedHandleResize();
        window.addEventListener('resize', debouncedHandleResize);

        return _ => window.removeEventListener('resize', debouncedHandleResize);
    }, [loading])

    useEffect(() => {
        if (!accountId) {
            return;
        }
        const timer = setTimeout(loadAllNFT, 100);
        return () => {
            console.log('load all nft debounce ---- ', timer)
            clearTimeout(timer)
        }
    }, [accountId])



    useEffect(() => {
        console.log('page size', pageSize)
        setPageCount(Math.ceil(boxList.length / pageSize))
        setPage(1)
        setBoxInfoList(boxList.slice(pageSize * (page - 1), pageSize * page));

        return () => {
        }
    }, [boxList.length, pageSize])

    useEffect(() => {
        (async () => {
            try {
                const whitePrice = await contractService.getWhiteMintPrice();
                console.log('white price', whitePrice)
                dispatch(setWhiteMintPrice(new BigNumber(whitePrice).shiftedBy(-18).toFixed()))
                const mintPrice = await contractService.getMintPrice()
                dispatch(setMintPrice(new BigNumber(mintPrice).shiftedBy(-18).toFixed()))

            } catch (e) {
                console.log('load nft error', e)
            }

        })();
        return () => {
        }


    }, [accountId])


    const paginationClasses = paginationStyle();
    const loadAllNFT = () => {
        if (loading) {
            return;
        }
        setLoading(true)
        console.log('tt')
        contractService.getAllNFTs().subscribe(tokenList => {
            // 测试
            if (tokenList.length) {
                contractService.getMultiResultInfo(tokenList).subscribe(res => {
                    console.log('result info', res)
                    // prize === 0 代表未开的箱子
                    const list = res.filter(item => item.prize < 2);
                    console.log('unopen box ', list)
                    setLoading(false)
                    dispatch(setBoxList(list))
                    setPageCount(Math.ceil(boxList.length / pageSize))
                    setBoxInfoList(boxList.slice(pageSize * (page - 1), pageSize * page));

                })
            } else {
                setLoading(false)
                dispatch(setBoxList([]))
            }
        }, err => {
            setLoading(false)
        });

    }

    const refresh = async () => {
        console.log('refresh ----')
        setPage(1)
        setPageCount(1)
        setBoxInfoList([])
        loadAllNFT();
    }

    const pageChange = (event, page) => {
        setPage(page)
        setBoxInfoList(boxList.slice(pageSize * (page - 1), pageSize * page));

    }

    return (
        <div className={style.container}>
            {
                loading &&
                <div className={style.loadingArea}>
                    <CircularProgress/>
                    <p>loading...</p>
                </div>
            }
            {
                !loading &&
                <Fragment>
                    <div className={style.topArea}>
                        <div>
                            {t('BoxNumber')}{boxList.length}
                        </div>
                        <div className={style.refresh} onClick={refresh}>
                            <ReloadSvg/>
                        </div>
                    </div>
                    <div className={style.centerArea} id='center-area'>
                        <div className={style.boxList}>
                            {
                                boxInfoList.map(item => <Box key={item.tokenId} boxInfo={item}/>)
                            }
                        </div>

                        {
                            boxList.length ?
                                <Pagination
                                    classes={paginationClasses}
                                    count={pageCount}
                                    page={page}
                                    onChange={pageChange}
                                    variant="outlined"
                                    shape="rounded"
                                />

                                : null

                        }

                    </div>

                </Fragment>
            }
        </div>
    )
}