import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    accountId: null,
    boxList: [],
    notifications: [],
    mintPrice: 0,
    whiteMintPrice: 0,
    lang: 'en',
    isWhite: false,
}
export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setAccount: (state, action) => {
            state.accountId = action.payload;
        },
        setBoxList: (state, action) => {
            state.boxList = action.payload;
        },
        updateBox: (state, action) => {
            const {tokenId, prize, image} = action.payload;
            state.boxList.forEach(box => {
                if (box.tokenId === tokenId) {
                    box.prize = prize;
                    box.image = image;
                }

            })
        },
        mintBox: (state, action) => {
            state.boxList.push(...action.payload);
        },
        enqueueSnackbar: (state, action) => {
            const {message, type = 'success', key = new Date().getTime()} = action.payload;
            if (!state.notifications) {
                state.notifications = [];
            }
            state.notifications = [
                ...state.notifications,
                {
                    message,
                    key,
                    type,
                }
            ]
        },
        removeSnackbar: (state, action) => {
            const key = action.payload;
            state.notifications = state.notifications.filter(notification => notification.key !== key)

        },
        setMintPrice: (state, action) => {
            state.mintPrice = action.payload
        },
        setWhiteMintPrice: (state, action) => {
            state.whiteMintPrice = action.payload;
        },
        setLang: (state, action) => {
            state.lang = action.payload;
        },
        setWhiteUser: (state, action) => {
            state.isWhite = action.payload;
        },
        clearUserInfo: (state, action) => {
            state.accountId = null;
            state.boxList = [];
        }

    }
})
export const {
    setAccount,
    setBoxList,
    mintBox, enqueueSnackbar, removeSnackbar,
    setMintPrice,
    setWhiteMintPrice,
    setLang,
    setWhiteUser,
    updateBox,
    clearUserInfo,
} = globalSlice.actions;
export default globalSlice.reducer;