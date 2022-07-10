import {useDispatch} from "react-redux";
import {enqueueSnackbar} from "../reducer/global.slice";

export function useSnackbar() {
    const dispatch = useDispatch();


    const openSnackBar = (message, type = 'success') => {
        dispatch(enqueueSnackbar({message, type}))
    }

    return {openSnackBar};
}