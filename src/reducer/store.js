import {configureStore} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import {persistReducer} from "redux-persist";
import {createRootReducer} from "./index.redurcer";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const persistedReducer = persistReducer(persistConfig, createRootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
})
