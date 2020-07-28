import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from "redux-thunk";
import {authReducer} from "./authReducer";
import {homeReducer} from "./homeReducer";
import {profileReducer} from "./profileReducer";
import {fullPostReducer} from "./fullPostReducer";
import {usersReducer} from "./usersReducer";


export const storeReducers = combineReducers({
    profilePage: profileReducer,
    homePage: homeReducer,
    auth: authReducer,
    postPage: fullPostReducer,
    userPage: usersReducer
})

export const store = createStore(storeReducers,applyMiddleware(thunk));

window.store = store;