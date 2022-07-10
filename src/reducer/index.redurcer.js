import {combineReducers} from "@reduxjs/toolkit";
import globalSlice from './global.slice'

export const createRootReducer = combineReducers({
    global: globalSlice,
})