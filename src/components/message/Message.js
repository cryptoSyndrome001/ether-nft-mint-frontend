import {useSnackbar} from 'notistack';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

// import {closeSnackbar1, removeSnackbar} from '../../actions/order-message.action';
import {removeSnackbar} from "../../reducer/global.slice";

let displayed = [];

export function Message() {
    const dispatch = useDispatch();
    const notifications = useSelector((store) => store.global.notifications || []);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const storeDisplayed = (id) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id) => {
        displayed = [...displayed.filter((key) => id !== key)];
    };

    React.useEffect(() => {
        notifications.forEach(({key, message, type, options = {}, dismissed = false}) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                variant: type,
                ...options,
                onClose: (event, reason, myKey) => {
                    console.log('onclose')
                    dispatch(removeSnackbar(myKey));
                },
                onExited: (event, myKey) => {
                    console.log('on exited')
                    // remove this snackbar from redux store
                    dispatch(removeSnackbar(myKey));
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};
