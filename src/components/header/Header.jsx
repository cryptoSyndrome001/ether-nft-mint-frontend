import style from './header.module.scss'
import logo from '../../images/logo.svg'
import tg from '../../images/tg.svg'
import os from '../../images/os.svg'
import twitter from '../../images/twitter.svg'
import youtube from '../../images/youtube.svg'
import discord from '../../images/discord.svg'
import languageSvg from '../../images/language.svg'
import franceScg from '../../images/france.svg'
import ltalySvg from '../../images/ltaly.svg'
import spainSvg from '../../images/spain.svg'
import usaSvg from '../../images/usa.svg';
import {ReactComponent as DisconnectSvg} from "../../images/disconnect.svg";
import {ReactComponent as DisConnectArrowSvg} from "../../images/disconnect-arrow.svg";

import languageBgSvg from '../../images/language-bg.svg';
import {ConnectWalletModal} from "../connect-wallet-modal/ConnectWalletModal";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getShortAddress} from "../../utils/common";

import {Dialog, Menu, MenuItem} from "@mui/material";
import {Faq} from "../faq/faq";
import styled from "@emotion/styled";
import {makeStyles} from "@mui/styles";
import {useTranslation} from "react-i18next";
import {setLang} from "../../reducer/global.slice";
import contractService from "../../services/contract.service";

const iconList = [
    {
        icon: twitter,
        url: '',
    },
    {
        icon: youtube,
        url: '',
    },

    {
        icon: discord,
        url: '',
    },
    {
        icon: tg,
        url: '',
    },
    {
        icon: os,
        url: '',
    },
]
const MyDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-root': {
        backdropFilter: '2px',
    },
    '& .MuiBackdrop-root': {
        // opacity: '0.3 !important',
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    '& .MuiPaper-root': {
        background: 'transparent',
        color: '#fff',
        boxShadow: 'none',
        maxWidth: '843px',
        maxHeight: '874px',
        margin: '0',
    }
}));

const useStyles = makeStyles(() => ({
    root: {},
    paper: {
        borderImage: `url(${languageBgSvg}) 20 80 20 80 fill / 20px 80px stretch`,
        padding: '20px 0',
        backgroundColor: "transparent !important",

    },
    list: {
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        gap: '10px',

    }
}))

const disconnectUseStyle = makeStyles(() => ({
    root: {},
    paper: {
        borderImage: `url(${languageBgSvg}) 20 80 20 80 fill / 20px 80px stretch`,
        padding: '10px 0',
        backgroundColor: "transparent !important",

    },
    list: {
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        gap: '10px',

    }
}))

function UserAddress({accountId}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const classes = disconnectUseStyle();
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null)
    }
    const logout = () => {

        contractService.logout().then();
    }

    return (
        <div className={style.connectWallet}>

            <div

            >
                <div className={style.accountId}>

                    {getShortAddress(accountId)}
                </div>
                <div className={style.userAddressRightBg}
                     onClick={openMenu}
                     id={'user-menu-btn'}
                     aria-controls={open ? 'user-menu' : undefined}
                     aria-haspopup='true'
                     aria-expanded={open ? 'true' : undefined}>

                    <DisConnectArrowSvg/>
                </div>
            </div>
            <Menu open={open}
                  id={'user-menu'}
                  anchorEl={anchorEl}
                  aria-labelledby={'user-menu-btn'}
                  onClose={closeMenu}
                  classes={classes}
                  MenuListProps={{
                      'aria-labelledby': 'language-menu-btn',
                  }}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
            >
                <MenuItem onClick={logout}>
                    <div className={style.disconnectRow}>
                        Disconnect <DisconnectSvg/>
                    </div>
                </MenuItem>

            </Menu>
        </div>
    )
}

export function Header() {
    const dispatch = useDispatch();
    const {i18n} = useTranslation();
    const {accountId} = useSelector(state => state.global);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null)
    }
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const classes = useStyles();
    const closeModal = () => {
        setShowFaq(false);
    }
    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang).then(() => {

            dispatch(setLang(lang))
            closeMenu()
        });

    }

    return (
        <div className={style.header}>
            <div className={style.left}>
                <div className={style.logo}>

                    <img src={logo} alt='logo'/>
                </div>
                <div className={style.nav}>
                    <div className={style.active}>HOME</div>
                    <div>ROADMAP</div>
                    <div onClick={() => setShowFaq(true)}>FAQ</div>
                </div>
            </div>
            <div className={style.right}>
                <div className={style.iconList}>
                    {
                        iconList.map((item, index) => <div key={index}>
                            <img src={item.icon} alt={'icon'}/>
                        </div>)
                    }
                    <div
                        id={'language-menu-btn'}
                        aria-controls={open ? 'language-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={openMenu}
                    >
                        <img src={languageSvg} alt={'language'}/>
                    </div>
                    <Menu open={open}
                          id={'language-menu'}
                          anchorEl={anchorEl}
                          aria-labelledby={'language-menu-btn'}
                          onClose={closeMenu}
                          classes={classes}
                          MenuListProps={{
                              'aria-labelledby': 'language-menu-btn',
                          }}
                          anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                          }}
                          transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                          }}
                    >
                        <MenuItem onClick={() => changeLanguage('en')}>
                            <div className={style.languageRow}>
                                <img src={usaSvg} alt={'usa'}/>
                                English
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => changeLanguage('fr')}>
                            <div className={style.languageRow}>
                                <img src={franceScg} alt={'france'}/>
                                français
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => changeLanguage('it')}>
                            <div className={style.languageRow}>
                                <img src={ltalySvg} alt={'ltaly'}/>
                                Italiano
                            </div>
                        </MenuItem>

                        <MenuItem onClick={() => changeLanguage('es')}>
                            <div className={style.languageRow}>
                                <img src={spainSvg} alt={'spain'}/>
                                Español
                            </div>
                        </MenuItem>


                    </Menu>
                </div>
                {
                    accountId ?

                        <UserAddress accountId={accountId}/>
                        :
                        <div className={style.connectWallet} onClick={() => setShowConnectModal(true)}>
                            connect wallet
                        </div>
                }
            </div>
            <ConnectWalletModal isShow={showConnectModal} onClose={() => setShowConnectModal(false)}/>
            <MyDialog open={showFaq} onClose={closeModal}>
                <Faq/>

            </MyDialog>
        </div>
    )
}