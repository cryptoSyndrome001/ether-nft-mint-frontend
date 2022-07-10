import React, {Suspense, useEffect} from 'react';
import './App.scss';
import {Header} from "./components/header/Header";
import {Home} from "./pages/home/Home";
import {Provider, useSelector} from "react-redux";
import {store} from "./reducer/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {SnackbarProvider} from "notistack";
import {Message} from "./components/message/Message";
import {useTranslation} from "react-i18next";

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                body {
                    font-family: tomorrow, sans-serif;
        
                }
            `
        }
    }
})

const useStyles = makeStyles(() => ({
    root: {
        padding: '0',

    },
    success: {
        backgroundColor: '#4c7247 !important',
        padding: '0',
        borderRadius: '2px',
    },
    error: {
        backgroundColor: '#8e4c51 !important',
        padding: '0',
        borderRadius: '2px',
    },
    warning: {
        // backgroundColor: '#456c8a !important',

    },
    info: {
        backgroundColor: '#456c8a !important',
        padding: '0',
        borderRadius: '2px',
    },
}));

function App() {
    const classes = useStyles();
    const persistor = persistStore(store);
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Suspense fallback={"loading"}>
                    <ThemeProvider theme={theme}>

                        <SnackbarProvider maxSnack={3}
                                          autoHideDuration={2000}
                                          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                                          transitionDuration={{enter: 0, exit: 0}}
                                          disableWindowBlurListener
                                          dense
                                          classes={{
                                              root: classes.root,
                                              variantSuccess: classes.success,
                                              variantError: classes.error,
                                              variantWarning: classes.warning,
                                              variantInfo: classes.info,
                                          }}
                        >


                            <CssBaseline/>
                            <div className="App">
                                <div className="AppBg"/>
                                <Header/>
                                <Home/>
                            </div>
                            <Message/>
                        </SnackbarProvider>
                    </ThemeProvider>
                </Suspense>

            </PersistGate>
        </Provider>
    );
}

export default App;
